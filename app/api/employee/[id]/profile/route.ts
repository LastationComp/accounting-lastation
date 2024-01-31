import { responseError, responseSuccess } from "@/app/_lib/Handling/Response";
import prisma from "@/app/_lib/Prisma/Client";
import { EmployeeProfileUpdateValidator } from "@/app/_lib/Validator/Employees";
import bcrypt from "bcrypt";

export async function GET(req:Request, route: {params: {id: string}}) {
    const employeeId = route.params.id; 

    const getProfileEmployee = await prisma.employees.findFirst({
        where: {
            id: employeeId,
        },
        select: {
            employee_code: true,
            name: true,
            username: true
        }
    });

    await prisma.$disconnect();
    if(!getProfileEmployee) return responseError("Data Not Found!");
    return responseSuccess({
        data: getProfileEmployee
    });
}

export async function POST(req:Request, route: {params: {id: string}}) {

    const body = await req.json();
    const result = EmployeeProfileUpdateValidator(body);


    if(!result.success) return responseError(result);

    const employeeId = route.params.id;

    const validated = result.data;

    let data: any = {
        name: validated.name,
        username: validated.username
    };

    console.log(data);

    if(body.new_password != body.re_enter_password) return responseError("New Password and Re-Enter Password Not Match!");
    if(body.old_password && body.new_password && body.re_enter_password){
        const ValidationOldPassword = await prisma.employees.findFirst({
            where: {
                id: employeeId
            },
            select: {
                password: true
            }
        });

        const checkedPassword = await bcrypt.compare(body.old_password, ValidationOldPassword?.password ?? "")

        if(!checkedPassword) return responseError("Old Password Not Match!");
        const hashedPassword: string = await bcrypt.hash(body.re_enter_password, 10);

        data = {
            ...data,
            password: hashedPassword
        }
    }

    const checkedUsername = await prisma.employees.findFirst({
        where: {
            username: validated.username,
            id: {
                not: employeeId
            }
        },
        select: {
            name: true
        }
    });

    if(checkedUsername?.name) return responseError("Username already exists!");

    const updateProfileEmployee = await prisma.employees.update({
        where: {
            id: employeeId
        },
        data: data
    });

    await prisma.$disconnect();

    if(!updateProfileEmployee) return responseError("Failed to Update Profile Employee!");

    return responseSuccess("Employee Profile Success to Update!");
}
