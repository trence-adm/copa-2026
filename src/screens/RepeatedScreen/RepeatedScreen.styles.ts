import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#effbf4',
  },
  topBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#1f6f4a',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#ebfff1',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  orderButton: {
    backgroundColor: '#b7efc5',
    borderRadius: 999,
    minWidth: 64,
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  orderText: {
    color: '#133d28',
    fontSize: 12,
    fontWeight: '800',
  },
  infoText: {
    marginTop: 8,
    color: '#a8e8c0',
    fontSize: 11,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  emptyState: {
    borderWidth: 1,
    borderColor: '#8ed2a8',
    backgroundColor: '#dcf6e6',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#1f6f4a',
    fontSize: 18,
    fontWeight: '900',
  },
  emptyText: {
    marginTop: 4,
    color: '#255f42',
    fontWeight: '600',
  },
});
