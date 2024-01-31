import { z } from 'zod';
import { ParsingZod } from '../Handling/ParsingWithErrorZod';
import { validateFormat } from './AccountingFormat';

export const EmployeeCreateInput = z.object({
  name: z
    .string({
      required_error: 'Name Must be Filled!',
      invalid_type_error: 'Name Must be a String!',
    })
    .max(100)
    .min(1, { message: 'Name must be filled!' })
    .refine(validateFormat, { message: 'Name format invalid' }),
  email: z
    .string({
      required_error: 'Email Must be Filled!',
      invalid_type_error: 'Email Must be a String!',
    })
    .email({
      message: 'Email not Validated!',
    }),
  username: z
    .string({
      required_error: 'Username Must be Filled!',
      invalid_type_error: 'Username must be a String',
    })
    .max(100)
    .min(1, { message: 'Username must be filled!' })
    .regex(/^[a-z0-9\_]+$/, {
      message: 'Username Format Invalid! Following lowercase a-z or number.',
    }),
});

export const EmployeeUpdateInput = z.object({
  name: z
    .string({
      required_error: 'Name Must be Filled!',
      invalid_type_error: 'Name Must be a String!',
    })
    .max(100)
    .min(1)
    .refine(validateFormat, { message: 'Name Format Invalid!' }),
  username: z
    .string({
      required_error: 'Username Must be Filled!',
      invalid_type_error: 'Username must be a String!',
    })
    .max(100)
    .min(1)
    .refine(validateFormat, { message: 'Username Format Invalid!' }),
});

export const EmployeeUpdateProfileInput = z.object({
  name: z
    .string({
      required_error: 'Name Must be Filled!',
      invalid_type_error: 'Name must be a String',
    })
    .max(50)
    .min(1)
    .refine(validateFormat, { message: 'Name Format Invalid!' }),

  username: z
    .string({
      required_error: 'Username Must Be Filled!',
      invalid_type_error: 'Username Must Be String!',
    })
    .max(50)
    .min(1)
    .refine(validateFormat, { message: 'Username Format Invalid!' }),
});

export const EmployeesCreateValidate = (args: any) => {
  const result = EmployeeCreateInput.safeParse(args);
  return ParsingZod(result);
};

export const EmployeeUpdateValidate = (args: any) => {
  const result = EmployeeUpdateInput.safeParse(args);
  return ParsingZod(result);
};

export const EmployeeProfileUpdateValidator = (args: any) => {
  const result = EmployeeUpdateProfileInput.safeParse(args);
  return ParsingZod(result);
};
