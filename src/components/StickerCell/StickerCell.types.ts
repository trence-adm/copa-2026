export interface StickerCellProps {
  number: number;
  quantity: number;
  onPress: () => void;
  onLongPress?: () => void;
  longPressDelay?: number;
}