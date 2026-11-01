import { NextRequest } from 'next/server';
import {z} from 'zod';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_MESSAGE_CHARS = 4000;
const MAX_HISTORY_TURNS = 10;
// Base64 chuỗi ~7MB ≈ ảnh ~5MB sau giải mã. Ảnh đã nén ở client còn ~vài trăm KB.
const MAX_IMAGE_BASE64_CHARS = 7_000_000;

const SYSTEM_PROMPT = `Bạn là "Trợ lý Văn học" của Văn Khố — Thư viện học liệu Ngữ văn trực tuyến chất lượng cao dành cho học sinh THPT (Lớp 10, 11, 12 theo Chương trình GDPT 2018).

VAI TRÒ VÀ TÔN CHỈ SƯ PHẠM:
1. Bạn là người thầy / người bạn đồng hành sư phạm thông tuệ, chuẩn mực, giàu cảm xúc thẩm mỹ nhưng gãy gọn, khúc chiết.
2. Mục tiêu là hướng dẫn phương pháp đọc hiểu, gợi mở tư duy, hướng dẫn tìm luận điểm, phân tích chi tiết nghệ thuật, giải nghĩa từ ngữ, điển tích điển cố, bối cảnh lịch sử - tác giả.
3. Tuyệt đối KHÔNG làm văn mẫu sáo rỗng hoặc viết bài chép văn nguyên khối khiến học sinh ỷ lại. Hãy hướng dẫn bằng dàn ý chi tiết, hệ thống luận điểm, dẫn chứng đắt giá và các câu hỏi gợi mở suy ngẫm.
4. Khi học sinh gửi ảnh chụp đề bài, đoạn trích văn bản hoặc bài làm:
   - Trước hết hãy nhận diện và tóm tắt lại nội dung câu hỏi/yêu cầu trong ảnh để học sinh an tâm là bạn đã đọc đúng.
   - Phân tích yêu cầu trọng tâm của đề (thể loại, đối tượng cảm thụ, thao tác lập luận chính).
   - Đưa ra hướng dẫn giải quyết từng câu hỏi hoặc dàn ý phân tích từng bước rõ ràng.
5. Định dạng câu trả lời bằng Markdown rõ ràng: dùng tiêu đề ngắn, gạch đầu dòng, in đậm từ khóa, trích dẫn thơ/văn trong khối trích dẫn (quote).`;

const requestSchema = z.object({
  message: z.string().optional(),
  imageBase64: z.string().nullish(),
  history: z.array(z.object({role: z.enum(['user', 'assistant']), content: z.string()})).default([]),
});

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try { body = await req.json(); }
    catch { return Response.json({error: 'Nội dung yêu cầu phải là JSON hợp lệ.'}, {status: 400}); }
    const parsedBody = requestSchema.safeParse(body);
    if (!parsedBody.success) return Response.json({error: 'Định dạng câu hỏi, ảnh hoặc lịch sử trò chuyện không hợp lệ.'}, {status: 400});
    const {message, imageBase64, history} = parsedBody.data;

    if (!message?.trim() && !imageBase64?.trim()) {
      return new Response(JSON.stringify({ error: 'Vui lòng cung cấp nội dung câu hỏi hoặc ảnh đính kèm.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (typeof message === 'string' && message.length > MAX_MESSAGE_CHARS) {
      return new Response(
        JSON.stringify({ error: `Câu hỏi quá dài (tối đa ${MAX_MESSAGE_CHARS} ký tự). Vui lòng rút gọn lại.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (typeof imageBase64 === 'string' && imageBase64.length > MAX_IMAGE_BASE64_CHARS) {
      return new Response(
        JSON.stringify({ error: 'Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB hoặc chụp lại với độ phân giải thấp hơn.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const baseUrl = (
      process.env.AI_BASE_URL ||
      'https://generativelanguage.googleapis.com/v1beta/openai'
    ).replace(/\/+$/, '');

    const apiKey = (
      process.env.AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      ''
    ).trim();

    if (!apiKey) {
      console.error('AI route: missing AI_API_KEY / GEMINI_API_KEY');
      return new Response(
        JSON.stringify({
          error: 'Trợ lý AI chưa được cấu hình khóa API trên máy chủ. Vui lòng thêm AI_API_KEY vào biến môi trường rồi triển khai lại.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const model = (process.env.AI_MODEL || 'gemini-2.5-flash').trim();

    // Format chat messages
    const formattedMessages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
    }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Append past messages (keep recent turns, truncate long turns)
    const recentHistory = history.slice(-MAX_HISTORY_TURNS);
    for (const h of recentHistory) {
      if (!h || typeof h.content !== 'string') continue;
      const clipped =
        h.content.length > MAX_MESSAGE_CHARS ? h.content.slice(0, MAX_MESSAGE_CHARS) + '…' : h.content;
      if (!clipped.trim()) continue;
      formattedMessages.push({
        role: h.role === 'assistant' ? 'assistant' : 'user',
        content: clipped,
      });
    }

    // Append the current turn
    if (imageBase64) {
      const imageUrl = imageBase64.startsWith('data:')
        ? imageBase64
        : `data:image/jpeg;base64,${imageBase64}`;

      formattedMessages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: message?.trim() || 'Em gửi ảnh này nhờ Trợ lý Văn Khố đọc và hướng dẫn giải đáp giúp em ạ.',
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
        ],
      });
    } else {
      formattedMessages.push({
        role: 'user',
        content: message?.trim() || '',
      });
    }

    // Call AI service with automatic retry on temporary 503/429 spikes.
    // Chỉ gửi max_completion_tokens (chuẩn mới). Gửi kèm max_tokens sẽ bị
    // Gemini trả 400 "max_tokens and max_completion_tokens cannot both be set".
    const requestPayload = {
      model,
      stream: true,
      messages: formattedMessages,
      max_completion_tokens: 3000,
      temperature: 0.7,
    };

    const upstreamSignal = AbortSignal.any([req.signal, AbortSignal.timeout(55_000)]);
    const callUpstream = () =>
      fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        signal: upstreamSignal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestPayload),
      });

    let upstreamRes = await callUpstream();

    if (upstreamRes.status === 503 || upstreamRes.status === 429) {
      // Temporary spike: wait 1.2s and retry once
      await new Promise((resolve) => setTimeout(resolve, 1200));
      upstreamRes = await callUpstream();
    }

    if (!upstreamRes.ok) {
      const errText = await upstreamRes.text().catch(() => '');
      console.error('AI upstream error:', upstreamRes.status);
      let friendly = `Dịch vụ AI tạm thời bận (${upstreamRes.status}). Vui lòng đợi vài giây rồi bấm thử lại.`;
      if (upstreamRes.status === 401 || upstreamRes.status === 403) {
        friendly = 'Khóa API của Trợ lý AI không hợp lệ hoặc đã hết hạn. Vui lòng báo cho quản trị viên kiểm tra AI_API_KEY.';
      } else if (upstreamRes.status === 404) {
        friendly = `Không tìm thấy mô hình AI "${model}". Vui lòng kiểm tra lại AI_MODEL.`;
      } else if (upstreamRes.status === 429 || upstreamRes.status === 503) {
        const quotaHit = /quota|RESOURCE_EXHAUSTED|rate-limit|rate_limit/i.test(errText);
        friendly = quotaHit
          ? 'Trợ lý AI đã dùng hết lượt miễn phí trong hôm nay. Vui lòng quay lại sau, hoặc báo quản trị viên nâng hạn mức API.'
          : 'Máy chủ AI đang quá tải. Vui lòng đợi khoảng 30 giây rồi thử lại.';
      } else if (upstreamRes.status === 400) {
        friendly = 'Yêu cầu gửi tới AI chưa hợp lệ. Hãy thử rút gọn câu hỏi hoặc dùng ảnh khác.';
      }
      return new Response(JSON.stringify({ error: friendly }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Stream UTF-8 text chunks to client. Chấp nhận cả delta.content dạng chuỗi
    // lẫn dạng mảng parts, và cả message.content cho phản hồi không stream.
    const extractText = (parsed: unknown): string => {
      if (!parsed || typeof parsed !== 'object') return '';
      const choice = (parsed as { choices?: Array<Record<string, unknown>> }).choices?.[0];
      if (!choice) return '';
      const delta = choice.delta as { content?: unknown } | undefined;
      const message = choice.message as { content?: unknown } | undefined;
      const raw = delta?.content ?? message?.content ?? '';
      if (typeof raw === 'string') return raw;
      if (Array.isArray(raw)) {
        return raw
          .map((p) => {
            if (typeof p === 'string') return p;
            if (p && typeof p === 'object' && 'text' in p) return String((p as { text: unknown }).text ?? '');
            return '';
          })
          .join('');
      }
      return '';
    };

    if (upstreamRes.headers.get('Content-Type')?.includes('application/json')) {
      const text = extractText(await upstreamRes.json());
      return new Response(text, {headers: {'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache, no-transform'}});
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstreamRes.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              // Một số gateway trả JSON thuần (không SSE) khi stream:true vẫn ok.
              if (!trimmed.startsWith('data:')) {
                if (trimmed.startsWith('{')) {
                  try {
                    const text = extractText(JSON.parse(trimmed));
                    if (text) {
                      controller.enqueue(encoder.encode(text));
                    }
                  } catch {
                    // Ignore incomplete JSON chunks
                  }
                }
                continue;
              }
              const jsonStr = trimmed.slice(5).trim();
              if (jsonStr === '[DONE]') continue;

              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed?.error) {
                  console.error('AI SSE error payload received');
                  continue;
                }
                const content = extractText(parsed);
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // Ignore incomplete JSON chunks
              }
            }
          }
          // Trường hợp gateway trả một JSON duy nhất (không SSE).
          buffer += decoder.decode();
          const tail = buffer.trim();
          if (tail && !/^data:\s*\[DONE\]$/.test(tail)) {
            try {
              const text = extractText(JSON.parse(tail.replace(/^data:\s*/, '')));
              if (text) controller.enqueue(encoder.encode(text));
            } catch {
              // bỏ qua
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error) {
    console.error('API route exception:', error instanceof Error ? error.name : 'UnknownError');
    return new Response(
      JSON.stringify({
        error: 'Không thể kết nối đến dịch vụ AI lúc này. Vui lòng kiểm tra mạng và thử lại sau ít phút.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
