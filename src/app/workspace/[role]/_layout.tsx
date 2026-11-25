import { Redirect, Slot, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { FloatingTabBar } from '../../../features/workspace/FloatingTabBar';
import { isRole } from '../../../features/workspace/roles';
import { colors } from '../../../theme';

export default function WorkspaceLayout() {
  const { role } = useLocalSearchParams<{ role: string }>();

  if (!isRole(role)) return <Redirect href="/" />;

  return (
    <View style={styles.shell}>
      <Slot />
      <FloatingTabBar role={role} />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: colors.canvas },
});
