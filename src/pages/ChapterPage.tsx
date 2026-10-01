import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { TrackId } from '@/types';
import { getChapterById } from '@/data/bpsc/syllabus-registry';
import { getQuestionsForChapter, getPYQsForChapter } from '@/data/bpsc/questions/question-generator';
import { getNotesForChapter, generateGenericNotes } from '@/data/bpsc/notes/notes-data';
import { getVideosForChapter } from '@/data/bpsc/videos/videos-data';
import { progressService } from '@/services/progress.service';
import { testEngine } from '@/services/test-engine.service';
import { NotesViewer } from '@/components/NotesViewer';
import { QuestionCard } from '@/components/QuestionCard';
import { Card, Button, ProgressBar, MasteryBadge, EmptyState, Badge } from '@/components/ui';
import { ArrowLeft, BookOpen, FileQuestion, Award, Video, RotateCcw, Target, Play } from 'lucide-react';
import { AIChat } from '@/components/AIChat';

interface Props { trackId: TrackId }

export function ChapterPage({ trackId }: Props) {
  const navigate = useNavigate();
  const { chapterId } = useParams<{ chapterId: string }>();
  const chapterData = chapterId ? getChapterById(trackId, chapterId) : undefined;
  const [tab, setTab] = useState<'overview' | 'notes' | 'mcqs' | 'pyqs' | 'practice' | 'videos' | 'revision'>('overview');
  const [mcqPage, setMcqPage] = useState(0);
  const [pyqPage, setPyqPage] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string | null>>({});
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!chapterData) {
    return <EmptyState message="Chapter not found" action={<Button onClick={() => navigate('/syllabus')}>Back to Syllabus</Button>} />;
  }

  const { chapter, subjectName, unitName } = chapterData;
  const allQuestions = getQuestionsForChapter(trackId, chapter.id, 50);
  const pyqs = getPYQsForChapter(trackId, chapter.id);
  const videos = getVideosForChapter(chapter.id);
  const notes = getNotesForChapter(chapter.id) || generateGenericNotes(chapter.id, chapter.name, chapter.importantConcepts || []);
  const progress = progressService.get();
  const completedTopics = chapter.topics.filter((t) => progress.completedTopics.includes(t.id)).length;
  const completionPct = chapter.topics.length > 0 ? Math.round((completedTopics / chapter.topics.length) * 100) : 0;
  const masteryScore = chapter.topics.length > 0 ? progressService.getMasteryScore(chapter.topics[0].id) : 0;

  const mcqsPerPage = 10;
  const mcqs = allQuestions.slice(mcqPage * mcqsPerPage, (mcqPage + 1) * mcqsPerPage);
  const pyqsPerPage = 10;
  const pyqList = pyqs.slice(pyqPage * pyqsPerPage, (pyqPage + 1) * pyqsPerPage);

  const practiceQuestions = allQuestions.slice(0, 10);
  const currentPractice = practiceQuestions[practiceIndex];

  const handlePracticeAnswer = (answer: string) => {
    setPracticeAnswers({ ...practiceAnswers, [currentPractice.id]: answer });
    if (practiceIndex < practiceQuestions.length - 1) {
      setPracticeIndex(practiceIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const startChapterTest = () => {
    testEngine.generateChapterTest(trackId, chapter.id, 30);
    navigate('/test?type=chapter');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'mcqs', label: 'MCQs', icon: FileQuestion },
    { id: 'pyqs', label: 'PYQs', icon: Award },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'revision', label: 'Revision', icon: RotateCcw },
  ] as const;

  return (
    <div className="space-y-4">
      <button onClick={() => navigate('/syllabus')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" /> Back to Syllabus
      </button>

      <div>
        <p className="text-xs text-gray-400">{subjectName} • {unitName}</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{chapter.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{chapter.description}</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-gray-500">Progress: <strong>{completionPct}%</strong></span>
        <ProgressBar value={completionPct} size="sm" className="w-32" />
        <MasteryBadge score={masteryScore} />
        <span className="text-sm text-gray-500">Questions: <strong>{allQuestions.length}</strong></span>
        <span className="text-sm text-gray-500">PYQs: <strong>{pyqs.length}</strong></span>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-200 pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Chapter Overview</h2>
            <p className="text-sm text-gray-600 mb-4">{chapter.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{chapter.topics.length}</p>
                <p className="text-xs text-gray-500">Topics</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{allQuestions.length}</p>
                <p className="text-xs text-gray-500">Questions</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{pyqs.length}</p>
                <p className="text-xs text-gray-500">PYQs</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{completionPct}%</p>
                <p className="text-xs text-gray-500">Complete</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Important Concepts</h3>
            <div className="flex flex-wrap gap-2">
              {(chapter.importantConcepts || []).map((concept) => (
                <Badge key={concept} label={concept} color="blue" />
              ))}
            </div>
          </Card>

          {chapter.difficultyDistribution && (
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Difficulty Distribution</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm w-16">Easy</span>
                  <ProgressBar value={chapter.difficultyDistribution.easy * 100} size="sm" color="bg-green-500" className="flex-1" />
                  <span className="text-sm font-medium">{Math.round(chapter.difficultyDistribution.easy * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm w-16">Medium</span>
                  <ProgressBar value={chapter.difficultyDistribution.medium * 100} size="sm" color="bg-amber-500" className="flex-1" />
                  <span className="text-sm font-medium">{Math.round(chapter.difficultyDistribution.medium * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm w-16">Hard</span>
                  <ProgressBar value={chapter.difficultyDistribution.hard * 100} size="sm" color="bg-red-500" className="flex-1" />
                  <span className="text-sm font-medium">{Math.round(chapter.difficultyDistribution.hard * 100)}%</span>
                </div>
              </div>
            </Card>
          )}

          <Button onClick={startChapterTest}>Take Chapter Test (30 Qs)</Button>
        </div>
      )}

      {tab === 'notes' && <NotesViewer sections={notes.sections} chapterName={chapter.name} />}

      {tab === 'mcqs' && (
        <div className="space-y-4">
          {mcqs.length === 0 ? (
            <EmptyState message="Question bank being expanded for this chapter" icon={<FileQuestion className="w-12 h-12" />} />
          ) : (
            <>
              {mcqs.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={mcqPage * mcqsPerPage + i} total={allQuestions.length} selectedAnswer={null} showResult />
              ))}
              <div className="flex items-center justify-between">
                <Button variant="secondary" size="sm" disabled={mcqPage === 0} onClick={() => setMcqPage(mcqPage - 1)}>Previous</Button>
                <span className="text-sm text-gray-500">Page {mcqPage + 1} of {Math.ceil(allQuestions.length / mcqsPerPage)}</span>
                <Button variant="secondary" size="sm" disabled={(mcqPage + 1) * mcqsPerPage >= allQuestions.length} onClick={() => setMcqPage(mcqPage + 1)}>Next</Button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'pyqs' && (
        <div className="space-y-4">
          {pyqList.length === 0 ? (
            <EmptyState message="No PYQs available for this chapter yet. PYQs will be added after verification." icon={<Award className="w-12 h-12" />} />
          ) : (
            <>
              {pyqList.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={pyqPage * pyqsPerPage + i} total={pyqs.length} selectedAnswer={null} showResult />
              ))}
              <div className="flex items-center justify-between">
                <Button variant="secondary" size="sm" disabled={pyqPage === 0} onClick={() => setPyqPage(pyqPage - 1)}>Previous</Button>
                <span className="text-sm text-gray-500">Page {pyqPage + 1} of {Math.ceil(pyqs.length / pyqsPerPage)}</span>
                <Button variant="secondary" size="sm" disabled={(pyqPage + 1) * pyqsPerPage >= pyqs.length} onClick={() => setPyqPage(pyqPage + 1)}>Next</Button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'practice' && (
        <div className="space-y-4">
          {!showResult && currentPractice ? (
            <QuestionCard question={currentPractice} index={practiceIndex} total={practiceQuestions.length} selectedAnswer={practiceAnswers[currentPractice.id] || null} onSelect={handlePracticeAnswer} />
          ) : showResult ? (
            <div className="space-y-4">
              {practiceQuestions.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} total={practiceQuestions.length} selectedAnswer={practiceAnswers[q.id] || null} showResult />
              ))}
              <Button onClick={() => { setPracticeAnswers({}); setPracticeIndex(0); setShowResult(false); }}>Practice Again</Button>
            </div>
          ) : (
            <EmptyState message="No practice questions available yet" icon={<Target className="w-12 h-12" />} />
          )}
        </div>
      )}

      {tab === 'videos' && (
        <div className="space-y-3">
          {videos.length === 0 ? (
            <EmptyState message="No videos added for this chapter yet" icon={<Video className="w-12 h-12" />} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videos.map((v) => (
                <Card key={v.id} className="p-4 hoverable">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-14 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                      <Play className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{v.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{v.channel}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge label={v.category} color="blue" />
                        <span className="text-xs text-gray-400">{v.duration} • {v.language}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'revision' && (
        <div className="space-y-3">
          {(() => {
            const dueItems = progressService.getDueRevision().filter((r) => r.chapterId === chapter.id);
            if (dueItems.length === 0) {
              return <EmptyState message="No revision is due for this chapter." icon={<RotateCcw className="w-12 h-12" />} />;
            }
            return dueItems.map((item) => (
              <Card key={item.questionId} className="p-4">
                <p className="text-sm text-gray-700">Question ID: {item.questionId}</p>
                <p className="text-xs text-gray-400 mt-1">Due: {item.nextReviewDate}</p>
                <Button size="sm" className="mt-2" onClick={() => navigate('/test?type=revision')}>Review Now</Button>
              </Card>
            ));
          })()}
        </div>
      )}

      <AIChat trackId={trackId} chapterId={chapter.id} chapterName={chapter.name} syllabusContext={`${subjectName} - ${chapter.name}`} />
    </div>
  );
}
