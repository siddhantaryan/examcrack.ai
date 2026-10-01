import { useNavigate } from 'react-router-dom';
import type { TrackId } from '@/types';
import { getAllChapters } from '@/data/bpsc/syllabus-registry';
import { testEngine } from '@/services/test-engine.service';
import { Card, Button, MasteryBadge } from '@/components/ui';
import { ClipboardList, Target } from 'lucide-react';

interface Props { trackId: TrackId }

export function MockTestsPage({ trackId }: Props) {
  const navigate = useNavigate();
  const chapters = getAllChapters(trackId);

  const startChapterTest = (chapterId: string) => {
    testEngine.generateChapterTest(trackId, chapterId, 30);
    navigate('/test?type=chapter');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mock Tests</h1>
        <p className="text-sm text-gray-500 mt-1">Chapter-wise and full-length mock tests</p>
      </div>

      <Card className="p-5 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-semibold text-blue-900">Full Mock Test (150 Questions)</h3>
            <p className="text-sm text-blue-700 mt-0.5">Complete BPSC TRE 4.0 simulation • 180 minutes</p>
          </div>
          <Button onClick={() => { testEngine.generateDailyTest(trackId); navigate('/test?type=daily'); }}>
            <Target className="w-4 h-4" /> Start Full Mock
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Chapter-wise Tests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {chapters.map(({ chapter }) => (
            <Card key={chapter.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{chapter.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">30 Questions • {chapter.topics.length} topics</p>
                </div>
                <Button size="sm" onClick={() => startChapterTest(chapter.id)}>Start</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
