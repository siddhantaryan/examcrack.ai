import type { Syllabus, TrackId } from '@/types';
import { MATH_6_8_SYLLABUS } from './mathematics-6-8';
import { MATH_9_10_SYLLABUS } from './mathematics-9-10';
import { CS_11_12_SYLLABUS } from './computer-science-11-12';

export const SYLLABI: Record<TrackId, Syllabus> = {
  'math-6-8': MATH_6_8_SYLLABUS,
  'math-9-10': MATH_9_10_SYLLABUS,
  'cs-11-12': CS_11_12_SYLLABUS,
};

export function getSyllabus(trackId: TrackId): Syllabus {
  return SYLLABI[trackId];
}

export function getAllChapters(trackId: TrackId) {
  const syllabus = SYLLABI[trackId];
  const chapters: { chapter: typeof syllabus.subjects[0]['units'][0]['chapters'][0]; subjectName: string; unitName: string }[] = [];
  for (const subject of syllabus.subjects) {
    for (const unit of subject.units) {
      for (const chapter of unit.chapters) {
        chapters.push({ chapter, subjectName: subject.name, unitName: unit.name });
      }
    }
  }
  return chapters;
}

export function getChapterById(trackId: TrackId, chapterId: string) {
  const chapters = getAllChapters(trackId);
  return chapters.find((c) => c.chapter.id === chapterId);
}

export function getAllTopics(trackId: TrackId) {
  const chapters = getAllChapters(trackId);
  const topics: { topicId: string; topicName: string; chapterId: string; chapterName: string }[] = [];
  for (const { chapter } of chapters) {
    for (const topic of chapter.topics) {
      topics.push({ topicId: topic.id, topicName: topic.name, chapterId: chapter.id, chapterName: chapter.name });
    }
  }
  return topics;
}
