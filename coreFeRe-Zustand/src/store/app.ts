import { create } from "zustand";
import { waiting } from "../utils/async";
import { useLoginStore } from "./login";

type State = {
  list: string[];
};

type Action = {
  getList: () => void;
  updateList: (list: State["list"]) => void;
};

export const useAppStore = create<State & Action>((set) => ({
  list: [],
  getList: async () => {
    const { name } = useLoginStore.getState(); // use other store
    await waiting();
    set(() => ({ list: name ? [name] : [] }));
  },
  updateList: (list) => set(() => ({ list })),
}));
