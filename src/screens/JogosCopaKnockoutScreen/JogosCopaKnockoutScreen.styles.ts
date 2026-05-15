import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f9fc',
  },
  content: {
    padding: 14,
    gap: 12,
    paddingBottom: 20,
  },
  title: {
    fontSize: 21,
    fontWeight: '900',
    color: '#114b5f',
  },
  subtitle: {
    fontSize: 13,
    color: '#4e6974',
  },
  roundCard: {
    borderWidth: 1,
    borderColor: '#d6e3e8',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  roundName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0b4b60',
  },
  matchCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6eef2',
    backgroundColor: '#f8fbfd',
    padding: 9,
  },
  teams: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1d3640',
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: '#4f6771',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f9fc',
  },
});