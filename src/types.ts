export type OrderMode = 'album' | 'alphabetical';

export interface Team {
  id: string;
  code: string;
  name: string;
  albumOrder: number;
}

export interface TeamSnapshot {
  team: Team;
  numbers: number[];
}

export interface OverallStats {
  totalSlots: number;
  uniqueOwned: number;
  duplicates: number;
  missing: number;
  totalCards: number;
}

export interface TeamStats {
  uniqueOwned: number;
  duplicates: number;
  missing: number;
}
