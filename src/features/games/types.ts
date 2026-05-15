export type MatchStatus = 'scheduled' | 'live' | 'finished';

export interface MatchItem {
  id: string;
  competitionId: string;
  competitionName: string;
  stage: string;
  dateIso: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamCrest?: string;
  awayTeamCrest?: string;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus;
  broadcast?: string;
}

export interface GroupStanding {
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface WorldCupGroup {
  id: string;
  name: string;
  standings: GroupStanding[];
}

export interface KnockoutRound {
  id: string;
  name: string;
  matches: MatchItem[];
}

export interface ClubCompetition {
  id: string;
  name: string;
}

export interface SportsDataProvider {
  id: string;
  getWorldCupGroups: () => Promise<WorldCupGroup[]>;
  getWorldCupMatches: (fromIso: string, toIso: string) => Promise<MatchItem[]>;
  getWorldCupKnockout: () => Promise<KnockoutRound[]>;
  getClubCompetitions: () => Promise<ClubCompetition[]>;
  getClubMatches: (
    competitionId: string | 'all',
    fromIso: string,
    toIso: string
  ) => Promise<MatchItem[]>;
}