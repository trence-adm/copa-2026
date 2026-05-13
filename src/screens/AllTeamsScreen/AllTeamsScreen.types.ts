import { Team } from '../../types';

export type TeamOrderMode = 'album' | 'alphabetical';

export type TeamSortFn = (teams: Team[], mode: TeamOrderMode) => Team[];
