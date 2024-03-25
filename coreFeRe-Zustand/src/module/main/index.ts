"use client";
import { register, Module, Loading } from "../../utils";
import { RootState } from "../../type/state";
// const MainComponent = dynamic(() => import("./component"), { ssr: false });
import Component from "./component";

export interface State {
  count: number;
}

class MainModule extends Module<RootState, "MAIN"> {
  async inc() {
    console.info(111);
    this.setState({
      count: this.state.count + 1,
    });
  }
  plus(value: number) {
    this.setState({
      count: value,
    });
  }
  dec() {
    this.setState({
      count: this.state.count - 1,
    });
  }
  resetCount(count: number) {
    this.setState(this.initialState);
  }
  async onEnter() {
    console.info(111);
    // const response = await axios.g("/api/count");
    // this.initialCount(response.data.count as number);
  }
}

const page = register(
  new MainModule("MAIN", {
    count: 0,
  })
);
export const actions = page?.getActions();

export default page?.attachLifecycle(Component);
