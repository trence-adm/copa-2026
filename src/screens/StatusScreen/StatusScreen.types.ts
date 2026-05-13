import { Team } from '../../types';

export interface TeamProgressEntry {
  team: Team;
  stats: {
    uniqueOwned: number;
    duplicates: number;
    missing: number;
  };
}
