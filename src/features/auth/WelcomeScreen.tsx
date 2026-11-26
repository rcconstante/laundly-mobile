import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from '../../shared/brand/BrandLogo';
import { brandName } from '../../shared/brand/brand';
import { colors } from '../../theme';
import { roleOptions, roles, workspaceHref, type Role } from '../workspace/roles';

export function WelcomeScreen() {
  const [role, setRole] = useState<Role>('client');

  return (
    <SafeAreaView style={styles.root}>
      <View pointerEvents="none" style={styles.blueCircle} />
      <View pointerEvents="none" style={styles.tealCircle} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View pointerEvents="none" style={styles.orbit} />
          <BrandLogo markSize={112} />
          <Text accessibilityRole="header" style={styles.title}>{brandName}</Text>
          <Text style={styles.tagline}>Smart laundry operations, beautifully synced.</Text>
        </View>
        <View style={styles.panel}>
          <Text style={styles.label}>Preview as</Text>
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
            <Text style={styles.buttonLabel}>Get started</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push(workspaceHref(role))} style={styles.preview}>
            <Text style={styles.previewLabel}>Explore the demo</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden', backgroundColor: '#F4F8FF' },
  blueCircle: { position: 'absolute', top: -125, right: -135, width: 380, height: 380,
    borderRadius: 190, backgroundColor: '#E1EBFF' },
  tealCircle: { position: 'absolute', bottom: -155, left: -140, width: 405, height: 405,
    borderRadius: 203, backgroundColor: '#DDF8F2' },
  content: { flexGrow: 1, width: '100%', maxWidth: 480, alignSelf: 'center', padding: 24 },
  hero: { flexGrow: 1, minHeight: 345, alignItems: 'center', justifyContent: 'center', gap: 14 },
  orbit: { position: 'absolute', top: '13%', width: 215, height: 215, borderRadius: 108,
    borderWidth: 1, borderColor: '#C9DAFC' },
  title: { color: colors.ink, fontFamily: 'Inter_700Bold', fontSize: 57, letterSpacing: -3 },
  tagline: { color: colors.muted, fontFamily: 'Inter_400Regular', fontSize: 17, lineHeight: 25,
    textAlign: 'center', maxWidth: 260 },
  panel: { gap: 10, padding: 16, backgroundColor: colors.white, borderRadius: 27,
    borderWidth: 1, borderColor: colors.line, boxShadow: '0px 12px 34px rgba(8, 24, 67, 0.08)' },
  label: { color: colors.muted, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  roles: { flexDirection: 'row', gap: 7, marginBottom: 3 },
  role: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: 22, minHeight: 44,
    alignItems: 'center', justifyContent: 'center' },
  selectedRole: { backgroundColor: colors.paleBlue, borderColor: '#B7CBFF' },
  roleText: { color: colors.muted, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  selectedText: { color: colors.blue },
  button: { minHeight: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue },
  buttonLabel: { color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 15 },
  preview: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  previewLabel: { color: colors.blue, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  pressed: { opacity: 0.82 },
});
