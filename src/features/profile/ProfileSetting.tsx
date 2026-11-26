import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';

const artwork = {
  account: require('../../../assets/profile/account.webp'),
  preferences: require('../../../assets/profile/preferences.webp'),
  language: require('../../../assets/profile/language.webp'),
  about: require('../../../assets/profile/about.webp'),
};

type Artwork = keyof typeof artwork;

export function ProfileArtwork({ name, size = 40 }: { name: Artwork; size?: number }) {
  return <Image source={artwork[name]} style={{ width: size, height: size }} contentFit="contain" accessible={false} />;
}

export function ProfileSetting({ icon, title, detail, control, children }: {
  icon: Artwork;
  title: string;
  detail?: string;
  control?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <ProfileArtwork name={icon} />
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          {detail ? <Text style={styles.detail}>{detail}</Text> : null}
        </View>
        {control}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, gap: 10, borderWidth: 1, borderColor: colors.line, borderRadius: 18, backgroundColor: colors.white },
  row: { minHeight: 45, flexDirection: 'row', alignItems: 'center', gap: 12 },
  copy: { flex: 1, minWidth: 0, gap: 3 },
  title: { fontFamily: 'Inter_700Bold', color: colors.ink, fontSize: 15 },
  detail: { fontFamily: 'Inter_400Regular', color: colors.muted, fontSize: 12, lineHeight: 17 },
});
