import { useNavigate } from 'react-router-dom';
import type { TrackId } from '@/types';
import { getAllTopics } from '@/data/bpsc/syllabus-registry';
import { progressService } from '@/services/progress.service';
import { testEngine } from '@/services/test-engine.service';
import { Card, Button, ProgressBar, EmptyState } from '@/components/ui';
import { AlertTriangle, Target, TrendingUp } from 'lucide-react';

interface Props { trackId: TrackId }

export function WeakAreasPage({ trackId }: Props) {
  const navigate = useNavigate();
  const topics = getAllTopics(trackId);
  const mastery = progressService.get().topicMastery;

  const weakTopics = topics
    .map((t) => {
      const m = mastery[t.topicId];
      const score = m && m.attempts > 0 ? Math.round((m.correct / m.attempts) * 100) : -1;
      return { ...t, score, attempts: m?.attempts || 0 };
    })
    .filter((t) => t.score >= 0 && t.score < 60)
    .sort((a, b) => a.score - b.score);

  const moderateTopics = topics
    .map((t) => {
      const m = mastery[t.topicId];
      const score = m && m.attempts > 0 ? Math.round((m.correct / m.attempts) * 100) : -1;
      return { ...t, score, attempts: m?.attempts || 0 };
    })
    .filter((t) => t.score >= 60 && t.score < 75)
    .sort((a, b) => a.score - b.score);

  const recommendations = testEngine.getRecommendations(trackId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weak Areas</h1>
        <p className="text-sm text-gray-500 mt-1">Topics that need more attention based on your performance</p>
      </div>

      {weakTopics.length === 0 && moderateTopics.length === 0 ? (
        <EmptyState message="No weak areas identified yet. Take a test to discover your weak topics." icon={<AlertTriangle className="w-12 h-12" />} action={<Button onClick={() => navigate('/test?type=daily')}>Take a Test</Button>} />
      ) : (
        <>
          {weakTopics.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Critical & Weak Topics
              </h2>
              <div className="space-y-2">
                {weakTopics.map((t) => (
                  <Card key={t.topicId} className="p-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{t.topicName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{t.chapterName} • {t.attempts} attempts</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${t.score < 40 ? 'text-red-600' : 'text-orange-600'}`}>{t.score}%</span>
                        <Button size="sm" onClick={() => navigate(`/chapter/${t.chapterId}`)}>Study</Button>
                      </div>
                    </div>
                    <ProgressBar value={t.score} size="sm" color="bg-red-500" className="mt-2" />
                  </Card>
                ))}
              </div>
            </div>
          )}

          {moderateTopics.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-amber-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Moderate Topics
              </h2>
              <div className="space-y-2">
                {moderateTopics.map((t) => (
                  <Card key={t.topicId} className="p-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{t.topicName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{t.chapterName} • {t.attempts} attempts</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-amber-600">{t.score}%</span>
                        <Button size="sm" variant="secondary" onClick={() => navigate(`/chapter/${t.chapterId}`)}>Study</Button>
                      </div>
                    </div>
                    <ProgressBar value={t.score} size="sm" color="bg-amber-500" className="mt-2" />
                  </Card>
                ))}
              </div>
            </div>
          )}

          {recommendations.length > 0 && (
            <Card className="p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Recommendations</h2>
              <div className="space-y-3">
                {recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Target className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.topicName} <span className="text-gray-400">({r.chapterName})</span></p>
                      <p className="text-xs text-red-600 mt-0.5">Accuracy: {r.accuracy}%</p>
                      <p className="text-xs text-gray-500 mt-1">{r.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-5 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Practice Weak Areas</h3>
                <p className="text-sm text-blue-700 mt-0.5">Generate a test focused on your weak topics</p>
              </div>
              <Button onClick={() => { testEngine.generateWeakAreaTest(trackId); navigate('/test?type=weak'); }}>
                <Target className="w-4 h-4" /> Practice Now
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
