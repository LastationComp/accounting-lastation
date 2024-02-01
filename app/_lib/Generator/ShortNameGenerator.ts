export const generateShortName = (fullName: string = '') => {
  const words = fullName.trim().split(' ');

  let result = '';
  words.slice(0,2).forEach((word) => {
    result += word.split('')[0];
  });

  return result;
};
