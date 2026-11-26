import ArrowLeft01Icon from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LegalPageContent, type LegalModalTarget } from '../../shared/legal/LegalWebModal';
import { colors } from '../../theme';

export function ProfileSheet({ title, legalPage, onClose, children }: {
  title: string;
  legalPage: LegalModalTarget | null;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Modal animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel={legalPage ? 'Back to About' : 'Back to Profile'}
            style={styles.back} onPress={onClose}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={2} color={colors.ink} />
          </Pressable>
          <Text accessibilityRole="header" style={styles.title}>{legalPage?.title ?? title}</Text>
          <View style={styles.spacer} />
        </View>
        {legalPage ? <LegalPageContent key={legalPage.url} target={legalPage} /> : (
          <KeyboardAvoidingView style={styles.body} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
              {children}
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  body: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: colors.white },
  back: { width: 44, height: 44, borderRadius: 22, alignItems: 'center',
    justifyContent: 'center', backgroundColor: colors.canvas },
  title: { flex: 1, textAlign: 'center', fontFamily: 'Inter_700Bold', fontSize: 17, color: colors.ink },
  spacer: { width: 44 },
  content: { width: '100%', maxWidth: 560, alignSelf: 'center', padding: 18, gap: 14 },
});
