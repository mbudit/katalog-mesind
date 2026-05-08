import '@testing-library/jest-dom';

// Polyfill ResizeObserver for jsdom — required by useFlipBookDimensions.
(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};