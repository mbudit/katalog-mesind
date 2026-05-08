/**
 * Vitest smoke tests for App.
 *
 * The page-flip library uses canvas/DOM internals not available in jsdom,
 * so it is mocked as a simple pass-through div.
 * The catalogue pages are imported from the isolated images.ts module.
 *
 * Run with: npm test          (watch mode)
 *          npm run test:run  (CI / single-run)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { cataloguePages } from './images';

// Mock react-pageflip — canvas/DOM internals aren't available in jsdom
vi.mock('react-pageflip', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="flip-book">{children}</div>
  ),
}));

describe('App', () => {
  it('renders without crashing', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<App />);
    expect(document.body.querySelector('.app-container')).toBeInTheDocument();
    expect(screen.getAllByText(/Geser halaman/i).length).toBeGreaterThan(0);
    spy.mockRestore();
  });

  it(`renders all ${cataloguePages.length} catalogue pages`, () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<App />);
    expect(document.body.querySelectorAll('.page').length).toBe(cataloguePages.length);
    spy.mockRestore();
  });

  it('renders page numbers 1 and the last page number', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<App />);
    const nums = screen.getAllByText(/\d+/).map((el) => el.textContent ?? '');
    expect(nums).toContain('1');
    expect(nums).toContain(String(cataloguePages.length));
    spy.mockRestore();
  });
});