import { Team } from '../../types';

export interface TeamSectionProps {
  team: Team;
  numbers: number[];
  expanded: boolean;
  ownedCount: number;
  totalPerTeam: number;
  onToggleExpanded: () => void;
  onPressSticker: (number: number) => void;
  onLongPressSticker?: (number: number) => void;
  stickerLongPressDelay?: number;
  getQuantity: (number: number) => number;
}
