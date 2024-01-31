import { EmailCredentialsTemplate } from '@/app/_components/Mailer/EmailCredentialsTemplate';
import { generatePasswords } from '@/app/_lib/Generator/PasswordGenerators';
import { responseError, responseSuccess } from '@/app/_lib/Handling/Response';
import { prisma } from '@/app/_lib/Prisma/Client';
import MailService from '@/app/_lib/Service/Mail';
import { EmployeesCreateValidate } from '@/app/_lib/Validator/Employees';
import { render } from '@react-email/render';
import bcrypt from 'bcrypt';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') ?? '';
  const isActive = req.nextUrl.searchParams.get('isactive') === 'false' ? true : false;
  const company = await prisma.company.findFirst({
    where: {
      id: id,
    },
    select: {
      employees: {
        where: {
          is_active: isActive,
        },
        orderBy: {
          created_at: 'desc',
        },
        select: {
          id: true,
          name: true,
          employee_code: true,
          is_active: true,
        },
      },
    },
  });

  await prisma.$disconnect();
  return responseSuccess({
    employees: company?.employees ?? [],
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = EmployeesCreateValidate(body);

  if (!result.success) return responseError(result);

  const validated = result.data;

  let password: string = generatePasswords(12);
  let companyId: string = body.companyId;
  const hashedPassword: string = await bcrypt.hash(password, 10);

  const data: any = {
    name: validated.name,
    email: validated.email,
    username: validated.username,
    password: hashedPassword,
    employee_code: '',
  };

  const usernameExist = await prisma.employees.findUnique({
    where: {
      username: validated.username,
    },
    select: {
      name: true,
    },
  });

  if (usernameExist?.name) return responseError(`Username already exists`);

  const emailExists = await prisma.employees.findUnique({
    where: {
      email: validated.email,
    },
    select: {
      name: true,
    },
  });

  if (emailExists?.name) return responseError(`Email already exists`);

  if (!companyId) return responseError('Unauthorized.', 401);

  const createEmployee = await prisma.company.update({
    where: {
      id: companyId,
    },
    data: {
      employees: {
        createMany: {
          data: [data],
        },
      },
    },
    select: {
      name: true,
      license_key: true,
    },
  });

  await prisma.$disconnect();

  if (!createEmployee) return responseError('Employee failed to created.');

  const mailService = MailService.getInstance();
  const template = render(
    EmailCredentialsTemplate({
      company_name: createEmployee.name,
      name: validated.name,
      license_key: createEmployee.license_key,
      username: validated.username,
      password: password,
    })
  );

  mailService.sendMail({
    to: validated.email,
    subject: 'You has been added!',
    html: template,
  });

  return responseSuccess({
    message: 'Employee Success Created! Please make sure your Employee to check the Email.',
  });
}
