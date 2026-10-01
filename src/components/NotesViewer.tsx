import type { NoteSection } from '@/types';
import { cn } from '@/lib/utils';
import { Lightbulb, AlertTriangle, Info, BookOpen, Calculator } from 'lucide-react';

interface NotesViewerProps {
  sections: NoteSection[];
  chapterName: string;
}

export function NotesViewer({ sections, chapterName }: NotesViewerProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{chapterName} — Complete Notes</h1>
      <div className="space-y-6">
        {sections.map((section, i) => (
          <NoteSectionView key={i} section={section} />
        ))}
      </div>
    </div>
  );
}

function NoteSectionView({ section }: { section: NoteSection }) {
  const icons = {
    warning: AlertTriangle,
    tip: Lightbulb,
    formula: Calculator,
    example: BookOpen,
    solved: Info,
  };
  const Icon = icons[section.type as keyof typeof icons] || BookOpen;
  const bgColors = {
    warning: 'bg-amber-50 border-amber-200',
    tip: 'bg-blue-50 border-blue-200',
    formula: 'bg-purple-50 border-purple-200',
    example: 'bg-green-50 border-green-200',
    solved: 'bg-cyan-50 border-cyan-200',
    text: 'bg-white border-gray-200',
    list: 'bg-white border-gray-200',
    table: 'bg-white border-gray-200',
  };
  const iconColors = {
    warning: 'text-amber-500',
    tip: 'text-blue-500',
    formula: 'text-purple-500',
    example: 'text-green-500',
    solved: 'text-cyan-500',
    text: 'text-gray-400',
    list: 'text-gray-400',
    table: 'text-gray-400',
  };

  return (
    <div className={cn('rounded-xl border p-5', bgColors[section.type] || 'bg-white border-gray-200')}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={cn('w-5 h-5', iconColors[section.type])} />
        <h2 className="text-lg font-semibold text-gray-900">{section.heading}</h2>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">{section.content}</p>
      {section.items && (
        <ul className="space-y-2">
          {section.items.map((item, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {section.table && (
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {section.table.headers.map((h, i) => (
                  <th key={i} className="px-4 py-2 text-left font-semibold text-gray-700 border border-gray-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2 text-gray-700 border border-gray-200">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
