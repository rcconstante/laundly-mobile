import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export type AuthFormProps = {
  onContinue: () => void;
  scrollTo: (y: number) => void;
};

export const styles = StyleSheet.create({
  form: { gap: 18 },
  signUpForm: { gap: 14 },
  header: { marginBottom: 16 },
  signUpHeader: { marginBottom: 10 },
  title: { fontSize: 34, lineHeight: 42, color: colors.ink, fontFamily: 'Inter_700Bold', letterSpacing: -0.8 },
  signUpTitle: { lineHeight: 41 },
  subtitle: { marginTop: 12, fontSize: 14, color: colors.muted },
  signUpSubtitle: { marginTop: 10 },
  fieldGroup: { gap: 4 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 14,
    minHeight: 56, paddingLeft: 18, paddingRight: 6, borderWidth: 1, borderColor: colors.line,
    boxShadow: '0px 2px 8px rgba(8, 24, 67, 0.04)' },
  signUpInputBox: { minHeight: 54, borderRadius: 13, paddingLeft: 16 },
  inputBoxError: { borderWidth: 1.5, borderColor: colors.danger },
  input: { flex: 1, fontSize: 15, color: colors.ink, paddingVertical: 14 },
  signUpInput: { paddingVertical: 12 },
  eye: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  optionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
    gap: 8, marginTop: 4, marginBottom: 14 },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: colors.line,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: colors.blue, borderColor: colors.blue },
  rememberText: { fontSize: 13, color: colors.muted },
  forgotText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: colors.blue },
  primaryButton: { minHeight: 54, borderRadius: 30, backgroundColor: colors.blue,
    alignItems: 'center', justifyContent: 'center', boxShadow: '0px 6px 12px rgba(16, 72, 230, 0.25)' },
  primaryLabel: { color: colors.white, fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  pressed: { opacity: 0.82 },
});
