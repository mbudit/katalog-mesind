
import { useState, useEffect, useRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './App.css';

// Fix for React PageFlip TS errors
const FlipBook = HTMLFlipBook as any;

// Dynamically import all images in the catalogue-pages folder
// @ts-ignore
const imagesGlob = import.meta.glob('./assets/catalogue-pages/catalogue-*.webp', { eager: true, query: '?url', import: 'default' });

const sortedImages = Object.entries(imagesGlob)
  .sort(([pathA], [pathB]) => {
    const numA = parseInt(pathA.match(/catalogue-(\d+)\.webp/)?.[1] || '0', 10);
    const numB = parseInt(pathB.match(/catalogue-(\d+)\.webp/)?.[1] || '0', 10);
    return numA - numB;
  })
  .map(([_, url]) => url as string);

const MOBILE_BREAKPOINT = 768;

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

function App() {
  const isMobile = useIsMobile();
  const bookRef = useRef<any>(null);

  const handlePrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const handleNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  return (
    <div className="app-container">
      <main className="catalog-wrapper">
        <div className="book-container">
          <FlipBook
            ref={bookRef}
            width={595}
            height={842}
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
            {sortedImages.map((src, index) => (
              <div className="page" key={index}>
                <div className="page-content">
                  <img src={src} alt={`Page ${index + 1}`} className="page-image" draggable="false" loading="lazy" decoding="async" />
                  <div className="page-number">{index + 1}</div>
                </div>
              </div>
            ))}
          </FlipBook>

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

