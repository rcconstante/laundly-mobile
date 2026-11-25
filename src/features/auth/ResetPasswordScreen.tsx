import { router, useLocalSearchParams } from 'expo-router';
import { type ComponentRef, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from '../../shared/brand/BrandLogo';
import { colors } from '../../theme';
import { isRole } from '../workspace/roles';
import { styles as form } from './formStyles';
import { isStrongPassword, isValidEmail } from './validation';

const demoCode = '123456';

export function ResetPasswordScreen() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  const [step, setStep] = useState<'email' | 'code' | 'password' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const input = useRef<ComponentRef<typeof TextInput>>(null);

  function backToLogin() {
    router.dismissTo({ pathname: '/login', params: { role: role && isRole(role) ? role : 'client' } });
  }

  function next() {
    setError('');
    if (step === 'email') {
      if (!isValidEmail(email)) return setError('Enter a valid email address.');
      setStep('code');
    }
    if (step === 'code') {
      if (code !== demoCode) return setError('Enter the six-digit demo code.');
      setStep('password');
    }
    if (step === 'password') {
      if (!isStrongPassword(password)) return setError('Use at least eight characters, including a letter and a number.');
      setPassword('');
      setStep('done');
    }
    if (step === 'done') backToLogin();
  }

  const title = { email: 'Forgot password?', code: 'Enter verification code', password: 'Set a new password', done: 'Demo reset complete' }[step];
  const description = {
    email: 'Enter your email to try the password reset flow.',
    code: 'Use demo code 123456. This preview does not send email.',
    password: 'Choose a sample password to finish the preview.',
    done: 'You can now return to the login screen.',
  }[step];
  const action = { email: 'Get demo code', code: 'Verify code', password: 'Reset password', done: 'Back to log in' }[step];

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          {step !== 'done' && <Pressable accessibilityRole="button" onPress={backToLogin} style={styles.back}>
            <Text style={styles.link}>Back to log in</Text>
          </Pressable>}
          <View style={styles.hero}>
            <BrandLogo markSize={58} />
            <Text accessibilityRole="header" style={styles.title}>{title}</Text>
            <Text style={styles.copy}>{description}</Text>
          </View>
          {step === 'email' && <View style={form.fieldGroup}>
            <Text style={form.label}>Email address</Text>
            <View style={form.inputBox}><TextInput accessibilityLabel="Email address" value={email}
              onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email"
              style={form.input} onSubmitEditing={next} /></View>
          </View>}
          {step === 'code' && <View style={styles.codeField}>
            <View pointerEvents="none" importantForAccessibility="no-hide-descendants" style={styles.boxes}>
              {Array.from({ length: 6 }, (_, index) => (
                <View key={index} style={[styles.box, index === code.length && styles.boxActive]}>
                  <Text style={styles.digit}>{code[index]}</Text>
                </View>
              ))}
            </View>
            <TextInput ref={input} accessibilityLabel="Six-digit verification code" value={code}
              onChangeText={(value) => { setCode(value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
              keyboardType="number-pad" autoComplete="one-time-code" textContentType="oneTimeCode"
              caretHidden selectionColor="transparent" style={styles.codeInput} onSubmitEditing={next} />
          </View>}
          {step === 'password' && <View style={form.fieldGroup}>
            <Text style={form.label}>New password</Text>
            <View style={form.inputBox}><TextInput accessibilityLabel="New password" value={password}
              onChangeText={setPassword} autoComplete="new-password" secureTextEntry style={form.input}
              onSubmitEditing={next} /></View>
          </View>}
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <Pressable accessibilityRole="button" onPress={next} style={form.primaryButton}>
            <Text style={form.primaryLabel}>{action}</Text>
          </Pressable>
          {step === 'code' && <Pressable accessibilityRole="button" style={styles.back}
            onPress={() => { setCode(''); setError(''); input.current?.focus(); }}>
            <Text style={styles.link}>Clear code</Text>
          </Pressable>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  content: { width: '100%', maxWidth: 480, alignSelf: 'center', padding: 24, gap: 16 },
  back: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  link: { color: colors.blue, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  hero: { alignItems: 'center', gap: 12, marginBottom: 8 },
  title: { textAlign: 'center', fontSize: 26, color: colors.ink, fontFamily: 'Inter_700Bold' },
  copy: { textAlign: 'center', fontSize: 14, color: colors.muted, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  codeField: { position: 'relative' },
  boxes: { flexDirection: 'row', gap: 7 },
  box: { flex: 1, minHeight: 53, borderWidth: 1, borderColor: colors.line, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas },
  boxActive: { borderColor: colors.blue },
  digit: { color: colors.ink, fontSize: 21, fontFamily: 'Inter_700Bold' },
  codeInput: { ...StyleSheet.absoluteFill, color: 'transparent', backgroundColor: 'transparent' },
  error: { color: colors.danger, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
});
