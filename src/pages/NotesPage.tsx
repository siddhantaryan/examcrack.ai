import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TrackId } from '@/types';
import { getAllChapters } from '@/data/bpsc/syllabus-registry';
import { getNotesForChapter, generateGenericNotes } from '@/data/bpsc/notes/notes-data';
import { NotesViewer } from '@/components/NotesViewer';
import { Card, EmptyState, Button } from '@/components/ui';
import { BookOpen } from 'lucide-react';

interface Props { trackId: TrackId }

export function NotesPage({ trackId }: Props) {
  const navigate = useNavigate();
  const chapters = getAllChapters(trackId);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  if (selectedChapter) {
    const chapterData = chapters.find((c) => c.chapter.id === selectedChapter);
    if (!chapterData) return null;
    const notes = getNotesForChapter(selectedChapter) || generateGenericNotes(selectedChapter, chapterData.chapter.name, chapterData.chapter.importantConcepts || []);
    return (
      <div className="space-y-4">
        <button onClick={() => setSelectedChapter(null)} className="text-sm text-gray-500 hover:text-gray-700">← Back to all notes</button>
        <NotesViewer sections={notes.sections} chapterName={chapterData.chapter.name} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
        <p className="text-sm text-gray-500 mt-1">Complete exam-oriented notes for all chapters</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {chapters.map(({ chapter }) => {
          const hasNotes = !!getNotesForChapter(chapter.id);
          return (
            <Card key={chapter.id} className="p-4 hoverable" onClick={() => setSelectedChapter(chapter.id)}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{chapter.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{chapter.topics.length} topics</p>
                  <span className={`text-xs mt-1 inline-block ${hasNotes ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasNotes ? 'Complete notes available' : 'Basic notes'}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
