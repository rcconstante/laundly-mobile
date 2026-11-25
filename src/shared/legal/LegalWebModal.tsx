import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { HugeiconsIcon } from '@hugeicons/react-native';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';
import { colors } from '../../theme';

export type LegalModalTarget = {
  title: string;
  url: string;
};

type LegalWebModalProps = {
  target: LegalModalTarget | null;
  onClose: () => void;
};

export function LegalWebModal({ target, onClose }: LegalWebModalProps) {
  const insets = useSafeAreaInsets();
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const hasError = Boolean(target && failedUrl === target.url);

  const handleClose = () => {
    setFailedUrl(null);
    onClose();
  };

  return (
    <Modal
      visible={Boolean(target)}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.canvas, paddingBottom: Platform.OS === 'android' ? insets.bottom : 0 },
        ]}
        edges={['top', 'bottom']}
      >
        <View
          style={[
            styles.header,
            { backgroundColor: colors.white, borderBottomColor: colors.line },
          ]}
        >
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.ink }]} numberOfLines={1}>
              {target?.title ?? ''}
            </Text>
            <Text style={[styles.url, { color: colors.muted }]} numberOfLines={1}>
              {target?.url ?? ''}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close popup"
            onPress={handleClose}
            style={({ pressed }) => [
              styles.closeButton,
              { backgroundColor: colors.paleBlue },
              pressed && styles.pressed,
            ]}
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={20}
              color={colors.ink}
              strokeWidth={2}
            />
          </Pressable>
        </View>

        {target ? (
          hasError ? (
            <View style={styles.errorState}>
              <Text style={[styles.errorTitle, { color: colors.ink }]}>
                Unable to load page
              </Text>
              <Text style={[styles.errorBody, { color: colors.muted }]}>
                Make sure you have an internet connection and that {target.url} is live.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setFailedUrl(null);
                  setReloadKey((k) => k + 1);
                }}
                style={({ pressed }) => [
                  styles.retryButton,
                  { backgroundColor: colors.blue },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.retryLabel}>Try Again</Text>
              </Pressable>
            </View>
          ) : Platform.OS === 'web' ? (
            <View style={styles.webFrameWrap}>
              <iframe
                title={target.title}
                src={target.url}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </View>
          ) : (
            <WebView
              key={`${target.url}-${reloadKey}`}
              source={{ uri: target.url }}
              style={styles.webview}
              startInLoadingState
              onError={() => setFailedUrl(target.url)}
              onHttpError={(event) => {
                if (event.nativeEvent.statusCode >= 400) {
                  setFailedUrl(target.url);
                }
              }}
              renderLoading={() => (
                <View style={[styles.loadingOverlay, { backgroundColor: colors.canvas }]}>
                  <ActivityIndicator size="large" color={colors.blue} />
                  <Text style={[styles.loadingText, { color: colors.muted }]}>
                    Loading {target.title}…
                  </Text>
                </View>
              )}
            />
          )
        ) : null}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  url: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '400',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
  webview: {
    flex: 1,
  },
  webFrameWrap: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  errorBody: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
