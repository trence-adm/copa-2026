import { useEffect, useState, useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getWorldCupGroups, getWorldCupMatches, WorldCupGroup, MatchItem } from '../../features/games';
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

export function JogosCopaGroupsScreen() {
  const [groups, setGroups] = useState<WorldCupGroup[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
            (a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime()
          );
          setMatches(sorted);
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

  // Group matches by stage (Fase de Grupos matches)
  const groupMatches = useMemo(
    () => matches.filter((m) => m.stage === 'Fase de Grupos'),
    [matches]
  );

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

        {groups.map((group) => (
          (() => {
            const groupTeams = new Set(group.standings.map((team) => team.team));
            const matchesByGroup = groupMatches.filter(
              (item) => groupTeams.has(item.homeTeam) && groupTeams.has(item.awayTeam)
            );

            return (
              <View key={group.id} style={styles.card}>
                <Text style={styles.groupName}>{group.name}</Text>
                {group.standings.map((team, index) => (
                  <View key={`${group.id}-${team.team}`} style={styles.row}>
                    <Text style={styles.rowPos}>{index + 1}.</Text>
                    <Text style={styles.rowTeam}>{team.team}</Text>
                    <Text style={styles.rowPoints}>{team.points}p</Text>
                  </View>
                ))}

                {matchesByGroup.length > 0 && (
                  <View style={{ marginTop: 12, gap: 6, borderTopWidth: 1, borderTopColor: '#edf3f6', paddingTop: 10 }}>
                    <Text style={{ fontSize: 12, fontWeight: '900', color: '#0b4b60', marginBottom: 2 }}>
                      Jogos do {group.name}
                    </Text>
                    {matchesByGroup.map((item) => {
                      const score =
                        item.homeScore !== undefined && item.awayScore !== undefined
                          ? `${item.homeScore} x ${item.awayScore}`
                          : '_ x _';
                      const scoreColor = item.homeScore !== undefined ? '#1d3640' : '#a0a8ae';
                      return (
                        <View
                          key={item.id}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#f8fbfd',
                            borderRadius: 8,
                            padding: 8,
                            gap: 6,
                          }}
                        >
                          <Text style={{ flex: 1, fontSize: 13, fontWeight: '700', color: '#1d3640' }}>
                            {item.homeTeam} <Text style={{ color: scoreColor }}>{score}</Text> {item.awayTeam}
                          </Text>
                          <Text style={{ fontSize: 10, color: '#4f6771', fontWeight: '600' }}>
                            {formatDate(item.dateIso)} {formatTime(item.dateIso)}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })()
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}