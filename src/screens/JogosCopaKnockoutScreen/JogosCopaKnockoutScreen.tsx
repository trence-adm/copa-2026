import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getWorldCupKnockout, KnockoutRound } from '../../features/games';
import { styles } from './JogosCopaKnockoutScreen.styles';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });

const formatTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
};

export function JogosCopaKnockoutScreen() {
  const [rounds, setRounds] = useState<KnockoutRound[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getWorldCupKnockout()
      .then((data) => {
        if (active) {
          setRounds(data);
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
        <Text style={styles.title}>Eliminatorias</Text>
        <Text style={styles.subtitle}>Chave ate a final</Text>

        {rounds.map((round) => (
          <View key={round.id} style={styles.roundCard}>
            <Text style={styles.roundName}>{round.name}</Text>

            {round.matches.map((match) => (
              <View key={match.id} style={styles.matchCard}>
                <Text style={styles.teams}>
                  {match.homeTeam} <Text style={{ textDecorationLine: match.homeScore === undefined ? 'underline' : 'none' }}>{match.homeScore !== undefined && match.awayScore !== undefined ? `${match.homeScore} x ${match.awayScore}` : '_ x _'}</Text> {match.awayTeam}
                </Text>
                <Text style={styles.meta}>{formatDate(match.dateIso)} · {formatTime(match.dateIso)}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}