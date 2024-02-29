import { useNavigate } from "react-router-dom";
import { useLoginStore } from "./store/login";

export default function Login() {
  const navigate = useNavigate();
  const { name, updateName } = useLoginStore();
  // const { name, updateName } = useLoginStore((state) => {
  //   return { name: state.name, updateName: state.updateName };
  // });

  const onLogin = () => {
    if (!name) {
      alert("Please entry name!");
      return;
    }

    navigate("/app");
  };

  return (
    <div>
      <label htmlFor="name">Name</label>
      <input
        value={name}
        onChange={(e) => updateName(e.target.value)}
        id="name"
        type="text"
        placeholder="please entry name"
      />
      <button onClick={onLogin}>Login</button>
    </div>
  );
}
