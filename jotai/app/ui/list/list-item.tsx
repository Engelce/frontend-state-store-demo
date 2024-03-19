"use client";
import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { CustomCheckbox } from "@/app/ui/checkbox";
import { useSetAtom } from "jotai";
import { removeItemAtom, $ListItem, toggleItemAtom } from "@/app/store/store";

type Props = {
  item: $ListItem;
};
export const ListItem = ({ item }: Props) => {
  const removeItem = useSetAtom(removeItemAtom);
  const toggleItem = useSetAtom(toggleItemAtom);
  return (
    <div className="flex border-dashed border p-4 mt-4">
      <CustomCheckbox
        checked={item.complete}
        onChange={(e) => {
          toggleItem({ id: item.id, complete: e.target.checked });
        }}
      />
      <p
        className={`flex-1 ${lusitana.className} ${
          item.complete ? "line-through" : ""
        }`}
      >
        {item.content}
      </p>
      <TrashIcon
        className="ml-2 h-[18px] w-[18px] text-red-600 cursor-pointer"
        onClick={() => {
          removeItem(item.id);
        }}
      />
    </div>
  );
};
