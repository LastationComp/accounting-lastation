import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { ParsingZod } from '../Handling/ParsingWithErrorZod';

export const CompaniesCreateInput = z.object({
  name: z
    .string({
      required_error: 'Name must be filled.',
      invalid_type_error: 'Name must be string.',
    })
    .max(100),
  address: z
    .string({
      required_error: 'Address must be filled.',
      invalid_type_error: 'Address must be string.',
    })
    .max(1000),
  email: z
    .string({
      required_error: 'Email must be filled.',
      invalid_type_error: 'Email is must be string.',
    })
    .email({
      message: 'Email not validated.',
    }),
  service_days: z.number({
    required_error: 'Service Days must be filled.',
    invalid_type_error: 'Service Days must be number.',
  }),
});

export const CompaniesCreateValidate = (args: any) => {
  const result = CompaniesCreateInput.safeParse(args);
  return ParsingZod(result);
};
