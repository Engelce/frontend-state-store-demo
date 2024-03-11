import { State } from "@/utils";
import { useMemo } from "react";
import { useSelector } from "@/utils";
import { RootState } from "../type/state";

export const useRuntimeState = <T extends keyof RootState["app"]>(moduleStateName: T): RootState["app"][T] => {
  const state = useSelector((state: State) => (state.app as RootState["app"])[moduleStateName]);

  return useMemo(() => state, [state]);
};
