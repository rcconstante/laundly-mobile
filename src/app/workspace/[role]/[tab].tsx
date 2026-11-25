import { Redirect, useLocalSearchParams } from 'expo-router';
import { isRole, isRoleTab, workspaceHref } from '../../../features/workspace/roles';
import { WorkspaceScreen } from '../../../features/workspace/WorkspaceScreen';

export default function WorkspaceRoute() {
  const { role, tab } = useLocalSearchParams<{ role: string; tab: string }>();

  if (!isRole(role)) return <Redirect href="/" />;
  if (!isRoleTab(role, tab)) return <Redirect href={workspaceHref(role)} />;

  return <WorkspaceScreen key={role + '/' + tab} role={role} tab={tab} />;
}
