import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f8fa',
  },
  topBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#114b5f',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#e7f4f8',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  orderButton: {
    backgroundColor: '#ffb703',
    borderRadius: 999,
    minWidth: 64,
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  orderText: {
    color: '#2f2000',
    fontSize: 12,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 14,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f8fa',
  },
  loadingText: {
    marginTop: 10,
    color: '#114b5f',
    fontWeight: '700',
  },
});
