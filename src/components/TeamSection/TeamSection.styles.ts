import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  sectionWrap: {
    borderWidth: 1,
    borderColor: '#bfd0d8',
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#f9fcfd',
    overflow: 'hidden',
  },
  header: {
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#d9ebf1',
  },
  teamName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f2d3a',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    color: '#2f4e5c',
    marginTop: 2,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 2,
  },
});
