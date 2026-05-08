/**
 * Loads all catalogue page images as static URL strings.
 *
 * Uses Vite's import.meta.glob with `?url` so Vite:
 *  - Resolves the asset path at build time
 *  - Adds a content-hash to the filename for optimal browser caching
 *  - Includes the asset in the output directory
 *
 * The returned array is sorted numerically by catalogue page number.
 */

// istanbul ignore next — Vite-specific glob, not reachable in test coverage
const raw = import.meta.glob(
  './assets/catalogue-pages/catalogue-*.webp',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

export const cataloguePages: string[] = Object.entries(raw)
  .sort(([pathA], [pathB]) => {
    const numA = parseInt(pathA.match(/catalogue-(\d+)\.webp/)?.[1] || '0', 10);
    const numB = parseInt(pathB.match(/catalogue-(\d+)\.webp/)?.[1] || '0', 10);
    return numA - numB;
  })
  .map(([, url]) => url);