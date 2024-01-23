import { generateByName } from '@/app/_lib/Generator/CodeGenerator';
import { generatePasswords } from '@/app/_lib/Generator/PasswordGenerators';
import { responseError, responseSuccess } from '@/app/_lib/Handling/Response';
import { prisma } from '@/app/_lib/Prisma/Client';
import { CompaniesCreateValidate } from '@/app/_lib/Validator/Companies';

export async function POST(req: Request) {
  const body = await req.json();
  const result = CompaniesCreateValidate(body);

  if (!result.success) return responseError(result);

  const validated = result.data;

  let username: string = validated.name;
  username = username.toString().toLocaleLowerCase().replaceAll(' ', '');
  let password: string = generatePasswords(12);
  let company_code: string = generateByName(validated.name);

  const expires_at = new Date();
  expires_at.setDate(new Date().getDate() + validated.service_days);
  const data: any = {
    name: validated.name,
    email: validated.email,
    username: username,
    company_code: company_code,
    password: password,
    address: validated.address,
    expires_at: new Date(expires_at),
  };

  const createCompany = await prisma.company.create({
    data: data,
  });


  await prisma.$disconnect();
  
  return responseSuccess({
    message: 'Success Created',
    data: createCompany,
  });
  //update
}
