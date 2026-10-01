import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { GraduationCap, Send, Loader2, X, MessageCircle } from 'lucide-react';
import type { TrackId } from '@/types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  trackId: TrackId;
  chapterId?: string;
  chapterName?: string;
  syllabusContext?: string;
}

export function AIChat({ trackId, chapterId, chapterName, syllabusContext }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const contextKey = chapterId || 'general';

  useEffect(() => {
    if (!open || !user) return;
    setFetchingHistory(true);
    (async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('user_id', user.id)
        .eq('track_id', trackId)
        .or(`chapter_id.eq.${chapterId || ''},chapter_id.is.null`)
        .order('created_at', { ascending: true })
        .limit(50);
      if (data && data.length > 0) {
        setMessages(data.map((d) => ({ role: d.role as 'user' | 'assistant', content: d.content })));
      } else {
        setMessages([
          {
            role: 'assistant',
            content: chapterName
              ? `Hi! I'm your AI tutor. Ask me anything about "${chapterName}" and I'll help you understand the concepts.`
              : `Hi! I'm your AI tutor. Ask me anything about the syllabus and I'll help you understand the concepts.`,
          },
        ]);
      }
      setFetchingHistory(false);
    })();
  }, [open, user, contextKey, trackId, chapterId, chapterName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || !user) return;

    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        track_id: trackId,
        chapter_id: chapterId || null,
        role: 'user',
        content: userMsg.content,
      });

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          trackId,
          chapterId,
          chapterName,
          syllabusContext,
        }),
      });

      if (!response.ok) throw new Error('Chat service unavailable');

      const data = await response.json();
      const reply = data.reply || 'Sorry, I could not generate a response.';

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);

      await supabase.from('chat_messages').insert({
        user_id: user.id,
        track_id: trackId,
        chapter_id: chapterId || null,
        role: 'assistant',
        content: reply,
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I could not connect to the AI service. Please try again in a moment.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-300 hover:bg-blue-700 transition-all"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium text-sm">Ask AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          <div>
            <p className="font-semibold text-sm">AI Tutor</p>
            <p className="text-xs text-blue-100">{chapterName || 'Syllabus Assistant'}</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-blue-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {fetchingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3.5 py-2.5">
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about any concept..."
            rows={1}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-24"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
