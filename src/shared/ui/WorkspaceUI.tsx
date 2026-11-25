import { HugeiconsIcon } from '@hugeicons/react-native';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../theme';

export type WorkspaceIcon = ComponentProps<typeof HugeiconsIcon>['icon'];

export function Heading({ title, detail }: { title: string; detail?: string }) {
  return <View style={styles.stack}>
    <Text accessibilityRole="header" style={styles.title}>{title}</Text>
    {detail ? <Text style={styles.copy}>{detail}</Text> : null}
  </View>;
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <View style={styles.panel}>
    <Text accessibilityRole="header" style={styles.panelTitle}>{title}</Text>
    {children}
  </View>;
}

export function Copy({ children }: { children: ReactNode }) {
  return <Text style={styles.copy}>{children}</Text>;
}

export function ErrorText({ message }: { message: string }) {
  return message ? <Text accessibilityRole="alert" style={styles.error}>{message}</Text> : null;
}

export function Action({ label, onPress, secondary, disabled }: {
  label: string; onPress: () => void; secondary?: boolean; disabled?: boolean;
}) {
  return <Pressable accessibilityRole="button" disabled={disabled} aria-disabled={disabled} onPress={onPress}
    style={({ pressed }) => [styles.button, secondary && styles.secondary, (pressed || disabled) && styles.dim]}>
    <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{label}</Text>
  </Pressable>;
}

export function Field({ label, ...props }: ComponentProps<typeof TextInput> & { label: string }) {
  return <View style={styles.stack}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput accessibilityLabel={label} placeholderTextColor={colors.muted} {...props} style={styles.input} />
  </View>;
}

export function ItemRow({ title, detail, value, icon, action }: {
  title: string; detail?: string; value?: string; icon?: WorkspaceIcon; action?: () => void;
}) {
  const content = <>
    {icon && <View style={styles.icon}><HugeiconsIcon icon={icon} size={20} color={colors.blue} /></View>}
    <View style={styles.rowContent}>
      <Text style={styles.rowTitle}>{title}</Text>
      {detail ? <Text style={styles.copy}>{detail}</Text> : null}
    </View>
    {value ? <Text style={styles.value}>{value}</Text> : null}
  </>;
  if (action) return <Pressable accessibilityRole="button" onPress={action} style={styles.row}>{content}</Pressable>;
  return <View style={styles.row}>{content}</View>;
}

const styles = StyleSheet.create({
  stack: { gap: 5 },
  title: { color: colors.ink, fontSize: 29, fontFamily: 'Inter_700Bold', letterSpacing: -0.8 },
  copy: { color: colors.muted, fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular' },
  panel: { backgroundColor: colors.white, borderRadius: 20, borderColor: colors.line, borderWidth: 1, padding: 16, gap: 11 },
  panelTitle: { color: colors.ink, fontSize: 17, fontFamily: 'Inter_700Bold' },
  error: { color: colors.danger, fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  button: { minHeight: 46, borderRadius: 24, backgroundColor: colors.blue, paddingHorizontal: 16,
    alignItems: 'center', justifyContent: 'center' },
  secondary: { backgroundColor: colors.paleBlue },
  dim: { opacity: 0.66 },
  buttonText: { color: colors.white, fontSize: 13, textAlign: 'center', fontFamily: 'Inter_700Bold' },
  secondaryText: { color: colors.blue },
  fieldLabel: { color: colors.ink, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  input: { minHeight: 46, borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingHorizontal: 12,
    color: colors.ink, backgroundColor: colors.canvas, fontFamily: 'Inter_400Regular', fontSize: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 47 },
  rowContent: { flex: 1, gap: 2 },
  rowTitle: { color: colors.ink, fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  icon: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.paleBlue, alignItems: 'center', justifyContent: 'center' },
  value: { maxWidth: '40%', textAlign: 'right', color: colors.blue, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
});
