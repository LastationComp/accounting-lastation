//OLDER TECHNIQUE

// import { PrismaClient } from '@prisma/client';

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// export const prisma = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


// NEW TECHNIQUE

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    result: {
      company: {
        expires_left: {
          needs: {
            expires_at: true,
          },
          compute(data) {
            const dateNow: Date = new Date();
            const time = data.expires_at.getTime() - dateNow.getTime();
            const resultDate: number = Math.round(time / (1000 * 3600 * 24));
            if (resultDate < 0) return 'License Key has been expired.';
            return `${resultDate} day${resultDate === 1 || resultDate === 0 ? '' : 's'} left.`;
          },
        },
      },
    },
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
