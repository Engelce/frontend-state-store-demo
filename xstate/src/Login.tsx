import { useEffect } from "react";
import { Test } from "./Test";
import { GlobalMachineContext } from "./main";

export default function Login() {
  const state = GlobalMachineContext.useSelector((state) => state);
  const { send } = GlobalMachineContext.useActorRef();
  useEffect(() => {
    send({ type: "EDIT" });
  }, []);
  const onChangeUserName = (e: any) => {
    send({ type: ".changeName", userName: e.target.value });
    // send({ type: "text.change", name: e.target.value });
  };
  const onChangePassword = (e: any) => {
    send({ type: ".changePassword", password: e.target.value });
  };
  const onPress = () => {
    send({ type: ".commit" });
    // send({ type: "text.commit" });
  };
  const {
    context: { userName, password, user },
  } = state;
  return user ? (
    <div>Welcome, {user.name}</div>
  ) : (
    <div>
      <div>
        <label htmlFor="name">User Name</label>
        <input
          value={userName}
          id="name"
          type="text"
          onChange={onChangeUserName}
        />
        <label htmlFor="name">Password</label>
        <input
          value={password}
          id="password"
          type="password"
          onChange={onChangePassword}
        />
      </div>
      {state.matches("loading") && <p>fetching ...</p>}
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={state.matches("loading")}
          style={{ marginLeft: "20px" }}
          onClick={onPress}
        >
          Submit
        </button>
      </div>
      <Test />
    </div>
  );
}
