import React from "react";
import { app } from "@/utils/app";
import { actions } from "..";

const Page = () => {
  const state = app.store((state) => state.app.USER);

  console.info("USER", 22222);

  return (
    <div>
      <button onClick={async () => await actions.plus()}>{state?.count}</button>
      <button onClick={async () => await actions.doublePlus()}>{state?.count} Double Plus</button>
    </div>
  );
};

export default Page;
