import { APP_CONFIG } from '@/config/app.config';
import type { Question, TrackId, TestResult, Difficulty } from '@/types';
import { getQuestionsForTrack, getQuestionsForChapter } from '@/data/bpsc/questions/question-generator';
import { getAllChapters, getAllTopics } from '@/data/bpsc/syllabus-registry';
import { progressService } from './progress.service';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickByDifficulty(questions: Question[], count: number): Question[] {
  const easy = questions.filter((q) => q.difficulty === 'easy');
  const medium = questions.filter((q) => q.difficulty === 'medium');
  const hard = questions.filter((q) => q.difficulty === 'hard' || q.difficulty === 'very-hard');
  const easyCount = Math.round(count * APP_CONFIG.difficultyDistribution.easy);
  const hardCount = Math.round(count * APP_CONFIG.difficultyDistribution.hard);
  const mediumCount = count - easyCount - hardCount;
  return [
    ...shuffle(easy).slice(0, easyCount),
    ...shuffle(medium).slice(0, mediumCount),
    ...shuffle(hard).slice(0, hardCount),
  ];
}

export interface ActiveTest {
  testId: string;
  trackId: TrackId;
  questions: Question[];
  answers: Record<string, string | null>;
  markedForReview: Set<string>;
  currentIndex: number;
  startTime: number;
  durationMs: number;
  elapsedMs: number;
}

export const testEngine = {
  generateDailyTest(trackId: TrackId): ActiveTest {
    const allQuestions = getQuestionsForTrack(trackId, 40);
    const targetCount = APP_CONFIG.dailyTestQuestionCount;
    const mix = APP_CONFIG.testMix;

    const exposure = progressService.getQuestionExposure();
    const mistakes = progressService.getMistakes();
    const revisionDue = progressService.getDueRevision();
    const mastery = progressService.get().topicMastery;

    const mistakeIds = new Set(mistakes.map((m) => m.questionId));
    const revisionIds = new Set(revisionDue.map((r) => r.questionId));
    const weakTopicIds = new Set(
      Object.entries(mastery)
        .filter(([, m]) => m.attempts > 0 && m.correct / m.attempts < 0.6)
        .map(([id]) => id)
    );

    const unseen = allQuestions.filter((q) => !exposure[q.id]);
    const mistakeQs = allQuestions.filter((q) => mistakeIds.has(q.id));
    const revisionQs = allQuestions.filter((q) => revisionIds.has(q.id));
    const weakQs = allQuestions.filter((q) => weakTopicIds.has(q.topic_id));
    const general = allQuestions;

    const weakCount = Math.round(targetCount * mix.weakAreas);
    const mistakeCount = Math.round(targetCount * mix.previousMistakes);
    const unseenCount = Math.round(targetCount * mix.unseen);
    const revisionCount = Math.round(targetCount * mix.revision);
    const generalCount = targetCount - weakCount - mistakeCount - unseenCount - revisionCount;

    let selected: Question[] = [];
    selected.push(...shuffle(weakQs).slice(0, weakCount));
    selected.push(...shuffle(mistakeQs).slice(0, mistakeCount));
    selected.push(...shuffle(unseen).slice(0, unseenCount));
    selected.push(...shuffle(revisionQs).slice(0, revisionCount));
    selected.push(...shuffle(general).slice(0, generalCount));

    selected = selected.slice(0, targetCount);
    if (selected.length < targetCount) {
      const remaining = shuffle(allQuestions.filter((q) => !selected.includes(q)));
      selected.push(...remaining.slice(0, targetCount - selected.length));
    }

    selected = shuffle(selected);

    const test: ActiveTest = {
      testId: `test-${Date.now()}`,
      trackId,
      questions: selected,
      answers: {},
      markedForReview: new Set(),
      currentIndex: 0,
      startTime: Date.now(),
      durationMs: APP_CONFIG.dailyTestDurationMinutes * 60 * 1000,
      elapsedMs: 0,
    };

    progressService.saveActiveTest({
      ...test,
      markedForReview: Array.from(test.markedForReview),
    });
    return test;
  },

  generateChapterTest(trackId: TrackId, chapterId: string, count = 30): ActiveTest {
    const chapterQuestions = getQuestionsForChapter(trackId, chapterId, count * 2);
    const selected = pickByDifficulty(chapterQuestions, count);
    const shuffled = shuffle(selected);

    const test: ActiveTest = {
      testId: `test-${Date.now()}`,
      trackId,
      questions: shuffled,
      answers: {},
      markedForReview: new Set(),
      currentIndex: 0,
      startTime: Date.now(),
      durationMs: Math.max(count * 60 * 1000, 30 * 60 * 1000),
      elapsedMs: 0,
    };

    progressService.saveActiveTest({
      ...test,
      markedForReview: Array.from(test.markedForReview),
    });
    return test;
  },

  generateTopicTest(trackId: TrackId, chapterId: string, topicId: string, count = 20): ActiveTest {
    const chapterQuestions = getQuestionsForChapter(trackId, chapterId, 100);
    const topicQuestions = chapterQuestions.filter((q) => q.topic_id === topicId);
    const selected = topicQuestions.slice(0, count);
    const shuffled = shuffle(selected);

    const test: ActiveTest = {
      testId: `test-${Date.now()}`,
      trackId,
      questions: shuffled,
      answers: {},
      markedForReview: new Set(),
      currentIndex: 0,
      startTime: Date.now(),
      durationMs: Math.max(count * 60 * 1000, 20 * 60 * 1000),
      elapsedMs: 0,
    };

    progressService.saveActiveTest({
      ...test,
      markedForReview: Array.from(test.markedForReview),
    });
    return test;
  },

  generateWeakAreaTest(trackId: TrackId, count = 20): ActiveTest {
    const mastery = progressService.get().topicMastery;
    const weakTopicIds = Object.entries(mastery)
      .filter(([, m]) => m.attempts > 0 && m.correct / m.attempts < 0.6)
      .map(([id]) => id);

    const allQuestions = getQuestionsForTrack(trackId, 40);
    const weakQs = allQuestions.filter((q) => weakTopicIds.includes(q.topic_id));
    const selected = weakQs.length >= count ? shuffle(weakQs).slice(0, count) : shuffle(allQuestions).slice(0, count);

    const test: ActiveTest = {
      testId: `test-${Date.now()}`,
      trackId,
      questions: selected,
      answers: {},
      markedForReview: new Set(),
      currentIndex: 0,
      startTime: Date.now(),
      durationMs: Math.max(count * 60 * 1000, 20 * 60 * 1000),
      elapsedMs: 0,
    };

    progressService.saveActiveTest({
      ...test,
      markedForReview: Array.from(test.markedForReview),
    });
    return test;
  },

  generateRevisionTest(trackId: TrackId): ActiveTest {
    const dueItems = progressService.getDueRevision();
    const allQuestions = getQuestionsForTrack(trackId, 40);
    const dueIds = new Set(dueItems.map((r) => r.questionId));
    let revisionQs = allQuestions.filter((q) => dueIds.has(q.id));

    if (revisionQs.length < 10) {
      const additional = shuffle(allQuestions.filter((q) => !dueIds.has(q.id))).slice(0, 20 - revisionQs.length);
      revisionQs = [...revisionQs, ...additional];
    }

    const test: ActiveTest = {
      testId: `test-${Date.now()}`,
      trackId,
      questions: revisionQs,
      answers: {},
      markedForReview: new Set(),
      currentIndex: 0,
      startTime: Date.now(),
      durationMs: Math.max(revisionQs.length * 60 * 1000, 20 * 60 * 1000),
      elapsedMs: 0,
    };

    progressService.saveActiveTest({
      ...test,
      markedForReview: Array.from(test.markedForReview),
    });
    return test;
  },

  restoreActiveTest(): ActiveTest | null {
    const raw = progressService.getActiveTest() as Record<string, unknown> | null;
    if (!raw) return null;
    return {
      testId: raw.testId as string,
      trackId: raw.trackId as TrackId,
      questions: raw.questions as Question[],
      answers: (raw.answers as Record<string, string | null>) || {},
      markedForReview: new Set((raw.markedForReview as string[]) || []),
      currentIndex: (raw.currentIndex as number) || 0,
      startTime: raw.startTime as number,
      durationMs: raw.durationMs as number,
      elapsedMs: raw.elapsedMs as number,
    };
  },

  saveTestState(test: ActiveTest): void {
    progressService.saveActiveTest({
      ...test,
      markedForReview: Array.from(test.markedForReview),
    });
  },

  submitTest(test: ActiveTest): TestResult {
    const { questions, answers, trackId } = test;
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;
    const topicStats: Record<string, { topicId: string; topicName: string; accuracy: number; total: number; correct: number }> = {};
    const topics = getAllTopics(trackId);
    const topicMap = new Map(topics.map((t) => [t.topicId, t.topicName]));

    for (const q of questions) {
      const myAnswer = answers[q.id] || null;
      if (!myAnswer) {
        skipped++;
      } else if (myAnswer === q.correct_answer) {
        correct++;
        progressService.recordQuestionSeen(q.id, true, myAnswer);
        progressService.recordTopicAttempt(q.topic_id, true);
      } else {
        incorrect++;
        progressService.recordQuestionSeen(q.id, false, myAnswer);
        progressService.recordTopicAttempt(q.topic_id, false);
        progressService.addMistake({
          questionId: q.id,
          question: q.question,
          myAnswer,
          correctAnswer: q.correct_answer,
          explanation: q.explanation,
          topicId: q.topic_id,
          topicName: topicMap.get(q.topic_id) || q.topic_id,
          chapterId: q.chapter_id,
          chapterName: getAllChapters(trackId).find((c) => c.chapter.id === q.chapter_id)?.chapter.name || q.chapter_id,
          difficulty: q.difficulty,
          date: new Date().toISOString(),
          attempts: 1,
          bookmarked: false,
        });
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + APP_CONFIG.revisionIntervals[0]);
        progressService.addRevisionItem({
          questionId: q.id,
          chapterId: q.chapter_id,
          topicId: q.topic_id,
          nextReviewDate: nextDate.toISOString().split('T')[0],
          intervalIndex: 0,
          lastReviewed: new Date().toISOString().split('T')[0],
        });
      }

      if (!topicStats[q.topic_id]) {
        topicStats[q.topic_id] = { topicId: q.topic_id, topicName: topicMap.get(q.topic_id) || q.topic_id, accuracy: 0, total: 0, correct: 0 };
      }
      topicStats[q.topic_id].total++;
      if (myAnswer === q.correct_answer) topicStats[q.topic_id].correct++;
    }

    for (const ts of Object.values(topicStats)) {
      ts.accuracy = ts.total > 0 ? Math.round((ts.correct / ts.total) * 100) : 0;
    }

    const topicPerformance = Object.values(topicStats);
    const weakTopics = topicPerformance.filter((t) => t.accuracy < 60).map((t) => t.topicName);
    const strongTopics = topicPerformance.filter((t) => t.accuracy >= 80).map((t) => t.topicName);
    const timeTaken = Math.round((Date.now() - test.startTime) / 1000);
    const score = correct;
    const accuracy = questions.length > 0 ? Math.round((correct / questions.length) * 1000) / 10 : 0;

    const result: TestResult = {
      testId: test.testId,
      date: new Date().toISOString(),
      trackId,
      score,
      totalQuestions: questions.length,
      correct,
      incorrect,
      skipped,
      accuracy,
      timeTaken,
      topicPerformance,
      weakTopics,
      strongTopics,
      questionIds: questions.map((q) => q.id),
      answers,
    };

    progressService.saveTestResult(result);
    progressService.recordDailyActivity(questions.length - skipped, 1);
    progressService.clearActiveTest();

    return result;
  },

  getRecommendations(trackId: TrackId): { topicName: string; chapterName: string; accuracy: number; recommendation: string }[] {
    const mastery = progressService.get().topicMastery;
    const topics = getAllTopics(trackId);
    const chapters = getAllChapters(trackId);
    const chapterMap = new Map(chapters.map((c) => [c.chapter.id, c.chapter.name]));
    const topicChapterMap = new Map<string, string>();

    for (const { chapter } of chapters) {
      for (const topic of chapter.topics) {
        topicChapterMap.set(topic.id, chapter.id);
      }
    }

    const recommendations: { topicName: string; chapterName: string; accuracy: number; recommendation: string }[] = [];

    for (const [topicId, m] of Object.entries(mastery)) {
      if (m.attempts < 3) continue;
      const accuracy = Math.round((m.correct / m.attempts) * 100);
      const topicName = topics.find((t) => t.topicId === topicId)?.topicName || topicId;
      const chapterId = topicChapterMap.get(topicId) || '';
      const chapterName = chapterMap.get(chapterId) || '';

      if (accuracy < 60) {
        recommendations.push({
          topicName,
          chapterName,
          accuracy,
          recommendation: 'Read notes, practice 30 questions, review mistakes, take topic test',
        });
      } else if (accuracy < 75) {
        recommendations.push({
          topicName,
          chapterName,
          accuracy,
          recommendation: 'Practice 20 more questions and review key concepts',
        });
      }
    }

    return recommendations.sort((a, b) => a.accuracy - b.accuracy).slice(0, 10);
  },

  getPersonalizedTestSummary(trackId: TrackId): string | null {
    const history = progressService.getTestHistory().filter((t) => t.trackId === trackId);
    if (history.length === 0) return null;
    const last = history[history.length - 1];
    if (last.weakTopics.length === 0) return null;
    return `Yesterday you struggled with ${last.weakTopics.slice(0, 3).join(', ')}. Today's test contains additional questions from these areas.`;
  },
};
