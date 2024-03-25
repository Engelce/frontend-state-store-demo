import React from "react";
import { actions } from "..";
import { app } from "../../../utils/app";
import { useStore } from "../../../utils/platform/bootstrap";

const Page = () => {
  const mainState = useStore((state) => {
    return state.app.MAIN;
  });

  return (
    <div>
      <h1>count {mainState.count}</h1>
      <div>
        <button onClick={async () => await actions.inc()}>Inc</button>.<button onClick={actions.dec}>Dec</button>
      </div>
    </div>
  );
};

export default Page;
