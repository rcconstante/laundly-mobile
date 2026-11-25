import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export type AuthFormProps = {
  onContinue: () => void;
  scrollTo: (y: number) => void;
};

export const styles = StyleSheet.create({
  form: { gap: 14 },
  fieldGroup: { gap: 5 },
  label: { fontSize: 12, lineHeight: 17, color: colors.muted, fontFamily: 'Inter_600SemiBold' },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12,
    minHeight: 49, paddingLeft: 13, paddingRight: 4, borderWidth: 1, borderColor: colors.line },
  inputBoxError: { borderColor: colors.danger },
  input: { flex: 1, minWidth: 0, minHeight: 47, fontSize: 14, color: colors.ink, paddingVertical: 10,
    fontFamily: 'Inter_400Regular' },
  eye: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  optionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 36 },
  checkbox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1.5, borderColor: '#8090A8',
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: colors.blue, borderColor: colors.blue },
  rememberText: { fontSize: 12, color: colors.muted, fontFamily: 'Inter_400Regular' },
  forgotText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: colors.blue },
  primaryButton: { minHeight: 50, borderRadius: 26, backgroundColor: colors.blue,
    alignItems: 'center', justifyContent: 'center' },
  primaryLabel: { color: colors.white, fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  pressed: { opacity: 0.8 },
});
