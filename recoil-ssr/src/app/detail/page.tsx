"use client";

import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "@/state/user";
import { UserForm } from "@/component/form";
import { List } from "@/component/list";
import React from "react";

export default function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [users, setUsers] = useRecoilState(userState);

  return (
    <main>
      <h1>
        <a href="/">Link to Home</a>
      </h1>
      <UserForm />

      <List users={users ?? []} />
    </main>
  );
}
