import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TrackId } from '@/types';
import { progressService } from '@/services/progress.service';
import { testEngine } from '@/services/test-engine.service';
import { Card, Button, ProgressBar, EmptyState, Badge } from '@/components/ui';
import { formatTime } from '@/lib/utils';
import { CheckCircle, XCircle, SkipForward, Clock, TrendingUp, Award, Target, AlertTriangle } from 'lucide-react';
import type { TestResult } from '@/types';

interface Props { trackId: TrackId }

export function TestResultPage({ trackId }: Props) {
  const navigate = useNavigate();
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    const history = progressService.getTestHistory().filter((t) => t.trackId === trackId);
    if (history.length > 0) setResult(history[history.length - 1]);
  }, [trackId]);

  if (!result) {
    return <EmptyState message="No test results found. Take a test first!" action={<Button onClick={() => navigate('/daily-test')}>Go to Tests</Button>} />;
  }

  const accuracyColor = result.accuracy >= 75 ? 'text-green-600' : result.accuracy >= 60 ? 'text-amber-600' : 'text-red-600';
  const sortedTopics = [...result.topicPerformance].sort((a, b) => a.accuracy - b.accuracy);
  const recommendations = testEngine.getRecommendations(trackId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-3">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Test Completed</h1>
        <p className="text-sm text-gray-500 mt-1">{new Date(result.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>

      <Card className="p-6">
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-gray-900">{result.score} <span className="text-2xl text-gray-400">/ {result.totalQuestions}</span></p>
          <p className={`text-2xl font-bold ${accuracyColor} mt-1`}>{result.accuracy}% Accuracy</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-green-700">{result.correct}</p>
            <p className="text-xs text-gray-500">Correct</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <XCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-red-700">{result.incorrect}</p>
            <p className="text-xs text-gray-500">Incorrect</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <SkipForward className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-600">{result.skipped}</p>
            <p className="text-xs text-gray-500">Skipped</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-blue-700">{formatTime(result.timeTaken)}</p>
            <p className="text-xs text-gray-500">Time</p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Topic Performance</h2>
        <div className="space-y-3">
          {sortedTopics.map((tp) => {
            const status = tp.accuracy >= 80 ? { label: 'Strong', color: 'text-green-600', bar: 'bg-green-500' }
              : tp.accuracy >= 60 ? { label: 'Moderate', color: 'text-amber-600', bar: 'bg-amber-500' }
              : { label: 'Weak', color: 'text-red-600', bar: 'bg-red-500' };
            return (
              <div key={tp.topicId}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{tp.topicName}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${status.color}`}>{tp.accuracy}%</span>
                    <Badge label={status.label} color={tp.accuracy >= 80 ? 'green' : tp.accuracy >= 60 ? 'amber' : 'red'} />
                  </div>
                </div>
                <ProgressBar value={tp.accuracy} size="sm" color={status.bar} />
                <p className="text-xs text-gray-400 mt-0.5">{tp.correct}/{tp.total} correct</p>
              </div>
            );
          })}
        </div>
      </Card>

      {result.weakTopics.length > 0 && (
        <Card className="p-5">
          <h2 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Your Weak Areas
          </h2>
          <div className="space-y-2">
            {result.weakTopics.map((t) => (
              <div key={t} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">{t}</span>
                <Button size="sm" variant="secondary" onClick={() => navigate('/weak-areas')}>Practice</Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {result.strongTopics.length > 0 && (
        <Card className="p-5">
          <h2 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5" /> Your Strong Topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {result.strongTopics.map((t) => <Badge key={t} label={t} color="green" />)}
          </div>
        </Card>
      )}

      {recommendations.length > 0 && (
        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" /> Recommendations
          </h2>
          <div className="space-y-3">
            {recommendations.slice(0, 5).map((r, i) => (
              <div key={i} className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{r.topicName} <span className="text-gray-400">({r.chapterName})</span></p>
                <p className="text-xs text-red-600 mt-0.5">Accuracy: {r.accuracy}%</p>
                <p className="text-xs text-gray-600 mt-1">{r.recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Button className="flex-1" onClick={() => navigate('/test?type=daily')}>
          <TrendingUp className="w-4 h-4" /> Take Another Test
        </Button>
        <Button variant="secondary" className="flex-1" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
