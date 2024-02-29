import { create } from "zustand";

type State = {
  name: string;
};

type Action = {
  updateName: (name: State["name"]) => void;
};

export const useLoginStore = create<State & Action>((set) => ({
  name: "",
  updateName: (name) => set(() => ({ name })),
}));
