import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fffef9',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2f2a24',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricCard: {
    width: '48.5%',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
  },
  metricBlue: {
    backgroundColor: '#d6ecff',
    borderColor: '#8abfe8',
  },
  metricGreen: {
    backgroundColor: '#d9f7e8',
    borderColor: '#8ac8a9',
  },
  metricOrange: {
    backgroundColor: '#ffe5c2',
    borderColor: '#f0ba74',
  },
  metricCoral: {
    backgroundColor: '#ffd7d0',
    borderColor: '#e7a59a',
  },
  metricLabel: {
    fontSize: 12,
    color: '#3d3128',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricValue: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: '900',
    color: '#1f1712',
  },
  bigCard: {
    marginTop: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cabca6',
    backgroundColor: '#f5eedf',
    padding: 14,
  },
  bigCardLabel: {
    color: '#584632',
    fontWeight: '800',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  bigCardValue: {
    marginTop: 6,
    color: '#281f16',
    fontWeight: '900',
    fontSize: 34,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    color: '#2f2a24',
    fontSize: 19,
    fontWeight: '900',
  },
  teamCard: {
    borderWidth: 1,
    borderColor: '#e2d4bf',
    borderRadius: 12,
    backgroundColor: '#fff7ea',
    padding: 12,
    marginBottom: 10,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3a2e22',
  },
  teamNumbers: {
    fontSize: 14,
    color: '#5d4b3a',
    fontWeight: '700',
  },
  progressTrack: {
    marginTop: 8,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#ecdcc3',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#f18805',
  },
  teamMeta: {
    marginTop: 7,
    fontSize: 12,
    color: '#5d4b3a',
    fontWeight: '600',
  },
});
