import { generateByName } from '@/app/_lib/Generator/CodeGenerator';
import { generatePasswords } from '@/app/_lib/Generator/PasswordGenerators';
import { responseError, responseSuccess } from '@/app/_lib/Handling/Response';
import { prisma } from '@/app/_lib/Prisma/Client';
import MailService from '@/app/_lib/Service/Mail';
import { CompaniesCreateValidate } from '@/app/_lib/Validator/Companies';
import { render } from '@react-email/render';
import bcrypt from 'bcrypt';
import { CredentialsTemplate } from '@/app/_components/Mailer/CredentialsTemplate';

export async function POST(req: Request) {
  const body = await req.json();
  const result = CompaniesCreateValidate(body);

  if (!result.success) return responseError(result);

  const validated = result.data;

  let username: string = validated.name;
  username = username.toString().toLocaleLowerCase().replaceAll(' ', '');
  let password: string = generatePasswords(12);
  let company_code: string = generateByName(validated.name);
  const hashedPassword: string = await bcrypt.hash(password, 10);

  const expires_at = new Date();
  expires_at.setDate(new Date().getDate() + validated.service_days);
  const data: any = {
    name: validated.name,
    email: validated.email,
    username: username,
    company_code: company_code,
    password: hashedPassword,
    address: validated.address,
    expires_at: new Date(expires_at),
  };

  const nameExists = await prisma.company.findUnique({
    where: {
      username: username,
    },
    select: {
      name: true,
    },
  });

  if (nameExists?.name) return responseError(`Username already exists.`);

  const emailExists = await prisma.company.findUnique({
    where: {
      email: validated.email,
    },
    select: {
      name: true,
    },
  });

  if (emailExists?.name) return responseError(`Email already exists.`);

  const createCompany = await prisma.company.create({
    data: data,
  });

  await prisma.$disconnect();

  if (createCompany) {
    const mailService = MailService.getInstance();
    const template = render(
      CredentialsTemplate({
        name: validated.name,
        license_key: createCompany.license_key,
        username: username,
        password: password,
      })
    );
    mailService.sendMail({
      to: data.email,
      subject: 'Thanks for Subscription!',
      html: template,
    });
  }
  return responseSuccess({
    message: 'Company successfully created! Please check the email',
  });
}
