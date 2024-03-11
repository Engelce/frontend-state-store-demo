import { type ActionHandler } from "./module";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface App {
  readonly store: any;
  readonly actionHandlers: { [actionType: string]: { handler: ActionHandler; moduleName: string } };
}

export const app = createApp();

function createApp(): App {
  const store = create(
    devtools((set) => ({
      app: {},
    }))
  );

  return {
    store,
    actionHandlers: {},
  };
}
