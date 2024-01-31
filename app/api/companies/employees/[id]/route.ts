import { responseError, responseSuccess } from '@/app/_lib/Handling/Response';
import { prisma } from '@/app/_lib/Prisma/Client';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest, route: { params: { id: string } }) {
  const { id } = await req.json();
  const employeeId = route.params.id;

  const activeEmployee = await prisma.employees.update({
    where: {
      id: employeeId,
      company: {
        is: {
          id: id,
        },
      },
    },
    data: {
      is_active: true,
    },
  });

  await prisma.$disconnect();

  if (!activeEmployee) return responseError('Update Employee Failed');

  return responseSuccess('Employee successfully Activated!');
}

export async function DELETE(req: NextRequest, route: { params: { id: string } }) {
  const id = req.nextUrl.searchParams.get('id') ?? '';
  const employeeId = route.params.id;
  try {
    const deleteEmployee = await prisma.employees.update({
      where: {
        id: employeeId,
        company: {
          is: {
            id: id,
          },
        },
      },
      data: {
        is_active: false,
      },
    });

    await prisma.$disconnect();
    if (!deleteEmployee) return responseError('Failed to Deactive Employee');
    return responseSuccess({
      message: 'Employee Sucessfully Deactivated!',
    });
  } catch {
    return responseError('Internal Server Error[500]', 500);
  }
}
