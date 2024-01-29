import { responseError, responseSuccess } from '@/app/_lib/Handling/Response';
import { prisma } from '@/app/_lib/Prisma/Client';
import { CompanyExpiresUpdateValidate } from '@/app/_lib/Validator/Companies';

export async function POST(req: Request) {
  const body = await req.json();

  const result = CompanyExpiresUpdateValidate(body);

  if (!result.success) return responseError(result);

  const validated = result.data;

  const companyExists = await prisma.company.findUnique({
    where: {
      id: validated?.companyId,
    },
    select: {
      name: true,
      expires_at: true,
    },
  });

  if (!companyExists?.expires_at) return responseError('Company not found.');

  const newExpiredDate: Date = companyExists.expires_at;
  newExpiredDate.setDate(Number(newExpiredDate.getDate()) + Number(validated.service_days));

  const updateExpires = await prisma.company.update({
    where: {
      id: validated.companyId,
    },
    data: {
      expires_at: newExpiredDate,
    },
    select: {
      expires_at: true,
    },
  });

  if (!updateExpires.expires_at) return responseError('Expires failed update.');

  await prisma.$disconnect();

  return responseSuccess('Expires successfully update.');
}
