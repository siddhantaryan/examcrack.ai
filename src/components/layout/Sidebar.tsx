import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { progressService } from '@/services/progress.service';
import { useAuth } from '@/lib/auth';
import type { TrackId } from '@/types';
import {
  LayoutDashboard, BookOpen, FileText, FileQuestion, Library,
  CalendarClock, ClipboardList, AlertTriangle, RotateCcw, BarChart3,
  Video, Bookmark, GraduationCap, Search, LogOut, Home
} from 'lucide-react';

interface SidebarProps {
  trackId: TrackId;
  onNavigate?: () => void;
}

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/syllabus', label: 'Syllabus', icon: BookOpen },
  { to: '/notes', label: 'Notes', icon: FileText },
  { to: '/pyqs', label: 'PYQs', icon: FileQuestion },
  { to: '/question-bank', label: 'Question Bank', icon: Library },
  { to: '/daily-test', label: 'Daily Test', icon: CalendarClock },
  { to: '/mock-tests', label: 'Mock Tests', icon: ClipboardList },
  { to: '/weak-areas', label: 'Weak Areas', icon: AlertTriangle },
  { to: '/mistakes', label: 'My Mistakes', icon: AlertTriangle },
  { to: '/revision', label: 'Revision', icon: RotateCcw },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/videos', label: 'Videos', icon: Video },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
];

export function Sidebar({ trackId, onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleTrackChange = () => {
    progressService.setSelectedTrack(trackId);
    onNavigate?.();
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
    onNavigate?.();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-gray-200">
        <button onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer text-left">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">ExamCrack AI</h1>
            <p className="text-xs text-gray-500">BPSC TRE 4.0</p>
          </div>
        </button>
      </div>

      <div className="px-3 py-3 border-b border-gray-100">
        <button
          onClick={() => { navigate('/track-selection'); handleTrackChange(); }}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-xs text-gray-400">Current Track</span>
          <p className="text-sm font-medium text-gray-700 mt-0.5">
            {trackId === 'cs-11-12' ? 'CS 11-12' : trackId === 'math-9-10' ? 'Math 9-10' : 'Math 6-8'}
          </p>
          <span className="text-xs text-blue-600">Change track {'->'}</span>
        </button>
      </div>

      {profile?.email && (
        <div className="px-3 py-2 border-b border-gray-100">
          <p className="text-xs text-gray-400 px-3">Signed in as</p>
          <p className="text-sm font-medium text-gray-700 px-3 truncate">{profile.email}</p>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5',
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200 space-y-1">
        <NavLink
          to="/search"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <Search className="w-4 h-4" />
          Search
        </NavLink>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const items = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/syllabus', label: 'Syllabus', icon: BookOpen },
    { to: '/question-bank', label: 'Practice', icon: Library },
    { to: '/daily-test', label: 'Test', icon: CalendarClock },
    { to: '/analytics', label: 'Progress', icon: BarChart3 },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around py-2 z-50 md:hidden">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 px-2 py-1 text-xs font-medium',
              isActive ? 'text-blue-600' : 'text-gray-500'
            )
          }
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
