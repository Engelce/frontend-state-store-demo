import { app } from "./app";
import { Module, type ModuleLifecycleListener } from "./platform/Module";
import { ModuleProxy } from "./platform/ModuleProxy";
import { type SagaGenerator } from "./typed-saga";
import { produce } from "immer";

export interface TickIntervalDecoratorFlag {
  tickInterval?: number;
}

export type ActionHandler = (...args: any[]) => SagaGenerator;

export function register<M extends Module<any, any>>(module: M): ModuleProxy<M> {
  const moduleName: string = module.name;
  if (!app?.store.getState().app[moduleName]) {
    // To get private property
    app.store.setState(
      produce(app.store.getState(), (draft) => {
        draft[moduleName] = {
          count: 0,
        };
      })
    );
  }

  const actions: any = {};
  getMethods(module).forEach(({ name: actionType, method }) => {
    // Attach action name, for @Log / error handler reflection
    const qualifiedActionType = `${moduleName}/${actionType}`;
    method.actionName = qualifiedActionType;
    actions[actionType] = method.bind(module);

    app.actionHandlers[qualifiedActionType] = {
      handler: method.bind(module),
      moduleName,
    };
  });
  return new ModuleProxy(module, actions);
}
function getMethods<M extends Module<any, any>>(module: M): Array<{ name: string; method: any }> {
  // Do not use Object.keys(Object.getPrototypeOf(module)), because class methods are not enumerable
  const keys: Array<{ name: string; method: any }> = [];
  for (const propertyName of Object.getOwnPropertyNames(Object.getPrototypeOf(module))) {
    const method = Reflect.get(module, propertyName);
    if (method instanceof Function && propertyName !== "constructor") {
      keys.push({ name: propertyName, method });
    }
  }
  return keys;
}
