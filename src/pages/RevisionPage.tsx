import { useNavigate } from 'react-router-dom';
import type { TrackId } from '@/types';
import { progressService } from '@/services/progress.service';
import { testEngine } from '@/services/test-engine.service';
import { Card, Button, EmptyState, Badge } from '@/components/ui';
import { RotateCcw, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { APP_CONFIG } from '@/config/app.config';

interface Props { trackId: TrackId }

export function RevisionPage({ trackId }: Props) {
  const navigate = useNavigate();
  const schedule = progressService.getRevisionSchedule();
  const today = new Date().toISOString().split('T')[0];
  const dueItems = schedule.filter((r) => r.nextReviewDate <= today);
  const upcomingItems = schedule.filter((r) => r.nextReviewDate > today).sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revision</h1>
        <p className="text-sm text-gray-500 mt-1">Spaced repetition system — review at optimal intervals</p>
      </div>

      <Card className="p-4 bg-purple-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-purple-900">Spaced Revision Schedule</h3>
            <p className="text-sm text-purple-700 mt-0.5">Day 1 → Day 3 → Day 7 → Day 14 → Day 30</p>
          </div>
          <Button onClick={() => { testEngine.generateRevisionTest(trackId); navigate('/test?type=revision'); }} disabled={dueItems.length === 0}>
            <RotateCcw className="w-4 h-4" /> Start Revision Test
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Today's Revision ({dueItems.length})</h2>
        {dueItems.length === 0 ? (
          <EmptyState message="No revision is due today. Great job!" icon={<CheckCircle className="w-12 h-12" />} />
        ) : (
          <div className="space-y-2">
            {dueItems.map((item) => (
              <Card key={item.questionId} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Question: {item.questionId}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Chapter: {item.chapterId} • Topic: {item.topicId}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge label={`Interval: Day ${APP_CONFIG.revisionIntervals[item.intervalIndex]}`} color="purple" />
                      <span className="text-xs text-red-500">Due: {item.nextReviewDate}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Revision ({upcomingItems.length})</h2>
        {upcomingItems.length === 0 ? (
          <EmptyState message="No upcoming revision scheduled." icon={<Calendar className="w-12 h-12" />} />
        ) : (
          <div className="space-y-2">
            {upcomingItems.slice(0, 20).map((item) => (
              <Card key={item.questionId} className="p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">{item.questionId}</p>
                  <div className="flex items-center gap-2">
                    <Badge label={`Day ${APP_CONFIG.revisionIntervals[item.intervalIndex]}`} color="gray" />
                    <span className="text-xs text-gray-400">{item.nextReviewDate}</span>
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
