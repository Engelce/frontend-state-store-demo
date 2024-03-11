import { State } from "@/utils";
import { State as UserState } from "@/module/user/type";

export interface RootState extends State {
  app: {
    MAIN: {
      count: number;
    };
    USER: UserState;
  };
}
