import { create } from "zustand";

interface LoadingState {
  globalLoading: boolean;
  loadingMap: Record<string, boolean>;
  showLoading: (key?: string) => void;
  hideLoading: (key?: string) => void;
  loadingCount: number;

  isScopedLoading: (key: string) => boolean;
  hasGridLoading: () => boolean;
}

export const useLoadingStore = create<LoadingState>()((set, get) => ({
  globalLoading: false,
  loadingMap: {},
  loadingCount: 0,

  showLoading: (key) => {
    if (key === undefined) {
      const newCount = get().loadingCount + 1;
      set({
        globalLoading: true,
        loadingCount: newCount,
      });
    } else {
      set((state) => ({
        loadingMap: { ...state.loadingMap, [key]: true },
      }));
    }
  },

  hideLoading: (key) => {
    if (key === undefined) {
      const newCount = get().loadingCount - 1;
      if (newCount <= 0) {
        set({
          globalLoading: false,
          loadingCount: 0,
        });
      } else {
        set({ loadingCount: newCount });
      }
    } else {
      set((state) => {
        const map = { ...state.loadingMap };
        delete map[key];
        return { loadingMap: map };
      });
    }
  },
  isScopedLoading: (key) => !!get().loadingMap[key],
  hasGridLoading: () => Object.keys(get().loadingMap).some((k) => k.startsWith("grid:")),
}));
