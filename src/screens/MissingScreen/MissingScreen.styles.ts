import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fdf8ef',
  },
  topBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#5e3023',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff5ea',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  orderButton: {
    backgroundColor: '#ffd166',
    borderRadius: 999,
    minWidth: 64,
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  orderText: {
    color: '#42210b',
    fontSize: 12,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  emptyState: {
    borderWidth: 1,
    borderColor: '#efcc9e',
    backgroundColor: '#fff2df',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#6a3f10',
    fontSize: 18,
    fontWeight: '900',
  },
  emptyText: {
    marginTop: 4,
    color: '#6a3f10',
    fontWeight: '600',
  },
});
