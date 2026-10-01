import { useNavigate } from 'react-router-dom';
import type { TrackId } from '@/types';
import { APP_CONFIG } from '@/config/app.config';
import { testEngine } from '@/services/test-engine.service';
import { progressService } from '@/services/progress.service';
import { Card, Button, StatCard } from '@/components/ui';
import { Target, Flame, RotateCcw, Clock, TrendingUp, AlertTriangle, Award } from 'lucide-react';

interface Props { trackId: TrackId }

export function DailyTestPage({ trackId }: Props) {
  const navigate = useNavigate();
  const stats = progressService.getStats(trackId);
  const dueRevision = progressService.getDueRevision();
  const mistakes = progressService.getMistakes();
  const weakTopics = Object.entries(progressService.get().topicMastery)
    .filter(([, m]) => m.attempts > 0 && m.correct / m.attempts < 0.6);
  const personalizedMsg = testEngine.getPersonalizedTestSummary(trackId);
  const history = progressService.getTestHistory().filter((t) => t.trackId === trackId);

  const startTest = (type: 'daily' | 'weak' | 'revision') => {
    if (type === 'daily') testEngine.generateDailyTest(trackId);
    else if (type === 'weak') testEngine.generateWeakAreaTest(trackId);
    else testEngine.generateRevisionTest(trackId);
    navigate(`/test?type=${type}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Daily Test</h1>
        <p className="text-sm text-gray-500 mt-1">Take mock tests and track your performance</p>
      </div>

      {personalizedMsg && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 text-sm mb-1">Your Personalized Test</h3>
          <p className="text-sm text-blue-700">{personalizedMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Today's {APP_CONFIG.dailyTestQuestionCount} MCQ Test</h3>
              <p className="text-sm text-gray-500 mt-1">{APP_CONFIG.dailyTestQuestionCount} Questions • {APP_CONFIG.dailyTestDurationMinutes} min • Mixed difficulty</p>
              <p className="text-xs text-gray-400 mt-1">Personalized based on your performance</p>
              <Button className="mt-3" onClick={() => startTest('daily')}>Start Test</Button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Weak Area Practice</h3>
              <p className="text-sm text-gray-500 mt-1">
                {weakTopics.length > 0 ? `${weakTopics.length} weak topics • 20 Questions` : 'Take a test first to identify weak areas'}
              </p>
              <Button className="mt-3" disabled={weakTopics.length === 0} onClick={() => startTest('weak')}>Practice Now</Button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Revision Test</h3>
              <p className="text-sm text-gray-500 mt-1">{dueRevision.length} items due for revision</p>
              <Button className="mt-3" disabled={dueRevision.length === 0} onClick={() => startTest('revision')}>Start Revision</Button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Mistake Practice</h3>
              <p className="text-sm text-gray-500 mt-1">{mistakes.length} questions in your mistakes list</p>
              <Button className="mt-3" variant="secondary" onClick={() => navigate('/mistakes')}>View Mistakes</Button>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Test History</h2>
        {history.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 text-sm">No tests taken yet. Start your first test above!</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {history.slice().reverse().map((test, i) => (
              <Card key={test.testId} className="p-4 hoverable" onClick={() => navigate('/test/result')}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Test {history.length - i}</p>
                    <p className="text-xs text-gray-400">{new Date(test.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">{test.score}/{test.totalQuestions}</span>
                    <span className="text-sm text-green-600">{test.accuracy}%</span>
                    <span className="text-xs text-gray-400">{Math.floor(test.timeTaken / 60)}m</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
