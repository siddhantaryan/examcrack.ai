import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressService } from '@/services/progress.service';
import { Card, Button, EmptyState, Badge } from '@/components/ui';
import { AlertTriangle, Bookmark, RotateCcw, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function MistakesPage() {
  const navigate = useNavigate();
  const [mistakes, setMistakes] = useState(progressService.getMistakes());

  const removeMistake = (questionId: string) => {
    progressService.removeMistake(questionId);
    setMistakes(progressService.getMistakes());
  };

  const toggleBookmark = (questionId: string) => {
    const m = mistakes.find((mm) => mm.questionId === questionId);
    if (!m) return;
    if (progressService.isBookmarked('mcq', questionId)) {
      progressService.removeBookmark('mcq', questionId);
    } else {
      progressService.addBookmark({ id: `bm-${questionId}`, type: 'mcq', refId: questionId, chapterId: m.chapterId, title: m.question, date: new Date().toISOString() });
    }
    setMistakes([...mistakes]);
  };

  if (mistakes.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">My Mistakes</h1>
        <EmptyState message="No mistakes yet — keep practicing!" icon={<AlertTriangle className="w-12 h-12" />} action={<Button onClick={() => navigate('/test?type=daily')}>Take a Test</Button>} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Mistakes</h1>
        <p className="text-sm text-gray-500 mt-1">{mistakes.length} questions you've answered incorrectly</p>
      </div>

      <div className="space-y-3">
        {mistakes.map((m) => (
          <Card key={m.questionId} className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="text-sm font-medium text-gray-900 flex-1">{m.question}</p>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleBookmark(m.questionId)} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <Bookmark className={`w-4 h-4 ${progressService.isBookmarked('mcq', m.questionId) ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`} />
                </button>
                <button onClick={() => removeMistake(m.questionId)} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <p className="text-xs text-red-500">Your Answer</p>
                <p className="text-sm font-medium text-red-700 mt-0.5">{m.myAnswer ? m.myAnswer.toUpperCase() : 'Not answered'}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <p className="text-xs text-green-500">Correct Answer</p>
                <p className="text-sm font-medium text-green-700 mt-0.5">{m.correctAnswer.toUpperCase()}</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg mb-3">
              <p className="text-xs text-gray-500 mb-1">Explanation</p>
              <p className="text-sm text-gray-700">{m.explanation}</p>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Badge label={m.topicName} color="blue" />
                <Badge label={m.difficulty} color="gray" />
                <span className="text-xs text-gray-400">{formatDate(m.date)}</span>
                <span className="text-xs text-gray-400">Attempts: {m.attempts}</span>
              </div>
              <Button size="sm" variant="secondary" onClick={() => navigate(`/chapter/${m.chapterId}`)}>
                <RotateCcw className="w-3.5 h-3.5" /> Practice Again
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
