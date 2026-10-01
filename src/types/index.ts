export type TrackId = 'math-6-8' | 'math-9-10' | 'cs-11-12';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'very-hard';

export type QuestionType =
  | 'conceptual'
  | 'numerical'
  | 'application'
  | 'statement-based'
  | 'assertion-reason'
  | 'match-the-following'
  | 'true-false'
  | 'code-based'
  | 'output-based'
  | 'formula-based'
  | 'case-based';

export type QuestionLabel = 'OFFICIAL PYQ' | 'VERIFIED' | 'PRACTICE' | 'AI GENERATED' | 'DEMO';

export interface Track {
  id: TrackId;
  title: string;
  level: string;
  subject: string;
  icon: string;
  description: string;
  color: string;
}

export interface Subtopic {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subtopics?: Subtopic[];
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
  importantConcepts?: string[];
  difficultyDistribution?: { easy: number; medium: number; hard: number };
}

export interface Unit {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface Subject {
  id: string;
  name: string;
  units: Unit[];
}

export interface Syllabus {
  trackId: TrackId;
  trackName: string;
  subjects: Subject[];
}

export interface Question {
  id: string;
  track_id: TrackId;
  subject: string;
  chapter_id: string;
  topic_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e?: string;
  correct_answer: 'a' | 'b' | 'c' | 'd' | 'e';
  explanation: string;
  difficulty: Difficulty;
  question_type: QuestionType;
  concept: string;
  tags: string[];
  source: string;
  year?: number;
  is_pyq: boolean;
  is_verified: boolean;
  is_ai_generated: boolean;
}

export interface NoteSection {
  heading: string;
  type: 'text' | 'formula' | 'table' | 'example' | 'warning' | 'tip' | 'list' | 'solved';
  content: string;
  items?: string[];
  table?: { headers: string[]; rows: string[][] };
}

export interface ChapterNote {
  chapter_id: string;
  sections: NoteSection[];
}

export interface VideoResource {
  id: string;
  chapter_id: string;
  title: string;
  channel: string;
  duration: string;
  language: string;
  category: string;
  url: string;
}

export interface TestResult {
  testId: string;
  date: string;
  trackId: TrackId;
  score: number;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number;
  timeTaken: number;
  topicPerformance: { topicId: string; topicName: string; accuracy: number; total: number; correct: number }[];
  weakTopics: string[];
  strongTopics: string[];
  questionIds: string[];
  answers: Record<string, string | null>;
}

export interface QuestionExposure {
  seen_count: number;
  last_seen: string;
  correct_count: number;
  wrong_count: number;
  last_answer: string | null;
}

export interface RevisionItem {
  questionId: string;
  chapterId: string;
  topicId: string;
  nextReviewDate: string;
  intervalIndex: number;
  lastReviewed: string;
}

export interface StudentProgress {
  completedTopics: string[];
  completedChapters: string[];
  topicMastery: Record<string, { attempts: number; correct: number; lastAttempt: string }>;
  dailyProgress: { date: string; questionsAnswered: number; testsTaken: number }[];
  streak: number;
  lastVisitDate: string;
  lastVisitedTopic: string | null;
}

export interface Bookmark {
  id: string;
  type: 'note' | 'mcq' | 'pyq' | 'video' | 'formula' | 'concept';
  refId: string;
  chapterId: string;
  title: string;
  date: string;
}

export interface MistakeItem {
  questionId: string;
  question: string;
  myAnswer: string | null;
  correctAnswer: string;
  explanation: string;
  topicId: string;
  topicName: string;
  chapterId: string;
  chapterName: string;
  difficulty: Difficulty;
  date: string;
  attempts: number;
  bookmarked: boolean;
}
