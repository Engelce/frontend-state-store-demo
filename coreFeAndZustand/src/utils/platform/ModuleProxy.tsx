import React from "react";
import { Module } from "./Module";

let startupModuleName: string | null = null;

export class ModuleProxy<M extends Module<any, any>> {
  constructor(private module: M, private actions: any) {}

  getActions(): any {
    return this.actions;
  }

  attachLifecycle<P extends object>(ComponentType: React.ComponentType<P>): React.ComponentType<P> {
    const moduleName = this.module.name as string;
    const lifecycleListener = this.module as any;

    return class extends React.PureComponent<P> {
      static displayName = `Module[${moduleName}]`;

      constructor(props: P) {
        super(props);
        if (!startupModuleName) {
          startupModuleName = moduleName;
        }
      }

      override componentDidMount() {
        lifecycleListener.onEnter();
      }

      override componentDidUpdate(prevProps: Readonly<P>) {}

      override componentWillUnmount() {}

      override render() {
        return <ComponentType {...this.props} />;
      }
    };
  }
}
