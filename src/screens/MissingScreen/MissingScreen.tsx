import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TeamSection } from '../../components/TeamSection';
import { useCollection } from '../../context/CollectionContext';
import { STICKER_NUMBERS, STICKERS_PER_TEAM } from '../../data/teams';
import { TeamSnapshot } from '../../types';
import { styles } from './MissingScreen.styles';
import { SnapshotSortFn } from './MissingScreen.types';

const sortSnapshots: SnapshotSortFn = (snapshots, mode) => {
  const sorted = [...snapshots];
  if (mode === 'album') {
    sorted.sort((a, b) => a.team.albumOrder - b.team.albumOrder);
    return sorted;
  }

  sorted.sort((a, b) => a.team.name.localeCompare(b.team.name));
  return sorted;
};

export function MissingScreen() {
  const {
    teams,
    orderMode,
    toggleOrderMode,
    isExpanded,
    toggleExpanded,
    getQuantity,
    increment,
    decrement,
  } = useCollection();

  const [snapshot, setSnapshot] = useState<TeamSnapshot[]>([]);

  useFocusEffect(
    useCallback(() => {
      const nextSnapshot: TeamSnapshot[] = teams
        .map((team) => ({
          team,
          numbers: STICKER_NUMBERS.filter(
            (number) => getQuantity(team.id, number) === 0,
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBlock}>
        <View style={styles.topRow}>
          <Text style={styles.title}>Faltantes</Text>
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
            <Text style={styles.emptyTitle}>Album completo!</Text>
            <Text style={styles.emptyText}>
              Nao ha faltantes no snapshot atual.
            </Text>
          </View>
        ) : null}

        {orderedSnapshot.map(({ team, numbers }) => {
          const currentMissingCount = STICKER_NUMBERS.filter(
            (number) => getQuantity(team.id, number) === 0,
          ).length;

          return (
            <TeamSection
              key={`${team.id}-missing`}
              team={team}
              numbers={numbers}
              expanded={isExpanded(team.id)}
              ownedCount={STICKERS_PER_TEAM - currentMissingCount}
              totalPerTeam={STICKERS_PER_TEAM}
              onToggleExpanded={() => toggleExpanded(team.id)}
              onPressSticker={(number) => increment(team.id, number)}
              onLongPressSticker={(number) => decrement(team.id, number)}
              getQuantity={(number) => getQuantity(team.id, number)}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
