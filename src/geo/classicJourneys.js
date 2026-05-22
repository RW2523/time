/**
 * Illustrative multi-stop routes (educational, not surveyed archaeology).
 * Inspired by classic Bible atlas corridor diagrams.
 */

/** @type {Array<{ id: string; label: string; path: [number, number][]; color: string; dashArray?: string; weight?: number; opacity?: number }>} */
export const CLASSIC_JOURNEYS = [
  {
    id: 'exodus',
    label: 'Exodus corridor',
    path: [
      [30.72, 31.75],
      [30.45, 32.35],
      [30.05, 33.05],
      [29.35, 33.95],
      [29.05, 34.62],
      [28.72, 33.85],
      [28.539, 33.975],
      [29.05, 34.35],
      [30.68, 34.43],
      [31.15, 35.05],
      [31.837, 35.549]
    ],
    color: '#1f6f54',
    dashArray: '10 14',
    weight: 3,
    opacity: 0.82
  },
  {
    id: 'abraham',
    label: 'Abraham (Ur → Haran → Canaan)',
    path: [
      [30.962, 46.103],
      [32.8, 42.5],
      [36.86, 39.031],
      [35.2, 37.8],
      [32.213, 35.282]
    ],
    color: '#8b5a1a',
    dashArray: '8 10',
    weight: 3,
    opacity: 0.78
  },
  {
    id: 'exile',
    label: 'Judah to Babylon',
    path: [
      [31.778, 35.235],
      [33.513, 36.292],
      [34.8, 39.2],
      [33.1, 42.0],
      [32.543, 44.421]
    ],
    color: '#5c3d7a',
    dashArray: '6 10',
    weight: 3,
    opacity: 0.75
  },
  {
    id: 'return',
    label: 'Return & restoration',
    path: [
      [32.543, 44.421],
      [33.4, 42.2],
      [34.2, 39.5],
      [33.2, 37.2],
      [31.778, 35.235]
    ],
    color: '#1a4340',
    dashArray: '8 12',
    weight: 2.5,
    opacity: 0.72
  },
  {
    id: 'paul',
    label: "Paul's mission (illustrative)",
    path: [
      [36.202, 36.157],
      [36.915, 34.896],
      [37.939, 27.341],
      [37.938, 22.932],
      [41.9028, 12.4964]
    ],
    color: '#1a4d6e',
    dashArray: '4 8',
    weight: 2.5,
    opacity: 0.65
  }
];
