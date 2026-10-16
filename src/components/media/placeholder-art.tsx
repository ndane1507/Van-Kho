import { BookOpen, Feather, Flame, Library, MessagesSquare, Moon, Mountain, Music, PenLine, Quote, ScrollText, Sparkles } from 'lucide-react';

const byGenre: Record<string, typeof BookOpen> = {
  'Thơ': Feather,
  'Truyện ngắn': BookOpen,
  'Truyện vừa': BookOpen,
  'Tiểu thuyết': Library,
  'Chính luận': ScrollText,
  'Tiểu luận': ScrollText,
  'Phê bình văn học': PenLine,
  'Kịch': MessagesSquare,
  'Sử thi': Mountain,
  'Thần thoại': Sparkles,
  'Chèo': Music,
  'Tuồng': Music,
  'Truyện thơ': Quote,
  'Truyện truyền kỳ': Moon,
  'Ký': PenLine,
  'Hồi ký': PenLine,
  'Văn tế': Flame,
};

export function PlaceholderArt({ title, genre, className = '' }: { title: string; genre: string; className?: string }) {
  const Icon = byGenre[genre] ?? BookOpen;
  const initial = title.trim().charAt(0).toUpperCase();
  return (
    <div className={`motif-art ${className}`} aria-hidden="true">
      <span className="motif-initial">{initial}</span>
      <span className="motif-row"><Icon size={18} strokeWidth={1.5} /><span>{genre}</span></span>
    </div>
  );
}
