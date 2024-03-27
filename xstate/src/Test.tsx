import { GlobalMachineContext } from "./main";

export const Test = () => {
  const state = GlobalMachineContext.useSelector((state) => state.context);
  console.log("Test", state);
  return <></>;
};
