import Add01Icon from '@hugeicons/core-free-icons/Add01Icon';
import UserGroupIcon from '@hugeicons/core-free-icons/UserGroupIcon';
import Tag01Icon from '@hugeicons/core-free-icons/Tag01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getSales, money, type Branch } from '../../entities/owner/model';
import { Action, Copy, ErrorText, Heading, ItemRow, Panel, type WorkspaceIcon } from '../../shared/ui/WorkspaceUI';
import { colors } from '../../theme';
import { tabs, workspaceHref, type Destination } from '../workspace/roles';
import { ProfileScreen } from '../profile/ProfileScreen';
import { BranchScreen } from './BranchScreen';
import { Loads, NewLoad } from './LoadScreens';
import { OperationsScreen } from './OperationsScreen';
import { useOwner } from './OwnerProvider';

const shortcuts: { destination: Destination; title: string; icon: WorkspaceIcon }[] = [
  { destination: 'new-load', title: 'New load', icon: Add01Icon },
  { destination: 'machines', title: 'Machines', icon: tabs.machines.icon },
  { destination: 'orders', title: 'Orders', icon: tabs.orders.icon },
  { destination: 'customers', title: 'Customers', icon: UserGroupIcon },
  { destination: 'pricing', title: 'Pricing', icon: Tag01Icon },
  { destination: 'reports', title: 'Reports', icon: tabs.reports.icon },
];

function open(destination: Destination) {
  router.replace(workspaceHref('owner', destination));
}

function Dashboard({ branch }: { branch: Branch }) {
  const sales = getSales(branch.loads);
  const active = branch.loads.filter((load) => load.status !== 'completed');
  return <>
    <Heading title="Owner dashboard" detail="Track sales and keep loads moving." />
    <Pressable accessibilityRole="button" accessibilityLabel="View today's sales report"
      onPress={() => open('reports')} style={styles.sales}>
      <View style={styles.salesTop}>
        <Text style={styles.salesLabel}>Today’s sales</Text>
        <HugeiconsIcon icon={tabs.reports.icon} color={colors.white} size={23} />
      </View>
      <Text style={styles.salesValue}>{money(sales.today)}</Text>
      <Text style={styles.salesDetail}>{sales.paidToday} {sales.paidToday === 1 ? 'payment' : 'payments'} recorded today</Text>
    </Pressable>
    <View style={styles.grid}>
      {shortcuts.map(({ destination, title, icon }) => (
        <Pressable key={destination} accessibilityRole="button" onPress={() => open(destination)}
          style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}>
          <View style={styles.tileIcon}><HugeiconsIcon icon={icon} color={colors.blue} size={22} /></View>
          <Text style={styles.tileTitle}>{title}</Text>
        </Pressable>
      ))}
    </View>
    <Panel title={`Active loads (${active.length})`}>
      <Loads loads={active.slice(0, 5)} />
      {!!active.length && <Action secondary label="View orders" onPress={() => open('orders')} />}
    </Panel>
  </>;
}

function Reports({ branch }: { branch: Branch }) {
  const sales = getSales(branch.loads);
  return <>
    <Heading title="Reports" detail={`Sales and order activity for ${branch.name}.`} />
    <Panel title="Sales">
      <ItemRow title="Today’s sales" value={money(sales.today)} />
      <ItemRow title="Payments today" value={String(sales.paidToday)} />
      <ItemRow title="Total collected" value={money(sales.collected)} />
      <ItemRow title="Outstanding balances" value={money(sales.pending)} />
    </Panel>
    <Panel title="Loads">
      <ItemRow title="Total orders" value={String(branch.loads.length)} />
      <ItemRow title="Completed" value={String(sales.completed)} />
      <ItemRow title="In progress" value={String(branch.loads.length - sales.completed)} />
    </Panel>
  </>;
}

export function OwnerWorkspace({ destination }: { destination: Destination }) {
  const { ready, error, retry, state } = useOwner();
  const branch = state.branches.find((item) => item.id === state.activeBranchId);
  if (!ready) return error
    ? <Panel title="Branch data"><ErrorText message={error} /><Action label="Try again" onPress={retry} /></Panel>
    : <Copy>Loading branches…</Copy>;

  let screen;
  if (destination === 'profile') {
    screen = <ProfileScreen role="owner" />;
  } else if (!branch || destination === 'branches') {
    screen = <BranchScreen onDone={() => open('home')} />;
  } else {
    switch (destination) {
      case 'home': screen = <Dashboard branch={branch} />; break;
      case 'customers':
      case 'pricing':
      case 'machines': screen = <OperationsScreen branch={branch} section={destination} />; break;
      case 'new-load': screen = <NewLoad branch={branch} onCustomers={() => open('customers')}
        onPricing={() => open('pricing')} onDone={() => open('orders')} />; break;
      case 'orders': screen = <>
        <Heading title="Orders" detail={`Track each load at ${branch.name}.`} />
        <Action label="New load" onPress={() => open('new-load')} />
        <Panel title={`All loads (${branch.loads.length})`}><Loads loads={branch.loads} allowChanges /></Panel>
      </>; break;
      case 'reports': screen = <Reports branch={branch} />; break;
      default: screen = <>
        <Heading title="More" />
        <Panel title="Workspace">
          <ItemRow title="Branches" detail="Create or switch laundry locations" action={() => open('branches')} />
          <ItemRow title="Customers" action={() => open('customers')} />
          <ItemRow title="Pricing" action={() => open('pricing')} />
        </Panel>
        <Panel title="Account"><ItemRow title="Profile and settings" icon={tabs.profile.icon} action={() => open('profile')} /></Panel>
      </>;
    }
  }

  return <>
    {error ? <Panel title="Saving changes"><ErrorText message={error} /><Action label="Retry save" onPress={retry} /></Panel> : null}
    {branch && destination !== 'branches' && <Pressable accessibilityRole="button"
      accessibilityLabel={`Switch branch, current branch ${branch.name}`} onPress={() => open('branches')} style={styles.branch}>
      <View style={styles.branchDot} />
      <Text numberOfLines={1} style={styles.branchText}>{branch.name}</Text>
      <Text style={styles.branchLink}>Switch</Text>
    </Pressable>}
    {screen}
  </>;
}

const styles = StyleSheet.create({
  branch: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', minHeight: 44, maxWidth: '100%',
    gap: 8, paddingHorizontal: 12, borderRadius: 23, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  branchDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.tealInk },
  branchText: { color: colors.ink, fontFamily: 'Inter_700Bold', flexShrink: 1, fontSize: 13 },
  branchLink: { color: colors.blue, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  sales: { borderRadius: 22, padding: 18, backgroundColor: colors.blue, gap: 8 },
  salesTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  salesLabel: { color: colors.white, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  salesValue: { color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 34 },
  salesDetail: { color: '#E9F0FF', fontFamily: 'Inter_400Regular', fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 8 },
  tile: { width: '32%', minHeight: 83, borderRadius: 16, borderWidth: 1, borderColor: colors.line,
    padding: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, gap: 6 },
  tilePressed: { backgroundColor: colors.paleBlue },
  tileIcon: { width: 36, height: 36, backgroundColor: colors.paleBlue, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center' },
  tileTitle: { color: colors.ink, fontFamily: 'Inter_600SemiBold', fontSize: 12, textAlign: 'center' },
});
