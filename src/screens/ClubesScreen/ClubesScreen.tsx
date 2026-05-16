import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClubCompetition, getClubCompetitions, getClubMatches, MatchItem } from '../../features/games';
import { styles } from './ClubesScreen.styles';

const getWindow = () => {
  const now = new Date();
  const from = new Date(now);
  from.setDate(now.getDate() - 7);
  const to = new Date(now);
  to.setDate(now.getDate() + 30);
  return { fromIso: from.toISOString(), toIso: to.toISOString() };
};

const toDayKey = (iso: string) => iso.slice(0, 10);
const todayKey = () => new Date().toISOString().slice(0, 10);

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

export function ClubesScreen() {
  const [competitions, setCompetitions] = useState<ClubCompetition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string | 'all'>('brasileirao-a');
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [todayY, setTodayY] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    let active = true;

    getClubCompetitions()
      .then((competitionData) => {
        if (!active) {
          return;
        }
        setCompetitions(competitionData);
      })
      .finally(() => {
        if (active) {
          setIsLoadingCompetitions(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const { fromIso, toIso } = getWindow();
    let active = true;

    setIsLoadingMatches(true);
    getClubMatches(selectedCompetition, fromIso, toIso)
      .then((data) => {
        if (!active) {
          return;
        }
        const sorted = [...data].sort(
          (a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime()
        );
        setMatches(sorted);
      })
      .finally(() => {
        if (active) {
          setIsLoadingMatches(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedCompetition]);

  useEffect(() => {
    if (todayY === null) {
      return;
    }

    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: Math.max(0, todayY - 80), animated: true });
    }, 250);

    return () => clearTimeout(timer);
  }, [todayY]);

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

  const keyToday = todayKey();
  const isLoading = isLoadingCompetitions || isLoadingMatches;

  if (isLoading) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom', 'top']} style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#114b5f" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom', 'top']} style={styles.safeArea}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Clubes</Text>
        <Text style={styles.subtitle}>Brasileirão Série A | janela de jogos: -7 dias ate +30 dias</Text>

        <View style={styles.filterRow}>
          {competitions.map((competition) => {
            const isSelected = selectedCompetition === competition.id;
            return (
              <Pressable
                key={competition.id}
                style={[styles.filterChip, isSelected ? styles.filterChipActive : undefined]}
                onPress={() => setSelectedCompetition(competition.id)}
              >
                <Text style={[styles.filterText, isSelected ? styles.filterTextActive : undefined]}>
                  {competition.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {grouped.length === 0 ? <Text style={styles.empty}>Sem jogos para esse filtro.</Text> : null}

        {grouped.map(([dayKey, dayMatches]) => {
          const isToday = dayKey === keyToday;

          return (
            <View
              key={dayKey}
              onLayout={(event) => {
                if (isToday) {
                  setTodayY(event.nativeEvent.layout.y);
                }
              }}
            >
              <Text style={[styles.sectionTitle, isToday ? styles.sectionToday : undefined]}>
                {formatDayLabel(dayKey)} {isToday ? '(hoje)' : ''}
              </Text>

              {dayMatches.map((item) => {
                const hasScore = item.homeScore !== undefined && item.awayScore !== undefined;
                const scoreColor = hasScore ? '#1d3640' : '#a0a8ae';
                return (
                  <View key={item.id} style={styles.card}>
                    <View style={styles.teamRow}>
                      {item.homeTeamCrest ? (
                        <Image source={{ uri: item.homeTeamCrest }} style={styles.crest} />
                      ) : null}
                      <Text style={[styles.teams, { flex: 1 }]}>{item.homeTeam}</Text>
                      <Text style={[styles.matchScore, { color: scoreColor }]}>
                        {hasScore ? String(item.homeScore) : '_'}
                      </Text>
                    </View>
                    <View style={styles.teamRow}>
                      {item.awayTeamCrest ? (
                        <Image source={{ uri: item.awayTeamCrest }} style={styles.crest} />
                      ) : null}
                      <Text style={[styles.teams, { flex: 1 }]}>{item.awayTeam}</Text>
                      <Text style={[styles.matchScore, { color: scoreColor }]}>
                        {hasScore ? String(item.awayScore) : '_'}
                      </Text>
                    </View>
                    <Text style={styles.meta}>
                      {item.competitionName} | {item.stage} | {formatTime(item.dateIso)}
                    </Text>
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