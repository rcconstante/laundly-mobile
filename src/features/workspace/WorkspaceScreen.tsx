import { OwnerWorkspace } from '../owner/OwnerWorkspace';
import { ProfileScreen } from '../profile/ProfileScreen';
import Logout01Icon from '@hugeicons/core-free-icons/Logout01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandLogo } from '../../shared/brand/BrandLogo';
import { colors } from '../../theme';
import { roles, type Destination, type Role } from './roles';

export function WorkspaceScreen({ role, tab }: { role: Role; tab: Destination }) {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <BrandLogo markSize={36} />
          <Text style={styles.brandName}>Laundly</Text>
          <Text style={styles.roleName}>{roles[role].label} workspace</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Exit demo" style={styles.exit}
          onPress={() => router.dismissTo('/')}>
          <HugeiconsIcon icon={Logout01Icon} size={21} color={colors.blue} />
        </Pressable>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.page, { paddingBottom: Math.max(insets.bottom, 12) + 94 }]}>
        {role === 'owner' ? <OwnerWorkspace destination={tab} /> : tab === 'profile' ? <ProfileScreen role={role} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { width: '100%', maxWidth: 580, alignSelf: 'center', padding: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  brand: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  brandName: { color: colors.ink, fontSize: 17, fontFamily: 'Inter_700Bold' },
  roleName: { color: colors.muted, fontSize: 12, lineHeight: 16, fontFamily: 'Inter_600SemiBold' },
  exit: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, borderWidth: 1,
    borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  page: { width: '100%', maxWidth: 580, alignSelf: 'center', paddingTop: 4, paddingHorizontal: 18, gap: 14 },
});
