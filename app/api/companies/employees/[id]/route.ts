import { responseError, responseSuccess } from "@/app/_lib/Handling/Response";
import { EmployeeUpdateValidate } from "@/app/_lib/Validator/Employees";
import bcrypt from "bcrypt";
import { prisma } from "@/app/_lib/Prisma/Client";

// export async function POST(req: Request, route: { params: { id: string } }) {
//   const body = await req.json();
//   const employee_id = route.params.id;
//   const result = EmployeeUpdateValidate(body);

//   if (!result.success) return responseError(result);

//   const validated = result.data;

//   let data: any = {
//     name: validated.name,
//     username: validated.username,
//   };

//   if (body.new_password != body.re_enter_password)
//     return responseError("New Password And Re-Enter Password not match!");
//   if (body.old_password && body.new_password && body.re_enter_password) {
//     const ValidationOldPassword = await prisma.company.findFirst({
//       where: {
//         id: body.companyId,
//       },
//       select: {
//         employees: {
//           where: {
//             id: route.params.id,
//           },
//           select: {
//             password: true,
//           },
//         },
//       },
//     });
//     const checkedPassword = await bcrypt.compare(
//       body.old_password,
//       ValidationOldPassword?.employees[0]?.password ?? ""
//     );
//     if (!checkedPassword) return responseError("Old Password Not Match!");
//     const hashedPassword: string = await bcrypt.hash(
//       body.re_enter_password,
//       10
//     );
//     data = {
//       ...data,
//       password: hashedPassword,
//     };
//   }

//   const checkUsername = await prisma.employees.findFirst({
//     where: {
//         username: validated.username,
//         id: {
//             not: route.params.id
//         }
//     },
//     select: {
//         name: true
//     }
//   });

//   if(checkUsername?.name) return responseError('Username already exists!');

//   const updateEmployee = await prisma.company.update({
//     where: {
//       id: body.companyId,
//     },
//     data: {
//       employees: {
//         update: {
//           where: {
//             id: employee_id,
//           },
//           data: data,
//         },
//       },
//     },
//   });

//   await prisma.$disconnect();

//   if (!updateEmployee) return responseError("Employee failed to updated");

//   return responseSuccess({
//     message: "Employee Succesfully Updated!",
//   });
// }

export async function DELETE(req: Request, route: { params: { id: string } }) {
  const employeeId = route.params.id;

  const deleteEmployee = await prisma.employees.update({
    where: {
      id: employeeId,
    },
    data: {
      is_active: false,
    }
  });

  await prisma.$disconnect();
  if (!deleteEmployee) return responseError("Failed to Delete Employee");
  return responseSuccess({
    message: "Employee Sucessfully Deleted",
  });
}

