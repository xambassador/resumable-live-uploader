import { create } from "zustand";

interface State {
  files: File[];
  setFiles: (files: File[]) => void;
  error: string;
  setError: (error: string) => void;
  totalCompleted: number;
  setTotalCompleted: (totalCompleted: number) => void;
  totalPaused: number;
  setTotalPaused: (totalPaused: number) => void;
  totalCancelled: number;
  setTotalCancelled: (totalCancelled: number) => void;
}

const initializerFn = (set: any) => ({
  files: [],
  setFiles: (files: File[]) => set({ files }),
  error: "",
  setError: (error: string) => set({ error }),
  totalCompleted: 0,
  setTotalCompleted: (totalCompleted: number) => set({ totalCompleted }),
  totalPaused: 0,
  setTotalPaused: (totalPaused: number) => set({ totalPaused }),
  totalCancelled: 0,
  setTotalCancelled: (totalCancelled: number) => set({ totalCancelled }),
});

const useStore = create<State>()(initializerFn);

export default useStore;
