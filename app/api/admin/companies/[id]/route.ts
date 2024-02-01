import { responseError, responseSuccess } from '@/app/_lib/Handling/Response';
import prisma from '@/app/_lib/Prisma/Client';

export async function GET(req: Request, route: { params: { id: string } }) {
  const url = new URL(req.url);
  const license_key = url.searchParams.get('license') ?? '';

  const companyDetail = await prisma.company.findUnique({
    where: {
      id: route.params.id,
    },
    select: {
      name: true,
      company_code: true,
      address: true,
      email: true,
      expires_left: true,
      license_key: true,
    },
  });

  if (!companyDetail) return responseError('Data not found.');

  if (license_key !== companyDetail.license_key) return responseError('Unauthorized', 401);

  return responseSuccess({
    data: companyDetail,
  });
}
