"use client";

import { store, Status, Filter, Todo, addTodo, removeTodo, toggleDone, setFilter } from "@/state/store";
import React from "react";
import { useSnapshot } from "valtio";

const filterValues: Filter[] = ["all", "pending", "completed"];

const Filters = () => {
  const snap = useSnapshot(store);
  return (
    <nav>
      {filterValues.map((filter) => (
        <React.Fragment key={filter}>
          <input
            name="filter"
            type="radio"
            value={filter}
            checked={snap.filter === filter}
            onChange={() => setFilter(filter)}
          />
          <label>{filter}</label>
        </React.Fragment>
      ))}
    </nav>
  );
};

const CreateTodo = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <section>
      <input name="description" type="text" minLength={2} ref={inputRef} />
      <button className="add" onClick={() => addTodo(inputRef.current?.value ?? "")}>
        Add new
      </button>
    </section>
  );
};

export default function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const snap = useSnapshot(store);

  console.info(snap)

  return (
    <>
      <h1>
        To-do List{" "}
        <span role="img" aria-label="pen">
          ✏️
        </span>
      </h1>
      <Filters />
      <ul>
        {snap.todos
          .filter(({ status }) => status === snap.filter || snap.filter === "all")
          .map(({ description, status, id }) => {
            return (
              <li key={id}>
                <span data-status={status} className="description">
                  {description}
                </span>
                <button className="remove" onClick={() => removeTodo(id)}>
                  x
                </button>
              </li>
            );
          })}
      </ul>
      <CreateTodo />
    </>
  );
}
