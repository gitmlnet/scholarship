/**
 * Static, public site constants (non-secret, bundled at build time).
 * Program *content* (dates, fees, notices…) comes from the API layer via
 * `src/services` — this file only holds values the shell itself needs.
 */
export const SITE = {
  name: 'ScholarSphere',
  titleSuffix: 'ScholarSphere',
  repositoryUrl: 'https://github.com/gitmlnet/scholarship',
  pagesUrl: 'https://gitmlnet.github.io/scholarship/',
} as const;
