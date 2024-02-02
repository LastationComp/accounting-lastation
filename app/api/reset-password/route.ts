import { responseError, responseSuccess } from '@/app/_lib/Handling/Response';
import { resetPasswordValidate } from '@/app/_lib/Validator/ResetPassword';
import { NextRequest } from 'next/server';
import prisma from '@/app/_lib/Prisma/Client';
import { generatePasswords } from '@/app/_lib/Generator/PasswordGenerators';
import { getAllDateByRegion } from '@/app/_lib/Parser/DateLocal';
import MailService from '@/app/_lib/Service/Mail';
import { render } from '@react-email/render';
import { ResetPasswordTemplate } from '@/app/_components/Mailer/ResetPasswordTemplate';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? '';
  const email = req.nextUrl.searchParams.get('email') ?? '';

  try {
    const validateResetPassword = await prisma.resetPasswords.findFirst({
      where: {
        email: email,
        token: token,
        is_used: false,
        expires_left: {
          not: {
            lt: getAllDateByRegion('Asia/Jakarta'),
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        token: true,
        expires_left: true,
      },
    });

    if (!validateResetPassword?.token) return responseError('Reset Password invalid! Please send reset password request again.');

    return responseSuccess({
      message: 'Token Valid',
      tokenId: validateResetPassword.id,
    });
  } catch (err) {
    console.log(err);
    return responseError('Internal Server Error');
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = resetPasswordValidate(body);

  if (!result?.success) return responseError(result);

  const validated = result.data;

  const searchByEmail: any = await prisma.$queryRaw`SELECT id, name, email, role FROM accounting.users WHERE email = ${validated.email}`;

  if (!searchByEmail[0]?.id) return responseError('Email is not registered. Please check your Email again.');

  const token = generatePasswords(36);

  const expirestLeft = new Date().setMinutes(new Date().getMinutes() + 5);
  const createResetPasswordToken = await prisma.resetPasswords.upsert({
    where: {
      email: searchByEmail[0]?.email,
    },
    update: {
      email: searchByEmail[0]?.email ?? '',
      token: token,
      is_used: false,
      expires_left: new Date(expirestLeft),
    },
    create: {
      email: searchByEmail[0]?.email ?? '',
      token: token,
      expires_left: new Date(expirestLeft),
    },
  });

  await prisma.$disconnect();

  if (!createResetPasswordToken) return responseError('Reset password failed!');

  const url = process.env.NEXT_URL + `/reset-password/${searchByEmail[0].role}/${token}/${createResetPasswordToken.email}`;

  const mailService = MailService.getInstance();

  const template = render(
    ResetPasswordTemplate({
      name: searchByEmail[0].name,
      url: url,
    })
  );

  mailService.sendMail({
    to: searchByEmail[0].email,
    subject: 'Reset Password',
    html: template,
  });

  //   return responseSuccess({
  //     reset_password: createResetPasswordToken,
  //     url: url,
  //   });

  return responseSuccess('Email Reset Password sended! it will valid for 5 minutes');
}
