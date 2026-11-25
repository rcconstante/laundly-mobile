import AnalyticsUpIcon from '@hugeicons/core-free-icons/AnalyticsUpIcon';
import Calendar03Icon from '@hugeicons/core-free-icons/Calendar03Icon';
import CheckListIcon from '@hugeicons/core-free-icons/CheckListIcon';
import Home01Icon from '@hugeicons/core-free-icons/Home01Icon';
import Mail01Icon from '@hugeicons/core-free-icons/Mail01Icon';
import MapsLocation01Icon from '@hugeicons/core-free-icons/MapsLocation01Icon';
import MoreHorizontalIcon from '@hugeicons/core-free-icons/MoreHorizontalIcon';
import PackageIcon from '@hugeicons/core-free-icons/PackageIcon';
import UserCircleIcon from '@hugeicons/core-free-icons/UserCircleIcon';
import Wallet01Icon from '@hugeicons/core-free-icons/Wallet01Icon';
import WashingMachineIcon from '@hugeicons/core-free-icons/WashingMachineIcon';

export const tabs = {
  home: { label: 'Home', icon: Home01Icon },
  orders: { label: 'Orders', icon: PackageIcon },
  machines: { label: 'Machines', icon: WashingMachineIcon },
  reports: { label: 'Reports', icon: AnalyticsUpIcon },
  more: { label: 'More', icon: MoreHorizontalIcon },
  book: { label: 'Book', icon: Calendar03Icon },
  inbox: { label: 'Inbox', icon: Mail01Icon },
  profile: { label: 'Profile', icon: UserCircleIcon },
  tasks: { label: 'Tasks', icon: CheckListIcon },
  map: { label: 'Map', icon: MapsLocation01Icon },
  cash: { label: 'Cash', icon: Wallet01Icon },
};

export type Tab = keyof typeof tabs;

type RoleDefinition = { label: string; tabs: readonly Tab[] };

export const roles = {
  owner: { label: 'Owner', tabs: ['home', 'orders', 'machines', 'reports', 'more'] },
  client: { label: 'Client', tabs: ['home', 'orders', 'book', 'inbox', 'profile'] },
  rider: { label: 'Rider', tabs: ['home', 'tasks', 'map', 'cash', 'profile'] },
} satisfies Record<string, RoleDefinition>;

export type Role = keyof typeof roles;
export const roleOptions: Role[] = ['owner', 'client', 'rider'];

export function isRole(value: string): value is Role {
  return Object.hasOwn(roles, value);
}

export function isRoleTab(role: Role, value: string): value is Tab {
  return roles[role].tabs.some((tab) => tab === value);
}

export function workspaceHref(role: Role, tab: Tab = 'home') {
  return { pathname: '/workspace/[role]/[tab]' as const, params: { role, tab } };
}
