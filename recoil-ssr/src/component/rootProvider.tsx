"use client";

import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import { serverSideUsersState, userState } from "@/state/user";
import React from "react";

export const RootProvider = ({ data, children }: { data: any; children: React.ReactNode }) => {
  return (
    <RecoilRoot
      initializeState={({ set }) => {
        set(userState, data);
      }}
    >
      {/** 
      // async 
    <DataProvider /> */}
      {children}
    </RecoilRoot>
  );
};

export const DataProvider = () => {
  const initialUsers = useRecoilValue(serverSideUsersState);
  const [_, setUsers] = useRecoilState(userState);

  React.useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  return <div />;
};
