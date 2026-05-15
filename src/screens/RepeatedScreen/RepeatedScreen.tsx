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
            (number) => getQuantity(team.id, number) > 1,
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
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {orderedSnapshot.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Sem repetidas no momento</Text>
            <Text style={styles.emptyText}>
              Quando tiver copias extras, elas aparecerao aqui.
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
              onPressSticker={(number) => increment(team.id, number)}
              onLongPressSticker={(number) => decrement(team.id, number)}
              stickerLongPressDelay={200}
              getQuantity={(number) => getQuantity(team.id, number)}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
