/**
 * Self-contained type declarations for react-pageflip (v2.0.3).
 *
 * This file completely replaces the library's own .d.ts so that:
 *  - All FlipSettings props are optional (no forced required fields)
 *  - The ref is typed as FlipBookRef (not `any`)
 *
 * Vite resolves the `~react-pageflip` alias to this file instead of the
 * package's bundled declaration.
 */

import type { CSSProperties, ReactNode, RefAttributes } from 'react';

// ---------------------------------------------------------------------------
// Event types — extracted from page-flip v2.0.7 internal bundle
// ---------------------------------------------------------------------------

export type PageOrientation = 'portrait' | 'landscape';

export interface PageFlipEvent {
  page: number;
  mode: PageOrientation;
}

// ---------------------------------------------------------------------------
// FlipController — returned by ref.pageFlip()
// ---------------------------------------------------------------------------

export interface FlipPageFlipController {
  flipPrev(): void;
  flipNext(): void;
  flipTo(page: number): void;
  load(): void;
  update(): void;
  updateFromHtml(): void;
  clear(): void;
  getCurrentPage(): PageFlipEvent;
  getFlipController(): unknown;
  on(
    event: 'flip' | 'changeOrientation' | 'changeState' | 'init' | 'update',
    handler: (e: PageFlipEvent) => void
  ): void;
  off(event: string, handler: (...args: unknown[]) => void): void;
}

// ---------------------------------------------------------------------------
// Ref shape — pass useRef<FlipBookRef>(null) to HTMLFlipBook
// ---------------------------------------------------------------------------

export interface FlipBookRef {
  pageFlip(): FlipPageFlipController | null;
}

// ---------------------------------------------------------------------------
// Props — all optional so callers only pass what they need
// ---------------------------------------------------------------------------

export interface HTMLFlipBookProps {
  // Flip settings
  startPage?: number;
  size?: 'fixed' | 'stretch';
  width?: number;
  height?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  drawShadow?: boolean;
  flippingTime?: number;
  usePortrait?: boolean;
  startZIndex?: number;
  autoSize?: boolean;
  maxShadowOpacity?: number;
  showCover?: boolean;
  mobileScrollSupport?: boolean;
  clickEventForward?: boolean;
  useMouseEvents?: boolean;
  swipeDistance?: number;
  showPageCorners?: boolean;
  disableFlipByClick?: boolean;

  // Events
  onFlip?: (e: PageFlipEvent) => void;
  onChangeOrientation?: (e: PageFlipEvent) => void;
  onChangeState?: (e: PageFlipEvent) => void;
  onInit?: (e: PageFlipEvent) => void;
  onUpdate?: (e: PageFlipEvent) => void;

  // React standard
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  renderOnlyPageLengthChange?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

declare const HTMLFlipBook: React.ComponentType<
  HTMLFlipBookProps & RefAttributes<FlipBookRef>
>;

export default HTMLFlipBook;
export type { PageFlipEvent, PageOrientation };
