export const tryJsonParse = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (err) {
    console.error(err);
    return undefined;
  }
};
