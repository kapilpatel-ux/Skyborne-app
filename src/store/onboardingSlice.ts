import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OnboardingState = {
  inspiration?: string;
  firstGoal?: string;
  setInspiration: (v: string) => void;
  setFirstGoal: (v: string) => void;
};

export const useOnboardingStore = create<OnboardingState>(
  persist(
    (set) => ({
      inspiration: undefined,
      firstGoal: undefined,
      setInspiration: (v) => set({ inspiration: v }),
      setFirstGoal: (v) => set({ firstGoal: v }),
    }),
    {
      name: 'onboarding',
      storage: AsyncStorage as any,
    }
  )
);
