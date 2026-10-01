import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { TrackId } from '@/types';
import { progressService } from '@/services/progress.service';
import { useAuth } from '@/lib/auth';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { Topbar, MobileMenu } from '@/components/layout/Topbar';
import { AuthPage } from '@/pages/AuthPage';
import { LandingPage } from '@/pages/LandingPage';
import { TrackSelectionPage } from '@/pages/TrackSelectionPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { SyllabusPage } from '@/pages/SyllabusPage';
import { ChapterPage } from '@/pages/ChapterPage';
import { NotesPage } from '@/pages/NotesPage';
import { PYQsPage } from '@/pages/PYQsPage';
import { QuestionBankPage } from '@/pages/QuestionBankPage';
import { DailyTestPage } from '@/pages/DailyTestPage';
import { MockTestsPage } from '@/pages/MockTestsPage';
import { WeakAreasPage } from '@/pages/WeakAreasPage';
import { MistakesPage } from '@/pages/MistakesPage';
import { RevisionPage } from '@/pages/RevisionPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { VideosPage } from '@/pages/VideosPage';
import { BookmarksPage } from '@/pages/BookmarksPage';
import { SearchPage } from '@/pages/SearchPage';
import { TestInterfacePage } from '@/pages/TestInterfacePage';
import { TestResultPage } from '@/pages/TestResultPage';
import { Loader2 } from 'lucide-react';

function AppShell() {
  const { user, profile, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const trackId: TrackId | null = (profile?.selected_track as TrackId) || null;

  useEffect(() => {
    if (user) progressService.recordVisit();
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (!trackId) {
    return (
      <Routes>
        <Route path="/track-selection" element={<TrackSelectionPage onSelectTrack={() => navigate('/dashboard')} />} />
        <Route path="/" element={<Navigate to="/track-selection" replace />} />
        <Route path="*" element={<Navigate to="/track-selection" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:block sticky top-0 h-screen">
        <Sidebar trackId={trackId} />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage trackId={trackId} />} />
            <Route path="/syllabus" element={<SyllabusPage trackId={trackId} />} />
            <Route path="/chapter/:chapterId" element={<ChapterPage trackId={trackId} />} />
            <Route path="/notes" element={<NotesPage trackId={trackId} />} />
            <Route path="/pyqs" element={<PYQsPage trackId={trackId} />} />
            <Route path="/question-bank" element={<QuestionBankPage trackId={trackId} />} />
            <Route path="/daily-test" element={<DailyTestPage trackId={trackId} />} />
            <Route path="/mock-tests" element={<MockTestsPage trackId={trackId} />} />
            <Route path="/weak-areas" element={<WeakAreasPage trackId={trackId} />} />
            <Route path="/mistakes" element={<MistakesPage />} />
            <Route path="/revision" element={<RevisionPage trackId={trackId} />} />
            <Route path="/analytics" element={<AnalyticsPage trackId={trackId} />} />
            <Route path="/videos" element={<VideosPage trackId={trackId} />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/search" element={<SearchPage trackId={trackId} />} />
            <Route path="/test" element={<TestInterfacePage trackId={trackId} />} />
            <Route path="/test/result" element={<TestResultPage trackId={trackId} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <MobileNav />
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
