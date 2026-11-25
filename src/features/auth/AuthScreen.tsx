import ArrowLeft01Icon from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import { type ComponentRef, useRef } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandLogo } from '../../shared/brand/BrandLogo';
import { TermsLink } from '../../shared/legal/TermsLink';
import { colors } from '../../theme';
import { isRole, workspaceHref } from '../workspace/roles';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

export function AuthScreen({ mode }: { mode: 'login' | 'signup' }) {
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const role = roleParam && isRole(roleParam) ? roleParam : 'client';
  const insets = useSafeAreaInsets();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const signingUp = mode === 'signup';
  const Form = signingUp ? SignUpForm : LoginForm;

  return (
    <View style={styles.root}>
      <LinearGradient pointerEvents="none" colors={['#ABC6FA', '#E6EEFD', '#F2F7FF']} locations={[0, 0.55, 1]}
        style={styles.backdrop} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView ref={scroll} keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.scroll, signingUp && styles.signUpScroll,
              { paddingBottom: Math.max(insets.bottom, signingUp ? 20 : 24) + 12 }]}>
            <View style={styles.topRow}>
              <Pressable accessibilityRole="button" accessibilityLabel="Go back" hitSlop={4}
                onPress={() => router.dismissTo('/')} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
                <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={colors.ink} strokeWidth={2} />
              </Pressable>
            </View>
            <View style={[styles.logoWrap, signingUp && styles.signUpLogoWrap]}>
              <View style={styles.logoBadge}><BrandLogo markSize={signingUp ? 52 : 56} /></View>
            </View>

            <Form onContinue={() => router.replace(workspaceHref(role))}
              scrollTo={(y) => scroll.current?.scrollTo({ y, animated: true })} />

            <View style={styles.footer}>
              <View style={styles.switchRow}>
                <Text style={styles.footerText}>
                  {signingUp ? 'Already have an account?' : 'Don’t have an account?'}
                </Text>
                <Pressable accessibilityRole="button" hitSlop={8} onPress={() => {
                  router.replace({ pathname: signingUp ? '/login' : '/signup', params: { role } });
                }}>
                  <Text style={styles.footerLink}>{signingUp ? 'Log in' : 'Sign up'}</Text>
                </Pressable>
              </View>
              {signingUp ? null : <TermsLink />}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, height: 260 },
  safeArea: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 26, paddingTop: 32, width: '100%', maxWidth: 520, alignSelf: 'center' },
  signUpScroll: { paddingHorizontal: 24, paddingTop: 24 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFFC7',
    alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.82 },
  logoWrap: { alignItems: 'center', marginTop: 28, marginBottom: 36 },
  signUpLogoWrap: { marginTop: 20, marginBottom: 28 },
  logoBadge: { borderRadius: 17, boxShadow: '0px 6px 12px rgba(16, 72, 230, 0.22)' },
  footer: { marginTop: 'auto', paddingTop: 32, alignItems: 'center', gap: 12 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 4 },
  footerText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: colors.muted },
  footerLink: { fontSize: 13, fontFamily: 'Inter_700Bold', color: colors.blue },
});
