export const capitalize = (s: string): string =>
  s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const padId = (id: number): string => `#${String(id).padStart(3, '0')}`;

export const formatHeight = (dm: number): string => `${(dm / 10).toFixed(1)} m`;
export const formatWeight = (hg: number): string => `${(hg / 10).toFixed(1)} kg`;
