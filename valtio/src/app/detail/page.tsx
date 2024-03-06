"use client";

import React from "react";

export default function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <h1>
        <a href="/">Link to Home</a>
      </h1>
    </main>
  );
}
