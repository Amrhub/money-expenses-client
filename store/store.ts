import { create } from 'zustand';

export const useStore = create(() => ({
  showLoader: false,
}));
