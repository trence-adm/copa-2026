import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getWorldCupMatches, MatchItem } from '../../features/games';
import { styles } from './JogosCopaByDateScreen.styles';

const getTeamFlag = (team: string | null | undefined) => {
  if (!team) return '';
  const match = team.match(/^\p{Regional_Indicator}{2}/u);
  return match ? match[0] : '';
};

const teamNameWithoutFlag = (team: string | null | undefined) => {
  if (!team) return '';
  return team.replace(/^\p{Regional_Indicator}{2}\s*/u, '').trim();
};

const toIsoWindow = () => {
  const now = new Date();
  const from = new Date(now);
  from.setDate(now.getDate() - 4);
  const to = new Date(now);
  to.setDate(now.getDate() + 180);
  return { fromIso: from.toISOString(), toIso: to.toISOString() };
};

const toDayKey = (iso: string) => iso.slice(0, 10);

const formatDayLabel = (dayKey: string) => {
  const date = new Date(`${dayKey}T00:00:00`);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
};

const formatTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
};

const todayKey = () => new Date().toISOString().slice(0, 10);

export function JogosCopaByDateScreen() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { fromIso, toIso } = toIsoWindow();
    let active = true;
    getWorldCupMatches(fromIso, toIso)
      .then((data) => {
        if (active) {
          const sorted = [...data].sort(
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

  const grouped = useMemo(() => {
    const map = new Map<string, MatchItem[]>();
    matches.forEach((item) => {
      const key = toDayKey(item.dateIso);
      const bucket = map.get(key) ?? [];
      bucket.push(item);
      map.set(key, bucket);
    });
    return [...map.entries()];
  }, [matches]);

  if (isLoading) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom', 'top']} style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#114b5f" />
      </SafeAreaView>
    );
  }

  const keyToday = todayKey();

  return (
    <SafeAreaView edges={['left', 'right', 'bottom', 'top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Jogos por data</Text>
        <Text style={styles.subtitle}>Resultados, ao vivo e proximas partidas</Text>

        {grouped.length === 0 ? <Text style={styles.empty}>Sem jogos no periodo.</Text> : null}

        {grouped.map(([dayKey, dayMatches]) => {
          const isToday = dayKey === keyToday;

          return (
            <View key={dayKey}>
              <Text style={[styles.dayTitle, isToday ? styles.todayTitle : undefined]}>
                {formatDayLabel(dayKey)} {isToday ? '(hoje)' : ''}
              </Text>
              {dayMatches.map((item) => {
                const hasScore = item.homeScore !== undefined && item.awayScore !== undefined;
                const scoreColor = hasScore ? '#1d3640' : '#a0a8ae';
                const homeFlag = getTeamFlag(item.homeTeam);
                const awayFlag = getTeamFlag(item.awayTeam);

                return (
                  <View key={item.id} style={styles.card}>
                    <View style={styles.teamRow}>
                      <Text style={styles.teamFlag}>{homeFlag}</Text>
                      <Text style={[styles.teams, { flex: 1 }]}>{teamNameWithoutFlag(item.homeTeam)}</Text>
                      <Text style={[styles.matchScore, { color: scoreColor }]}>
                        {hasScore ? String(item.homeScore) : '_'}
                      </Text>
                    </View>
                    <View style={styles.teamRow}>
                      <Text style={styles.teamFlag}>{awayFlag}</Text>
                      <Text style={[styles.teams, { flex: 1 }]}>{teamNameWithoutFlag(item.awayTeam)}</Text>
                      <Text style={[styles.matchScore, { color: scoreColor }]}>
                        {hasScore ? String(item.awayScore) : '_'}
                      </Text>
                    </View>
                    <Text style={styles.meta}>{item.stage} · {formatTime(item.dateIso)}</Text>
                    {item.broadcast ? <Text style={styles.meta}>Onde assistir: {item.broadcast}</Text> : null}
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}