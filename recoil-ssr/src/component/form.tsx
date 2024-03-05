"use client";

import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { User, adminCountState, userState } from "@/state/user";

const initialForm = {
  name: "",
  email: "",
  isAdmin: false,
};

export const UserForm = () => {
  const [users, setUsers] = useRecoilState(userState);
  const [form, setForm] = React.useState<User>(initialForm);

  return (
    <div style={{ display: "flex", gap: "5px" }}>
      <input
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
        placeholder="set user name"
      />
      <input
        value={form.email}
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
        placeholder="set user email"
      />
      <label>
        Is Admin:
        <input
          value={form.isAdmin}
          type="checkbox"
          onChange={(e) =>
            setForm({
              ...form,
              isAdmin: e.target.value,
            })
          }
        />
      </label>
      <button
        disabled={!form.name || !form.email}
        onClick={() => {
          setUsers([...users, form]);
          setForm(initialForm);
        }}
      >
        Add User
      </button>
    </div>
  );
};
