import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { TrackId } from '@/types';
import { testEngine, type ActiveTest } from '@/services/test-engine.service';
import { progressService } from '@/services/progress.service';
import { QuestionCard, QuestionPalette } from '@/components/QuestionCard';
import { Button, Card } from '@/components/ui';
import { formatTime } from '@/lib/utils';
import { Clock, ChevronLeft, ChevronRight, Flag, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { APP_CONFIG } from '@/config/app.config';

interface Props { trackId: TrackId }

export function TestInterfacePage({ trackId }: Props) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [test, setTest] = useState<ActiveTest | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    let active = testEngine.restoreActiveTest();
    if (!active) {
      const type = params.get('type') || 'daily';
      if (type === 'daily') active = testEngine.generateDailyTest(trackId);
      else if (type === 'weak') active = testEngine.generateWeakAreaTest(trackId);
      else if (type === 'revision') active = testEngine.generateRevisionTest(trackId);
      else active = testEngine.generateDailyTest(trackId);
    }
    setTest(active);
    setTimeLeft(Math.max(0, Math.floor((active.durationMs - (Date.now() - active.startTime)) / 1000)));
  }, [trackId, params]);

  useEffect(() => {
    if (!test || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [test]);

  const saveState = useCallback((updated: ActiveTest) => {
    setTest(updated);
    testEngine.saveTestState(updated);
  }, []);

  if (!test) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-gray-500">Loading test...</p></div>;

  const currentQ = test.questions[test.currentIndex];
  const answeredCount = Object.values(test.answers).filter(Boolean).length;
  const unanswered = test.questions.length - answeredCount;

  const handleSelect = (answer: string) => {
    const newAnswers = { ...test.answers, [currentQ.id]: answer };
    saveState({ ...test, answers: newAnswers });
  };

  const handleClear = () => {
    const newAnswers = { ...test.answers };
    delete newAnswers[currentQ.id];
    saveState({ ...test, answers: newAnswers });
  };

  const handleMark = () => {
    const newMarked = new Set(test.markedForReview);
    if (newMarked.has(currentQ.id)) newMarked.delete(currentQ.id);
    else newMarked.add(currentQ.id);
    saveState({ ...test, markedForReview: newMarked });
  };

  const handlePrev = () => {
    if (test.currentIndex > 0) saveState({ ...test, currentIndex: test.currentIndex - 1 });
  };

  const handleNext = () => {
    if (test.currentIndex < test.questions.length - 1) saveState({ ...test, currentIndex: test.currentIndex + 1 });
  };

  const handleSubmit = () => {
    if (unanswered > 0 && !showSubmitConfirm) {
      setShowSubmitConfirm(true);
      return;
    }
    testEngine.submitTest(test);
    navigate('/test/result');
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3 sticky top-16 bg-gray-50 z-30 py-2">
        <div>
          <h1 className="text-lg font-bold text-gray-900">{APP_CONFIG.examName} — Daily Mock Test</h1>
          <p className="text-sm text-gray-500">Question {test.currentIndex + 1} / {test.questions.length}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className={`text-lg font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="space-y-4">
          {currentQ && (
            <QuestionCard
              question={currentQ}
              index={test.currentIndex}
              total={test.questions.length}
              selectedAnswer={test.answers[currentQ.id] || null}
              onSelect={handleSelect}
            />
          )}

          <div className="flex items-center justify-between flex-wrap gap-2">
            <Button variant="secondary" onClick={handlePrev} disabled={test.currentIndex === 0}>
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <Trash2 className="w-4 h-4" /> Clear
              </Button>
              <Button variant="ghost" size="sm" onClick={handleMark}>
                <Flag className={`w-4 h-4 ${test.markedForReview.has(currentQ?.id || '') ? 'fill-amber-400 text-amber-400' : ''}`} />
                {test.markedForReview.has(currentQ?.id || '') ? 'Unmark' : 'Mark'}
              </Button>
            </div>
            <Button onClick={handleNext} disabled={test.currentIndex === test.questions.length - 1}>
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <Button onClick={handleSubmit} className="w-full" size="lg">
            <CheckCircle className="w-5 h-5" /> Submit Test
          </Button>
        </div>

        <div className="space-y-3">
          <QuestionPalette
            questions={test.questions}
            answers={test.answers}
            markedForReview={test.markedForReview}
            currentIndex={test.currentIndex}
            onJump={(i) => saveState({ ...test, currentIndex: i })}
          />
          <Card className="p-3 text-xs text-gray-500">
            <p>Answered: {answeredCount} | Unanswered: {unanswered} | Marked: {test.markedForReview.size}</p>
          </Card>
        </div>
      </div>

      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowSubmitConfirm(false)}>
          <Card className="p-6 max-w-md w-full" >
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
                <h2 className="text-lg font-bold text-gray-900">Submit Test?</h2>
              </div>
              <p className="text-sm text-gray-600 mb-1">You still have <strong>{unanswered}</strong> unanswered {unanswered === 1 ? 'question' : 'questions'}.</p>
              <p className="text-sm text-gray-500 mb-5">Are you sure you want to submit?</p>
              <div className="flex items-center gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowSubmitConfirm(false)}>Continue Test</Button>
                <Button className="flex-1" onClick={() => { testEngine.submitTest(test); navigate('/test/result'); }}>Submit Anyway</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
