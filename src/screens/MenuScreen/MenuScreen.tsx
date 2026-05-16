import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HistoricoScreen } from '../HistoricoScreen';
import { styles } from './MenuScreen.styles';

type MenuView = 'home' | 'copas-passadas';

export function MenuScreen() {
  const [view, setView] = useState<MenuView>('home');

  if (view === 'copas-passadas') {
    return <HistoricoScreen onBack={() => setView('home')} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Menu</Text>
        <Text style={styles.subtitle}>Atalhos e conteúdos extras do app.</Text>

        <Pressable onPress={() => setView('copas-passadas')}>
          <View style={styles.menuCard}>
            <Text style={styles.menuCardTitle}>Copas passadas</Text>
            <Text style={styles.menuCardText}>
              Informações históricas e acesso aos PDFs dos álbuns.
            </Text>
            <Text style={styles.menuCardAction}>Abrir seção →</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
