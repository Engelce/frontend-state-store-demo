import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div>
      <label htmlFor="name">Name</label>
      <input id="name" type="text" />
      <button onClick={() => navigate("/app")}>Login</button>
    </div>
  );
}
