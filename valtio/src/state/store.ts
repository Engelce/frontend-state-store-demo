import { proxy } from "valtio";

export type Status = "pending" | "completed";
export type Filter = Status | "all";
export type Todo = {
  description: string;
  status: Status;
  id: number;
};

export const store = proxy<{ filter: Filter; todos: Todo[] }>({
  filter: "all",
  todos: [],
});

export const initTodo = (todos: Todo[]) => {
  store.todos.push({
    description: "343434",
    status: "pending",
    id: Date.now(),
  });
  console.info(todos);
  todos.map((v) => {
    store.todos.push({
      ...v,
      status: "pending",
      id: Date.now(),
    });
  });
};

export const addTodo = (description: string) => {
  store.todos.push({
    description,
    status: "pending",
    id: Date.now(),
  });
};

export const removeTodo = (id: number) => {
  const index = store.todos.findIndex((todo) => todo.id === id);
  if (index >= 0) {
    store.todos.splice(index, 1);
  }
};

export const toggleDone = (id: number, currentStatus: Status) => {
  const nextStatus = currentStatus === "pending" ? "completed" : "pending";
  const todo = store.todos.find((todo) => todo.id === id);
  if (todo) {
    todo.status = nextStatus;
  }
};

export const setFilter = (filter: Filter) => {
  store.filter = filter;
};
