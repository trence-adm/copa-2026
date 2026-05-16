import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MatchItem, WorldCupGroup, getWorldCupGroups, getWorldCupMatches } from '../../features/games';
import { styles } from './JogosCopaGroupsScreen.styles';

const formatTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
};

const teamNameWithoutFlag = (team: string | null | undefined) => {
  if (!team) return '';
  return team.replace(/^\p{Regional_Indicator}{2}\s*/u, '').trim();
};

const getTeamFlag = (team: string | null | undefined) => {
  if (!team) return '';
  const match = team.match(/^\p{Regional_Indicator}{2}/u);
  return match ? match[0] : '';
};

export function JogosCopaGroupsScreen() {
  const [groups, setGroups] = useState<WorldCupGroup[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - 4);
    const to = new Date(now);
    to.setDate(now.getDate() + 180);
    const fromIso = from.toISOString();
    const toIso = to.toISOString();

    Promise.all([getWorldCupGroups(), getWorldCupMatches(fromIso, toIso)])
      .then(([groupData, matchData]) => {
        if (active) {
          setGroups(groupData);
          const sorted = [...matchData].sort(
            (a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime(),
          );
          setMatches(sorted);
          const collapsedByDefault = groupData.reduce<Record<string, boolean>>((acc, group) => {
            acc[group.id] = false;
            return acc;
          }, {});
          setExpandedGroups(collapsedByDefault);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const groupMatches = useMemo(
    () => matches.filter((m) => m.stage === 'Fase de Grupos'),
    [matches],
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((current) => ({
      ...current,
      [groupId]: !current[groupId],
    }));
  };

  if (isLoading) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom', 'top']} style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#114b5f" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom', 'top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tabela da Copa</Text>
        <Text style={styles.subtitle}>Grupos e jogos</Text>

        {groups.map((group) => {
          const groupTeams = new Set(group.standings.map((team) => team.team));
          const matchesByGroup = groupMatches.filter(
            (item) => groupTeams.has(item.homeTeam) && groupTeams.has(item.awayTeam),
          );
          const isExpanded = expandedGroups[group.id] ?? false;

          return (
            <View key={group.id} style={styles.card}>
              <Pressable style={styles.groupHeader} onPress={() => toggleGroup(group.id)}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.expandText}>{isExpanded ? 'Ocultar' : 'Expandir'}</Text>
              </Pressable>

              {!isExpanded ? (
                <View style={styles.teamPreviewGrid}>
                  {group.standings.slice(0, 4).map((team) => (
                    <View key={`${group.id}-${team.team}-preview`} style={styles.teamPreviewCard}>
                      <Text style={styles.teamPreviewName} numberOfLines={1}>
                        {team.team}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {isExpanded ? (
                <>
                  {group.standings.map((team, index) => (
                    <View key={`${group.id}-${team.team}`} style={styles.row}>
                      <Text style={styles.rowPos}>{index + 1}.</Text>
                      <Text style={styles.rowTeam}>{teamNameWithoutFlag(team.team)}</Text>
                      <Text style={styles.rowPoints}>{team.points}p</Text>
                    </View>
                  ))}

                  {matchesByGroup.length > 0 ? (
                    <View style={styles.matchesWrap}>
                      <Text style={styles.matchesTitle}>Jogos do {group.name}</Text>
                      {matchesByGroup.map((item) => {
                        const hasScore = item.homeScore !== undefined && item.awayScore !== undefined;
                        const scoreColor = hasScore ? '#1d3640' : '#a0a8ae';
                        const homeFlag = getTeamFlag(item.homeTeam);
                        const awayFlag = getTeamFlag(item.awayTeam);
                        return (
                          <View key={item.id} style={styles.matchCard}>
                            <View style={styles.teamRow}>
                              <Text style={styles.matchTeamFlag}>{homeFlag}</Text>
                              <Text style={[styles.matchTeam, { flex: 1 }]}>{teamNameWithoutFlag(item.homeTeam)}</Text>
                              <Text style={[styles.matchScore, { color: scoreColor }]}>
                                {hasScore ? String(item.homeScore) : '_'}
                              </Text>
                            </View>
                            <View style={styles.teamRow}>
                              <Text style={styles.matchTeamFlag}>{awayFlag}</Text>
                              <Text style={[styles.matchTeam, { flex: 1 }]}>{teamNameWithoutFlag(item.awayTeam)}</Text>
                              <Text style={[styles.matchScore, { color: scoreColor }]}>
                                {hasScore ? String(item.awayScore) : '_'}
                              </Text>
                            </View>
                            <Text style={styles.matchDate}>
                              {formatDate(item.dateIso)} {formatTime(item.dateIso)}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ) : null}
                </>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
