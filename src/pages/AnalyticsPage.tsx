import type { TrackId } from '@/types';
import { getAllChapters } from '@/data/bpsc/syllabus-registry';
import { progressService } from '@/services/progress.service';
import { Card, ProgressBar, StatCard, EmptyState, MasteryBadge } from '@/components/ui';
import { TrendingUp, Target, Award, Flame, BarChart3 } from 'lucide-react';

interface Props { trackId: TrackId }

export function AnalyticsPage({ trackId }: Props) {
  const stats = progressService.getStats(trackId);
  const progress = progressService.get();
  const chapters = getAllChapters(trackId);
  const history = progressService.getTestHistory().filter((t) => t.trackId === trackId);
  const totalTopics = chapters.reduce((s, c) => s + c.chapter.topics.length, 0);
  const completedPct = totalTopics > 0 ? Math.round((progress.completedTopics.length / totalTopics) * 100) : 0;

  const chapterPerformance = chapters.map(({ chapter }) => {
    const topicIds = chapter.topics.map((t) => t.id);
    const masteryScores = topicIds.map((id) => progressService.getMasteryScore(id));
    const avgMastery = masteryScores.length > 0 ? Math.round(masteryScores.reduce((a, b) => a + b, 0) / masteryScores.length) : 0;
    const attempts = topicIds.reduce((s, id) => s + (progress.topicMastery[id]?.attempts || 0), 0);
    const correct = topicIds.reduce((s, id) => s + (progress.topicMastery[id]?.correct || 0), 0);
    const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
    return { chapter, mastery: avgMastery, attempts, accuracy };
  }).filter((c) => c.attempts > 0);

  const maxScore = history.length > 0 ? Math.max(...history.map((t) => t.score)) : 0;
  const avgScore = history.length > 0 ? Math.round(history.reduce((s, t) => s + t.score, 0) / history.length) : 0;
  const avgAccuracy = history.length > 0 ? Math.round(history.reduce((s, t) => s + t.accuracy, 0) / history.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
        <p className="text-sm text-gray-500 mt-1">Track your performance and improvement over time</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Syllabus" value={`${completedPct}%`} icon={<BarChart3 className="w-6 h-6" />} color="text-blue-600" />
        <StatCard label="Questions" value={stats.totalQuestions.toLocaleString()} icon={<Target className="w-6 h-6" />} color="text-cyan-600" />
        <StatCard label="Accuracy" value={`${stats.accuracy}%`} icon={<TrendingUp className="w-6 h-6" />} color="text-green-600" />
        <StatCard label="Avg Score" value={avgScore} icon={<Award className="w-6 h-6" />} color="text-purple-600" />
        <StatCard label="Best Score" value={maxScore} icon={<Award className="w-6 h-6" />} color="text-amber-600" />
        <StatCard label="Streak" value={`${progress.streak}d`} icon={<Flame className="w-6 h-6" />} color="text-orange-600" />
      </div>

      <Card className="p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Score Trend</h2>
        {history.length === 0 ? (
          <EmptyState message="No test data yet. Take a test to see your score trend." icon={<TrendingUp className="w-12 h-12" />} />
        ) : (
          <div>
            <div className="flex items-end gap-2 h-40 mb-2">
              {history.map((test, i) => {
                const heightPct = test.totalQuestions > 0 ? (test.score / test.totalQuestions) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">{test.score}</span>
                    <div className="w-full bg-blue-200 rounded-t hover:bg-blue-400 transition-colors" style={{ height: `${heightPct}%` }} />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              {history.map((_, i) => (
                <span key={i} className="flex-1 text-center text-xs text-gray-400">T{i + 1}</span>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Accuracy Trend</h2>
        {history.length === 0 ? (
          <EmptyState message="No accuracy data yet." icon={<TrendingUp className="w-12 h-12" />} />
        ) : (
          <div>
            <div className="flex items-end gap-2 h-32 mb-2">
              {history.map((test, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">{test.accuracy}%</span>
                  <div className="w-full bg-green-200 rounded-t hover:bg-green-400 transition-colors" style={{ height: `${test.accuracy}%` }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {history.map((_, i) => (
                <span key={i} className="flex-1 text-center text-xs text-gray-400">T{i + 1}</span>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Chapter Performance</h2>
        {chapterPerformance.length === 0 ? (
          <EmptyState message="No chapter data yet. Practice questions to see performance." icon={<BarChart3 className="w-12 h-12" />} />
        ) : (
          <div className="space-y-3">
            {chapterPerformance.map(({ chapter, mastery, attempts, accuracy }) => (
              <div key={chapter.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{chapter.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{attempts} Qs</span>
                    <span className="text-sm font-medium text-gray-700">{accuracy}%</span>
                    <MasteryBadge score={mastery} />
                  </div>
                </div>
                <ProgressBar value={accuracy} size="sm" color={accuracy >= 75 ? 'bg-green-500' : accuracy >= 60 ? 'bg-amber-500' : 'bg-red-500'} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
