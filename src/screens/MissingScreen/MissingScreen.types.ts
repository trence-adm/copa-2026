import { TeamSnapshot } from '../../types';

export type TeamOrderMode = 'album' | 'alphabetical';

export type SnapshotSortFn = (
  snapshots: TeamSnapshot[],
  mode: TeamOrderMode,
) => TeamSnapshot[];
