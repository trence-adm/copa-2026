import { OrderMode, OverallStats, Team, TeamStats } from '../../types';

export type ExpandedMap = Record<string, boolean>;
export type InventoryMap = Record<string, number>;

export interface PersistedState {
  orderMode: OrderMode;
  expanded: ExpandedMap;
  inventory: InventoryMap;
}

export interface CollectionContextValue {
  teams: Team[];
  orderMode: OrderMode;
  isReady: boolean;
  toggleOrderMode: () => void;
  setOrderMode: (mode: OrderMode) => void;
  isExpanded: (teamId: string) => boolean;
  toggleExpanded: (teamId: string) => void;
  getQuantity: (teamId: string, number: number) => number;
  increment: (teamId: string, number: number) => void;
  decrement: (teamId: string, number: number) => void;
  getOverallStats: () => OverallStats;
  getTeamStats: (teamId: string) => TeamStats;
}
