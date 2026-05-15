import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f9fc',
  },
  content: {
    padding: 14,
    gap: 12,
  },
  title: {
    fontSize: 21,
    fontWeight: '900',
    color: '#114b5f',
  },
  subtitle: {
    fontSize: 13,
    color: '#4e6974',
    marginTop: -2,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d6e3e8',
    padding: 12,
    gap: 8,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0b4b60',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#edf3f6',
    paddingVertical: 6,
    gap: 8,
  },
  rowPos: {
    width: 18,
    fontSize: 12,
    color: '#62808a',
    fontWeight: '700',
  },
  rowTeam: {
    flex: 1,
    fontSize: 14,
    color: '#19323b',
    fontWeight: '700',
  },
  rowPoints: {
    width: 34,
    textAlign: 'right',
    fontSize: 14,
    color: '#114b5f',
    fontWeight: '900',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f9fc',
  },
});