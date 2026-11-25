import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export type AuthFormProps = {
  onContinue: () => void;
  scrollTo: (y: number) => void;
  rolePicker: ReactNode;
};

export const styles = StyleSheet.create({
  form: { gap: 12 },
  header: { gap: 4, marginBottom: 4 },
  title: { fontSize: 29, lineHeight: 34, color: colors.ink, fontWeight: '800', letterSpacing: -0.7 },
  subtitle: { fontSize: 14, lineHeight: 20, color: colors.muted },
  fieldGroup: { gap: 4 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.canvas, borderRadius: 14,
    minHeight: 52, paddingLeft: 14, paddingRight: 4, borderWidth: 1, borderColor: colors.line },
  inputBoxError: { borderColor: colors.danger },
  input: { flex: 1, minHeight: 50, fontSize: 15, color: colors.ink, paddingVertical: 11 },
  eye: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  primaryButton: { minHeight: 51, borderRadius: 26, backgroundColor: colors.blue,
    alignItems: 'center', justifyContent: 'center' },
  primaryLabel: { color: colors.white, fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.82 },
});
