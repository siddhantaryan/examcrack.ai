import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TrackId } from '@/types';
import { getAllChapters } from '@/data/bpsc/syllabus-registry';
import { getQuestionsForChapter } from '@/data/bpsc/questions/question-generator';
import { getVideosForChapter } from '@/data/bpsc/videos/videos-data';
import { getNotesForChapter } from '@/data/bpsc/notes/notes-data';
import { Card, EmptyState, Badge } from '@/components/ui';
import { Search, BookOpen, FileQuestion, Video, FileText } from 'lucide-react';

interface Props { trackId: TrackId }

export function SearchPage({ trackId }: Props) {
  const [params] = useSearchParams();
  const initialQuery = params.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{ type: string; title: string; subtitle: string; chapterId: string }[]>([]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const chapters = getAllChapters(trackId);
    const found: { type: string; title: string; subtitle: string; chapterId: string }[] = [];

    for (const { chapter } of chapters) {
      if (chapter.name.toLowerCase().includes(q) || chapter.description.toLowerCase().includes(q)) {
        found.push({ type: 'Chapter', title: chapter.name, subtitle: chapter.description, chapterId: chapter.id });
      }
      for (const topic of chapter.topics) {
        if (topic.name.toLowerCase().includes(q)) {
          found.push({ type: 'Topic', title: topic.name, subtitle: chapter.name, chapterId: chapter.id });
        }
      }
      if (getNotesForChapter(chapter.id)) {
        found.push({ type: 'Notes', title: `${chapter.name} Notes`, subtitle: 'Complete notes', chapterId: chapter.id });
      }
      const pyqs = getQuestionsForChapter(trackId, chapter.id, 50).filter((qq) => qq.is_pyq && (qq.concept.toLowerCase().includes(q) || qq.question.toLowerCase().includes(q)));
      if (pyqs.length > 0) found.push({ type: 'PYQs', title: `${chapter.name} PYQs`, subtitle: `${pyqs.length} PYQs found`, chapterId: chapter.id });
      const mcqs = getQuestionsForChapter(trackId, chapter.id, 50).filter((qq) => qq.concept.toLowerCase().includes(q) || qq.question.toLowerCase().includes(q));
      if (mcqs.length > 0) found.push({ type: 'MCQs', title: `${chapter.name} MCQs`, subtitle: `${mcqs.length} questions found`, chapterId: chapter.id });
      const vids = getVideosForChapter(chapter.id).filter((v) => v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q));
      if (vids.length > 0) found.push({ type: 'Videos', title: `${chapter.name} Videos`, subtitle: `${vids.length} videos found`, chapterId: chapter.id });
    }

    setResults(found);
  }, [query, trackId]);

  const icons: Record<string, typeof BookOpen> = { Chapter: BookOpen, Topic: BookOpen, Notes: FileText, PYQs: FileQuestion, MCQs: FileQuestion, Videos: Video };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search</h1>
        <p className="text-sm text-gray-500 mt-1">Search across chapters, topics, notes, MCQs, PYQs, and videos</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for 'deadlock', 'quadratic', 'normalization'..."
          autoFocus
          className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {query.trim() && results.length === 0 ? (
        <EmptyState message={`No results found for "${query}"`} icon={<Search className="w-12 h-12" />} />
      ) : results.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-500">{results.length} results found</p>
          {results.map((r, i) => {
            const Icon = icons[r.type] || BookOpen;
            return (
              <Card key={i} className="p-4 hoverable" onClick={() => window.location.hash = `#/chapter/${r.chapterId}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge label={r.type} color="blue" />
                      <h3 className="font-medium text-gray-900 text-sm">{r.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{r.subtitle}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
