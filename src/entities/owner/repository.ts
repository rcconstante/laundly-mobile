import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialOwnerState, ownerStateSchema, type OwnerState } from './model';

const storageKey = 'laundly.owner.v1';

export const ownerRepository = {
  async read(): Promise<OwnerState> {
    const value = await AsyncStorage.getItem(storageKey);
    return value ? ownerStateSchema.parse(JSON.parse(value)) : initialOwnerState;
  },
  write(state: OwnerState): Promise<void> {
    return AsyncStorage.setItem(storageKey, JSON.stringify(state));
  },
};
