import Logout01Icon from '@hugeicons/core-free-icons/Logout01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from '../../shared/brand/BrandLogo';
import { colors } from '../../theme';
import { roles, tabs, type Role, type Tab } from './roles';

export function WorkspaceScreen({ role, tab }: { role: Role; tab: Tab }) {
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
      <View accessibilityLabel={tabs[tab].label} style={styles.page} />
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
  page: { flex: 1 },
});
