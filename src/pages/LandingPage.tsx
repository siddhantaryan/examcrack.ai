import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, FileQuestion, BarChart3, Clock, ArrowRight, Target, Award, TrendingUp, MessageCircle } from 'lucide-react';
import { APP_CONFIG } from '@/config/app.config';
import { daysUntil } from '@/lib/utils';

export function LandingPage() {
  const navigate = useNavigate();
  const days = daysUntil(APP_CONFIG.examDate);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="font-bold text-gray-900 text-lg">ExamCrack AI</h1>
              <p className="text-xs text-gray-500">{APP_CONFIG.tagline}</p>
            </div>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
              <Clock className="w-4 h-4 text-red-500" />
              <span className="text-sm font-bold text-red-700">{days} Days Left</span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-medium text-blue-700">BPSC TRE 4.0 Preparation Platform</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Prepare Smarter. Practice More.<br />Improve Every Day.
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
            Complete syllabus, detailed notes, thousands of MCQs, PYQs, mock tests, AI-powered tutoring and personalized performance analysis.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              START PREPARATION
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              TAKE DAILY TEST
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {[
            { icon: BookOpen, title: 'Complete Syllabus', desc: 'Structured chapter-wise notes & concepts', color: 'text-blue-600 bg-blue-50' },
            { icon: FileQuestion, title: '5000+ MCQs', desc: 'Practice questions with detailed explanations', color: 'text-cyan-600 bg-cyan-50' },
            { icon: MessageCircle, title: 'AI Tutor', desc: 'Chat with AI to understand any concept deeply', color: 'text-teal-600 bg-teal-50' },
            { icon: BarChart3, title: 'Smart Analytics', desc: 'Track weak areas & get personalized tests', color: 'text-green-600 bg-green-50' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mx-auto mb-3`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
          {[
            { icon: Target, label: '150 Daily MCQs', value: 'Per Test' },
            { icon: TrendingUp, label: 'Performance', value: 'Analytics' },
            { icon: Award, label: 'Mastery', value: 'Tracking' },
            { icon: Clock, label: 'Timer', value: 'Built-in' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <s.icon className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{s.label}</p>
                <p className="text-xs text-gray-400">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-200 py-6">
        <p className="text-center text-sm text-gray-400">
          ExamCrack AI — BPSC TRE 4.0 Complete Preparation Platform
        </p>
      </footer>
    </div>
  );
}
