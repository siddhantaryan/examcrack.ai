import { useState } from 'react';
import { progressService } from '@/services/progress.service';
import { Card, EmptyState, Badge } from '@/components/ui';
import { Bookmark, FileQuestion, FileText, Video, BookOpen, Calculator } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function BookmarksPage() {
  const [bookmarks] = useState(progressService.getBookmarks());

  const icons = {
    note: BookOpen,
    mcq: FileQuestion,
    pyq: FileQuestion,
    video: Video,
    formula: Calculator,
    concept: FileText,
  };

  if (bookmarks.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>
        <EmptyState message="No bookmarked questions yet. Bookmark questions while practicing to find them here." icon={<Bookmark className="w-12 h-12" />} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>
        <p className="text-sm text-gray-500 mt-1">{bookmarks.length} bookmarked items</p>
      </div>

      <div className="space-y-2">
        {bookmarks.map((b) => {
          const Icon = icons[b.type] || Bookmark;
          return (
            <Card key={b.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{b.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge label={b.type.toUpperCase()} color="blue" />
                    <span className="text-xs text-gray-400">{formatDate(b.date)}</span>
                  </div>
                </div>
                <button onClick={() => { progressService.removeBookmark(b.type, b.refId); }} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <Bookmark className="w-4 h-4 fill-blue-500 text-blue-500" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
