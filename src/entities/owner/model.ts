import { z } from 'zod';

const record = z.object({ id: z.string(), name: z.string() });
const loadStatus = z.enum(['received', 'washing', 'ready', 'completed']);
const customer = record.extend({ phone: z.string() });
const service = record.extend({ price: z.number().int().positive() });
const machine = record.extend({ available: z.boolean() });
const load = z.object({
  id: z.string(), number: z.number().int().positive(), customerId: z.string(), customerName: z.string(),
  serviceName: z.string(), amount: z.number().int().positive(), status: loadStatus,
  createdAt: z.string(), paidAt: z.string().nullable(),
});
const branch = record.extend({
  address: z.string(), customers: z.array(customer), services: z.array(service), machines: z.array(machine), loads: z.array(load),
});
export const ownerStateSchema = z.object({ activeBranchId: z.string().nullable(), branches: z.array(branch) });

export type OwnerState = z.infer<typeof ownerStateSchema>;
export type Branch = z.infer<typeof branch>;
export type Load = z.infer<typeof load>;
export type LoadStatus = z.infer<typeof loadStatus>;

export const initialOwnerState: OwnerState = { activeBranchId: null, branches: [] };
export const statusLabels: Record<LoadStatus, string> = {
  received: 'Received', washing: 'Washing', ready: 'Ready for pickup', completed: 'Completed',
};
export const nextStatus: Partial<Record<LoadStatus, LoadStatus>> = {
  received: 'washing', washing: 'ready', ready: 'completed',
};

export type OwnerCommand =
  | { type: 'branch.add'; name: string; address: string }
  | { type: 'branch.select'; id: string }
  | { type: 'customer.save'; id?: string; name: string; phone: string }
  | { type: 'service.save'; id?: string; name: string; price: string }
  | { type: 'machine.add'; name: string }
  | { type: 'machine.toggle'; id: string }
  | { type: 'load.add'; customerId: string; serviceId: string }
  | { type: 'load.advance'; id: string }
  | { type: 'load.pay'; id: string };

function uniqueName(input: string, records: { name: string }[], label: string) {
  const name = input.trim();
  if (name.length < 2 || name.length > 80) throw new Error(`Enter a ${label} name between 2 and 80 characters.`);
  if (records.some((item) => item.name.toLowerCase() === name.toLowerCase())) throw new Error(`This ${label} name is already in use.`);
  return name;
}

export function applyOwnerCommand(state: OwnerState, command: OwnerCommand, id: string, now: string): OwnerState {
  if (command.type === 'branch.add') {
    const name = uniqueName(command.name, state.branches, 'branch');
    if (command.address.trim().length > 180) throw new Error('Use an address of 180 characters or fewer.');
    const added: Branch = { id, name, address: command.address.trim(), customers: [], services: [], machines: [], loads: [] };
    return { branches: [...state.branches, added], activeBranchId: added.id };
  }
  if (command.type === 'branch.select') {
    if (!state.branches.some((item) => item.id === command.id)) throw new Error('That branch is unavailable.');
    return { ...state, activeBranchId: command.id };
  }

  const current = state.branches.find((item) => item.id === state.activeBranchId);
  if (!current) throw new Error('Create a branch to continue.');
  const update = (changes: Partial<Branch>): OwnerState => ({
    ...state, branches: state.branches.map((item) => item.id === current.id ? { ...item, ...changes } : item),
  });

  switch (command.type) {
    case 'customer.save': {
      if (command.id && !current.customers.some((item) => item.id === command.id)) throw new Error('That customer is unavailable.');
      const name = uniqueName(command.name, current.customers.filter((item) => item.id !== command.id), 'customer');
      if (command.phone.trim().length > 35) throw new Error('Use a phone number of 35 characters or fewer.');
      const customer = { id: command.id ?? id, name, phone: command.phone.trim() };
      const customers = command.id ? current.customers.map((item) => item.id === customer.id ? customer : item) : [...current.customers, customer];
      return update({ customers });
    }
    case 'service.save': {
      if (command.id && !current.services.some((item) => item.id === command.id)) throw new Error('That service is unavailable.');
      const name = uniqueName(command.name, current.services.filter((item) => item.id !== command.id), 'service');
      const input = command.price.trim();
      if (!/^\d{1,6}(\.\d{1,2})?$/.test(input) || Number(input) <= 0) throw new Error('Enter a positive price with up to two decimals.');
      const service = { id: command.id ?? id, name, price: Math.round(Number(input) * 100) };
      const services = command.id ? current.services.map((item) => item.id === service.id ? service : item) : [...current.services, service];
      return update({ services });
    }
    case 'machine.add': {
      const name = uniqueName(command.name, current.machines, 'machine');
      return update({ machines: [...current.machines, { id, name, available: true }] });
    }
    case 'machine.toggle': {
      if (!current.machines.some((item) => item.id === command.id)) throw new Error('That machine is unavailable.');
      return update({ machines: current.machines.map((item) => item.id === command.id ? { ...item, available: !item.available } : item) });
    }
    case 'load.add': {
      const customer = current.customers.find((item) => item.id === command.customerId);
      const service = current.services.find((item) => item.id === command.serviceId);
      if (!customer || !service) throw new Error('Choose a customer and a service.');
      return update({ loads: [{
        id, number: current.loads.length + 1, customerId: customer.id, customerName: customer.name,
        serviceName: service.name, amount: service.price, status: 'received', createdAt: now, paidAt: null,
      }, ...current.loads] });
    }
    case 'load.advance':
    case 'load.pay': {
      const load = current.loads.find((item) => item.id === command.id);
      if (!load) throw new Error('That load is unavailable.');
      const status = nextStatus[load.status];
      const updated = command.type === 'load.pay'
        ? { ...load, paidAt: load.paidAt ?? now }
        : { ...load, status: status ?? load.status };
      return update({ loads: current.loads.map((item) => item.id === load.id ? updated : item) });
    }
  }
}

export const money = (cents: number) => new Intl.NumberFormat('en-PH', {
  style: 'currency', currency: 'PHP',
}).format(cents / 100);

export function getSales(loads: Load[], today = new Date()) {
  const collected = loads.filter((load) => load.paidAt);
  const todayPaid = collected.filter(({ paidAt }) => paidAt && new Date(paidAt).toDateString() === today.toDateString());
  return {
    today: todayPaid.reduce((sum, load) => sum + load.amount, 0),
    paidToday: todayPaid.length,
    collected: collected.reduce((sum, load) => sum + load.amount, 0),
    pending: loads.filter((load) => !load.paidAt).reduce((sum, load) => sum + load.amount, 0),
    completed: loads.filter((load) => load.status === 'completed').length,
  };
}
