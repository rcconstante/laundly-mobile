import { useState } from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { HugeiconsIcon } from '@hugeicons/react-native';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';
import { colors } from '../../theme';

export type LegalModalTarget = { title: string; url: string };

function LegalPageContent({ target }: { target: LegalModalTarget }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <View style={styles.errorState}>
        <Text style={styles.errorTitle}>Unable to load page</Text>
        <Text style={styles.errorBody}>Check your connection and try again.</Text>
        <Pressable accessibilityRole="button" onPress={() => setFailed(false)} style={styles.retry}>
          <Text style={styles.retryLabel}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.body}>
        <iframe title={target.title} src={target.url} style={{ width: '100%', height: '100%', border: 'none' }} />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: target.url }}
      style={styles.body}
      startInLoadingState
      onError={() => setFailed(true)}
      onHttpError={(event) => { if (event.nativeEvent.statusCode >= 400) setFailed(true); }}
      renderLoading={() => (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.blue} />
          <Text style={styles.url}>Loading {target.title}…</Text>
        </View>
      )}
    />
  );
}

export function LegalWebModal({ target, onClose }: { target: LegalModalTarget | null; onClose: () => void }) {
  if (!target) return null;

  return (
    <Modal animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={1}>{target.title}</Text>
            <Text style={styles.url} numberOfLines={1}>{target.url}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Close popup" onPress={onClose} style={styles.close}>
            <HugeiconsIcon icon={Cancel01Icon} size={20} color={colors.ink} strokeWidth={2} />
          </Pressable>
        </View>
        <LegalPageContent key={target.url} target={target} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 10, gap: 12,
    borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: colors.white },
  headerText: { flex: 1 },
  title: { color: colors.ink, fontSize: 16, fontFamily: 'Inter_700Bold' },
  url: { color: colors.muted, marginTop: 2, fontSize: 12, fontFamily: 'Inter_400Regular' },
  close: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paleBlue },
  body: { flex: 1 },
  loading: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.canvas },
  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 },
  errorTitle: { color: colors.ink, fontSize: 18, fontFamily: 'Inter_700Bold' },
  errorBody: { color: colors.muted, fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  retry: { backgroundColor: colors.blue, minHeight: 44, justifyContent: 'center', borderRadius: 22, paddingHorizontal: 24 },
  retryLabel: { color: colors.white, fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
