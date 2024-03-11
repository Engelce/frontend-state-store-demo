import { produce, enablePatches } from "immer";
import { app } from "../app";
import type { Location } from "history";

if (process.env.NODE_ENV === "development") enablePatches();

export interface State {
  app: Record<string, any>;
}

export type ModuleLocation<State> = Location<Readonly<State> | undefined>;

export interface ModuleLifecycleListener {
  onEnter: (entryComponentProps?: any) => void;
  onDestroy: () => void;
}

export class Module<RootState extends State, ModuleName extends keyof RootState["app"] & string>
  implements ModuleLifecycleListener
{
  constructor(readonly name: ModuleName, readonly initialState: RootState["app"][ModuleName]) {}

  onEnter(entryComponentProps: any) {}

  onDestroy() {}

  get state(): Readonly<RootState["app"][ModuleName]> {
    return this.rootState.app[this.name];
  }

  get rootState(): Readonly<RootState> {
    return app.store.getState() as Readonly<RootState>;
  }

  setState(state: any): void {
    app.store.setState({
      ...this.rootState,
      app: {
        ...this.rootState.app,
        [this.name]: {
          ...this.rootState.app[this.name],
          ...state,
        },
      },
    });
  }
}
