import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TeamSection } from '../../components/TeamSection';
import { useCollection } from '../../context/CollectionContext';
import { STICKER_NUMBERS, STICKERS_PER_TEAM } from '../../data/teams';
import { Team } from '../../types';
import { styles } from './AllTeamsScreen.styles';
import { TeamSortFn } from './AllTeamsScreen.types';

const sortTeams: TeamSortFn = (teams, mode) => {
  const sorted = [...teams];
  if (mode === 'album') {
    sorted.sort((a, b) => a.albumOrder - b.albumOrder);
    return sorted;
  }

  sorted.sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
};

export function AllTeamsScreen() {
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
    isReady,
  } = useCollection();

  const orderedTeams = useMemo(() => sortTeams(teams, orderMode), [teams, orderMode]);

  if (!isReady) {
    return (
      <SafeAreaView style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#114b5f" />
        <Text style={styles.loadingText}>Carregando colecao...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView >
      <View style={styles.topBlock}>
        <View style={styles.topRow}>
          <Text style={styles.title}>Figurinhas Copa 2026</Text>
          <Pressable onPress={toggleOrderMode} style={styles.orderButton}>
            <Text style={styles.orderText}>
              {orderMode === 'album' ? 'Album' : 'A-Z'}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {orderedTeams.map((team) => {
          const teamStats = getTeamStats(team.id);

          return (
            <TeamSection
              key={team.id}
              team={team}
              numbers={STICKER_NUMBERS}
              expanded={isExpanded(team.id)}
              ownedCount={teamStats.uniqueOwned}
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
