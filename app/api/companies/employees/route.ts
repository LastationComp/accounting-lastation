import { generatePasswords } from "@/app/_lib/Generator/PasswordGenerators";
import { responseError, responseSuccess } from "@/app/_lib/Handling/Response";
import { prisma } from "@/app/_lib/Prisma/Client";
import { EmployeesCreateValidate } from "@/app/_lib/Validator/Employees";
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    const body = await req.json();
    const result = EmployeesCreateValidate(body);

    if(!result.success) return responseError(result);

    const validated = result.data;

    let password: string = generatePasswords(12);
    let companyId: string = body.companyId;
    const hashedPassword: string = await bcrypt.hash(password, 10);

    const data: any = {
        name: validated.name,
        email: validated.email,
        username: validated.username,
        password: hashedPassword,
        employee_code: "",
    }

    const usernameExist = await  prisma.employees.findUnique({
        where: {
            username: validated.username,
        },
        select: {
            name: true
        },
    });

    if(usernameExist?.name) return responseError(`${data.username} already exists`);

    const emailExists = await prisma.employees.findUnique({
        where: {
            email: validated.email,
        },
        select: {
            name: true
        },
    });

    if(emailExists?.name) return responseError(`${data.email} already exists`);

    const createEmployee = await prisma.company.update({
        where: {
            id: companyId
        },
        data: {
            employees: {
                createMany: {
                    data:[data]
                }
            }
        }
    })

    await prisma.$disconnect();

    return responseSuccess({
        message: 'Employee Success Created! Please Check Your Email',
    });
}