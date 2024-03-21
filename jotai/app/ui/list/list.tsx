"use client";
import React from "react";
import { ListItem } from "@/app/ui/list/list-item";
import { list } from "@/app/store/store";
import { useAtomValue } from "jotai";
import ListBulletIcon from "@heroicons/react/24/outline/ListBulletIcon";
import { lusitana } from "@/app/ui/fonts";

type Props = {};
export const List = (props: Props) => {
  const data = useAtomValue(list);
  if (data.length === 0)
    return (
      <div className="container mx-auto flex items-center justify-center py-16 border-solid border border-gray-100 mt-3 rounded">
        <p className={`${lusitana.className} font-bold mr-4`}>No data</p>
        <ListBulletIcon className="w-[24px] h-[24px]" />
      </div>
    );
  return (
    <div>
      {data.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  );
};
