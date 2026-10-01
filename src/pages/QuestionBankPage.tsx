import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TrackId } from '@/types';
import { getAllChapters } from '@/data/bpsc/syllabus-registry';
import { getQuestionsForChapter } from '@/data/bpsc/questions/question-generator';
import { QuestionCard } from '@/components/QuestionCard';
import { Card, EmptyState, Badge, Button } from '@/components/ui';
import { Library, Filter, Target } from 'lucide-react';

interface Props { trackId: TrackId }

export function QuestionBankPage({ trackId }: Props) {
  const navigate = useNavigate();
  const chapters = getAllChapters(trackId);
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const perPage = 10;

  const allQuestions = chapters
    .flatMap(({ chapter }) => getQuestionsForChapter(trackId, chapter.id, 50))
    .filter((q) => chapterFilter === 'all' || q.chapter_id === chapterFilter)
    .filter((q) => difficultyFilter === 'all' || q.difficulty === difficultyFilter);

  const pageItems = allQuestions.slice(page * perPage, (page + 1) * perPage);
  const totalQuestions = chapters.reduce((sum, { chapter }) => sum + getQuestionsForChapter(trackId, chapter.id, 50).length, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
        <p className="text-sm text-gray-500 mt-1">
          {totalQuestions > 0 ? `${totalQuestions} practice questions available` : 'Question bank being expanded'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalQuestions}</p>
          <p className="text-xs text-gray-500">Total Questions</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{allQuestions.filter((q) => q.difficulty === 'easy').length}</p>
          <p className="text-xs text-gray-500">Easy</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{allQuestions.filter((q) => q.difficulty === 'medium').length}</p>
          <p className="text-xs text-gray-500">Medium</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{allQuestions.filter((q) => q.difficulty === 'hard' || q.difficulty === 'very-hard').length}</p>
          <p className="text-xs text-gray-500">Hard</p>
        </Card>
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
          <select value={difficultyFilter} onChange={(e) => { setDifficultyFilter(e.target.value); setPage(0); }} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="very-hard">Very Hard</option>
          </select>
        </div>
      </Card>

      {pageItems.length === 0 ? (
        <EmptyState message="No questions match these filters" icon={<Library className="w-12 h-12" />} />
      ) : (
        <>
          <div className="space-y-4">
            {pageItems.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={page * perPage + i} total={allQuestions.length} selectedAnswer={null} showResult />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50">Previous</button>
            <span className="text-sm text-gray-500">Page {page + 1} of {Math.ceil(allQuestions.length / perPage)}</span>
            <button disabled={(page + 1) * perPage >= allQuestions.length} onClick={() => setPage(page + 1)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50">Next</button>
          </div>
        </>
      )}

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">Ready for a full test?</h3>
            <p className="text-sm text-blue-700 mt-0.5">Take a 150-question daily mock test</p>
          </div>
          <Button onClick={() => navigate('/test?type=daily')} className="shrink-0">
            <Target className="w-4 h-4" /> Start Test
          </Button>
        </div>
      </Card>
    </div>
  );
}
