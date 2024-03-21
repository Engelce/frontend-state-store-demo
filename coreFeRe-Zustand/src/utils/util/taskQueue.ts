export const processTaskAsync = (handler: (signal: AbortSignal) => Promise<any>): AbortController => {
    const controller = new AbortController();
    handler(controller.signal);

    return controller;
};
