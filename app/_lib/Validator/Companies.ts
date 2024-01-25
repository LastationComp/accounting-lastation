import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { ParsingZod } from '../Handling/ParsingWithErrorZod';
import { validateFormat } from './AccountingFormat';

export const CompaniesCreateInput = z.object({
  name: z
    .string({
      required_error: 'Name must be filled.',
      invalid_type_error: 'Name must be string.',
    })
    .min(1, { message: 'Name must be filled.' })
    .max(100)
    .refine(validateFormat, { message: 'Name format invalid.' }),
  address: z
    .string({
      required_error: 'Address must be filled.',
      invalid_type_error: 'Address must be string.',
    })
    .min(1, { message: 'Address must be filled.' })
    .max(1000)
    .refine(validateFormat, { message: 'Address format invalid.' }),
  email: z
    .string({
      required_error: 'Email must be filled.',
      invalid_type_error: 'Email is must be string.',
    })
    .min(1, { message: 'Email must be filled.' })
    .email({
      message: 'Email not validated.',
    })
    .refine(validateFormat, { message: 'Email format invalid.' }),
  service_days: z.number({
    required_error: 'Service Days must be filled.',
    invalid_type_error: 'Service Days must be number.',
  }),
});

export const CompanyExpiresUpdateInput = z.object({
  companyId: z.string().max(50).refine(validateFormat, { message: 'Company format invalid' }),
  service_days: z.number({
    required_error: 'Service Days must be filled.',
    invalid_type_error: 'Service Days must be number.',
  }),
});

export const CompanyExpiresUpdateValidate = (args: any) => {
  const result = CompanyExpiresUpdateInput.required().safeParse(args);
  return ParsingZod(result);
};

export const CompaniesCreateValidate = (args: any) => {
  const result = CompaniesCreateInput.required().safeParse(args);
  return ParsingZod(result);
};
