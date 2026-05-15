import { MatchItem, SportsDataProvider, WorldCupGroup, KnockoutRound, ClubCompetition } from '../types';

// Get your free token at: https://www.football-data.org/client/register
const API_TOKEN = 'bec332496092468cbbc62f3ffe3ced76';
const BASE_URL = 'https://api.football-data.org/v4';

interface ApiTeam {
  id: number;
  name: string;
  tla?: string;
  crest?: string;
}

interface ApiMatch {
  id: number;
  utcDate: string;
  status: 'SCHEDULED' | 'FINISHED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'POSTPONED' | 'CANCELLED' | 'SUSPENDED';
  stage: string;
  group?: string;
  matchday?: number;
  homeTeam: ApiTeam;
  awayTeam: ApiTeam;
  score: {
    winner?: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW';
    fullTime: { home: number | null; away: number | null };
    halfTime?: { home: number | null; away: number | null };
  };
  venue?: string;
}

interface ApiStanding {
  stage: string;
  type: string;
  group?: string;
  table: Array<{
    position: number;
    team: ApiTeam;
    playedGames: number;
    won: number;
    draw: number;
    lost: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
  }>;
}

interface ApiStandingsResponse {
  standings: ApiStanding[];
}

const COUNTRY_EMOJI_MAP: Record<string, string> = {
  Brazil: '🇧🇷',
  Mexico: '🇲🇽',
  Senegal: '🇸🇳',
  'Netherlands': '🇳🇱',
  Canada: '🇨🇦',
  Croatia: '🇭🇷',
  Japan: '🇯🇵',
  Cameroon: '🇨🇲',
  'South Africa': '🇿🇦',
  'Bosnia-Herzegovina': '🇧🇦',
  Qatar: '🇶🇦',
  Scotland: '🏴',
  Turkey: '🇹🇷',
  'United States': '🇺🇸',
  Haiti: '🇭🇹',
  Paraguay: '🇵🇾',
  Ecuador: '🇪🇨',
  Venezuela: '🇻🇪',
  'Costa Rica': '🇨🇷',
  Algeria: '🇩🇿',
  Egypt: '🇪🇬',
  Iraq: '🇮🇶',
  UAE: '🇦🇪',
  Uruguay: '🇺🇾',
  'South Korea': '🇰🇷',
  Ghana: '🇬🇭',
  Tunisia: '🇹🇳',
  Germany: '🇩🇪',
  Italy: '🇮🇹',
  Spain: '🇪🇸',
  France: '🇫🇷',
  Portugal: '🇵🇹',
  England: '🇬🇧',
  Argentina: '🇦🇷',
  Chile: '🇨🇱',
  Colombia: '🇨🇴',
  Peru: '🇵🇪',
  'Saudi Arabia': '🇸🇦',
  Australia: '🇦🇺',
  USA: '🇺🇸',
  Wales: '🇬🇧',
  Iran: '🇮🇷',
  Poland: '🇵🇱',
  Ukraine: '🇺🇦',
  Belgium: '🇧🇪',
  Denmark: '🇩🇰',
  Sweden: '🇸🇪',
  Switzerland: '🇨🇭',
  Austria: '🇦🇹',
  'Czech Republic': '🇨🇿',
  Czechia: '🇨🇿',
  Romania: '🇷🇴',
  Greece: '🇬🇷',
  Serbia: '🇷🇸',
  Slovenia: '🇸🇮',
  Slovakia: '🇸🇰',
  'Bosnia and Herzegovina': '🇧🇦',
  Hungary: '🇭🇺',
  Iceland: '🇮🇸',
  Norway: '🇳🇴',
  Finland: '🇫🇮',
  Russia: '🇷🇺',
  Kazakhstan: '🇰🇿',
  Uzbekistan: '🇺🇿',
  'Northern Ireland': '🇬🇧',
  Israel: '🇮🇱',
  Lebanon: '🇱🇧',
  India: '🇮🇳',
  Thailand: '🇹🇭',
  Vietnam: '🇻🇳',
  Indonesia: '🇮🇩',
  Malaysia: '🇲🇾',
  Singapore: '🇸🇬',
  China: '🇨🇳',
  'Hong Kong': '🇭🇰',
  Taiwan: '🇹🇼',
  'New Zealand': '🇳🇿',
};

const COUNTRY_EMOJI_BY_TLA: Record<string, string> = {
  ARG: '🇦🇷',
  AUS: '🇦🇺',
  AUT: '🇦🇹',
  BEL: '🇧🇪',
  BIH: '🇧🇦',
  BRA: '🇧🇷',
  CAN: '🇨🇦',
  CHI: '🇨🇱',
  CMR: '🇨🇲',
  COL: '🇨🇴',
  CRC: '🇨🇷',
  CRO: '🇭🇷',
  CZE: '🇨🇿',
  DEN: '🇩🇰',
  ECU: '🇪🇨',
  EGY: '🇪🇬',
  ENG: '🇬🇧',
  ESP: '🇪🇸',
  FRA: '🇫🇷',
  GER: '🇩🇪',
  GHA: '🇬🇭',
  HAI: '🇭🇹',
  IRN: '🇮🇷',
  IRQ: '🇮🇶',
  ITA: '🇮🇹',
  JPN: '🇯🇵',
  KOR: '🇰🇷',
  MAR: '🇲🇦',
  MEX: '🇲🇽',
  NED: '🇳🇱',
  NGA: '🇳🇬',
  NZL: '🇳🇿',
  PAR: '🇵🇾',
  PER: '🇵🇪',
  POL: '🇵🇱',
  POR: '🇵🇹',
  QAT: '🇶🇦',
  RSA: '🇿🇦',
  SCO: '🏴',
  SEN: '🇸🇳',
  SRB: '🇷🇸',
  SUI: '🇨🇭',
  SWE: '🇸🇪',
  TUN: '🇹🇳',
  TUR: '🇹🇷',
  UAE: '🇦🇪',
  UKR: '🇺🇦',
  URU: '🇺🇾',
  USA: '🇺🇸',
  VEN: '🇻🇪',
};

const getTeamName = (apiTeam: ApiTeam): string => {
  const emoji = (apiTeam.tla ? COUNTRY_EMOJI_BY_TLA[apiTeam.tla] : undefined) || COUNTRY_EMOJI_MAP[apiTeam.name] || '';
  return emoji ? `${emoji} ${apiTeam.name}` : apiTeam.name;
};

const mapMatchStatus = (apiStatus: string): 'scheduled' | 'live' | 'finished' => {
  if (apiStatus === 'FINISHED') return 'finished';
  if (apiStatus === 'LIVE' || apiStatus === 'IN_PLAY') return 'live';
  return 'scheduled';
};

const mapWorldCupStage = (apiStage: string) => {
  if (apiStage === 'GROUP_STAGE') return 'Fase de Grupos';
  if (apiStage === 'ROUND_OF_16') return 'Oitavas de Final';
  if (apiStage === 'QUARTER_FINALS') return 'Quartas de Final';
  if (apiStage === 'SEMI_FINALS') return 'Semifinais';
  if (apiStage === 'FINAL') return 'Final';
  return apiStage;
};

const toApiDate = (iso: string) => iso.slice(0, 10);

const normalizeGroupId = (group: string) =>
  group.replace('Group ', '').replace('GROUP_', '').trim();

export const apiFootballDataProvider: SportsDataProvider = {
  id: 'api-football-data',
  async getWorldCupGroups(): Promise<WorldCupGroup[]> {
    try {
      const response = await fetch(`${BASE_URL}/competitions/2000/standings`, {
        headers: { 'X-Auth-Token': API_TOKEN },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = (await response.json()) as ApiStandingsResponse;
      const groupStandings = data.standings.filter(
        (standing) => standing.type === 'TOTAL' && Boolean(standing.group)
      );

      if (groupStandings.length > 0) {
        return groupStandings
          .filter((standing) => Boolean(standing.group))
          .map((standing) => {
            const groupId = normalizeGroupId(standing.group ?? 'A');
            return {
              id: groupId,
              name: `Grupo ${groupId}`,
              standings: [...standing.table]
                .sort((a, b) => a.position - b.position)
                .map((row) => ({
                  team: getTeamName(row.team),
                  played: row.playedGames,
                  wins: row.won,
                  draws: row.draw,
                  losses: row.lost,
                  points: row.points,
                  goalsFor: row.goalsFor,
                  goalsAgainst: row.goalsAgainst,
                })),
            };
          });
      }

      // Pre-tournament fallback: build groups from scheduled matches when standings are not published yet.
      const matchesResponse = await fetch(`${BASE_URL}/competitions/2000/matches`, {
        headers: { 'X-Auth-Token': API_TOKEN },
      });
      if (!matchesResponse.ok) {
        throw new Error(`API error: ${matchesResponse.status}`);
      }

      const matchesData = (await matchesResponse.json()) as { matches: ApiMatch[] };
      const grouped = new Map<string, Set<string>>();

      matchesData.matches
        .filter((match) => match.stage === 'GROUP_STAGE' && Boolean(match.group))
        .forEach((match) => {
          const groupId = normalizeGroupId(match.group ?? 'A');
          if (!grouped.has(groupId)) {
            grouped.set(groupId, new Set<string>());
          }
          grouped.get(groupId)?.add(getTeamName(match.homeTeam));
          grouped.get(groupId)?.add(getTeamName(match.awayTeam));
        });

      const derivedGroups = [...grouped.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([groupId, teams]) => ({
          id: groupId,
          name: `Grupo ${groupId}`,
          standings: [...teams].sort((a, b) => a.localeCompare(b)).map((team) => ({
            team,
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            points: 0,
            goalsFor: 0,
            goalsAgainst: 0,
          })),
        }));

      if (derivedGroups.length === 0) {
        throw new Error('No world cup groups available yet');
      }

      return derivedGroups;
    } catch (error) {
      console.error('Failed to fetch World Cup groups:', error);
      throw error;
    }
  },

  async getWorldCupMatches(fromIso: string, toIso: string): Promise<MatchItem[]> {
    try {
      const response = await fetch(`${BASE_URL}/competitions/2000/matches`, {
        headers: { 'X-Auth-Token': API_TOKEN },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = (await response.json()) as { matches: ApiMatch[] };

      return data.matches
        .filter((m) => m.utcDate >= fromIso && m.utcDate <= toIso)
        .map((match) => ({
          id: match.id.toString(),
          homeTeam: getTeamName(match.homeTeam),
          awayTeam: getTeamName(match.awayTeam),
          homeScore: match.score.fullTime.home ?? undefined,
          awayScore: match.score.fullTime.away ?? undefined,
          dateIso: match.utcDate,
          status: mapMatchStatus(match.status),
          stage: mapWorldCupStage(match.stage || 'GROUP_STAGE'),
          competitionName: 'Copa do Mundo 2026',
          competitionId: 'world-cup-2026',
          broadcast: undefined,
        }));
    } catch (error) {
      console.error('Failed to fetch World Cup matches:', error);
      throw error;
    }
  },

  async getWorldCupKnockout(): Promise<KnockoutRound[]> {
    try {
      const response = await fetch(`${BASE_URL}/competitions/2000/matches`, {
        headers: { 'X-Auth-Token': API_TOKEN },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = (await response.json()) as { matches: ApiMatch[] };

      // Filter knockout stage matches
      const knockoutMatches = data.matches.filter((m) => m.stage !== 'GROUP_STAGE');

      // Group by stage
      const stages = [
        { apiStage: 'ROUND_OF_16', name: 'Oitavas de Final' },
        { apiStage: 'QUARTER_FINALS', name: 'Quartas de Final' },
        { apiStage: 'SEMI_FINALS', name: 'Semifinais' },
        { apiStage: 'FINAL', name: 'Final' },
      ];

      const rounds: KnockoutRound[] = [];

      stages.forEach((stageInfo) => {
        const stageMatches = knockoutMatches
          .filter((m) => m.stage === stageInfo.apiStage)
          .map((match) => ({
            id: match.id.toString(),
            homeTeam: getTeamName(match.homeTeam),
            awayTeam: getTeamName(match.awayTeam),
            homeScore: match.score.fullTime.home ?? undefined,
            awayScore: match.score.fullTime.away ?? undefined,
            dateIso: match.utcDate,
            status: mapMatchStatus(match.status),
            stage: stageInfo.name,
            competitionName: 'Copa do Mundo 2026',
            competitionId: 'world-cup-2026',
            broadcast: undefined,
          }));

        if (stageMatches.length > 0) {
          rounds.push({
            id: stageInfo.apiStage,
            name: stageInfo.name,
            matches: stageMatches,
          });
        }
      });

      return rounds;
    } catch (error) {
      console.error('Failed to fetch World Cup knockout:', error);
      throw error;
    }
  },

  async getClubCompetitions(): Promise<ClubCompetition[]> {
    return [{ id: 'brasileirao-a', name: 'Brasileirão Série A' }];
  },

  async getClubMatches(competitionId: string, fromIso: string, toIso: string): Promise<MatchItem[]> {
    try {
      // Map our IDs to football-data.org IDs
      const competitionMap: Record<string, string> = {
        'brasileirao-a': '2013', // Série A (free tier)
      };

      const selectedCompetitionId = competitionId === 'all' ? 'brasileirao-a' : competitionId;
      const apiCompId = competitionMap[selectedCompetitionId];
      if (!apiCompId) {
        return []; // Competition not available in free tier
      }

      const fromDate = toApiDate(fromIso);
      const toDate = toApiDate(toIso);
      const response = await fetch(
        `${BASE_URL}/competitions/${apiCompId}/matches?dateFrom=${fromDate}&dateTo=${toDate}`,
        {
          headers: { 'X-Auth-Token': API_TOKEN },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = (await response.json()) as { matches: ApiMatch[] };

      return data.matches.map((match) => ({
        id: match.id.toString(),
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        homeTeamCrest: match.homeTeam.crest,
        awayTeamCrest: match.awayTeam.crest,
        homeScore: match.score.fullTime.home ?? undefined,
        awayScore: match.score.fullTime.away ?? undefined,
        dateIso: match.utcDate,
        status: mapMatchStatus(match.status),
        stage: match.stage || 'Regular',
        competitionName: 'Brasileirão Série A',
        competitionId: 'brasileirao-a',
        broadcast: undefined,
      }));
    } catch (error) {
      console.error('Failed to fetch club matches:', error);
      throw error;
    }
  },
};
