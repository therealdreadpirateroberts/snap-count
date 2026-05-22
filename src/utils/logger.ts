export const log = (scope: string, ...args: unknown[]) => {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.log(`[${scope}]`, ...args);
  }
};
