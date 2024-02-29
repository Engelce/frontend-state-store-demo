import { useState, useEffect } from "react";
import { useAppStore } from "./store/app";

function App() {
  const [name, setName] = useState("");
  const { list, getList, updateList } = useAppStore();

  useEffect(() => {
    getList();
  }, []);

  const onPlus = () => {
    updateList([...list, name]);
    setName("");
  };
  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />
      <button onClick={onPlus}>Plus</button>
      <div>
        {list.map((str) => {
          return (
            <div
              key={str}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <div>{str}</div>
              <button onClick={() => updateList(list.filter((v) => v !== str))}>
                X
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
