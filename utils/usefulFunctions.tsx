export const wait = (seconds: any) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};
