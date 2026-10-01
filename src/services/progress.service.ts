import { APP_CONFIG } from '@/config/app.config';
import type { TrackId, StudentProgress, TestResult, MistakeItem, Bookmark, QuestionExposure, RevisionItem } from '@/types';

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getProgress(): StudentProgress {
  return safeGet<StudentProgress>(APP_CONFIG.storageKeys.progress, {
    completedTopics: [],
    completedChapters: [],
    topicMastery: {},
    dailyProgress: [],
    streak: 0,
    lastVisitDate: '',
    lastVisitedTopic: null,
  });
}

function saveProgress(p: StudentProgress): void {
  safeSet(APP_CONFIG.storageKeys.progress, p);
}

export const progressService = {
  get: getProgress,
  save: saveProgress,

  getSelectedTrack(): TrackId | null {
    return safeGet<TrackId | null>(APP_CONFIG.storageKeys.selectedTrack, null);
  },
  setSelectedTrack(trackId: TrackId): void {
    safeSet(APP_CONFIG.storageKeys.selectedTrack, trackId);
  },

  recordVisit(): void {
    const p = getProgress();
    const today = todayStr();
    if (p.lastVisitDate !== today) {
      if (p.lastVisitDate) {
        const last = new Date(p.lastVisitDate);
        const now = new Date(today);
        const diffDays = Math.round((now.getTime() - last.getTime()) / 86400000);
        if (diffDays === 1) p.streak += 1;
        else if (diffDays > 1) p.streak = 1;
      } else {
        p.streak = 1;
      }
      p.lastVisitDate = today;
      saveProgress(p);
    }
  },

  markTopicComplete(topicId: string): void {
    const p = getProgress();
    if (!p.completedTopics.includes(topicId)) {
      p.completedTopics.push(topicId);
      saveProgress(p);
    }
  },

  recordTopicAttempt(topicId: string, correct: boolean): void {
    const p = getProgress();
    const existing = p.topicMastery[topicId] || { attempts: 0, correct: 0, lastAttempt: '' };
    existing.attempts += 1;
    if (correct) existing.correct += 1;
    existing.lastAttempt = todayStr();
    p.topicMastery[topicId] = existing;
    saveProgress(p);
  },

  recordDailyActivity(questionsAnswered: number, testsTaken: number): void {
    const p = getProgress();
    const today = todayStr();
    const existing = p.dailyProgress.find((d) => d.date === today);
    if (existing) {
      existing.questionsAnswered += questionsAnswered;
      existing.testsTaken += testsTaken;
    } else {
      p.dailyProgress.push({ date: today, questionsAnswered, testsTaken });
    }
    saveProgress(p);
  },

  setLastVisitedTopic(topicId: string): void {
    const p = getProgress();
    p.lastVisitedTopic = topicId;
    saveProgress(p);
  },

  getMasteryScore(topicId: string): number {
    const p = getProgress();
    const m = p.topicMastery[topicId];
    if (!m || m.attempts === 0) return 0;
    return Math.round((m.correct / m.attempts) * 100);
  },

  getMasteryStatus(score: number): string {
    if (score >= APP_CONFIG.masteryThresholds.mastered) return 'Mastered';
    if (score >= APP_CONFIG.masteryThresholds.strong) return 'Strong';
    if (score >= APP_CONFIG.masteryThresholds.moderate) return 'Moderate';
    if (score >= APP_CONFIG.masteryThresholds.weak) return 'Weak';
    return 'Critical';
  },

  getStats(trackId: TrackId) {
    const p = getProgress();
    const history = this.getTestHistory();
    const trackHistory = history.filter((t) => t.trackId === trackId);
    const totalQuestions = trackHistory.reduce((sum, t) => sum + t.totalQuestions, 0);
    const totalCorrect = trackHistory.reduce((sum, t) => sum + t.correct, 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const strongTopics: string[] = [];
    const weakTopics: string[] = [];
    for (const [topicId, m] of Object.entries(p.topicMastery)) {
      if (m.attempts === 0) continue;
      const score = Math.round((m.correct / m.attempts) * 100);
      if (score >= 75) strongTopics.push(topicId);
      else if (score < 60) weakTopics.push(topicId);
    }
    return {
      totalQuestions,
      accuracy,
      totalTests: trackHistory.length,
      strongCount: strongTopics.length,
      weakCount: weakTopics.length,
      streak: p.streak,
      completedTopics: p.completedTopics.length,
    };
  },

  getTestHistory(): TestResult[] {
    return safeGet<TestResult[]>(APP_CONFIG.storageKeys.testHistory, []);
  },
  saveTestResult(result: TestResult): void {
    const history = this.getTestHistory();
    history.push(result);
    safeSet(APP_CONFIG.storageKeys.testHistory, history);
  },

  getMistakes(): MistakeItem[] {
    return safeGet<MistakeItem[]>(APP_CONFIG.storageKeys.mistakes, []);
  },
  addMistake(m: MistakeItem): void {
    const mistakes = this.getMistakes();
    const existing = mistakes.find((mm) => mm.questionId === m.questionId);
    if (existing) {
      existing.attempts += 1;
      existing.date = m.date;
      existing.myAnswer = m.myAnswer;
    } else {
      mistakes.push(m);
    }
    safeSet(APP_CONFIG.storageKeys.mistakes, mistakes);
  },
  removeMistake(questionId: string): void {
    const mistakes = this.getMistakes().filter((m) => m.questionId !== questionId);
    safeSet(APP_CONFIG.storageKeys.mistakes, mistakes);
  },

  getBookmarks(): Bookmark[] {
    return safeGet<Bookmark[]>(APP_CONFIG.storageKeys.bookmarks, []);
  },
  addBookmark(b: Bookmark): void {
    const bookmarks = this.getBookmarks();
    if (!bookmarks.find((bb) => bb.type === b.type && bb.refId === b.refId)) {
      bookmarks.push(b);
      safeSet(APP_CONFIG.storageKeys.bookmarks, bookmarks);
    }
  },
  removeBookmark(type: string, refId: string): void {
    const bookmarks = this.getBookmarks().filter((b) => !(b.type === type && b.refId === refId));
    safeSet(APP_CONFIG.storageKeys.bookmarks, bookmarks);
  },
  isBookmarked(type: string, refId: string): boolean {
    return this.getBookmarks().some((b) => b.type === type && b.refId === refId);
  },

  getQuestionExposure(): Record<string, QuestionExposure> {
    return safeGet<Record<string, QuestionExposure>>(APP_CONFIG.storageKeys.questionExposure, {});
  },
  recordQuestionSeen(questionId: string, correct: boolean, answer: string | null): void {
    const exposure = this.getQuestionExposure();
    const existing = exposure[questionId] || { seen_count: 0, last_seen: '', correct_count: 0, wrong_count: 0, last_answer: null };
    existing.seen_count += 1;
    existing.last_seen = todayStr();
    if (correct) existing.correct_count += 1;
    else existing.wrong_count += 1;
    existing.last_answer = answer;
    exposure[questionId] = existing;
    safeSet(APP_CONFIG.storageKeys.questionExposure, exposure);
  },

  getRevisionSchedule(): RevisionItem[] {
    return safeGet<RevisionItem[]>(APP_CONFIG.storageKeys.revisionSchedule, []);
  },
  addRevisionItem(item: RevisionItem): void {
    const schedule = this.getRevisionSchedule();
    const existing = schedule.find((r) => r.questionId === item.questionId);
    if (existing) {
      existing.nextReviewDate = item.nextReviewDate;
      existing.intervalIndex = item.intervalIndex;
      existing.lastReviewed = item.lastReviewed;
    } else {
      schedule.push(item);
    }
    safeSet(APP_CONFIG.storageKeys.revisionSchedule, schedule);
  },
  getDueRevision(): RevisionItem[] {
    const today = todayStr();
    return this.getRevisionSchedule().filter((r) => r.nextReviewDate <= today);
  },
  completeRevision(questionId: string, correct: boolean): void {
    const schedule = this.getRevisionSchedule();
    const item = schedule.find((r) => r.questionId === questionId);
    if (!item) return;
    if (correct) {
      item.intervalIndex = Math.min(item.intervalIndex + 1, APP_CONFIG.revisionIntervals.length - 1);
    } else {
      item.intervalIndex = Math.max(item.intervalIndex - 1, 0);
    }
    const days = APP_CONFIG.revisionIntervals[item.intervalIndex];
    const next = new Date();
    next.setDate(next.getDate() + days);
    item.nextReviewDate = next.toISOString().split('T')[0];
    item.lastReviewed = todayStr();
    safeSet(APP_CONFIG.storageKeys.revisionSchedule, schedule);
  },

  getActiveTest(): unknown {
    return safeGet<unknown>(APP_CONFIG.storageKeys.activeTest, null);
  },
  saveActiveTest(test: unknown): void {
    safeSet(APP_CONFIG.storageKeys.activeTest, test);
  },
  clearActiveTest(): void {
    localStorage.removeItem(APP_CONFIG.storageKeys.activeTest);
  },

  clearAll(): void {
    Object.values(APP_CONFIG.storageKeys).forEach((key) => localStorage.removeItem(key));
  },
};
