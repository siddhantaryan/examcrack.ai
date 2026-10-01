import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TrackId } from '@/types';
import { getSyllabus } from '@/data/bpsc/syllabus-registry';
import { getQuestionsForChapter } from '@/data/bpsc/questions/question-generator';
import { progressService } from '@/services/progress.service';
import { Card, ProgressBar, MasteryBadge } from '@/components/ui';
import { AIChat } from '@/components/AIChat';
import { ChevronDown, ChevronRight, BookOpen, FileQuestion, Video, Award } from 'lucide-react';

interface Props { trackId: TrackId }

export function SyllabusPage({ trackId }: Props) {
  const syllabus = getSyllabus(trackId);
  const navigate = useNavigate();
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const progress = progressService.get();

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) next.delete(unitId);
      else next.add(unitId);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Syllabus</h1>
        <p className="text-sm text-gray-500 mt-1">{syllabus.trackName} — Complete chapter-wise syllabus</p>
      </div>

      {syllabus.subjects.map((subject) => (
        <div key={subject.id}>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">{subject.name}</h2>
          <div className="space-y-3">
            {subject.units.map((unit) => {
              const isExpanded = expandedUnits.has(unit.id);
              const totalTopics = unit.chapters.reduce((s, c) => s + c.topics.length, 0);
              const completedTopics = unit.chapters
                .flatMap((c) => c.topics)
                .filter((t) => progress.completedTopics.includes(t.id)).length;
              const pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

              return (
                <Card key={unit.id} className="overflow-hidden">
                  <div onClick={() => toggleUnit(unit.id)} className="p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                        <h3 className="font-semibold text-gray-900">{unit.name}</h3>
                        <span className="text-xs text-gray-400">{unit.chapters.length} chapters</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">{pct}%</span>
                        <div className="w-24"><ProgressBar value={pct} size="sm" /></div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 divide-y divide-gray-100">
                      {unit.chapters.map((chapter) => {
                        const qCount = getQuestionsForChapter(trackId, chapter.id, 50).length;
                        const pyqCount = getQuestionsForChapter(trackId, chapter.id, 50).filter((q) => q.is_pyq).length;
                        const chapterCompleted = chapter.topics.filter((t) => progress.completedTopics.includes(t.id)).length;
                        const chapterPct = chapter.topics.length > 0 ? Math.round((chapterCompleted / chapter.topics.length) * 100) : 0;
                        const masteryScore = progressService.getMasteryScore(chapter.topics[0]?.id || '');
                        return (
                          <div key={chapter.id} onClick={() => navigate(`/chapter/${chapter.id}`)} className="p-4 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm">{chapter.name}</h4>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">{chapter.description}</p>
                              </div>
                              <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-1 text-xs text-gray-500"><BookOpen className="w-3.5 h-3.5" /> {chapter.topics.length}</div>
                                <div className="flex items-center gap-1 text-xs text-gray-500"><FileQuestion className="w-3.5 h-3.5" /> {qCount}</div>
                                {pyqCount > 0 && <div className="flex items-center gap-1 text-xs text-purple-600"><Award className="w-3.5 h-3.5" /> {pyqCount}</div>}
                                <div className="flex items-center gap-1 text-xs text-gray-500"><Video className="w-3.5 h-3.5" /></div>
                                <MasteryBadge score={masteryScore} />
                                <span className="text-xs font-medium text-gray-600">{chapterPct}%</span>
                              </div>
                            </div>
                            <div className="mt-2"><ProgressBar value={chapterPct} size="sm" /></div>
                            <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700">Study Chapter →</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      <AIChat trackId={trackId} syllabusContext={syllabus.trackName} />
    </div>
  );
}
