import { useState } from 'react';
import type { Branch, OwnerCommand } from '../../entities/owner/model';
import { money } from '../../entities/owner/model';
import { Action, Copy, ErrorText, Field, Heading, ItemRow, Panel } from '../../shared/ui/WorkspaceUI';
import { useOwner } from './OwnerProvider';

const operations = {
  customers: { title: 'Customers', singular: 'customer', label: 'Customer name', detail: 'Manage the people this branch serves.' },
  pricing: { title: 'Pricing', singular: 'service', label: 'Service name', detail: 'Set prices for services offered at this branch.' },
  machines: { title: 'Machines', singular: 'machine', label: 'Machine name', detail: 'Track machine availability for this branch.' },
};

export function OperationsScreen({ branch, section }: {
  branch: Branch; section: keyof typeof operations;
}) {
  const { commit } = useOwner();
  const [name, setName] = useState('');
  const [extra, setExtra] = useState('');
  const [editingId, setEditingId] = useState<string>();
  const [error, setError] = useState('');
  const config = operations[section];
  const records = section === 'customers' ? branch.customers.map((record) => ({ ...record, detail: record.phone, input: record.phone }))
    : section === 'pricing' ? branch.services.map((record) => ({ ...record, detail: money(record.price), input: (record.price / 100).toFixed(2) }))
    : branch.machines.map((record) => ({ ...record, detail: record.available ? 'Available' : 'Unavailable', input: '' }));

  function reset() {
    setEditingId(undefined);
    setName('');
    setExtra('');
    setError('');
  }

  function save() {
    const command: OwnerCommand = section === 'customers' ? { type: 'customer.save', id: editingId, name, phone: extra }
      : section === 'pricing' ? { type: 'service.save', id: editingId, name, price: extra }
      : { type: 'machine.add', name };
    const problem = commit(command);
    setError(problem ?? '');
    if (!problem) reset();
  }

  return <>
    <Heading title={config.title} detail={config.detail} />
    <Panel title={editingId ? `Edit ${config.singular}` : `Add a ${config.singular}`}>
      <Field label={config.label} value={name} onChangeText={setName} maxLength={80} />
      {section === 'customers' && <Field label="Phone (optional)" value={extra} onChangeText={setExtra} inputMode="tel" maxLength={35} />}
      {section === 'pricing' && <Field label="Price in PHP" placeholder="0.00" value={extra} onChangeText={setExtra} inputMode="decimal" />}
      <ErrorText message={error} />
      <Action label={editingId ? `Save ${config.singular}` : `Add ${config.singular}`} onPress={save} />
      {editingId && <Action label="Cancel edit" secondary onPress={reset} />}
    </Panel>
    <Panel title={`${config.title} at ${branch.name}`}>
      {!records.length && <Copy>{`No ${section === 'pricing' ? 'services' : section} yet.`}</Copy>}
      {records.map((record) => <ItemRow key={record.id} title={record.name} detail={record.detail}
        value={section === 'machines' ? 'Toggle status' : 'Edit'}
        action={() => {
          if (section === 'machines') {
            setError(commit({ type: 'machine.toggle', id: record.id }) ?? '');
            return;
          }
          setEditingId(record.id);
          setName(record.name);
          setExtra(record.input);
          setError('');
        }} />)}
    </Panel>
  </>;
}
