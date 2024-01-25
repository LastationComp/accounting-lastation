import { responseError } from '../Handling/Response';

export const ValidateAdmin = (args: any) => {
  if (process.env.NODE_ENV === 'production') {
    if (args?.token !== process.env.NEXT_SECRET) return false;
  }

  return true;
};
