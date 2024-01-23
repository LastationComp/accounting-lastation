import { allNumbers, allWords } from './Data';

export const generatePasswords = (length: number = 8) => {
  let result: string = '';

  for (let index = 0; index < length; index++) {
    if (index % 2 === 0) {
      const randomIndexWords = Math.floor(Math.random() * allWords.length);
      result += allWords[randomIndexWords].toString();
    } else {
        const randomIndexNumber = Math.floor(Math.random() * allNumbers.length);
        result += allNumbers[randomIndexNumber].toString();
    }
    
  }
  return result
};
