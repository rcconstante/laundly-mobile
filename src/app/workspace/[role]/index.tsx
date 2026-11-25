import { Redirect, useLocalSearchParams } from 'expo-router';
import { isRole, workspaceHref } from '../../../features/workspace/roles';

export default function WorkspaceIndex() {
  const { role } = useLocalSearchParams<{ role: string }>();
  return <Redirect href={isRole(role) ? workspaceHref(role) : '/'} />;
}
