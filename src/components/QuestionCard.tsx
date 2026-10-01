import type { Question } from '@/types';
import { cn } from '@/lib/utils';
import { Bookmark, CheckCircle, XCircle } from 'lucide-react';
import { progressService } from '@/services/progress.service';
import { useState } from 'react';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  selectedAnswer: string | null;
  showResult?: boolean;
  onSelect?: (answer: string) => void;
  onBookmark?: () => void;
}

export function QuestionCard({ question, index, total, selectedAnswer, showResult, onSelect, onBookmark }: QuestionCardProps) {
  const [bookmarked, setBookmarked] = useState(
    progressService.isBookmarked('mcq', question.id)
  );

  const options = [
    { key: 'a', text: question.option_a },
    { key: 'b', text: question.option_b },
    { key: 'c', text: question.option_c },
    { key: 'd', text: question.option_d },
  ...(question.option_e ? [{ key: 'e', text: question.option_e }] : []),
  ];

  const handleBookmark = () => {
    if (bookmarked) {
      progressService.removeBookmark('mcq', question.id);
    } else {
      progressService.addBookmark({
        id: `bm-${question.id}`,
        type: 'mcq',
        refId: question.id,
        chapterId: question.chapter_id,
        title: question.question,
        date: new Date().toISOString(),
      });
    }
    setBookmarked(!bookmarked);
    onBookmark?.();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-400">Q{index + 1} / {total}</span>
          <span className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
            question.difficulty === 'easy' ? 'bg-green-100 text-green-700'
            : question.difficulty === 'medium' ? 'bg-amber-100 text-amber-700'
            : 'bg-red-100 text-red-700'
          )}>
            {question.difficulty}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
            {question.question_type.replace(/-/g, ' ')}
          </span>
          {question.is_pyq && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
              OFFICIAL PYQ
            </span>
          )}
          {question.is_ai_generated && !question.is_pyq && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-100 text-cyan-700">
              AI GENERATED
            </span>
          )}
          {!question.is_pyq && !question.is_ai_generated && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
              PRACTICE
            </span>
          )}
        </div>
        <button onClick={handleBookmark} className="p-1.5 rounded-lg hover:bg-gray-100 shrink-0">
          <Bookmark className={cn('w-4 h-4', bookmarked ? 'fill-blue-500 text-blue-500' : 'text-gray-400')} />
        </button>
      </div>

      <p className="text-gray-900 font-medium mb-5 leading-relaxed">{question.question}</p>

      <div className="space-y-2.5">
        {options.map((opt) => {
          const isSelected = selectedAnswer === opt.key;
          const isCorrect = showResult && opt.key === question.correct_answer;
          const isWrong = showResult && isSelected && opt.key !== question.correct_answer;
          return (
            <button
              key={opt.key}
              onClick={() => !showResult && onSelect?.(opt.key)}
              disabled={showResult}
              className={cn(
                'w-full text-left px-4 py-3 rounded-lg border-2 transition-all flex items-center gap-3',
                !showResult && isSelected && 'border-blue-500 bg-blue-50',
                !showResult && !isSelected && 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                isCorrect && 'border-green-500 bg-green-50',
                isWrong && 'border-red-500 bg-red-50',
                showResult && !isCorrect && !isWrong && 'border-gray-200 opacity-60'
              )}
            >
              <span className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shrink-0',
                !showResult && isSelected && 'bg-blue-500 text-white',
                !showResult && !isSelected && 'bg-gray-100 text-gray-600',
                isCorrect && 'bg-green-500 text-white',
                isWrong && 'bg-red-500 text-white',
                showResult && !isCorrect && !isWrong && 'bg-gray-100 text-gray-400'
              )}>
                {opt.key.toUpperCase()}
              </span>
              <span className="text-sm text-gray-700">{opt.text}</span>
              {isCorrect && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
              {isWrong && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-1">Explanation</p>
          <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <span>Concept: {question.concept}</span>
            {question.year && <span>• Year: {question.year}</span>}
            <span>• Source: {question.source}</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface QuestionPaletteProps {
  questions: Question[];
  answers: Record<string, string | null>;
  markedForReview: Set<string>;
  currentIndex: number;
  onJump: (index: number) => void;
}

export function QuestionPalette({ questions, answers, markedForReview, currentIndex, onJump }: QuestionPaletteProps) {
  const stats = {
    answered: Object.values(answers).filter(Boolean).length,
    marked: markedForReview.size,
    notVisited: questions.length - Object.keys(answers).length,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-4 mb-3 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500" /> Answered ({stats.answered})</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400" /> Marked ({stats.marked})</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-gray-200" /> Not Visited ({stats.notVisited})</span>
      </div>
      <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
        {questions.map((q, i) => {
          const answered = answers[q.id];
          const marked = markedForReview.has(q.id);
          return (
            <button
              key={q.id}
              onClick={() => onJump(i)}
              className={cn(
                'w-8 h-8 rounded text-xs font-medium transition-all',
                i === currentIndex && 'ring-2 ring-blue-400',
                marked && answered && 'bg-amber-400 text-white',
                marked && !answered && 'bg-amber-200 text-amber-700',
                !marked && answered && 'bg-green-500 text-white',
                !marked && !answered && i < currentIndex && 'bg-red-100 text-red-600',
                !marked && !answered && i >= currentIndex && 'bg-gray-100 text-gray-500'
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
