import { Team } from '../types';
import { STICKER_IMAGE_CATALOG } from './stickerImageCatalog';

export const STICKERS_PER_TEAM = 20;

export interface Sticker {
  number: number;
  name?: string;
  position?: string;
  type: 'regular' | 'special';
}

export interface CocaColaSticker {
  id: string;
  name: string;
  description: string;
  type: 'team' | 'trophy' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra_rare';
}

// Coca-Cola special stickers
export const COCA_COLA_STICKERS: CocaColaSticker[] = [
  { id: 'cc-1', name: 'World Cup Trophy', description: 'Trophy Golden Edition', type: 'trophy', rarity: 'ultra_rare' },
  { id: 'cc-2', name: 'Golden Boot', description: 'Top Scorer Award', type: 'special', rarity: 'rare' },
  { id: 'cc-3', name: 'Best Goalkeeper', description: 'Golden Glove', type: 'special', rarity: 'rare' },
  { id: 'cc-4', name: 'Best Young Player', description: 'Young Star Award', type: 'special', rarity: 'uncommon' },
  { id: 'cc-5', name: 'Fair Play Award', description: 'Sportsmanship', type: 'special', rarity: 'uncommon' },
  { id: 'cc-6', name: 'Team of the Tournament', description: '11 Best Players', type: 'special', rarity: 'uncommon' },
  { id: 'cc-7', name: 'Coca-Cola Hologram', description: 'Rare Holographic', type: 'special', rarity: 'ultra_rare' },
  { id: 'cc-8', name: 'Limited Edition Gold', description: 'Gold Foil Special', type: 'special', rarity: 'rare' },
];

// Base sticker data for teams with real player names (sample)
const BASE_STICKERS: Record<string, Sticker[]> = {
  BRA: [
    { number: 1, name: 'Vinicius Jr', position: 'LW', type: 'regular' },
    { number: 2, name: 'Neymar', position: 'LW', type: 'regular' },
    { number: 3, name: 'Rodrygo', position: 'RW', type: 'regular' },
    { number: 4, name: 'Paqueta', position: 'CM', type: 'regular' },
    { number: 5, name: 'Casemiro', position: 'CDM', type: 'regular' },
    { number: 6, name: 'Bruno Guimaraes', position: 'CM', type: 'regular' },
    { number: 7, name: 'Alisson', position: 'GK', type: 'regular' },
    { number: 8, name: 'Thiago Silva', position: 'CB', type: 'regular' },
    { number: 9, name: 'Marquinhos', position: 'CB', type: 'regular' },
    { number: 10, name: 'Danilo', position: 'RB', type: 'regular' },
    { number: 11, name: 'Raphael', position: 'CB', type: 'regular' },
    { number: 12, name: 'Vinícius Silva', position: 'LB', type: 'regular' },
    { number: 13, name: 'Gabriel Magalhaes', position: 'CB', type: 'regular' },
    { number: 14, name: 'Emerson Royal', position: 'RB', type: 'regular' },
    { number: 15, name: 'Eder Militao', position: 'CB', type: 'regular' },
    { number: 16, name: 'Lucas Paqueta', position: 'AM', type: 'regular' },
    { number: 17, name: 'Brazil Shield', type: 'special' },
    { number: 18, name: 'CBF Badge', type: 'special' },
    { number: 19, name: 'Historic Win', type: 'special' },
    { number: 20, name: 'Trophy Holder', type: 'special' },
  ],
  ARG: [
    { number: 1, name: 'Messi', position: 'RW', type: 'special' },
    { number: 2, name: 'Maradona Legacy', position: 'ST', type: 'special' },
    { number: 3, name: 'Julián Alvarez', position: 'ST', type: 'regular' },
    { number: 4, name: 'Paulo Dybala', position: 'AM', type: 'regular' },
    { number: 5, name: 'Leandro Paredes', position: 'CM', type: 'regular' },
    { number: 6, name: 'De Paul', position: 'CM', type: 'regular' },
    { number: 7, name: 'Otamendi', position: 'CB', type: 'regular' },
    { number: 8, name: 'Martinez', position: 'CB', type: 'regular' },
    { number: 9, name: 'Tagliafico', position: 'LB', type: 'regular' },
    { number: 10, name: 'Molina', position: 'RB', type: 'regular' },
    { number: 11, name: 'Montiel', position: 'RB', type: 'regular' },
    { number: 12, name: 'Gonzalez', position: 'LW', type: 'regular' },
    { number: 13, name: 'Enzo Fernandez', position: 'CM', type: 'regular' },
    { number: 14, name: 'Almada', position: 'AM', type: 'regular' },
    { number: 15, name: 'Garnacho', position: 'LW', type: 'regular' },
    { number: 16, name: 'Acuna', position: 'LB', type: 'regular' },
    { number: 17, name: 'Argentina Shield', type: 'special' },
    { number: 18, name: 'Copa 1978', type: 'special' },
    { number: 19, name: 'Copa 1986', type: 'special' },
    { number: 20, name: 'World Champions', type: 'special' },
  ],
};

// Generate sticker data for other teams
const generateTeamStickers = (teamCode: string, teamName: string): Sticker[] => {
  const stickers: Sticker[] = [];
  for (let i = 1; i <= STICKERS_PER_TEAM; i++) {
    stickers.push({
      number: i,
      name: i <= 15 ? `Player ${i}` : `${teamName} Special ${i - 15}`,
      position: i <= 15 ? ['GK', 'CB', 'LB', 'RB', 'CM', 'AM', 'LW', 'RW', 'ST'][i % 9] : undefined,
      type: i > 15 ? 'special' : 'regular',
    });
  }
  return stickers;
};

const teamsInAlbumOrder: Array<{ code: string; name: string }> = [
  { code: 'MEX', name: 'Mexico' },
  { code: 'CAN', name: 'Canada' },
  { code: 'USA', name: 'USA' },
  { code: 'ARG', name: 'Argentina' },
  { code: 'BRA', name: 'Brazil' },
  { code: 'URU', name: 'Uruguay' },
  { code: 'COL', name: 'Colombia' },
  { code: 'ECU', name: 'Ecuador' },
  { code: 'CHI', name: 'Chile' },
  { code: 'PER', name: 'Peru' },
  { code: 'PAR', name: 'Paraguay' },
  { code: 'VEN', name: 'Venezuela' },
  { code: 'ENG', name: 'England' },
  { code: 'FRA', name: 'France' },
  { code: 'ESP', name: 'Spain' },
  { code: 'GER', name: 'Germany' },
  { code: 'POR', name: 'Portugal' },
  { code: 'NED', name: 'Netherlands' },
  { code: 'ITA', name: 'Italy' },
  { code: 'BEL', name: 'Belgium' },
  { code: 'CRO', name: 'Croatia' },
  { code: 'SUI', name: 'Switzerland' },
  { code: 'DEN', name: 'Denmark' },
  { code: 'SWE', name: 'Sweden' },
  { code: 'NOR', name: 'Norway' },
  { code: 'POL', name: 'Poland' },
  { code: 'SRB', name: 'Serbia' },
  { code: 'AUT', name: 'Austria' },
  { code: 'TUR', name: 'Turkey' },
  { code: 'UKR', name: 'Ukraine' },
  { code: 'MAR', name: 'Morocco' },
  { code: 'SEN', name: 'Senegal' },
  { code: 'NGA', name: 'Nigeria' },
  { code: 'GHA', name: 'Ghana' },
  { code: 'CMR', name: 'Cameroon' },
  { code: 'TUN', name: 'Tunisia' },
  { code: 'ALG', name: 'Algeria' },
  { code: 'EGY', name: 'Egypt' },
  { code: 'JPN', name: 'Japan' },
  { code: 'KOR', name: 'South Korea' },
  { code: 'AUS', name: 'Australia' },
  { code: 'IRN', name: 'Iran' },
  { code: 'KSA', name: 'Saudi Arabia' },
  { code: 'QAT', name: 'Qatar' },
  { code: 'IRQ', name: 'Iraq' },
  { code: 'UAE', name: 'UAE' },
  { code: 'NZL', name: 'New Zealand' },
  { code: 'CRC', name: 'Costa Rica' },
];

export const teams: Team[] = teamsInAlbumOrder.map(({ code, name }, index) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  code,
  name,
  albumOrder: index,
}));

export const STICKER_NUMBERS = Array.from(
  { length: STICKERS_PER_TEAM },
  (_, index) => index + 1,
);

// Get stickers for a team
export const getStickersByTeam = (teamCode: string): Sticker[] => {
  return BASE_STICKERS[teamCode] || generateTeamStickers(teamCode, teams.find(t => t.code === teamCode)?.name || teamCode);
};

export const getStickerImageSource = (teamCode: string, stickerNumber: number, stickerName?: string) => {
  const key = `${teamCode}-${stickerNumber}`;
  const fromCatalog = STICKER_IMAGE_CATALOG[key];
  if (fromCatalog) {
    return fromCatalog;
  }

  const seed = encodeURIComponent(`${teamCode}-${stickerNumber}-${stickerName ?? 'sticker'}`);
  return { uri: `https://placehold.co/420x600/f3eadb/5d4b3a?text=${seed}` };
};

// Get all stickers across all teams
export const getAllStickers = (): Record<string, Sticker[]> => {
  const allStickers: Record<string, Sticker[]> = {};
  teams.forEach(team => {
    allStickers[team.code] = getStickersByTeam(team.code);
  });
  return allStickers;
};
