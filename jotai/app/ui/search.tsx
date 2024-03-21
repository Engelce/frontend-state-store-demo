"use client";
import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { addItemAtom } from "@/app/store/store";
import { useSetAtom } from "jotai";

type Props = {};
export const Search = (props: Props) => {
  const [value, setValue] = useState("");
  const addItem = useSetAtom(addItemAtom);
  return (
    <div className="flex">
      <div className="relative flex flex-1 flex-shrink-0 mr-4">
        <label htmlFor="search" className="sr-only">
          Add
        </label>
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      <button
        disabled={!value}
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-500"
        onClick={() => {
          addItem({
            id: Math.random().toString(32).slice(8),
            complete: false,
            content: value,
          });
        }}
      >
        add
      </button>
    </div>
  );
};
