import { useState } from 'react';
import { Action, Copy, ErrorText, Field, Heading, ItemRow, Panel } from '../../shared/ui/WorkspaceUI';
import { useOwner } from './OwnerProvider';

export function BranchScreen({ onDone }: { onDone: () => void }) {
  const { state, commit } = useOwner();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const first = state.branches.length === 0;

  return <>
    <Heading title={first ? 'Create your first branch' : 'Branches'}
      detail={first ? 'Set up a laundry location to open your owner workspace.' : 'Switch between your laundry locations.'} />
    {!first && <Panel title="Your branches">
      {state.branches.map((branch) => <ItemRow key={branch.id} title={branch.name} detail={branch.address}
        value={state.activeBranchId === branch.id ? 'Current' : 'Switch'}
        action={() => {
          const problem = commit({ type: 'branch.select', id: branch.id });
          if (problem) setError(problem); else onDone();
        }} />)}
    </Panel>}
    <Panel title={first ? 'Branch details' : 'Add a branch'}>
      <Field label="Branch name" placeholder="e.g. Quezon City Main" value={name} onChangeText={setName} maxLength={80} />
      <Field label="Address (optional)" placeholder="Street, city" value={address} onChangeText={setAddress} maxLength={180} />
      <ErrorText message={error} />
      <Action label="Create branch" onPress={() => {
        const problem = commit({ type: 'branch.add', name, address });
        if (problem) setError(problem); else onDone();
      }} />
      <Copy>Branch records are saved on this device.</Copy>
    </Panel>
  </>;
}
