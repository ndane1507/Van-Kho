'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Image as ImageIcon,
  X,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  BookOpen,
  User,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  {
    title: 'Phân tích Trao duyên',
    prompt: 'Phân tích diễn biến tâm trạng đầy bi kịch của Thúy Kiều trong đoạn trích Trao duyên (Truyện Kiều - Nguyễn Du).',
  },
  {
    title: 'Dàn ý Nghị luận xã hội',
    prompt: 'Gợi ý cấu trúc dàn ý chi tiết cho bài văn nghị luận xã hội về chủ đề "Ý chí vượt lên nghịch cảnh của tuổi trẻ hiện nay".',
  },
  {
    title: 'Bình giảng Tràng giang',
    prompt: 'Bình giảng nét cổ điển và hiện đại trong hai khổ thơ đầu bài thơ Tràng giang của Huy Cận.',
  },
  {
    title: 'Hình tượng Tây Tiến',
    prompt: 'Phân tích vẻ đẹp lãng mạn và tinh thần bi tráng của người lính trong bài thơ Tây Tiến của Quang Dũng.',
  },
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-msg',
  role: 'assistant',
  content: `Chào em! Thầy/cô là **Trợ lý Văn học của Văn Khố**.

Em có thể trao đổi bất kỳ câu hỏi nào về các tác phẩm, tác giả hoặc kỹ năng viết văn trong chương trình Ngữ văn THPT (Lớp 10, 11, 12 theo chuẩn GDPT 2018).

> **Gợi ý học tập:** Nếu em có **ảnh chụp đề kiểm tra, đoạn trích văn bản hoặc phiếu học tập**, em hãy nhấn nút đính kèm hình ảnh (hoặc kéo thả ảnh vào khung) để đính kèm nhé. Thầy/cô sẽ đọc đề và hướng dẫn em cách tìm luận điểm, phân tích chi tiết từng bước!`,
  timestamp: 'Văn Khố AI',
};

// Lightweight safe markdown renderer for literary formatting
function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let listType: 'ul' | 'ol' = 'ul';

  const flushList = () => {
    if (inList && listItems.length > 0) {
      if (listType === 'ol') {
        elements.push(<ol key={`ol-${elements.length}`}>{listItems}</ol>);
      } else {
        elements.push(<ul key={`ul-${elements.length}`}>{listItems}</ul>);
      }
      listItems = [];
      inList = false;
    }
  };

  const formatInline = (text: string): React.ReactNode => {
    // Hỗ trợ [nhãn](url), **đậm**, *nghiêng*, `mã`. Thứ tự ưu tiên link > code > bold > italic.
    const tokenRegex = /(\[([^\]]+)\]\((https?:[^)\s]+)\))|(`([^`]+)`)|(\*\*([^*]+)\*\*)|(\*([^*\n]+)\*)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let keyIdx = 0;

    while ((match = tokenRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      if (match[1]) {
        parts.push(
          <a key={`a-${keyIdx++}`} href={match[3]} target="_blank" rel="noopener noreferrer">
            {match[2]}
          </a>
        );
      } else if (match[4]) {
        parts.push(<code key={`c-${keyIdx++}`}>{match[5]}</code>);
      } else if (match[6]) {
        parts.push(<strong key={`b-${keyIdx++}`}>{match[7]}</strong>);
      } else if (match[8]) {
        parts.push(<em key={`i-${keyIdx++}`}>{match[9]}</em>);
      }
      lastIndex = tokenRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(<h4 key={`h4-${i}`}>{formatInline(trimmed.slice(4))}</h4>);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(<h3 key={`h3-${i}`}>{formatInline(trimmed.slice(3))}</h3>);
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={`bq-${i}`}>{formatInline(trimmed.slice(2))}</blockquote>
      );
      continue;
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***') {
      flushList();
      elements.push(<hr key={`hr-${i}`} />);
      continue;
    }

    // Unordered List
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(<li key={`li-${i}`}>{formatInline(trimmed.slice(2))}</li>);
      continue;
    }

    // Ordered List
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(<li key={`li-${i}`}>{formatInline(olMatch[2])}</li>);
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(<p key={`p-${i}`}>{formatInline(trimmed)}</p>);
  }

  flushList();
  return elements;
}

export function AiTutorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollWrapRef = useRef<HTMLDivElement>(null);
  const [pinnedToBottom, setPinnedToBottom] = useState(true);
  const autoScrolling = useRef(false);
  const autoScrollTimer = useRef<number | null>(null);

  const scrollToBottom = useCallback((instant = false) => {
    const el = scrollWrapRef.current;
    if (!el) return;
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    autoScrolling.current = true;
    if (autoScrollTimer.current) window.clearTimeout(autoScrollTimer.current);
    autoScrollTimer.current = window.setTimeout(() => {
      autoScrolling.current = false;
    }, instant || reduceMotion ? 80 : 550);
    el.scrollTo({ top: el.scrollHeight, behavior: instant || reduceMotion ? 'auto' : 'smooth' });
  }, []);

  const handleMessagesScroll = useCallback(() => {
    if (autoScrolling.current) return;
    const el = scrollWrapRef.current;
    if (!el) return;
    setPinnedToBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 90);
  }, []);

  useEffect(() => {
    if (pinnedToBottom) scrollToBottom();
  }, [messages, streamingContent, isLoading, pinnedToBottom, scrollToBottom]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const msgSeqRef = useRef(0);

  // Handle image file selection with client-side scaling/compression
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng chỉ chọn tệp hình ảnh (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('Dung lượng ảnh tối đa là 20MB.');
      return;
    }

    setErrorMsg(null);
    setAttachedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawUrl = e.target?.result;
      if (typeof rawUrl !== 'string') return;

      const img = new window.Image();
      img.onload = () => {
        const maxDim = 1600;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setAttachedImage(compressed);
        } else {
          setAttachedImage(rawUrl);
        }
      };
      img.onerror = () => setAttachedImage(rawUrl);
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleClearImage = () => {
    setAttachedImage(null);
    setAttachedFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback cho trình duyệt chặn Clipboard API (iframe/http).
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch {
        setErrorMsg('Không thể sao chép tự động. Vui lòng bôi đen văn bản và sao chép thủ công.');
        return;
      }
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm('Em có chắc chắn muốn làm mới cuộc trò chuyện này không?')) {
      setMessages([INITIAL_MESSAGE]);
      setStreamingContent('');
      setErrorMsg(null);
      handleClearImage();
    }
  };

  // Submit message
  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend ?? input).trim();
    if ((!messageText && !attachedImage) || isLoading) return;

    setErrorMsg(null);
    setPinnedToBottom(true);
    const currentImage = attachedImage;
    const currentText = messageText;

    // Reset input fields
    setInput('');
    handleClearImage();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    msgSeqRef.current += 1;
    const userMessageId = `user-${msgSeqRef.current}`;
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: currentText || (currentImage ? 'Nhờ thầy/cô đọc ảnh đề bài này và hướng dẫn giải đáp giúp em ạ.' : ''),
      image: currentImage ?? undefined,
      timestamp: 'Vừa xong',
    };

    const nextHistory = [...messages, newUserMessage];
    setMessages(nextHistory);
    setIsLoading(true);
    setStreamingContent('');

    try {
      // Prepare payload
      const historyPayload = nextHistory
        .filter((m) => m.id !== 'init-msg')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch('/api/tro-ly-van-hoc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentText,
          imageBase64: currentImage,
          history: historyPayload.slice(0, -1), // Previous turns
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Lỗi máy chủ (${res.status})`);
      }

      if (!res.body) {
        throw new Error('Không nhận được phản hồi dữ liệu từ máy chủ.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        setStreamingContent(fullResponse);
      }

      // Add finished response to messages
      msgSeqRef.current += 1;
      const assistantMessageId = `assistant-${msgSeqRef.current}`;
      const cleanResponse = fullResponse.trim();
      if (!cleanResponse) {
        setErrorMsg('Trợ lý AI trả về phản hồi rỗng. Vui lòng bấm Gửi để thử lại.');
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            role: 'assistant',
            content: cleanResponse,
            timestamp: 'Vừa xong',
          },
        ]);
      }
      setStreamingContent('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi kết nối với Trợ lý AI.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="ai-chat-card"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Header Bar */}
      <div className="ai-chat-header">
        <div className="ai-chat-header-title">
          <span className="pulse-dot" aria-hidden="true" />
          <span>Trợ lý Ngữ văn Trực tuyến</span>
        </div>
        <div className="ai-chat-header-actions">
          <button
            type="button"
            className="ai-chat-btn-subtle"
            onClick={handleClearChat}
            title="Làm mới cuộc trò chuyện"
          >
            <RotateCcw size={13} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompts (Visible when only initial message exists) */}
      {messages.length === 1 && !isLoading && (
        <div style={{ padding: '16px 20px 0' }}>
          <span className="ai-prompts-label">CÂU HỎI & CHỦ ĐỀ GỢI Ý NHANH</span>
          <div className="ai-prompts-list">
            {STARTER_PROMPTS.map((item) => (
              <button
                key={item.title}
                type="button"
                className="ai-prompt-btn"
                onClick={() => handleSendMessage(item.prompt)}
              >
                <Sparkles size={16} />
                <div>
                  <strong>{item.title}</strong>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
                    {item.prompt}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        className="ai-messages-wrap"
        ref={scrollWrapRef}
        onScroll={handleMessagesScroll}
        role="log"
        aria-live="polite"
        aria-label="Lịch sử trò chuyện với Trợ lý Văn học"
      >
        {messages.map((m) => (
          <div key={m.id} className={`ai-message ${m.role}`}>
            <div className="ai-avatar" aria-hidden="true">
              {m.role === 'assistant' ? <BookOpen size={16} /> : <User size={16} />}
            </div>
            <div className="ai-message-bubble">
              {m.role === 'assistant' && (
                <button
                  type="button"
                  className="ai-message-copy"
                  onClick={() => handleCopyText(m.content, m.id)}
                  title="Sao chép câu trả lời"
                >
                  {copiedId === m.id ? <Check size={14} /> : <Copy size={14} />}
                </button>
              )}
              {m.image && (
                <div className="ai-message-image-preview">
                  <img src={m.image} alt="Ảnh đề bài học sinh tải lên" />
                </div>
              )}
              <div className="ai-message-text">{renderMarkdown(m.content)}</div>
            </div>
          </div>
        ))}

        {/* Live Streaming Response */}
        {isLoading && (
          <div className="ai-message assistant">
            <div className="ai-avatar" aria-hidden="true">
              <BookOpen size={16} />
            </div>
            <div className="ai-message-bubble">
              {streamingContent ? (
                renderMarkdown(streamingContent)
              ) : (
                <p style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--muted)' }}>
                  <span className="ai-typing" aria-hidden="true"><i /><i /><i /></span>
                  Đang đọc đề bài và suy ngẫm giải đáp...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#ef4444',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{errorMsg}</span>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              aria-label="Đóng thông báo lỗi"
              style={{
                background: 'transparent',
                border: 0,
                color: 'inherit',
                cursor: 'pointer',
                padding: '4px',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />

        {!pinnedToBottom && (
          <div className="ai-jump-wrap">
            <button
              type="button"
              className="ai-jump-btn"
              onClick={() => {
                setPinnedToBottom(true);
                scrollToBottom(true);
              }}
            >
              ↓ Tin nhắn mới nhất
            </button>
          </div>
        )}
      </div>

      {/* Input Zone */}
      <div className={`ai-input-zone ${isDragOver ? 'border-accent' : ''}`}>
        {/* Attachment preview bar */}
        {attachedImage && (
          <div className="ai-image-attachment-bar">
            <div className="ai-attachment-info">
              <img src={attachedImage} alt="Xem trước ảnh đề bài" className="ai-attachment-thumb" />
              <span>Đã đính kèm ảnh: <strong>{attachedFileName || 'Ảnh đề bài'}</strong></span>
            </div>
            <button
              type="button"
              className="ai-remove-attachment"
              onClick={handleClearImage}
              title="Gỡ ảnh"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Form controls */}
        <div className="ai-input-form">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <button
            type="button"
            className="ai-attach-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Đính kèm ảnh đề bài / bài tập (hoặc kéo thả vào đây)"
          >
            <ImageIcon size={20} />
          </button>

          <textarea
            ref={textareaRef}
            className="ai-textarea"
            aria-label="Nhập câu hỏi gửi Trợ lý Văn học"
            placeholder={
              attachedImage
                ? 'Nhập thêm yêu cầu hoặc câu hỏi cụ thể về bức ảnh (Nhấn Enter để gửi)...'
                : 'Nhập câu hỏi văn học, yêu cầu lập dàn ý, phân tích tác phẩm... (Nhấn Enter để gửi)'
            }
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
          />

          <button
            type="button"
            className="ai-send-btn"
            onClick={() => handleSendMessage()}
            disabled={isLoading || (!input.trim() && !attachedImage)}
            title="Gửi câu hỏi"
          >
            <Send size={16} />
            <span>Gửi</span>
          </button>
        </div>

        <p className="ai-footnote">
          <HelpCircle size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
          Trợ lý AI Văn Khố hướng dẫn phương pháp, phân tích dẫn chứng và gợi mở luận điểm; không làm thay bài tập chép nguyên mẫu.
        </p>
      </div>
    </div>
  );
}
