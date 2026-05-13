import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { StickerCell } from '../StickerCell';
import { styles } from './TeamSection.styles';
import { TeamSectionProps } from './TeamSection.types';

function TeamSectionComponent({
  team,
  numbers,
  expanded,
  ownedCount,
  totalPerTeam,
  onToggleExpanded,
  onPressSticker,
  onLongPressSticker,
  getQuantity,
}: TeamSectionProps) {
  return (
    <View style={styles.sectionWrap}>
      <Pressable onPress={onToggleExpanded} style={styles.header}>
        <View>
          <Text style={styles.teamName}>{team.code} - {team.name}</Text>
          <Text style={styles.subtitle}>
            {ownedCount}/{totalPerTeam} obtidas
          </Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-down-circle' : 'chevron-forward-circle'}
          size={24}
          color="#1f4f63"
        />
      </Pressable>

      {expanded ? (
        <View style={styles.grid}>
          {numbers.map((number) => (
            <StickerCell
              key={`${team.id}-${number}`}
              number={number}
              quantity={getQuantity(number)}
              onPress={() => onPressSticker(number)}
              onLongPress={() => onLongPressSticker(number)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export const TeamSection = memo(TeamSectionComponent);
