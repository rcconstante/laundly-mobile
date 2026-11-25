import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../../theme';
import { LegalWebModal, type LegalModalTarget } from './LegalWebModal';

const terms: LegalModalTarget = {
  title: 'Terms and Conditions',
  url: 'https://laundly.vercel.app/',
};

export function TermsLink({ showAgreement = false }: { showAgreement?: boolean }) {
  const [legalModal, setLegalModal] = useState<LegalModalTarget | null>(null);

  return (
    <>
      <Text style={styles.copy}>
        {showAgreement ? 'By signing up, you agree to Laundly’s ' : null}
        <Text accessibilityRole="link" onPress={() => setLegalModal(terms)} style={styles.link}>{terms.title}</Text>
        {showAgreement ? '.' : null}
      </Text>
      <LegalWebModal target={legalModal} onClose={() => setLegalModal(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  copy: { textAlign: 'center', fontSize: 12, lineHeight: 18, color: colors.muted },
  link: { color: colors.blue, fontWeight: '700', textDecorationLine: 'underline' },
});
