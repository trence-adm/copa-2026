import { useMemo, useState } from 'react';
import { ScrollView, Text, View, Pressable, Image, Modal } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCollection } from '../../context/CollectionContext';
import { STICKERS_PER_TEAM, COCA_COLA_STICKERS, getStickerImageSource, getStickersByTeam } from '../../data/teams';
import { styles } from './StatusScreen.styles';
import { TeamProgressEntry } from './StatusScreen.types';

type SelectedSticker = {
  imageSource: ImageSourcePropType;
  title: string;
  subtitle: string;
};

export function StatusScreen() {
  const { teams, getOverallStats, getTeamStats, getQuantity } = useCollection();
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [showCocaCola, setShowCocaCola] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<SelectedSticker | null>(null);

  const overall = getOverallStats();

  const perTeam = useMemo<TeamProgressEntry[]>(
    () =>
      [...teams]
        .map((team) => ({ team, stats: getTeamStats(team.id) }))
        .sort((a, b) => a.team.albumOrder - b.team.albumOrder),
    [teams, getTeamStats],
  );

  const toggleTeamExpand = (teamId: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  const toggleCocaCola = () => {
    setShowCocaCola(!showCocaCola);
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Status da coleção</Text>

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
          <Text style={styles.bigCardLabel}>Total de figurinhas físicas</Text>
          <Text style={styles.bigCardValue}>{overall.totalCards}</Text>
        </View>

        <Text style={styles.sectionTitle}>Progresso por país</Text>

        {perTeam.map(({ team, stats }) => {
          const completion = Math.round((stats.uniqueOwned / STICKERS_PER_TEAM) * 100);
          const isExpanded = expandedTeams.has(team.id);
          const teamStickers = getStickersByTeam(team.code);

          return (
            <View key={`${team.id}-status`}>
              <Pressable onPress={() => toggleTeamExpand(team.id)}>
                <View style={styles.teamCard}>
                  <View style={styles.teamHeader}>
                    <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
                    <View style={styles.teamRowExpand}>
                      <Text style={styles.teamName}>{team.name}</Text>
                      <Text style={styles.teamNumbers}>
                        {stats.uniqueOwned}/{STICKERS_PER_TEAM}
                      </Text>
                    </View>
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
              </Pressable>

              {isExpanded && (
                <View style={styles.stickerGrid}>
                  {teamStickers.map((sticker) => {
                    const qty = getQuantity(team.id, sticker.number);
                    const isOwned = qty > 0;
                    const imageSource = getStickerImageSource(team.code, sticker.number, sticker.name);
                    const colorImageSource = getStickerImageSource(team.code, sticker.number, sticker.name);
                    return (
                      <Pressable
                        key={`${team.code}-${sticker.number}`}
                        style={styles.stickerItem}
                        onPress={() =>
                          setSelectedSticker({
                            imageSource: colorImageSource,
                            title: `${team.name} #${sticker.number}`,
                            subtitle: sticker.name ?? 'Figurinha',
                          })
                        }
                      >
                        <View
                          style={[
                            styles.stickerCard,
                            sticker.type === 'special' ? styles.stickerSpecial : undefined,
                            isOwned ? styles.stickerOwned : styles.stickerMissing,
                          ]}
                        >
                          <Image
                            source={imageSource}
                            style={[styles.stickerImage, !isOwned && styles.stickerImageMissing]}
                            resizeMode="cover"
                          />
                          <View style={styles.stickerFooter}>
                            <Text style={[styles.stickerNumber, !isOwned && styles.stickerNumberMissing]}>
                              #{sticker.number}
                            </Text>
                            {sticker.name ? (
                              <Text style={styles.stickerName} numberOfLines={1}>
                                {sticker.name}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>Coca-Cola Especiais</Text>

        <Pressable onPress={toggleCocaCola}>
          <View style={styles.cocaColaHeader}>
            <Text style={styles.expandIcon}>{showCocaCola ? '▼' : '▶'}</Text>
            <Text style={styles.cocaColaTitle}>Figurinhas Coca-Cola</Text>
            <Text style={styles.cocaColaCount}>{COCA_COLA_STICKERS.length} figurinhas</Text>
          </View>
        </Pressable>

        {showCocaCola && (
          <View style={styles.cocaColaGrid}>
            {COCA_COLA_STICKERS.map((sticker) => {
              const rarityColors: Record<string, string> = {
                common: '#e0e0e0',
                uncommon: '#4caf50',
                rare: '#2196f3',
                ultra_rare: '#ffc107',
              };

              return (
                <View key={sticker.id} style={styles.cocaColaItem}>
                  <View style={[
                    styles.cocaColaCard,
                    { borderColor: rarityColors[sticker.rarity], borderWidth: 2 },
                  ]}>
                    <Text style={styles.cocaColaName} numberOfLines={2}>
                      {sticker.name}
                    </Text>
                    <Text style={[styles.rarityBadge, { backgroundColor: rarityColors[sticker.rarity] }]}>
                      {sticker.rarity.toUpperCase()}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <Modal
          visible={selectedSticker !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedSticker(null)}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setSelectedSticker(null)}>
            <View style={styles.modalCard}>
              {selectedSticker ? (
                <>
                  <Image
                    source={selectedSticker.imageSource}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.modalTitle}>{selectedSticker.title}</Text>
                  <Text style={styles.modalSubtitle}>{selectedSticker.subtitle}</Text>
                </>
              ) : null}
            </View>
          </Pressable>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
