import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlbumViewerScreen } from '../AlbumViewerScreen';
import { PAST_COPA_ALBUMS, type CopaAlbum } from '../../data/pastAlbums';
import { styles } from './HistoricoScreen.styles';

interface HistoricoScreenProps {
  onBack?: () => void;
}

const mainAlbums = PAST_COPA_ALBUMS.filter((a) => !a.isBonus).sort((a, b) => b.year - a.year);
const bonusAlbums = PAST_COPA_ALBUMS.filter((a) => a.isBonus).sort((a, b) => b.year - a.year);

export function HistoricoScreen({ onBack }: HistoricoScreenProps = {}) {
  const [selectedAlbum, setSelectedAlbum] = useState<CopaAlbum | null>(null);

  if (selectedAlbum) {
    return (
      <AlbumViewerScreen
        album={selectedAlbum}
        onBack={() => setSelectedAlbum(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {onBack ? (
          <Pressable onPress={onBack}>
            <Text style={styles.backButton}>← Voltar ao Menu</Text>
          </Pressable>
        ) : null}
        <View style={styles.header}>
          <Text style={styles.title}>Álbuns Históricos</Text>
          <Text style={styles.subtitle}>
            {`${PAST_COPA_ALBUMS.length} álbuns com visualização de páginas extraídas.`}
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Copas do Mundo</Text>
        {mainAlbums.map((album) => (
          <AlbumCard
            key={`${album.year}-${album.pdfFile}`}
            album={album}
            onPress={() => {
              setSelectedAlbum(album);
            }}
          />
        ))}

        <Text style={styles.sectionLabel}>Edições Especiais</Text>
        {bonusAlbums.map((album) => (
          <AlbumCard
            key={`${album.year}-${album.pdfFile}`}
            album={album}
            onPress={() => {
              setSelectedAlbum(album);
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

interface AlbumCardProps {
  album: CopaAlbum;
  onPress: () => void;
}

function AlbumCard({ album, onPress }: AlbumCardProps) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.albumCard}>
        {album.isBonus && (
          <View style={styles.bonusBadge}>
            <Text style={styles.bonusBadgeText}>ESPECIAL</Text>
          </View>
        )}
        <View
          style={[
            styles.albumCardInner,
            { backgroundColor: album.themeColor },
          ]}
        >
          <Text style={styles.albumYear}>{album.year}</Text>
          <Text style={styles.albumLabel}>{album.label}</Text>

          <View style={styles.albumMeta}>
            {album.champion !== '—' && (
              <View style={styles.albumChampion}>
                <Text style={styles.albumChampionText}>🏆 {album.champion}</Text>
              </View>
            )}
            <View style={styles.albumHost}>
              <Text style={styles.albumHostText}>📍 {album.hostCountry}</Text>
            </View>
          </View>

          <Text style={styles.albumDescription}>{album.description}</Text>

          <View style={styles.albumFooter}>
            <Text style={styles.albumPageCount}>
              {`${album.totalPages} páginas`}
            </Text>
            <View style={styles.albumButton}>
              <Text style={styles.albumButtonText}>Visualizar →</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

