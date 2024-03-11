"use client";

import React from "react";

interface BootstrapOption {
  componentType: React.ComponentType | null;
  rootContainer?: HTMLElement;
}

export function bootstrap(option: BootstrapOption): any {
  return renderRoot(option.componentType);
}

function renderRoot(EntryComponent: React.ComponentType | null) {
  const RootProvider = ({ children }: { children: React.ReactNode }) => children;
  if (EntryComponent === null) {
    return RootProvider;
  }
}
