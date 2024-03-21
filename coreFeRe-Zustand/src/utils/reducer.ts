import { type RouterState } from "redux-first-history";
import { combineReducers, type Action as ReduxAction, type Reducer } from "redux";
import { DEFAULT_IDLE_TIMEOUT } from "./util/IdleDetector";

// Redux State
interface LoadingState {
  [loading: string]: number;
}

export interface IdleState {
  timeout: number;
  state: "active" | "idle";
}

export interface State {
  loading: LoadingState;
  router: RouterState;
  navigationPrevented: boolean;
  app: Record<string, any>;
  idle: IdleState;
}

// Redux Action
const SET_STATE_ACTION = "@@framework/setState";

// Redux Action: SetState (to update state.app)
interface SetStateActionPayload {
  module: string;
  state: any;
}

export const LOADING_ACTION = "@@framework/loading";

// Redux Action: Navigation Prevent (to update state.navigationPrevented)
interface NavigationPreventionActionPayload {
  isPrevented: boolean;
}

const NAVIGATION_PREVENTION_ACTION = "@@framework/navigation-prevention";

// Redux Action: Idle state  (to update state.idle)
interface IdleStateActionPayload {
  state: "active" | "idle";
}

export const IDLE_STATE_ACTION = "@@framework/idle-state";

// Redux Action: Idle timeout (to update state.timeout)

const IDLE_TIMEOUT_ACTION = "@@framework/idle-timeout";

// Helper function, to determine if show loading
export function showLoading(state: State, identifier: string = "global") {
  return state.loading[identifier] > 0;
}
