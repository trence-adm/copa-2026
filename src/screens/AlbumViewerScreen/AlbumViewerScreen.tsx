import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ALBUM_PAGE_CATALOG } from '../../data/pastAlbumsCatalog';
import type { CopaAlbum } from '../../data/pastAlbums';
import { styles } from './AlbumViewerScreen.styles';

interface AlbumViewerScreenProps {
  album: CopaAlbum;
  onBack: () => void;
}

export function AlbumViewerScreen({ album, onBack }: AlbumViewerScreenProps) {
  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  // Collect pages from catalog
  const albumKey = catalog_key(album);
  const pages: number[] = [];
  for (let i = 0; i < album.totalPages; i++) {
    if (ALBUM_PAGE_CATALOG[`${albumKey}-${i}`]) {
      pages.push(i);
    }
  }

  const hasPages = pages.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>{'‹'}</Text>
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{album.label}</Text>
          <Text style={styles.headerSubtitle}>
            {album.champion !== '—' ? `🏆 ${album.champion}` : album.hostCountry}
          </Text>
        </View>
        {hasPages ? (
          <Text style={styles.headerPageCount}>{pages.length} pág.</Text>
        ) : null}
      </View>

      {hasPages ? (
        <ScrollView contentContainerStyle={styles.grid}>
          {pages.map((pageIndex) => {
            const source = ALBUM_PAGE_CATALOG[`${albumKey}-${pageIndex}`];
            return (
              <Pressable
                key={pageIndex}
                style={styles.gridItem}
                onPress={() => setSelectedPage(pageIndex)}
              >
                <View style={styles.pageCard}>
                  <Image
                    source={source}
                    style={styles.pageImage}
                    resizeMode="cover"
                  />
                  <View style={styles.pageFooter}>
                    <Text style={styles.pageNumber}>pág. {pageIndex + 1}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Páginas não extraídas ainda</Text>
          <Text style={styles.emptyText}>
            {'Execute para gerar as imagens:\n\nnpm run extract:albums'}
          </Text>
        </View>
      )}

      {/* Fullscreen modal */}
      <Modal
        visible={selectedPage !== null}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setSelectedPage(null)}
      >
        <View style={styles.modal}>
          <Pressable style={styles.modalClose} onPress={() => setSelectedPage(null)}>
            <Text style={styles.modalCloseText}>✕</Text>
          </Pressable>
          {selectedPage !== null ? (
            <>
              <Image
                source={ALBUM_PAGE_CATALOG[`${albumKey}-${selectedPage}`]}
                style={styles.modalImage}
                resizeMode="contain"
              />
              <Text style={styles.modalPageLabel}>
                {album.label} — pág. {selectedPage + 1}
              </Text>
            </>
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/**
 * Derives the catalog key for a given album (must match pdfFileToKey in extract-albums.mjs).
 */
function catalog_key(album: CopaAlbum): string {
  const name = album.pdfFile.toLowerCase().replace(/\.pdf$/, '');
  if (name.includes('road to rusia') || name.includes('road to russia')) {
    return '2018-road-to-russia';
  }
  if (name.includes('ping') || name.includes('pong')) {
    return '1982-ping-pong';
  }
  return String(album.year);
}
