import React from "react";
import { app } from "../app";
import { executeAction } from "../module";
import { Module, type ModuleLifecycleListener } from "./Module";
import type { Location } from "history";
import type { RouteComponentProps } from "react-router";
import { processTaskAsync } from "../util/taskQueue";
import { setNavigationPrevented } from "../storeActions";
import { ErrorListener } from "core-fe";

let startupModuleName: string | null = null;

type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type Actions<M> = {
  [K in Exclude<FunctionKeys<M>, keyof Module<any, any> | keyof ErrorListener>]: M[K];
};

export class ModuleProxy<M extends Module<any, any>> {
  constructor(private module: M, private actions: Actions<M>) {}

  getActions(): Actions<M> {
    return this.actions;
  }

  attachLifecycle<P extends object>(ComponentType: React.ComponentType<P>): React.ComponentType<P> {
    const moduleName = this.module.name as string;
    const lifecycleListener = this.module as ModuleLifecycleListener;
    const modulePrototype = Object.getPrototypeOf(lifecycleListener);
    const actions = this.actions as any;

    return class extends React.PureComponent<P> {
      static displayName = `Module[${moduleName}]`;
      private lifecycleController: AbortController | null = null;
      private lastDidUpdateController: AbortController | null = null;
      private tickCount: number = 0;
      private mountedTime: number = Date.now();

      constructor(props: P) {
        super(props);
        if (!startupModuleName) {
          startupModuleName = moduleName;
        }
      }

      override componentDidMount() {
        this.lifecycleController = processTaskAsync(async () => await this.lifecycle.call(this));
      }

      override async componentDidUpdate(prevProps: Readonly<P>) {
        const prevLocation = (prevProps as any).location;
        const props = this.props as RouteComponentProps & P;
        const currentLocation = props.location;
        const currentRouteParams = props.match ? props.match.params : null;

        /**
         * Only trigger onLocationMatched if current component is connected to <Route>, and location literally changed.
         *
         * CAVEAT:
         *  Do not use !== to compare locations.
         *  Because in "connected-react-router", location from rootState.router.location is not equal to current history.location in reference.
         */
        if (
          currentLocation &&
          currentRouteParams &&
          !this.areLocationsPathNameEqual(currentLocation, prevLocation) &&
          this.hasOwnLifecycle("onPathnameMatched")
        ) {
          try {
            this.lastDidUpdateController?.abort();
          } catch (e) {
            // In rare case, it may throw error, just ignore
          }

          const action = `${moduleName}/@@PATHNAME_MATCHED`;
          const startTime = Date.now();
          this.lastDidUpdateController = processTaskAsync(async (signal) => {
            await executeAction({
              actionName: action,
              handler: lifecycleListener.onPathnameMatched.bind(lifecycleListener),
              payload: [currentRouteParams, currentLocation],
              signal,
            });
            app.logger.info({
              action,
              elapsedTime: Date.now() - startTime,
              info: {
                // URL params should not contain any sensitive or complicated objects
                route_params: JSON.stringify(currentRouteParams),
                history_state: JSON.stringify(currentLocation.state),
              },
            });
          });
          setNavigationPrevented(false);
        }

        /**
         * Only trigger onLocationMatched if current component is connected to <Route>, and location literally changed.
         *
         * CAVEAT:
         *  Do not use !== to compare locations.
         *  Because in "connected-react-router", location from rootState.router.location is not equal to current history.location in reference.
         */
        if (
          currentLocation &&
          currentRouteParams &&
          !this.areLocationsEqual(currentLocation, prevLocation) &&
          this.hasOwnLifecycle("onLocationMatched")
        ) {
          try {
            this.lastDidUpdateController?.abort();
          } catch (e) {
            // In rare case, it may throw error, just ignore
          }
          const action = `${moduleName}/@@LOCATION_MATCHED`;
          const startTime = Date.now();

          this.lastDidUpdateController = processTaskAsync(async (signal) => {
            await executeAction({
              actionName: action,
              handler: lifecycleListener.onLocationMatched.bind(lifecycleListener),
              payload: [currentRouteParams, currentLocation],
              signal,
            });
            app.logger.info({
              action,
              elapsedTime: Date.now() - startTime,
              info: {
                // URL params should not contain any sensitive or complicated objects
                route_params: JSON.stringify(currentRouteParams),
                history_state: JSON.stringify(currentLocation.state),
              },
            });
          });
          setNavigationPrevented(false);
        }
      }

      override componentWillUnmount() {
        if (this.hasOwnLifecycle("onDestroy")) {
          actions.onDestroy();
        }

        const currentLocation = (this.props as any).location;
        if (currentLocation) {
          // Only cancel navigation prevention if current component is connected to <Route>
          setNavigationPrevented(false);
        }
        // TODO 待替换
        // app.sagaMiddleware.run(function* () {
        //     yield put({type: `@@${moduleName}/@@cancel-saga`});
        // });

        app.logger.info({
          action: `${moduleName}/@@DESTROY`,
          stats: {
            tick_count: this.tickCount,
            staying_second: (Date.now() - this.mountedTime) / 1000,
          },
        });

        try {
          this.lastDidUpdateController?.abort();
          this.lifecycleController?.abort();
        } catch (e) {
          // In rare case, it may throw error, just ignore
        }
      }

      override render() {
        return <ComponentType {...this.props} />;
      }

      private areLocationsEqual = (a: Location, b: Location): boolean => {
        return (
          a.pathname === b.pathname &&
          a.search === b.search &&
          a.hash === b.hash &&
          a.key === b.key &&
          a.state === b.state
        );
      };

      private areLocationsPathNameEqual = (a: Location, b: Location): boolean => {
        return a.pathname === b.pathname;
      };

      private hasOwnLifecycle = (methodName: keyof ModuleLifecycleListener): boolean => {
        return Object.prototype.hasOwnProperty.call(modulePrototype, methodName);
      };

      private async lifecycle() {
        const props = this.props as RouteComponentProps & P;

        const enterActionName = `${moduleName}/@@ENTER`;
        const startTime = Date.now();

        await executeAction({
          actionName: enterActionName,
          handler: lifecycleListener.onEnter.bind(lifecycleListener),
          payload: [props],
        });

        app.logger.info({
          action: enterActionName,
          elapsedTime: Date.now() - startTime,
          info: {
            component_props: JSON.stringify(props),
          },
        });

        if (this.hasOwnLifecycle("onPathnameMatched")) {
          if ("match" in props && "location" in props) {
            const initialRenderActionName = `${moduleName}/@@PATHNAME_MATCHED`;
            const startTime = Date.now();
            const routeParams = props.match.params;
            await executeAction({
              actionName: initialRenderActionName,
              handler: lifecycleListener.onPathnameMatched.bind(lifecycleListener),
              payload: [routeParams, props.location],
            });
            app.logger.info({
              action: initialRenderActionName,
              elapsedTime: Date.now() - startTime,
              info: {
                route_params: JSON.stringify(props.match.params),
                history_state: JSON.stringify(props.location.state),
              },
            });
          } else {
            console.error(
              `[framework] Module component [${moduleName}] is non-route, use onEnter() instead of onPathnameMatched()`
            );
          }
        }

        if (this.hasOwnLifecycle("onLocationMatched")) {
          if ("match" in props && "location" in props) {
            const initialRenderActionName = `${moduleName}/@@LOCATION_MATCHED`;
            const startTime = Date.now();
            const routeParams = props.match.params;
            await executeAction({
              actionName: initialRenderActionName,
              handler: lifecycleListener.onLocationMatched.bind(lifecycleListener),
              payload: [routeParams, props.location],
            });
            app.logger.info({
              action: initialRenderActionName,
              elapsedTime: Date.now() - startTime,
              info: {
                route_params: JSON.stringify(props.match.params),
                history_state: JSON.stringify(props.location.state),
              },
            });
          } else {
            console.error(
              `[framework] Module component [${moduleName}] is non-route, use onEnter() instead of onLocationMatched()`
            );
          }
        }

        if (moduleName === startupModuleName) {
          createStartupPerformanceLog(`${moduleName}/@@STARTUP_PERF`);
        }

        if (this.hasOwnLifecycle("onTick")) {
          await this.onTickWatcher.call(this);
        }
      }

      private async onTickWatcher() {
        let runningIntervalTask: AbortController = processTaskAsync(async () => {
          this.onTick.call(this);
        });
        while (true) {
          //  TODO 替换
          // yield take(IDLE_STATE_ACTION);
          // yield cancel(runningIntervalTask); // no-op if already cancelled
          // const isActive: boolean = yield select((state: State) => state.idle.state === "active");
          // if (isActive) {
          //     runningIntervalTask = yield fork(this.onTickSaga.bind(this));
          // }
        }
      }

      private async onTick() {
        //  TODO 替换
        // const tickIntervalInMillisecond = (lifecycleListener.onTick.tickInterval || 5) * 1000;
        // const boundTicker = lifecycleListener.onTick.bind(lifecycleListener);
        // const tickActionName = `${moduleName}/@@TICK`;
        // while (true) {
        //     yield rawCall(executeAction, tickActionName, boundTicker);
        //     this.tickCount++;
        //     yield delay(tickIntervalInMillisecond);
        // }
      }
    };
  }
}

function createStartupPerformanceLog(actionName: string): void {
  // TODO: use new API
  if (window.performance && performance.timing) {
    // For performance timing API, please refer: https://www.w3.org/blog/2012/09/performance-timing-information/
    const now = Date.now();
    const perfTiming = performance.timing;
    const baseTime = perfTiming.navigationStart;
    const duration = now - baseTime;
    const stats: { [key: string]: number } = {};

    const createStat = (key: string, timeStamp: number) => {
      if (timeStamp >= baseTime) {
        stats[key] = timeStamp - baseTime;
      }
    };

    createStat("http_start", perfTiming.requestStart);
    createStat("http_end", perfTiming.responseEnd);
    createStat("dom_start", perfTiming.domLoading);
    createStat("dom_content", perfTiming.domContentLoadedEventEnd); // Mostly same time with domContentLoadedEventStart
    createStat("dom_end", perfTiming.loadEventEnd); // Mostly same with domComplete/loadEventStart

    const slowStartupThreshold = app.loggerConfig?.slowStartupThresholdInSecond || 5;
    if (duration / 1000 >= slowStartupThreshold) {
      app.logger.warn({
        action: actionName,
        elapsedTime: duration,
        stats,
        errorCode: "SLOW_STARTUP",
        errorMessage: `Startup took ${(duration / 1000).toFixed(2)} sec, longer than ${slowStartupThreshold}`,
      });
    } else {
      app.logger.info({
        action: actionName,
        elapsedTime: duration,
        stats,
      });
    }
  }
}
