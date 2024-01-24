export const validateFormat = (value: string) => {
  const regex = new RegExp(/^\s+|[<>;:#$%^&*{}?]|\s{2,}/);
  return !regex.test(value);
};
