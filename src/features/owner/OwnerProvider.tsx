import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { applyOwnerCommand, initialOwnerState, type OwnerCommand, type OwnerState } from '../../entities/owner/model';
import { ownerRepository } from '../../entities/owner/repository';

type OwnerContextValue = {
  state: OwnerState; ready: boolean; error: string; commit: (command: OwnerCommand) => string | undefined;
  retry: () => void;
};

const OwnerContext = createContext<OwnerContextValue | null>(null);

export function OwnerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialOwnerState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const latest = useRef(initialOwnerState);
  const writes = useRef(Promise.resolve());
  const sequence = useRef(0);

  useEffect(() => {
    let active = true;
    ownerRepository.read().then((stored) => {
      if (!active) return;
      latest.current = stored;
      setState(stored);
      setError('');
      setReady(true);
    }).catch(() => {
      if (active) setError('Could not open saved branch data. Try loading it again.');
    });
    return () => { active = false; };
  }, [attempt]);

  function persist(next: OwnerState) {
    writes.current = writes.current.then(() => ownerRepository.write(next)).then(() => setError(''))
      .catch(() => setError('Your latest changes could not be saved on this device.'));
  }

  function commit(command: OwnerCommand) {
    if (!ready) return 'Branch data is still loading.';
    try {
      const now = new Date();
      const id = now.getTime().toString(36) + '-' + (++sequence.current).toString(36);
      const next = applyOwnerCommand(latest.current, command, id, now.toISOString());
      latest.current = next;
      setState(next);
      persist(next);
      return undefined;
    } catch (reason) {
      return reason instanceof Error ? reason.message : 'Could not complete the change.';
    }
  }

  function retry() {
    if (ready) persist(latest.current);
    else setAttempt((value) => value + 1);
  }

  return <OwnerContext.Provider value={{ state, ready, error, commit, retry }}>{children}</OwnerContext.Provider>;
}

export function useOwner() {
  const owner = useContext(OwnerContext);
  if (!owner) throw new Error('OwnerProvider is missing.');
  return owner;
}
