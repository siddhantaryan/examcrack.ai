import { useState } from 'react';
import type { TrackId } from '@/types';
import { getAllChapters } from '@/data/bpsc/syllabus-registry';
import { getVideosForChapter } from '@/data/bpsc/videos/videos-data';
import { Card, EmptyState, Badge } from '@/components/ui';
import { Video, Play } from 'lucide-react';

interface Props { trackId: TrackId }

export function VideosPage({ trackId }: Props) {
  const chapters = getAllChapters(trackId);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const videos = selectedChapter ? getVideosForChapter(selectedChapter) : chapters.flatMap(({ chapter }) => getVideosForChapter(chapter.id));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
        <p className="text-sm text-gray-500 mt-1">Recommended learning videos for each chapter</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedChapter(null)} className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${!selectedChapter ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>All</button>
        {chapters.map(({ chapter }) => (
          <button key={chapter.id} onClick={() => setSelectedChapter(chapter.id)} className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${selectedChapter === chapter.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            {chapter.name}
          </button>
        ))}
      </div>

      {videos.length === 0 ? (
        <EmptyState message="No videos available yet. Videos will be added soon." icon={<Video className="w-12 h-12" />} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <Card key={v.id} className="p-4 hoverable">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-3 relative">
                <Play className="w-10 h-10 text-gray-400" />
                <span className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-1.5 py-0.5 rounded">{v.duration}</span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">{v.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{v.channel}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge label={v.category} color="blue" />
                <span className="text-xs text-gray-400">{v.language}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
