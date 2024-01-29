import { responseError, responseSuccess } from "@/app/_lib/Handling/Response";
import { prisma } from "@/app/_lib/Prisma/Client";
import { CompaniesProfileUpdateValidate } from "@/app/_lib/Validator/Companies";
import bcrypt from "bcrypt";

export async function GET(req:Request, route: {params: {id: string}}) {
    const companyId = route.params.id;

    const getProfileCompany = await prisma.company.findFirst({
        where: {
            id: companyId
        },
        select: {
            company_code: true,
            name: true,
            address: true,
            username: true
        }
    });

    await prisma.$disconnect();
    if(!getProfileCompany) return responseError("Data Nor Found!");
    return responseSuccess({
        data: getProfileCompany,
    })
}

export async function POST(req:Request, route: {params: {id: string}}) {
    const body = await req.json();
    const result = CompaniesProfileUpdateValidate(body);

    if (!result.success) return responseError(result);

    const validated = result.data;
    
    let data: any = {
        name: validated.name,
        address: validated.address,
        username: validated.username
    }

    if(body.new_password != body.re_enter_password) return responseError("New Password and Re-Enter Password not match!")
    if(body.old_password && body.new_password && body.re_enter_password){
        const ValidationOldPassword = await prisma.company.findFirst({
            where: {
                id: route.params.id
            },
            select: {
                password: true
            }
        });

        const checkedPassword = await bcrypt.compare(body.old_password, ValidationOldPassword?.password ?? "");

        if(!checkedPassword) return responseError("Old Password not match!")
        const hashedPassword: string = await bcrypt.hash(body.re_enter_password,10);

        data = {
            ...data,
            password: hashedPassword
        }
    }
    
    const checkUsername = await prisma.company.findFirst({
        where: {
            username: validated.username,
            id: {
                not: route.params.id
            }
        },
        select: {
            name: true
        }
    });

    if(checkUsername?.name) return responseError("Username already exists!");

    const updateCompany = await prisma.company.update({
        where: {
            id: route.params.id
        },
        data: data
    });

    await prisma.$disconnect();
    if(!updateCompany) return responseError("Failed to Update Company!")

    return responseSuccess({
        message: "Company Profile Success to Update!"
    })
}