export const APP_CONFIG = {
  name: 'ExamCrack AI',
  tagline: 'BPSC TRE 4.0 Complete Preparation Platform',
  examName: 'BPSC TRE 4.0',
  examDate: '2026-10-30',
  dailyTestQuestionCount: 150,
  dailyTestDurationMinutes: 180,
  masteryThresholds: {
    mastered: 90,
    strong: 75,
    moderate: 60,
    weak: 40,
  },
  difficultyDistribution: {
    easy: 0.3,
    medium: 0.5,
    hard: 0.2,
  },
  testMix: {
    weakAreas: 0.3,
    previousMistakes: 0.2,
    unseen: 0.3,
    revision: 0.1,
    general: 0.1,
  },
  revisionIntervals: [1, 3, 7, 14, 30],
  storageKeys: {
    selectedTrack: 'ec_selected_track',
    progress: 'ec_progress',
    testHistory: 'ec_test_history',
    mistakes: 'ec_mistakes',
    bookmarks: 'ec_bookmarks',
    weakAreas: 'ec_weak_areas',
    streak: 'ec_streak',
    lastVisit: 'ec_last_visit',
    activeTest: 'ec_active_test',
    questionExposure: 'ec_question_exposure',
    revisionSchedule: 'ec_revision_schedule',
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
