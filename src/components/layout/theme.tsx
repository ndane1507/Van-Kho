'use client';
import { ThemeProvider, useTheme } from 'next-themes';
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { Moon, Sun } from 'lucide-react';

const subscribe = () => () => {};

/** Distance (px) the knob travels. Must match the CSS translate. */
const TRAVEL_PX = 34;
const DRAG_THRESHOLD_PX = 6;

export function Themes({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="van-kho-theme">
      {children}
    </ThemeProvider>
  );
}

/** Compact two-position slider: light on the left, dark on the right.
 *  Click toggles; press-and-drag also works (pointer events, touch
 *  included). First visit follows the device (system default); sliding
 *  or clicking stores an explicit choice. Knob position always reflects
 *  the resolved theme. */
export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = mounted && resolvedTheme === 'dark';
  const [live, setLive] = useState(false);
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const drag = useRef<{ startX: number; moved: boolean; offset: number } | null>(null);
  const skipClick = useRef(false);

  // Enable motion only after the first painted frame, so the knob never
  // animates from its server position on page load.
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setLive(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    drag.current = { startX: event.clientX, moved: false, offset: isDark ? TRAVEL_PX : 0 };
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      // Pointer already released; drag still works via window-level moves.
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const state = drag.current;
    if (!state) return;
    const base = isDark ? TRAVEL_PX : 0;
    const next = Math.max(0, Math.min(TRAVEL_PX, base + (event.clientX - state.startX)));
    if (Math.abs(event.clientX - state.startX) > DRAG_THRESHOLD_PX) state.moved = true;
    state.offset = next;
    setDragOffset(next);
  };

  const handlePointerUp = () => {
    const state = drag.current;
    drag.current = null;
    setDragOffset(null);
    if (state?.moved) {
      skipClick.current = true;
      setTheme(state.offset > TRAVEL_PX / 2 ? 'dark' : 'light');
    }
  };

  const handleClick = () => {
    if (skipClick.current) {
      skipClick.current = false;
      return;
    }
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      className={`theme-slider${live ? ' is-live' : ''}`}
      aria-label={isDark ? 'Đang giao diện tối. Bấm hoặc kéo để chuyển sang giao diện sáng' : 'Đang giao diện sáng. Bấm hoặc kéo để chuyển sang giao diện tối'}
      title={isDark ? 'Giao diện tối — bấm hoặc kéo để chuyển sáng' : 'Giao diện sáng — bấm hoặc kéo để chuyển tối'}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        drag.current = null;
        setDragOffset(null);
      }}
      onDragStart={(event) => event.preventDefault()}
      onClick={handleClick}
      style={dragOffset !== null ? ({ '--knob-x': `${dragOffset}px` } as CSSProperties) : undefined}
    >
      <span className="theme-slider-knob" aria-hidden="true">
        <Sun size={15} className="knob-sun" aria-hidden="true" />
        <Moon size={15} className="knob-moon" aria-hidden="true" />
      </span>
    </button>
  );
}
