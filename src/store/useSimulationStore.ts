import { create } from 'zustand';
import { DEFAULT_BOT_PROFILES } from './_helpers';
import { BotProfile } from './types';

interface SimulationState {
  botProfiles: { [name: string]: BotProfile };
}

export const useSimulationStore = create<SimulationState>(() => ({
  botProfiles: DEFAULT_BOT_PROFILES,
}));
