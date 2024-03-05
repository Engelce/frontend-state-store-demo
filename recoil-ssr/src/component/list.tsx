"use client";

import { User } from "@/state/user";

export const List = ({ users = [] }: { users?: User[] }) => {
  return (
    <ul>
      {users?.map((user, index) => (
        <li
          key={user.name + "-" + index}
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <div style={{ width: "200px" }}>{user.name}</div>
          <div style={{ width: "200px" }}>{user.email}</div>
          <div style={{ width: "200px" }}>{user.isAdmin ? "Admin" : ""}</div>
        </li>
      ))}
    </ul>
  );
};
