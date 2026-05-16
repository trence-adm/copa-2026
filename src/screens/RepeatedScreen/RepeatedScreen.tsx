import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TeamSection } from '../../components/TeamSection';
import { useCollection } from '../../context/CollectionContext';
import { STICKER_NUMBERS, STICKERS_PER_TEAM } from '../../data/teams';
import { TeamSnapshot } from '../../types';
import { styles } from './RepeatedScreen.styles';
import { SnapshotSortFn } from './RepeatedScreen.types';

const sortSnapshots: SnapshotSortFn = (snapshots, mode) => {
  const sorted = [...snapshots];
  if (mode === 'album') {
    sorted.sort((a, b) => a.team.albumOrder - b.team.albumOrder);
    return sorted;
  }

  sorted.sort((a, b) => a.team.code.localeCompare(b.team.code));
  return sorted;
};

export function RepeatedScreen() {
  const {
    teams,
    orderMode,
    toggleOrderMode,
    isExpanded,
    toggleExpanded,
    getQuantity,
    increment,
    decrement,
    getTeamStats,
  } = useCollection();

  const [snapshot, setSnapshot] = useState<TeamSnapshot[]>([]);

  useFocusEffect(
    useCallback(() => {
      const nextSnapshot: TeamSnapshot[] = teams
        .map((team) => ({
          team,
          numbers: STICKER_NUMBERS.filter(
            (number) => getQuantity(team.id, number) > 0,
          ),
        }))
        .filter((entry) => entry.numbers.length > 0);

      setSnapshot(nextSnapshot);
      return () => {
        // Keep snapshot stable while on this screen to avoid disappearing rows.
      };
    }, [teams, getQuantity]),
  );

  const orderedSnapshot = useMemo(
    () => sortSnapshots(snapshot, orderMode),
    [snapshot, orderMode],
  );

  const handleIncrementDuplicate = (teamId: string, number: number) => {
    const currentQty = getQuantity(teamId, number);
    if (currentQty === 0) {
      // If not owned, do nothing
      return;
    }
    // Increment to add duplicate
    increment(teamId, number);
  };

  const handleDecrementDuplicate = (teamId: string, number: number) => {
    const currentQty = getQuantity(teamId, number);
    if (currentQty <= 1) {
      // Don't go below 1 (which represents the single owned copy in "todos")
      return;
    }
    // Decrement to remove duplicate
    decrement(teamId, number);
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
      <View style={styles.topBlock}>
        <View style={styles.topRow}>
          <Text style={styles.title}>Repetidas</Text>
          <Pressable onPress={toggleOrderMode} style={styles.orderButton}>
            <Text style={styles.orderText}>
              {orderMode === 'album' ? 'Album' : 'A-Z'}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.infoText}>Clique para adicionar duplicata • Long press para remover</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {orderedSnapshot.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhuma figurinha coletada</Text>
            <Text style={styles.emptyText}>
              Colecione figurinhas primeiro na aba "Todos".
            </Text>
          </View>
        ) : null}

        {orderedSnapshot.map(({ team, numbers }) => {
          const teamStats = getTeamStats(team.id);

          return (
            <TeamSection
              key={`${team.id}-repeated`}
              team={team}
              numbers={numbers}
              expanded={isExpanded(team.id)}
              ownedCount={teamStats.uniqueOwned}
              totalPerTeam={STICKERS_PER_TEAM}
              onToggleExpanded={() => toggleExpanded(team.id)}
              onPressSticker={(number) => handleIncrementDuplicate(team.id, number)}
              onLongPressSticker={(number) => handleDecrementDuplicate(team.id, number)}
              stickerLongPressDelay={200}
              getQuantity={(number) => {
                const qty = getQuantity(team.id, number);
                // Show duplicates count (qty - 1, minimum 0)
                return Math.max(0, qty - 1);
              }}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
