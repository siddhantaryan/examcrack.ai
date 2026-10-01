import type { Track } from '@/types';

export const TRACKS: Track[] = [
  {
    id: 'math-6-8',
    title: 'Classes 6–8',
    level: 'Classes 6–8',
    subject: 'Mathematics',
    icon: '📐',
    description: 'Complete preparation for BPSC TRE 4.0',
    color: 'blue',
  },
  {
    id: 'math-9-10',
    title: 'Classes 9–10',
    level: 'Classes 9–10',
    subject: 'Mathematics',
    icon: '📐',
    description: 'Complete preparation for BPSC TRE 4.0',
    color: 'cyan',
  },
  {
    id: 'cs-11-12',
    title: 'Classes 11–12',
    level: 'Classes 11–12',
    subject: 'Computer Science',
    icon: '💻',
    description: 'Complete preparation for BPSC TRE 4.0',
    color: 'purple',
  },
];

export const TRACK_MAP: Record<string, Track> = TRACKS.reduce(
  (acc, t) => ({ ...acc, [t.id]: t }),
  {} as Record<string, Track>
);
