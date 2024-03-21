import { State } from "../utils";
import { State as MainState } from "../module/main";

export interface RootState extends State {
  app: {
    MAIN: MainState;
  };
}
