import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCollection } from '../../context/CollectionContext';
import { STICKERS_PER_TEAM } from '../../data/teams';
import { styles } from './StatusScreen.styles';
import { TeamProgressEntry } from './StatusScreen.types';

export function StatusScreen() {
  const { teams, getOverallStats, getTeamStats } = useCollection();

  const overall = getOverallStats();

  const perTeam = useMemo<TeamProgressEntry[]>(
    () =>
      [...teams]
        .map((team) => ({ team, stats: getTeamStats(team.id) }))
        .sort((a, b) => a.team.albumOrder - b.team.albumOrder),
    [teams, getTeamStats],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Status da colecao</Text>

        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, styles.metricBlue]}>
            <Text style={styles.metricLabel}>Total album</Text>
            <Text style={styles.metricValue}>{overall.totalSlots}</Text>
          </View>
          <View style={[styles.metricCard, styles.metricGreen]}>
            <Text style={styles.metricLabel}>Eu tenho</Text>
            <Text style={styles.metricValue}>{overall.uniqueOwned}</Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, styles.metricOrange]}>
            <Text style={styles.metricLabel}>Faltam</Text>
            <Text style={styles.metricValue}>{overall.missing}</Text>
          </View>
          <View style={[styles.metricCard, styles.metricCoral]}>
            <Text style={styles.metricLabel}>Repetidas</Text>
            <Text style={styles.metricValue}>{overall.duplicates}</Text>
          </View>
        </View>

        <View style={styles.bigCard}>
          <Text style={styles.bigCardLabel}>Total de figurinhas fisicas</Text>
          <Text style={styles.bigCardValue}>{overall.totalCards}</Text>
        </View>

        <Text style={styles.sectionTitle}>Progresso por time</Text>

        {perTeam.map(({ team, stats }) => {
          const completion = Math.round((stats.uniqueOwned / STICKERS_PER_TEAM) * 100);
          return (
            <View key={`${team.id}-status`} style={styles.teamCard}>
              <View style={styles.teamRow}>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.teamNumbers}>
                  {stats.uniqueOwned}/{STICKERS_PER_TEAM}
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${completion}%` }]}
                />
              </View>
              <Text style={styles.teamMeta}>
                faltam {stats.missing} | repetidas {stats.duplicates}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
