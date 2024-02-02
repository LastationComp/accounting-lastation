import { responseError, responseSuccess } from '@/app/_lib/Handling/Response';
import { resetPasswordUpdateValidate } from '@/app/_lib/Validator/ResetPassword';
import { NextRequest } from 'next/server';
import prisma from '@/app/_lib/Prisma/Client';
import bcrypt from 'bcrypt';
import { getAllDateByRegion } from '@/app/_lib/Parser/DateLocal';

export async function POST(req: NextRequest, route: { params: { tokenId: string } }) {
  const body = await req.json();

  const validate = resetPasswordUpdateValidate({
    ...body,
    tokenId: route.params.tokenId,
  });

  if (!validate?.success) return responseError(validate);

  const validated = validate.data;

  const data = {
    tokenId: validated.tokenId,
    type: validated.type,
    newPassword: validated.newPassword,
    rePassword: validated.rePassword,
  };

  if (data.newPassword !== data.rePassword) return responseError('New Password is not match with Re Enter Password');
  try {
    const validateResetToken = await prisma.resetPasswords.findFirst({
      where: {
        id: data.tokenId,
        is_used: false,
        expires_left: {
          not: {
            lt: getAllDateByRegion('Asia/Jakarta'),
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!validateResetToken?.id) return responseError('Token has been invalid! Please re send Reset Password request.');

    const searchResetPassword = await prisma.resetPasswords.update({
      where: {
        id: validateResetToken.id,
      },
      data: {
        is_used: true,
      },
      select: {
        email: true,
      },
    });

    if (!searchResetPassword?.email) return responseError('Token Invalid');
    const searchAccount: any = await prisma.$queryRaw`SELECT id FROM accounting.users WHERE email = ${searchResetPassword.email} and role = ${data.type}`;

    if (!searchAccount[0]?.id) return responseError('User invalid');

    if (data.type === 'company') {
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      const updateCompany = await prisma.company.update({
        where: {
          id: searchAccount[0]?.id,
        },
        data: {
          password: hashedPassword,
        },
        select: {
          name: true,
        },
      });

      if (!updateCompany.name) return responseError('Reset Password Failed!');

      return responseSuccess('Reset Password successfully! We will redirecting you to login page...');
    }

    if (data.type === 'employee') {
      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      const updateEmployee = await prisma.employees.update({
        where: {
          id: searchAccount[0]?.id,
        },
        data: {
          password: hashedPassword,
        },
        select: {
          name: true,
        },
      });

      if (!updateEmployee.name) return responseError('Reset Password Failed!');

      return responseSuccess('Reset Password successfully! please back to login');
    }
  } catch (err) {
  } finally {
    await prisma.$disconnect();
  }
}
