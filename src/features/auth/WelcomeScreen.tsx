import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandLogo } from '../../shared/brand/BrandLogo';
import { colors } from '../../theme';
import { roleOptions, roles, workspaceHref, type Role } from '../workspace/roles';

const background = require('../../../assets/brand/onboarding-background.webp');

export function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<Role>('client');

  return (
    <View style={styles.container}>
      <Image source={background} style={StyleSheet.absoluteFill} contentFit="fill" accessible={false} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) + 14 }]}>
          <View style={styles.brand}>
            <BrandLogo markSize={128} />
            <Text accessibilityRole="header" style={styles.title}>Laundly</Text>
            <Text style={styles.tagline}>Smart laundry operations, beautifully synced.</Text>
          </View>

          <View style={styles.actions}>
            <Text style={styles.roleLabel}>Preview as</Text>
            <View accessibilityRole="radiogroup" style={styles.roles}>
              {roleOptions.map((choice) => (
                <Pressable key={choice} accessibilityRole="radio" aria-checked={role === choice}
                  onPress={() => setRole(choice)} style={[styles.role, role === choice && styles.selectedRole]}>
                  <Text style={[styles.roleText, role === choice && styles.selectedText]}>{roles[choice].label}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/login', params: { role } })}
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
              <Text style={styles.buttonLabel}>Log in</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/signup', params: { role } })}
              style={({ pressed }) => [styles.button, styles.outlineButton, pressed && styles.pressed]}>
              <Text style={[styles.buttonLabel, styles.whiteText]}>Sign up</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => router.push(workspaceHref(role))} style={styles.preview}>
              <Text style={styles.roleText}>Explore the demo</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.blue },
  safeArea: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 32, alignSelf: 'center', width: '100%', maxWidth: 520 },
  brand: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 32, paddingBottom: 52 },
  title: { color: colors.white, fontSize: 60, fontFamily: 'Inter_700Bold', letterSpacing: -1.5, textAlign: 'center' },
  tagline: { marginTop: 4, color: colors.paleBlue, fontSize: 21, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  actions: { gap: 10 },
  roles: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  role: { flex: 1, minHeight: 44, borderRadius: 22, borderColor: colors.white, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center' },
  selectedRole: { backgroundColor: colors.white },
  roleLabel: { color: colors.white, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  roleText: { color: colors.white, fontFamily: 'Inter_600SemiBold', fontSize: 13, textAlign: 'center' },
  selectedText: { color: colors.deepBlue },
  button: { width: '100%', minHeight: 58, borderRadius: 30, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: colors.white },
  outlineButton: { backgroundColor: colors.deepBlue },
  buttonLabel: { color: colors.ink, fontSize: 17, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  whiteText: { color: colors.white },
  preview: { justifyContent: 'center', minHeight: 44 },
  pressed: { opacity: 0.8 },
});
