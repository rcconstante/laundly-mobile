import ArrowLeft01Icon from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { type ComponentRef, useRef } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandLogo } from '../../shared/brand/BrandLogo';
import { LegalLinks } from '../../shared/legal/LegalLinks';
import { colors } from '../../theme';
import { isRole, workspaceHref } from '../workspace/roles';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

const authOptions = [
  { mode: 'login', label: 'Log in', pathname: '/login' },
  { mode: 'signup', label: 'Sign up', pathname: '/signup' },
] as const;

export function AuthScreen({ mode }: { mode: 'login' | 'signup' }) {
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const role = roleParam && isRole(roleParam) ? roleParam : 'client';
  const insets = useSafeAreaInsets();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const Form = mode === 'signup' ? SignUpForm : LoginForm;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scroll} keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 16) + 12 }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.dismissTo('/')}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={colors.ink} strokeWidth={2} />
          </Pressable>

          <View style={styles.hero}>
            <BrandLogo markSize={64} />
            <Text accessibilityRole="header" style={styles.title}>Get started now</Text>
            <Text style={styles.subtitle}>Create an account or log in to Laundly.</Text>
          </View>

          <View accessibilityRole="tablist" accessibilityLabel="Account access" style={styles.switcher}>
            {authOptions.map((option) => {
              const selected = option.mode === mode;
              return (
                <Pressable key={option.mode} accessibilityRole="tab" aria-selected={selected}
                  onPress={() => { if (!selected) router.replace({ pathname: option.pathname, params: { role } }); }}
                  style={[styles.option, selected && styles.selectedOption]}>
                  <Text style={[styles.optionLabel, selected && styles.selectedLabel]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Form onContinue={() => router.replace(workspaceHref(role))}
            scrollTo={(y) => scroll.current?.scrollTo({ y, animated: true })} />

          <View style={styles.footer}><LegalLinks /></View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 12, width: '100%', maxWidth: 480, alignSelf: 'center' },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.canvas,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  pressed: { opacity: 0.75 },
  hero: { alignItems: 'center', gap: 10, marginTop: 10, marginBottom: 24 },
  title: { color: colors.ink, fontFamily: 'Inter_700Bold', fontSize: 30, lineHeight: 37,
    letterSpacing: -1.1, textAlign: 'center', marginTop: 4 },
  subtitle: { color: colors.muted, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, textAlign: 'center' },
  switcher: { flexDirection: 'row', backgroundColor: '#EFF3F9', padding: 4, borderRadius: 13, gap: 4, marginBottom: 22 },
  option: { alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 44, borderRadius: 10 },
  selectedOption: { backgroundColor: colors.white, boxShadow: '0px 1px 4px rgba(8, 24, 67, 0.10)' },
  optionLabel: { color: colors.muted, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  selectedLabel: { color: colors.ink },
  footer: { paddingTop: 24, marginTop: 'auto' },
});
