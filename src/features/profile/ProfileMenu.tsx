import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cardShadow, colors } from '../../theme';

const artwork = {
  account: require('../../../assets/profile/account.webp'),
  preferences: require('../../../assets/profile/preferences.webp'),
  language: require('../../../assets/profile/language.webp'),
  about: require('../../../assets/profile/about.webp'),
};

export type ProfileSection = keyof typeof artwork;

type MenuItem = {
  section: ProfileSection;
  label: string;
  detail: string;
};

export function ProfileMenu({ items, onSelect }: {
  items: MenuItem[];
  onSelect: (section: ProfileSection) => void;
}) {
  return (
    <View style={styles.card}>
      {items.map(({ section, label, detail }, index) => (
        <Pressable
          key={section}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityHint={detail}
          onPress={() => onSelect(section)}
          style={({ pressed }) => [styles.row, index > 0 && styles.divider, pressed && styles.pressed]}
        >
          <Image source={artwork[section]} style={styles.icon} contentFit="contain" accessible={false} />
          <View style={styles.body}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.detail}>{detail}</Text>
          </View>
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} color={colors.muted} strokeWidth={2} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, borderWidth: 1, borderColor: colors.line,
    backgroundColor: colors.white, overflow: 'hidden', boxShadow: cardShadow },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, gap: 14, minHeight: 72 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  pressed: { backgroundColor: colors.canvas },
  icon: { width: 40, height: 40 },
  body: { flex: 1, minWidth: 0, gap: 3 },
  label: { fontSize: 16, color: colors.ink, fontFamily: 'Inter_700Bold' },
  detail: { fontSize: 12.5, lineHeight: 18, color: colors.muted, fontFamily: 'Inter_400Regular' },
});
