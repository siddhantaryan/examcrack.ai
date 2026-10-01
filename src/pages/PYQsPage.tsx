import { useState } from 'react';
import type { TrackId } from '@/types';
import { getAllChapters } from '@/data/bpsc/syllabus-registry';
import { getQuestionsForChapter } from '@/data/bpsc/questions/question-generator';
import { QuestionCard } from '@/components/QuestionCard';
import { Card, EmptyState, Badge } from '@/components/ui';
import { Award, Filter } from 'lucide-react';

interface Props { trackId: TrackId }

export function PYQsPage({ trackId }: Props) {
  const chapters = getAllChapters(trackId);
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [page, setPage] = useState(0);
  const perPage = 10;

  const allPyqs = chapters
    .flatMap(({ chapter }) => getQuestionsForChapter(trackId, chapter.id, 50).filter((q) => q.is_pyq))
    .filter((q) => chapterFilter === 'all' || q.chapter_id === chapterFilter)
    .filter((q) => yearFilter === 'all' || q.year === yearFilter);

  const years = [...new Set(allPyqs.map((q) => q.year).filter(Boolean))] as number[];
  const pageItems = allPyqs.slice(page * perPage, (page + 1) * perPage);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Previous Year Questions</h1>
        <p className="text-sm text-gray-500 mt-1">Verified BPSC TRE PYQs with detailed explanations</p>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <select value={chapterFilter} onChange={(e) => { setChapterFilter(e.target.value); setPage(0); }} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
            <option value="all">All Chapters</option>
            {chapters.map(({ chapter }) => <option key={chapter.id} value={chapter.id}>{chapter.name}</option>)}
          </select>
          <select value={yearFilter} onChange={(e) => { setYearFilter(e.target.value === 'all' ? 'all' : Number(e.target.value)); setPage(0); }} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
            <option value="all">All Years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <Badge label={`${allPyqs.length} PYQs`} color="purple" />
        </div>
      </Card>

      {pageItems.length === 0 ? (
        <EmptyState message="No PYQs available for these filters yet. PYQs will be added after verification." icon={<Award className="w-12 h-12" />} />
      ) : (
        <>
          <div className="space-y-4">
            {pageItems.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={page * perPage + i} total={allPyqs.length} selectedAnswer={null} showResult />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50">Previous</button>
            <span className="text-sm text-gray-500">Page {page + 1} of {Math.ceil(allPyqs.length / perPage)}</span>
            <button disabled={(page + 1) * perPage >= allPyqs.length} onClick={() => setPage(page + 1)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50">Next</button>
          </div>
        </>
      )}
    </div>
  );
}
