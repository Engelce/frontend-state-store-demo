import { fromPromise, assign, setup } from "xstate";

const getUserInfo = (name: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name && password) {
        resolve({ name, userId: "001" });
      } else {
        reject("unknow error");
      }
    }, 2000);
  });
};

export const userMachine = setup({
  actors: {
    fetchUser: fromPromise(async ({ input }: any) => {
      const user = await getUserInfo(input.userName, input.password);

      return user;
    }),
  },
}).createMachine({
  types: {} as {
    context: {
      userId: string;
      password: string;
      user: object | undefined;
      error: unknown;
    };
  },
  id: "user",
  initial: "idle",
  context: {
    userName: "",
    password: "",
    user: undefined,
    error: undefined,
  },
  states: {
    idle: {
      on: {
        FETCH: { target: "loading" },
        EDIT: { target: "editing" },
      },
    },
    editing: {
      on: {
        ".changeName": {
          actions: assign({
            userName: ({ event }) => event.userName,
          }),
        },
        ".changePassword": {
          actions: assign({
            password: ({ event }) => event.password,
          }),
        },
        ".commit": {
          target: "loading",
        },
      },
    },
    loading: {
      invoke: {
        id: "getUser",
        src: "fetchUser",
        input: ({ context: { userName, password } }) => ({
          userName,
          password,
        }),
        onDone: {
          target: "success",
          actions: assign({ user: ({ event }) => event.output }),
        },
        onError: {
          target: "failure",
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    success: {
      type: "final",
    },
    failure: {
      on: {
        RETRY: { target: "loading" },
      },
    },
  },
});
