import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from './StickerCell.styles';
import { StickerCellProps } from './StickerCell.types';

function StickerCellComponent({
  number,
  quantity,
  onPress,
  onLongPress,
  longPressDelay = 200,
}: StickerCellProps) {
  const hasSticker = quantity > 0;
  const duplicates = quantity > 1 ? quantity - 1 : 0;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cell,
        hasSticker ? styles.cellOwned : styles.cellMissing,
        pressed ? styles.cellPressed : null,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={longPressDelay}
    >
      <Text style={[styles.number, hasSticker ? styles.numberOwned : null]}>
        {number}
      </Text>
      {duplicates > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>+{duplicates}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export const StickerCell = memo(StickerCellComponent);
