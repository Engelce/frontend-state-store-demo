"use client";
import { atom, useAtom, useSetAtom } from "jotai";
import { produce } from "immer";

export interface $ListItem {
  id: string;
  complete: boolean;
  content: string;
}

const initialValue: $ListItem[] = [
  {
    id: "1",
    complete: false,
    content: "123",
  },
];

export const list = atom<$ListItem[]>(initialValue);
export const addItemAtom = atom(null, (get, set, args: $ListItem) => {
  set(list, (pre) => [...pre, args]);
});

export const removeItemAtom = atom(null, (get, set, id: string) => {
  const _list = produce(get(list), (draft) => {
    const index = draft.findIndex((item) => item.id === id);
    if (index > -1) {
      draft.splice(index, 1);
    }
  });
  set(list, _list);
});

export const toggleItemAtom = atom(
  null,
  (get, set, item: Omit<$ListItem, "content">) => {
    console.log(item.id);
    const _list = produce(get(list), (draft) => {
      const index = draft.findIndex((v) => v.id === item.id);
      if (index > -1) {
        draft[index].complete = item.complete;
      }
      return draft;
    });
    console.log(_list);
    set(list, _list);
  },
);
