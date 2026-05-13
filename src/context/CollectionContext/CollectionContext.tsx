import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { STICKER_NUMBERS, STICKERS_PER_TEAM, teams } from '../../data/teams';
import { OrderMode, OverallStats, TeamStats } from '../../types';
import {
  CollectionContextValue,
  ExpandedMap,
  InventoryMap,
  PersistedState,
} from './CollectionContext.types';

const STORAGE_KEY = 'figurinhas-2026-state-v1';

const CollectionContext = createContext<CollectionContextValue | undefined>(
  undefined,
);

const makeStickerKey = (teamId: string, number: number) => `${teamId}-${number}`;

const defaultExpandedState = teams.reduce<ExpandedMap>((acc, team) => {
  acc[team.id] = true;
  return acc;
}, {});

const sanitizePersistedState = (raw: unknown): PersistedState | null => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const state = raw as Partial<PersistedState>;
  const orderMode =
    state.orderMode === 'alphabetical' || state.orderMode === 'album'
      ? state.orderMode
      : 'album';

  const expanded: ExpandedMap = { ...defaultExpandedState };
  if (state.expanded && typeof state.expanded === 'object') {
    for (const [key, value] of Object.entries(state.expanded)) {
      expanded[key] = Boolean(value);
    }
  }

  const inventory: InventoryMap = {};
  if (state.inventory && typeof state.inventory === 'object') {
    for (const [key, value] of Object.entries(state.inventory)) {
      if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        inventory[key] = Math.floor(value);
      }
    }
  }

  return { orderMode, expanded, inventory };
};

export function CollectionProvider({ children }: PropsWithChildren) {
  const [orderMode, setOrderModeState] = useState<OrderMode>('album');
  const [expanded, setExpanded] = useState<ExpandedMap>(defaultExpandedState);
  const [inventory, setInventory] = useState<InventoryMap>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const persisted = await AsyncStorage.getItem(STORAGE_KEY);
        if (!persisted) {
          return;
        }

        const parsed: unknown = JSON.parse(persisted);
        const safeState = sanitizePersistedState(parsed);
        if (!safeState) {
          return;
        }

        setOrderModeState(safeState.orderMode);
        setExpanded(safeState.expanded);
        setInventory(safeState.inventory);
      } catch {
        // Ignore corrupted storage and continue with defaults.
      } finally {
        setIsReady(true);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const payload: PersistedState = { orderMode, expanded, inventory };
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [orderMode, expanded, inventory, isReady]);

  const isExpanded = useCallback(
    (teamId: string) => expanded[teamId] ?? true,
    [expanded],
  );

  const toggleExpanded = useCallback((teamId: string) => {
    setExpanded((current) => ({
      ...current,
      [teamId]: !(current[teamId] ?? true),
    }));
  }, []);

  const setOrderMode = useCallback((mode: OrderMode) => {
    setOrderModeState(mode);
  }, []);

  const toggleOrderMode = useCallback(() => {
    setOrderModeState((current) =>
      current === 'album' ? 'alphabetical' : 'album',
    );
  }, []);

  const getQuantity = useCallback(
    (teamId: string, number: number) => inventory[makeStickerKey(teamId, number)] ?? 0,
    [inventory],
  );

  const increment = useCallback((teamId: string, number: number) => {
    const key = makeStickerKey(teamId, number);
    setInventory((current) => ({ ...current, [key]: (current[key] ?? 0) + 1 }));
  }, []);

  const decrement = useCallback((teamId: string, number: number) => {
    const key = makeStickerKey(teamId, number);
    setInventory((current) => {
      const nextValue = (current[key] ?? 0) - 1;
      if (nextValue <= 0) {
        const { [key]: _, ...remaining } = current;
        return remaining;
      }

      return { ...current, [key]: nextValue };
    });
  }, []);

  const getOverallStats = useCallback((): OverallStats => {
    const totalSlots = teams.length * STICKERS_PER_TEAM;

    let uniqueOwned = 0;
    let duplicates = 0;

    for (const quantity of Object.values(inventory)) {
      if (quantity > 0) {
        uniqueOwned += 1;
      }
      if (quantity > 1) {
        duplicates += quantity - 1;
      }
    }

    const totalCards = uniqueOwned + duplicates;
    const missing = totalSlots - uniqueOwned;

    return { totalSlots, uniqueOwned, duplicates, missing, totalCards };
  }, [inventory]);

  const getTeamStats = useCallback(
    (teamId: string): TeamStats => {
      let uniqueOwned = 0;
      let duplicates = 0;

      for (const number of STICKER_NUMBERS) {
        const quantity = getQuantity(teamId, number);
        if (quantity > 0) {
          uniqueOwned += 1;
        }
        if (quantity > 1) {
          duplicates += quantity - 1;
        }
      }

      const missing = STICKERS_PER_TEAM - uniqueOwned;
      return { uniqueOwned, duplicates, missing };
    },
    [getQuantity],
  );

  const value = useMemo<CollectionContextValue>(
    () => ({
      teams,
      orderMode,
      isReady,
      toggleOrderMode,
      setOrderMode,
      isExpanded,
      toggleExpanded,
      getQuantity,
      increment,
      decrement,
      getOverallStats,
      getTeamStats,
    }),
    [
      orderMode,
      isReady,
      toggleOrderMode,
      setOrderMode,
      isExpanded,
      toggleExpanded,
      getQuantity,
      increment,
      decrement,
      getOverallStats,
      getTeamStats,
    ],
  );

  return (
    <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>
  );
}

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used inside CollectionProvider.');
  }
  return context;
};
