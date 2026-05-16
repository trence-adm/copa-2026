import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f9fc',
  },
  content: {
    padding: 14,
    gap: 10,
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#114b5f',
  },
  subtitle: {
    fontSize: 13,
    color: '#4e6974',
    marginBottom: 4,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: '#cbdce3',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
  },
  filterChipActive: {
    backgroundColor: '#114b5f',
    borderColor: '#114b5f',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#325260',
  },
  filterTextActive: {
    color: '#ecf6fa',
  },
  sectionTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '900',
    color: '#0b4b60',
  },
  sectionToday: {
    color: '#b7410e',
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d6e3e8',
    borderRadius: 12,
    padding: 10,
    gap: 6,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchScore: {
    fontSize: 18,
    fontWeight: '900',
    minWidth: 20,
    textAlign: 'right',
  },
  teams: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1d3640',
  },
  crest: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  meta: {
    fontSize: 12,
    color: '#4f6771',
    fontWeight: '600',
  },
  live: {
    color: '#b7410e',
    fontWeight: '900',
  },
  empty: {
    marginTop: 20,
    textAlign: 'center',
    color: '#526c75',
    fontWeight: '700',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f9fc',
  },
});