import { useState, useEffect, useRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ErrorBoundary } from './components/ErrorBoundary';
import { cataloguePages } from './images';
import type { FlipBookRef } from './types/react-pageflip';
import './App.css';

// Vite `?url` import fingerprints the asset with a content-hash at build time,
// giving optimal browser-cache behaviour in both dev and production.
const backgroundUrl = new URL('./assets/background.jpg', import.meta.url).href;
document.documentElement.style.setProperty('--bg-app', `url('${backgroundUrl}')`);

const MOBILE_BREAKPOINT = 768;

// A4 portrait ratio — used as the aspect-ratio constraint
const A4_RATIO = 595 / 842;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile;
}

/**
 * Measures the flip-book container and computes pixel dimensions that
 * honour the A4 aspect ratio while respecting min/max width/height bounds.
 *
 * The container is sized purely by CSS (max-width / padding / flex).
 * This hook reads the computed pixel width and derives height from it.
 */
function useFlipBookDimensions(isMobile: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 595, height: 842 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const containerWidth = el.clientWidth;
      if (containerWidth === 0) return;

      // Clamp to the min/max bounds that CSS also enforces
      const minW = isMobile ? 280 : 315;
      const maxW = isMobile ? 600 : 1000;
      const minH = isMobile ? 300 : 400;
      const maxH = isMobile ? 900 : 1533;

      const clampedWidth = Math.max(minW, Math.min(maxW, containerWidth));
      const derivedHeight = Math.round(clampedWidth / A4_RATIO);

      // Height also needs to satisfy its own min/max
      const clampedHeight = Math.max(minH, Math.min(maxH, derivedHeight));

      // Re-derive width from clamped height to keep the ratio tight
      const finalWidth = Math.round(clampedHeight * A4_RATIO);
      const finalWidthClamped = Math.max(minW, Math.min(maxW, finalWidth));

      setDimensions({ width: finalWidthClamped, height: clampedHeight });
    };

    update(); // run immediately in case the container already has a size

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  return { containerRef, dimensions };
}

function App() {
  const isMobile = useIsMobile();
  const { containerRef, dimensions } = useFlipBookDimensions(isMobile);
  const bookRef = useRef<FlipBookRef>(null);

  const handlePrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const handleNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  return (
    <div className="app-container">
      <main className="catalog-wrapper">
        <div className="book-container" ref={containerRef}>
          <ErrorBoundary>
            <HTMLFlipBook
              ref={bookRef}
              width={dimensions.width}
              height={dimensions.height}
              size="stretch"
              minWidth={isMobile ? 280 : 315}
              maxWidth={isMobile ? 600 : 1000}
              minHeight={isMobile ? 300 : 400}
              maxHeight={isMobile ? 900 : 1533}
              maxShadowOpacity={isMobile ? 0 : 0.5}
              showCover={true}
              mobileScrollSupport={false}
              className="flip-book"
              showPageCorners={!isMobile}
              flippingTime={isMobile ? 600 : 800}
              usePortrait={isMobile}
              drawShadow={!isMobile}
              startZIndex={20}
              startPage={0}
              useMouseEvents={true}
              swipeDistance={isMobile ? 20 : 30}
            >
              {cataloguePages.map((src, index) => (
                <div className="page" key={index}>
                  <div className="page-content">
                    <img
                      src={src}
                      alt={`Page ${index + 1}`}
                      className="page-image"
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="page-number">{index + 1}</div>
                  </div>
                </div>
              ))}
            </HTMLFlipBook>
          </ErrorBoundary>

          {isMobile && (
            <div className="mobile-nav">
              <button
                id="nav-prev"
                className="mobile-nav-btn mobile-nav-prev"
                onClick={handlePrev}
                aria-label="Previous page"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                id="nav-next"
                className="mobile-nav-btn mobile-nav-next"
                onClick={handleNext}
                aria-label="Next page"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p className="footer-title">Catatan:</p>
        <p>Geser halaman dari kanan ke kiri untuk beralih ke halaman berikutnya.</p>
        <p>Geser halaman dari kiri ke kanan untuk beralih ke halaman sebelumnya.</p>
      </footer>
    </div>
  );
}

export default App;