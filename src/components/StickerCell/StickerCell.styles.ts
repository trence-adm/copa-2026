import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cell: {
    width: '16.4%',
    margin: 6,
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cellMissing: {
    borderColor: '#b3c4cc',
    backgroundColor: '#edf4f7',
  },
  cellOwned: {
    borderColor: '#114b5f',
    backgroundColor: '#3ab795',
  },
  cellPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  number: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2a3b44',
  },
  numberOwned: {
    color: '#04242f',
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -6,
    minWidth: 26,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: '#ff7f11',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b3570d',
  },
  badgeText: {
    color: '#211003',
    fontSize: 11,
    fontWeight: '800',
  },
});