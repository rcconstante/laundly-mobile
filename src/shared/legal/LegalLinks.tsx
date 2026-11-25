import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';
import { LegalWebModal, type LegalModalTarget } from './LegalWebModal';

const site = 'https://laundly.vercel.app';
const pages: LegalModalTarget[] = [
  { title: 'Privacy Policy', url: site + '/privacy' },
  { title: 'Terms and Conditions', url: site + '/terms' },
];

const cookies = { title: 'Cookies', url: site + '/cookies' };

export function LegalLinks({ includeCookies = false }: { includeCookies?: boolean }) {
  const [target, setTarget] = useState<LegalModalTarget | null>(null);

  return (
    <View style={styles.row}>
      {(includeCookies ? [...pages, cookies] : pages).map((page) => (
        <Pressable key={page.url} accessibilityRole="link" onPress={() => setTarget(page)} style={styles.item}>
          <Text style={styles.link}>{page.title}</Text>
        </Pressable>
      ))}
      <LegalWebModal target={target} onClose={() => setTarget(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: 18 },
  item: { minHeight: 44, justifyContent: 'center' },
  link: { color: colors.blue, fontFamily: 'Inter_600SemiBold', fontSize: 12, textDecorationLine: 'underline' },
});
