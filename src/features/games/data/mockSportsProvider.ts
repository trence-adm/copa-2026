import {
  ClubCompetition,
  KnockoutRound,
  MatchItem,
  SportsDataProvider,
  WorldCupGroup,
} from '../types';

const WORLD_CUP_GROUPS: WorldCupGroup[] = [
  {
    id: 'A',
    name: 'Grupo A',
    standings: [
      { team: '🇲🇽 Mexico', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      { team: '🇸🇳 Senegal', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      { team: '🇳🇱 Paises Baixos', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      { team: '🇨🇦 Canada', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    ],
  },
  {
    id: 'B',
    name: 'Grupo B',
    standings: [
      { team: '🇧🇷 Brasil', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      { team: '🇭🇷 Croacia', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      { team: '🇯🇵 Japao', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      { team: '🇨🇲 Camaroes', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    ],
  },
];

const CLUB_COMPETITIONS: ClubCompetition[] = [
  { id: 'brasileirao-a', name: 'Brasileirao A' },
  { id: 'copa-do-brasil', name: 'Copa do Brasil' },
  { id: 'paulistao', name: 'Paulistao' },
  { id: 'libertadores', name: 'Libertadores' },
  { id: 'sul-americana', name: 'Sul-Americana' },
];

const WORLD_CUP_MATCHES: MatchItem[] = [
  {
    id: 'wc-1',
    competitionId: 'world-cup',
    competitionName: 'Copa 2026',
    stage: 'Fase de Grupos',
    dateIso: '2026-06-15T18:00:00.000Z',
    homeTeam: '🇲🇽 Mexico',
    awayTeam: '🇨🇦 Canada',
    status: 'scheduled',
    broadcast: 'TV Globo',
  },
  {
    id: 'wc-2',
    competitionId: 'world-cup',
    competitionName: 'Copa 2026',
    stage: 'Fase de Grupos',
    dateIso: '2026-06-15T21:00:00.000Z',
    homeTeam: '🇧🇷 Brasil',
    awayTeam: '🇨🇲 Camaroes',
    status: 'scheduled',
    broadcast: 'SporTV',
  },
  {
    id: 'wc-3',
    competitionId: 'world-cup',
    competitionName: 'Copa 2026',
    stage: 'Fase de Grupos',
    dateIso: '2026-06-16T18:00:00.000Z',
    homeTeam: '🇸🇳 Senegal',
    awayTeam: '🇳🇱 Paises Baixos',
    status: 'scheduled',
    broadcast: 'TV Globo',
  },
  {
    id: 'wc-4',
    competitionId: 'world-cup',
    competitionName: 'Copa 2026',
    stage: 'Fase de Grupos',
    dateIso: '2026-06-17T18:00:00.000Z',
    homeTeam: '🇲🇽 Mexico',
    awayTeam: '🇳🇱 Paises Baixos',
    status: 'scheduled',
  },
  {
    id: 'wc-5',
    competitionId: 'world-cup',
    competitionName: 'Copa 2026',
    stage: 'Fase de Grupos',
    dateIso: '2026-06-17T21:00:00.000Z',
    homeTeam: '🇧🇷 Brasil',
    awayTeam: '🇭🇷 Croacia',
    status: 'scheduled',
    broadcast: 'SporTV',
  },
  {
    id: 'wc-6',
    competitionId: 'world-cup',
    competitionName: 'Copa 2026',
    stage: 'Fase de Grupos',
    dateIso: '2026-06-18T18:00:00.000Z',
    homeTeam: '🇨🇦 Canada',
    awayTeam: '🇸🇳 Senegal',
    status: 'scheduled',
  },
  {
    id: 'wc-7',
    competitionId: 'world-cup',
    competitionName: 'Copa 2026',
    stage: 'Fase de Grupos',
    dateIso: '2026-06-18T21:00:00.000Z',
    homeTeam: '🇯🇵 Japao',
    awayTeam: '🇨🇲 Camaroes',
    status: 'scheduled',
  },
];

const WORLD_CUP_KNOCKOUT: KnockoutRound[] = [
  {
    id: 'oitavas',
    name: 'Oitavas',
    matches: [
      { id: 'ko-1', competitionId: 'world-cup', competitionName: 'Copa 2026', stage: 'Oitavas', dateIso: '2026-06-28T18:00:00.000Z', homeTeam: '1A', awayTeam: '2B', status: 'scheduled' },
      { id: 'ko-2', competitionId: 'world-cup', competitionName: 'Copa 2026', stage: 'Oitavas', dateIso: '2026-06-29T18:00:00.000Z', homeTeam: '1B', awayTeam: '2A', status: 'scheduled' },
      { id: 'ko-3', competitionId: 'world-cup', competitionName: 'Copa 2026', stage: 'Oitavas', dateIso: '2026-06-30T18:00:00.000Z', homeTeam: '1C', awayTeam: '2D', status: 'scheduled' },
      { id: 'ko-4', competitionId: 'world-cup', competitionName: 'Copa 2026', stage: 'Oitavas', dateIso: '2026-07-01T18:00:00.000Z', homeTeam: '1D', awayTeam: '2C', status: 'scheduled' },
      { id: 'ko-5', competitionId: 'world-cup', competitionName: 'Copa 2026', stage: 'Oitavas', dateIso: '2026-07-02T18:00:00.000Z', homeTeam: '1E', awayTeam: '2F', status: 'scheduled' },
      { id: 'ko-6', competitionId: 'world-cup', competitionName: 'Copa 2026', stage: 'Oitavas', dateIso: '2026-07-03T18:00:00.000Z', homeTeam: '1F', awayTeam: '2E', status: 'scheduled' },
    ],
  },
  {
    id: 'quartas',
    name: 'Quartas',
    matches: [
      { id: 'ko-7', competitionId: 'world-cup', competitionName: 'Copa 2026', stage: 'Quartas', dateIso: '2026-07-06T20:00:00.000Z', homeTeam: 'Venc. O1', awayTeam: 'Venc. O2', status: 'scheduled' },
      { id: 'ko-8', competitionId: 'world-cup', competitionName: 'Copa 2026', stage: 'Quartas', dateIso: '2026-07-07T20:00:00.000Z', homeTeam: 'Venc. O3', awayTeam: 'Venc. O4', status: 'scheduled' },
      { id: 'ko-9', competitionId: 'world-cup', competitionName: 'Copa 2026', stage: 'Quartas', dateIso: '2026-07-08T20:00:00.000Z', homeTeam: 'Venc. O5', awayTeam: 'Venc. O6', status: 'scheduled' },
      { id: 'ko-10', competitionId: 'world-cup', competitionName: 'Copa 2026', stage: 'Quartas', dateIso: '2026-07-09T20:00:00.000Z', homeTeam: 'Venc. O7', awayTeam: 'Venc. O8', status: 'scheduled' },
    ],
  },
  {
    id: 'semi',
    name: 'Semifinal',
    matches: [
      { id: 'ko-11', competitionId: 'world-cup', competitionName: 'Copa 2026', stage: 'Semifinal', dateIso: '2026-07-12T20:00:00.000Z', homeTeam: 'Venc. Q1', awayTeam: 'Venc. Q2', status: 'scheduled' },
      { id: 'ko-12', competitionId: 'world-cup', competitionName: 'Copa 2026', stage: 'Semifinal', dateIso: '2026-07-13T20:00:00.000Z', homeTeam: 'Venc. Q3', awayTeam: 'Venc. Q4', status: 'scheduled' },
    ],
  },
  {
    id: 'final',
    name: 'Final',
    matches: [
      { id: 'ko-13', competitionId: 'world-cup', competitionName: 'Copa 2026', stage: 'Final', dateIso: '2026-07-16T21:00:00.000Z', homeTeam: 'Venc. S1', awayTeam: 'Venc. S2', status: 'scheduled' },
    ],
  },
];

const CLUB_MATCHES: MatchItem[] = [
  {
    id: 'clb-1',
    competitionId: 'libertadores',
    competitionName: 'Libertadores',
    stage: 'Grupos',
    dateIso: '2026-05-14T02:00:00.000Z',
    homeTeam: '🇧🇷 Sao Paulo',
    awayTeam: '�🇷 Juventude',
    homeScore: 2,
    awayScore: 0,
    status: 'finished',
    broadcast: 'ESPN',
  },
  {
    id: 'clb-2',
    competitionId: 'libertadores',
    competitionName: 'Libertadores',
    stage: 'Grupos',
    dateIso: '2026-05-14T23:00:00.000Z',
    homeTeam: '🇧🇷 Palmeiras',
    awayTeam: '🇪🇨 LDU',
    status: 'scheduled',
    broadcast: 'SporTV',
  },
  {
    id: 'clb-3',
    competitionId: 'copa-do-brasil',
    competitionName: 'Copa do Brasil',
    stage: 'Oitavas',
    dateIso: '2026-05-15T01:30:00.000Z',
    homeTeam: '🇧🇷 Corinthians',
    awayTeam: '🇧🇷 Athletico-PR',
    status: 'scheduled',
    broadcast: 'Amazon Prime',
  },
  {
    id: 'clb-4',
    competitionId: 'brasileirao-a',
    competitionName: 'Brasileirao A',
    stage: 'Rodada 7',
    dateIso: '2026-05-10T23:30:00.000Z',
    homeTeam: '🇧🇷 Flamengo',
    awayTeam: '🇧🇷 Vasco',
    homeScore: 1,
    awayScore: 1,
    status: 'finished',
    broadcast: 'Premiere',
  },
  {
    id: 'clb-5',
    competitionId: 'paulistao',
    competitionName: 'Paulistao',
    stage: 'Final',
    dateIso: '2026-04-26T02:00:00.000Z',
    homeTeam: '🇧🇷 Santos',
    awayTeam: '🇧🇷 Sao Paulo',
    homeScore: 0,
    awayScore: 2,
    status: 'finished',
    broadcast: 'Record',
  },
  {
    id: 'clb-6',
    competitionId: 'brasileirao-a',
    competitionName: 'Brasileirao A',
    stage: 'Rodada 8',
    dateIso: '2026-05-18T02:30:00.000Z',
    homeTeam: '🇧🇷 Palmeiras',
    awayTeam: '🇧🇷 Flamengo',
    status: 'scheduled',
    broadcast: 'Premiere',
  },
  {
    id: 'clb-7',
    competitionId: 'sul-americana',
    competitionName: 'Sul-Americana',
    stage: 'Grupos',
    dateIso: '2026-05-20T03:00:00.000Z',
    homeTeam: '🇧🇷 Vasco',
    awayTeam: '🇪🇨 LDU',
    status: 'scheduled',
    broadcast: 'Paramount+',
  },
];

const inRange = (iso: string, fromIso: string, toIso: string) => {
  const value = new Date(iso).getTime();
  const from = new Date(fromIso).getTime();
  const to = new Date(toIso).getTime();
  return value >= from && value <= to;
};

export const mockSportsProvider: SportsDataProvider = {
  id: 'mock-primary',
  async getWorldCupGroups() {
    return WORLD_CUP_GROUPS;
  },
  async getWorldCupMatches(fromIso, toIso) {
    return WORLD_CUP_MATCHES.filter((item) => inRange(item.dateIso, fromIso, toIso));
  },
  async getWorldCupKnockout() {
    return WORLD_CUP_KNOCKOUT;
  },
  async getClubCompetitions() {
    return CLUB_COMPETITIONS;
  },
  async getClubMatches(competitionId, fromIso, toIso) {
    return CLUB_MATCHES.filter((match) => {
      const competitionOk = competitionId === 'all' || match.competitionId === competitionId;
      return competitionOk && inRange(match.dateIso, fromIso, toIso);
    });
  },
};

// Secondary provider can be replaced by another API later.
export const fallbackSportsProvider: SportsDataProvider = {
  ...mockSportsProvider,
  id: 'mock-fallback',
};