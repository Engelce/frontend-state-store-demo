export const processTaskAsync = (handler: () => Promise<any>): AbortController => {
  const controller = new AbortController();

  Promise.race([
    handler(),
    new Promise((_, reject) => {
      controller.signal.addEventListener("abort", () => reject(new Error("Cancelled")));
    }),
  ]).catch(() => {
    // 目前设计是在handler内部处理 或许需要在这里监听取消？
  });

  return controller;
};
