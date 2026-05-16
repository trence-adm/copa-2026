import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 20,
    marginTop: -1,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 1,
  },
  headerPageCount: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  grid: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  gridItem: {
    width: '48.5%',
  },
  pageCard: {
    aspectRatio: 0.77,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  pageImage: {
    width: '100%',
    height: '85%',
    backgroundColor: '#1a1a1a',
  },
  pageFooter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  pageNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  // Modal
  modal: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 48,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalImage: {
    width: '96%',
    aspectRatio: 0.77,
    borderRadius: 6,
  },
  modalPageLabel: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '600',
  },
});
