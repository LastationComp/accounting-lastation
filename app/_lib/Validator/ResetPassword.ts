import { z } from 'zod';
import { ParsingZod } from '../Handling/ParsingWithErrorZod';
import { validateFormat } from './AccountingFormat';

const ResetPasswordFindInput = z.object({
  email: z
    .string({
      required_error: 'Email must be filled!',
      invalid_type_error: 'Email must be string!',
    })
    .email({
      message: 'Email format invalid!',
    }),
});

const ResetPasswordUpdateInput = z.object({
  type: z.enum(['company', 'employee'], {
    required_error: 'Type must be filled!',
    invalid_type_error: 'Type format is invalid',
  }),
  tokenId: z
    .string({
      required_error: 'Token ID must be filled!',
      invalid_type_error: 'Token ID must be string!',
    })
    .uuid({ message: 'Token ID format is invalid!' }),
  newPassword: z
    .string({
      required_error: 'New Password must be filled!',
      invalid_type_error: 'New Password must be string!',
    })
    .min(8, { message: 'New Password min is 8 characters!' })
    .max(20, { message: 'New Password max is 20 characters!' }),
  rePassword: z
    .string({
      required_error: 'Re Enter Password must be filled!',
      invalid_type_error: 'Re Enter Password must be string!',
    })
    .min(8, { message: 'Re Enter Password min is 8 characters!' })
    .max(20, { message: 'Re Enter Password max is 20 characters!' }),
});

export const resetPasswordValidate = (args: any) => {
  const result = ResetPasswordFindInput.safeParse(args);
  return ParsingZod(result);
};

export const resetPasswordUpdateValidate = (args: any) => {
  const result = ResetPasswordUpdateInput.safeParse(args);
  return ParsingZod(result);
};
