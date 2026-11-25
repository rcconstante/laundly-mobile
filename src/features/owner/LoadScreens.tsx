import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { money, nextStatus, statusLabels, type Branch, type Load } from '../../entities/owner/model';
import { Action, Copy, ErrorText, Heading, Panel } from '../../shared/ui/WorkspaceUI';
import { colors } from '../../theme';
import { useOwner } from './OwnerProvider';

type Pickable = { id: string; name: string };

function ChoiceList({ label, records, value, onChange }: {
  label: string; records: Pickable[]; value: string; onChange: (id: string) => void;
}) {
  return <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.choices}>
    {records.map((record) => <Pressable key={record.id} accessibilityRole="radio" aria-checked={value === record.id}
      onPress={() => onChange(record.id)} style={[styles.choice, value === record.id && styles.selected]}>
      <Text style={styles.choiceText}>{record.name}</Text>
    </Pressable>)}
  </View>;
}

export function NewLoad({ branch, onCustomers, onPricing, onDone }: {
  branch: Branch; onCustomers: () => void; onPricing: () => void; onDone: () => void;
}) {
  const { commit } = useOwner();
  const [customerId, setCustomer] = useState('');
  const [serviceId, setService] = useState('');
  const [error, setError] = useState('');
  const service = branch.services.find((item) => item.id === serviceId);

  return <>
    <Heading title="New load" detail={`Add a laundry order at ${branch.name}.`} />
    <Panel title="Customer">
      {branch.customers.length ? <ChoiceList label="Customer" records={branch.customers} value={customerId} onChange={setCustomer} />
        : <Action secondary label="Add a customer" onPress={onCustomers} />}
    </Panel>
    <Panel title="Service">
      {branch.services.length ? <ChoiceList label="Service" value={serviceId} onChange={setService}
        records={branch.services.map((item) => ({ ...item, name: `${item.name} · ${money(item.price)}` }))} />
        : <Action secondary label="Set up pricing" onPress={onPricing} />}
    </Panel>
    <Copy>{service ? `Order total ${money(service.price)}` : 'Pick a service to see the order total.'}</Copy>
    <ErrorText message={error} />
    <Action label="Create load" disabled={!customerId || !serviceId} onPress={() => {
      const problem = commit({ type: 'load.add', customerId, serviceId });
      if (problem) setError(problem); else onDone();
    }} />
  </>;
}

export function Loads({ loads, allowChanges = false }: { loads: Load[]; allowChanges?: boolean }) {
  const { commit } = useOwner();
  const [error, setError] = useState('');
  return <>
    <ErrorText message={error} />
    {!loads.length && <Copy>No loads here yet.</Copy>}
    {loads.map((load) => {
      const status = nextStatus[load.status];
      return <View key={load.id} style={styles.load}>
        <View style={styles.loadHeader}>
          <Text style={styles.loadTitle}>Load #{String(load.number).padStart(3, '0')}</Text>
          <Text style={styles.badge}>{statusLabels[load.status]}</Text>
        </View>
        <Copy>{load.customerName} · {load.serviceName}</Copy>
        <Copy>{money(load.amount)} · {load.paidAt ? 'Paid' : 'Payment due'}</Copy>
        {allowChanges && (status || !load.paidAt) && <View style={styles.controls}>
          {status && <Action secondary label={`Mark ${statusLabels[status].toLowerCase()}`}
            onPress={() => setError(commit({ type: 'load.advance', id: load.id }) ?? '')} />}
          {!load.paidAt && <Action secondary label="Record payment"
            onPress={() => setError(commit({ type: 'load.pay', id: load.id }) ?? '')} />}
        </View>}
      </View>;
    })}
  </>;
}

const styles = StyleSheet.create({
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choice: { minHeight: 44, justifyContent: 'center', borderRadius: 20, borderWidth: 1,
    borderColor: colors.line, paddingHorizontal: 12 },
  selected: { backgroundColor: colors.paleBlue, borderColor: colors.blue },
  choiceText: { color: colors.ink, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  load: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, gap: 5 },
  loadHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 5 },
  loadTitle: { color: colors.ink, fontFamily: 'Inter_700Bold', fontSize: 14 },
  badge: { borderRadius: 12, overflow: 'hidden', backgroundColor: colors.paleBlue, color: colors.blue,
    fontFamily: 'Inter_600SemiBold', fontSize: 11, paddingHorizontal: 9, paddingVertical: 5 },
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 3 },
});
