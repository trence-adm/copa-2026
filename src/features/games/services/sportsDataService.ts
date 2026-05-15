import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiFootballDataProvider } from '../data/apiFootballDataProvider';
import { fallbackSportsProvider, mockSportsProvider } from '../data/mockSportsProvider';
import {
  ClubCompetition,
  KnockoutRound,
  MatchItem,
  SportsDataProvider,
  WorldCupGroup,
} from '../types';

const CACHE_TTL_MS = 1000 * 60 * 30;

interface CacheEnvelope<T> {
  savedAt: number;
  data: T;
}

const providers: SportsDataProvider[] = [apiFootballDataProvider, mockSportsProvider, fallbackSportsProvider];

async function readCache<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) {
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

async function writeCache<T>(key: string, data: T) {
  const payload: CacheEnvelope<T> = {
    savedAt: Date.now(),
    data,
  };
  await AsyncStorage.setItem(key, JSON.stringify(payload));
}

async function loadWithFallback<T>(
  key: string,
  request: (provider: SportsDataProvider) => Promise<T>
): Promise<T> {
  const cached = await readCache<T>(key);
  if (cached) {
    return cached;
  }

  let latestError: unknown = null;
  for (const provider of providers) {
    try {
      const data = await request(provider);
      await writeCache(key, data);
      return data;
    } catch (error) {
      latestError = error;
    }
  }

  if (latestError) {
    throw latestError;
  }

  throw new Error('No data provider available');
}

export function getWorldCupGroups() {
  return loadWithFallback<WorldCupGroup[]>('sports:v3:wc:groups', (provider) =>
    provider.getWorldCupGroups()
  );
}

export function getWorldCupMatches(fromIso: string, toIso: string) {
  return loadWithFallback<MatchItem[]>(`sports:v3:wc:matches:${fromIso}:${toIso}`, (provider) =>
    provider.getWorldCupMatches(fromIso, toIso)
  );
}

export function getWorldCupKnockout() {
  return loadWithFallback<KnockoutRound[]>('sports:v3:wc:knockout', (provider) =>
    provider.getWorldCupKnockout()
  );
}

export function getClubCompetitions() {
  return loadWithFallback<ClubCompetition[]>('sports:v2:club:competitions', (provider) =>
    provider.getClubCompetitions()
  );
}

export function getClubMatches(
  competitionId: string | 'all',
  fromIso: string,
  toIso: string
) {
  return loadWithFallback<MatchItem[]>(
    `sports:v2:club:matches:${competitionId}:${fromIso}:${toIso}`,
    (provider) => provider.getClubMatches(competitionId, fromIso, toIso)
  );
}