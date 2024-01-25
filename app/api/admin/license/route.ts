import { responseError, responseSuccess } from '@/app/_lib/Handling/Response';
import { getAllDateByRegion, getTimeByRegion } from '@/app/_lib/Parser/DateLocal';
import { prisma } from '@/app/_lib/Prisma/Client';

export async function POST(req: Request) {
  const { license } = await req.json();

  try {
    const checkLicense = await prisma.company.findFirst({
      where: {
        license_key: license ?? '',
      },
      select: {
        name: true,
        expires_at: true,
      },
    });

    if (!checkLicense) return responseError('Incorrect License Key');
    const expired = new Date(checkLicense.expires_at) < getAllDateByRegion('Asia/Jakarta');

    if (expired) return responseError('License Key is expired! Please contact Our Support for details.');

    return responseSuccess('License Key Corrected.');
  } catch (err: any) {
    if (err?.code === 'P2023') return responseError('Incorrect License Key! Please input correct License Key.');
  }
}
