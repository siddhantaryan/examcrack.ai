import { useNavigate } from 'react-router-dom';
import { TRACKS } from '@/data/bpsc/tracks';
import { progressService } from '@/services/progress.service';
import { useAuth } from '@/lib/auth';
import { ArrowRight, BookOpen, FileQuestion, ClipboardList, BarChart3, Loader2 } from 'lucide-react';
import type { TrackId } from '@/types';
import { useState } from 'react';

interface Props {
  onSelectTrack?: (trackId: TrackId) => void;
}

export function TrackSelectionPage({ onSelectTrack }: Props) {
  const navigate = useNavigate();
  const { updateProfile, user } = useAuth();
  const [selecting, setSelecting] = useState<string | null>(null);

  const handleSelect = async (trackId: TrackId) => {
    setSelecting(trackId);
    progressService.setSelectedTrack(trackId);
    if (user) {
      await updateProfile({ selected_track: trackId });
    }
    onSelectTrack?.(trackId);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Choose Your Preparation Track</h1>
          <p className="text-gray-500">Select the track that matches your BPSC TRE 4.0 exam</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TRACKS.map((track) => (
            <div
              key={track.id}
              onClick={() => !selecting && handleSelect(track.id)}
              className="bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{track.icon}</div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">BPSC TRE 4.0</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{track.title}</h2>
              <p className="text-sm text-gray-500 mb-1">{track.subject}</p>
              <p className="text-sm text-gray-400 mb-5">{track.description}</p>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  { icon: BookOpen, label: 'Syllabus' },
                  { icon: FileQuestion, label: 'MCQs' },
                  { icon: ClipboardList, label: 'Mock Tests' },
                  { icon: BarChart3, label: 'Progress' },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <f.icon className="w-3.5 h-3.5" />
                    {f.label}
                  </div>
                ))}
              </div>

              <button
                disabled={selecting !== null}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm group-hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {selecting === track.id ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Selecting...</>
                ) : (
                  <>Start Preparation <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
