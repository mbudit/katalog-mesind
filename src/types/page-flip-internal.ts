/**
 * Internal page-flip types — extracted from the page-flip v2.0.7 bundle.
 * These should NOT be imported directly; use react-pageflip.d.ts instead.
 */

export type PageState = 'user_fold' | 'fold_corner' | 'flipping' | 'read';
export type PageOrientation = 'portrait' | 'landscape';

export interface PageFlipEvent {
  page: number;
  mode: PageOrientation;
}