import { HugeiconsIcon } from '@hugeicons/react-native';
import { router, useGlobalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cardShadow, colors } from '../../theme';
import { roles, tabs, workspaceHref, type Role } from './roles';

export function FloatingTabBar({ role }: { role: Role }) {
  const insets = useSafeAreaInsets();
  const { tab: currentTab } = useGlobalSearchParams<{ tab?: string }>();

  const parentTab = role === 'owner' && currentTab === 'new-load' ? 'orders'
    : role === 'owner' && ['branches', 'customers', 'pricing', 'profile'].some((route) => route === currentTab)
      ? 'more' : currentTab;

  return (
    <View accessibilityRole="tablist" style={[styles.bar, { bottom: Math.max(insets.bottom, 12) + 8 }]}>
      {roles[role].tabs.map((tab) => {
        const focused = tab === parentTab;
        const color = focused ? colors.blue : colors.muted;
        const { label, icon } = tabs[tab];

        return (
          <Pressable key={tab} accessibilityRole="tab" accessibilityLabel={label} aria-selected={focused}
            onPress={() => { if (tab !== currentTab) router.replace(workspaceHref(role, tab)); }}
            style={({ pressed }) => [styles.item, focused && styles.active, pressed && styles.pressed]}>
            <HugeiconsIcon icon={icon} size={23} strokeWidth={focused ? 2.2 : 1.8} color={color} />
            <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8} style={[styles.label, { color }]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', alignSelf: 'center', width: '92%', maxWidth: 500, flexDirection: 'row',
    gap: 2, padding: 6, borderRadius: 40, borderWidth: 1, borderColor: colors.line,
    backgroundColor: colors.white, boxShadow: cardShadow },
  item: { flex: 1, minWidth: 0, minHeight: 53, alignItems: 'center', justifyContent: 'center', gap: 3,
    borderRadius: 30, paddingHorizontal: 3 },
  active: { backgroundColor: colors.paleBlue },
  pressed: { opacity: 0.7 },
  label: { fontSize: 10, lineHeight: 13, fontFamily: 'Inter_700Bold', textAlign: 'center' },
});
