"use client";
import React, { ChangeEventHandler } from "react";

type Props = {
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export const CustomCheckbox = ({ checked, onChange }: Props) => {
  return (
    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name="checkbox"
        id="checkbox"
        checked={checked}
        onChange={onChange}
        className="block w-6 h-6 cursor-pointer"
      />
    </div>
  );
};
