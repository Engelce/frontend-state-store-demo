import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

export interface User {
  name: string;
  email: string;
  isAdmin: boolean;
}

const { persistAtom } = recoilPersist({
  storage: typeof window === "undefined" ? undefined : window.sessionStorage,
});

const userState = atom<User[]>({
  key: "userState",
  default: [],
  effects: [persistAtom],
});

const serverSideUsersState = selector<User[]>({
  key: "getServerSideUsers",
  get: async ({ get }) => {
    const response = await fetch("http://localhost:3000/api/list");
    const usersData = await response.json();
    return usersData;
  },
});

export { userState, serverSideUsersState };
