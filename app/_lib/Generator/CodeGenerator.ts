import { generatePasswords } from './PasswordGenerators';

export const generateByName = (value: string) => {
  let result: string = '';
  const valueArray = value.split(' ');

  if (valueArray.length === 1) {
    result = valueArray[0].split('')[0];
    return result + '-' + generatePasswords(4);
  }

  valueArray.forEach((word: string, i: number) => {
    result += word.split('')[0];
  });

  return result + '-' + generatePasswords(4);
};
