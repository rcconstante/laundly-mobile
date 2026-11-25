import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { type ComponentRef, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from '../../shared/brand/BrandLogo';
import { TermsLink } from '../../shared/legal/TermsLink';
import { cardShadow, colors } from '../../theme';
import { roleOptions, roles, workspaceHref, type Role } from '../workspace/roles';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

export function WelcomeScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<Role>('client');
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const cardOffset = useRef(0);
  const signingUp = mode === 'signup';
  const Form = signingUp ? SignUpForm : LoginForm;

  function enterWorkspace() {
    router.push(workspaceHref(role));
  }

  const rolePicker = (
    <View style={styles.rolePicker}>
      <Text style={styles.label}>Preview as</Text>
      <View accessibilityRole="radiogroup" style={styles.roles}>
        {roleOptions.map((choice) => (
          <Pressable key={choice} accessibilityRole="radio" aria-checked={choice === role}
            onPress={() => setRole(choice)} style={[styles.role, choice === role && styles.roleActive]}>
            <Text style={[styles.switchLabel, choice === role && styles.activeLabel]}>{roles[choice].label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
          <LinearGradient colors={['#071739', '#133CBA', '#087C99']} style={styles.hero}>
            <View style={styles.halo} />
            <View style={styles.brandHeader}><BrandLogo mark /><Text style={styles.brandName}>Laundly</Text></View>
            <Text accessibilityRole="header" style={styles.heroTitle}>
              Smart laundry operations, <Text style={styles.heroAccent}>beautifully synced.</Text>
            </Text>
          </LinearGradient>

          <View style={styles.card} onLayout={(event) => { cardOffset.current = event.nativeEvent.layout.y; }}>
            <View accessibilityRole="tablist" style={styles.switcher}>
              {(['login', 'signup'] as const).map((choice) => (
                <Pressable key={choice} accessibilityRole="tab" aria-selected={choice === mode}
                  onPress={() => setMode(choice)} style={[styles.switchOption, choice === mode && styles.switchActive]}>
                  <Text style={[styles.switchLabel, choice === mode && styles.activeLabel]}>
                    {choice === 'login' ? 'Log in' : 'Sign up'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Form onContinue={enterWorkspace} rolePicker={rolePicker}
              scrollTo={(y) => scroll.current?.scrollTo({ y: y + cardOffset.current, animated: true })} />

            <Pressable accessibilityRole="button" onPress={enterWorkspace} style={styles.preview}>
              <Text style={styles.activeLabel}>Explore the demo</Text>
            </Pressable>
            <Text style={styles.legal}>Static preview. Use sample details or explore the demo.</Text>
            <TermsLink showAgreement={signingUp} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  scroll: { alignSelf: 'center', width: '100%', maxWidth: 520, padding: 18, paddingBottom: 24, gap: 15 },
  hero: { overflow: 'hidden', borderRadius: 30, padding: 22 },
  halo: { position: 'absolute', width: 250, height: 250, borderRadius: 125, borderWidth: 30,
    borderColor: '#FFFFFF15', right: -108, top: -75 },
  brandHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandName: { color: colors.white, fontSize: 23, fontWeight: '800', letterSpacing: -0.5 },
  heroTitle: { color: colors.white, fontSize: 32, fontWeight: '800', letterSpacing: -1.2, lineHeight: 36,
    marginTop: 14, maxWidth: 390 },
  heroAccent: { color: colors.teal },
  card: { gap: 14, backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 28,
    padding: 18, boxShadow: cardShadow },
  switcher: { flexDirection: 'row', borderRadius: 24, padding: 4, backgroundColor: colors.canvas },
  switchOption: { minHeight: 42, justifyContent: 'center', alignItems: 'center', flex: 1, borderRadius: 22 },
  switchActive: { backgroundColor: colors.white, boxShadow: '0px 1px 4px rgba(20, 43, 116, 0.12)' },
  switchLabel: { fontSize: 13, color: colors.muted, fontWeight: '700', textAlign: 'center' },
  activeLabel: { color: colors.blue, fontWeight: '800', textAlign: 'center' },
  rolePicker: { gap: 6 },
  label: { color: colors.ink, fontWeight: '700', fontSize: 13 },
  roles: { flexDirection: 'row', gap: 7 },
  role: { flex: 1, justifyContent: 'center', minHeight: 44, borderWidth: 1, borderColor: colors.line, borderRadius: 22 },
  roleActive: { backgroundColor: colors.paleBlue, borderColor: '#B9CCFF' },
  preview: { minHeight: 44, justifyContent: 'center', marginVertical: -5 },
  legal: { textAlign: 'center', fontSize: 12, lineHeight: 18, color: colors.muted },
});
