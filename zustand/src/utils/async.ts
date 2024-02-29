export const waiting = (timer = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timer);
  });
};
