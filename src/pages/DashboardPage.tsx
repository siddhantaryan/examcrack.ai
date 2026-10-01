import { useNavigate } from 'react-router-dom';
import type { TrackId } from '@/types';
import { TRACK_MAP } from '@/data/bpsc/tracks';
import { getAllChapters } from '@/data/bpsc/syllabus-registry';
import { getQuestionsForChapter } from '@/data/bpsc/questions/question-generator';
import { progressService } from '@/services/progress.service';
import { testEngine } from '@/services/test-engine.service';
import { APP_CONFIG } from '@/config/app.config';
import { daysUntil } from '@/lib/utils';
import { StatCard, Card, Button, ProgressBar } from '@/components/ui';
import { BookOpen, Target, Flame, RotateCcw, Clock, TrendingUp, Award, AlertTriangle } from 'lucide-react';

interface Props { trackId: TrackId }

export function DashboardPage({ trackId }: Props) {
  const navigate = useNavigate();
  const track = TRACK_MAP[trackId];
  const chapters = getAllChapters(trackId);
  const stats = progressService.getStats(trackId);
  const progress = progressService.get();
  const totalTopics = chapters.reduce((sum, c) => sum + c.chapter.topics.length, 0);
  const completedCount = progress.completedTopics.length;
  const syllabusPct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
  const days = daysUntil(APP_CONFIG.examDate);
  const dueRevision = progressService.getDueRevision();
  const mistakes = progressService.getMistakes();
  const weakTopics = Object.entries(progress.topicMastery)
    .filter(([, m]) => m.attempts > 0 && m.correct / m.attempts < 0.6);
  const personalizedMsg = testEngine.getPersonalizedTestSummary(trackId);
  const lastVisited = progress.lastVisitedTopic
    ? chapters.flatMap((c) => c.chapter.topics.map((t) => ({ ...t, chapterId: c.chapter.id, chapterName: c.chapter.name })))
        .find((t) => t.id === progress.lastVisitedTopic)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">BPSC TRE 4.0 Preparation</h1>
          <p className="text-sm text-gray-500 mt-1">{track.title} • {track.subject}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
          <Clock className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-xs text-red-500">Exam Countdown</p>
            <p className="text-lg font-bold text-red-700">{days} Days</p>
          </div>
        </div>
      </div>

      {personalizedMsg && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 text-sm mb-1">Your Personalized Test</h3>
          <p className="text-sm text-blue-700">{personalizedMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Syllabus Progress" value={`${syllabusPct}%`} icon={<ProgressBar value={syllabusPct} size="sm" className="mt-2" />} color="text-blue-600" />
        <StatCard label="Questions Attempted" value={stats.totalQuestions.toLocaleString()} icon={<Target className="w-6 h-6" />} color="text-cyan-600" />
        <StatCard label="Accuracy" value={`${stats.accuracy}%`} icon={<TrendingUp className="w-6 h-6" />} color="text-green-600" />
        <StatCard label="Mock Tests" value={stats.totalTests} icon={<Award className="w-6 h-6" />} color="text-purple-600" />
        <StatCard label="Strong Topics" value={stats.strongCount} icon={<Award className="w-6 h-6" />} color="text-green-600" />
        <StatCard label="Weak Topics" value={stats.weakCount} icon={<AlertTriangle className="w-6 h-6" />} color="text-red-600" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Today's Preparation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 hoverable" onClick={() => navigate(lastVisited ? `/chapter/${lastVisited.chapterId}` : '/syllabus')}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Continue Learning</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {lastVisited ? `${lastVisited.chapterName} → ${lastVisited.name}` : 'Browse syllabus to start'}
                </p>
                <Button size="sm" className="mt-3">Continue</Button>
              </div>
            </div>
          </Card>

          <Card className="p-5 hoverable" onClick={() => navigate('/test?type=daily')}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Today's {APP_CONFIG.dailyTestQuestionCount} MCQ Test</h3>
                <p className="text-sm text-gray-500 mt-0.5">{APP_CONFIG.dailyTestQuestionCount} Questions • Mixed Difficulty</p>
                <Button size="sm" className="mt-3">Start Test</Button>
              </div>
            </div>
          </Card>

          <Card className="p-5 hoverable" onClick={() => navigate('/test?type=weak')}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Weak Area Practice</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {weakTopics.length > 0 ? `${weakTopics.length} weak topics • 20 Questions` : 'Take a test to identify weak areas'}
                </p>
                <Button size="sm" className="mt-3">Practice Now</Button>
              </div>
            </div>
          </Card>

          <Card className="p-5 hoverable" onClick={() => navigate('/test?type=revision')}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Revision</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {dueRevision.length > 0 ? `${dueRevision.length} topics due today` : 'No revision due today'}
                </p>
                <Button size="sm" className="mt-3">Start Revision</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Study Streak</h2>
          <span className="flex items-center gap-1.5 text-sm font-medium text-orange-600">
            <Flame className="w-4 h-4" /> {progress.streak} {progress.streak === 1 ? 'Day' : 'Days'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {Array.from({ length: Math.max(7, progress.streak) }).map((_, i) => (
            <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${i < progress.streak ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
              {i + 1}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Recent Chapters</h2>
        <div className="space-y-2">
          {chapters.slice(0, 5).map(({ chapter }) => {
            const qCount = getQuestionsForChapter(trackId, chapter.id, 50).length;
            return (
              <div key={chapter.id} onClick={() => navigate(`/chapter/${chapter.id}`)} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{chapter.name}</p>
                  <p className="text-xs text-gray-400">{chapter.topics.length} topics • {qCount} questions</p>
                </div>
                <ProgressBar value={progress.completedTopics.filter((t) => chapter.topics.some((ct) => ct.id === t)).length} max={chapter.topics.length} size="sm" className="w-24" />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
