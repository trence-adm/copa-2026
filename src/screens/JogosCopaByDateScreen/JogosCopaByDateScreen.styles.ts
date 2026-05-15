import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f9fc',
  },
  content: {
    padding: 14,
    gap: 10,
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
    marginBottom: 2,
  },
  dayTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '900',
    color: '#0b4b60',
  },
  todayTitle: {
    color: '#b7410e',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d6e3e8',
    borderRadius: 12,
    padding: 10,
    gap: 6,
  },
  teams: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1d3640',
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
    marginTop: 24,
    color: '#4f6771',
    textAlign: 'center',
    fontWeight: '700',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f9fc',
  },
});