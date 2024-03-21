"use client";
import { register, Module } from "@/utils";
import { RootState } from "@/type/state";
import dynamic from "next/dynamic";
// const MainComponent = dynamic(() => import("./ui"), { ssr: false });
import Component from "./component";
import axios from "axios";

class MainModule extends Module<RootState, "MAIN"> {
  plus() {
    this.setState({
      count: (this.state as any).count + 1,
    });
  }
  doublePlus() {
    this.setState({
      count: (this.state as any).count + 1,
    });
    console.info(this.state);
    this.setState({
      count: (this.state as any).count + 1,
    });
  }
  initialCount(count: number) {
    this.setState({
      count,
    });
  }
  async onEnter() {
    const response = await axios.get("/api/count");
    this.initialCount(response.data.count as number);
  }
}

const page = register(
  new MainModule("MAIN", {
    count: 2,
  }),
);
export const actions = page?.getActions();

export default page?.attachLifecycle(Component);
