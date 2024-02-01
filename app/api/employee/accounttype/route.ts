import { responseError, responseSuccess } from "@/app/_lib/Handling/Response";
import prisma from "@/app/_lib/Prisma/Client";
import { AccountTypeCreateValidator } from "@/app/_lib/Validator/AccountType";

export async function POST(req:Request) {
    
    const body = await req.json();
    const result = AccountTypeCreateValidator(body);

    if(!result.success) return responseError(result);

    const validated = result.data;

    let data: any = {
        name: validated.name,
        normal_balance: validated.normal_balance,
        code: validated.code
    }

    const validationCode = await prisma.accountTypes.findFirst({
        where: {
            code: validated.code
        },
        select: {
            name:true
        }
    })

    if(validationCode?.name) return responseError("Code Already Exists! Please Input Another Code.")

    const CreateAccountType = await prisma.employees.update({
        where: {
            id: body.employeeId
        },
        data: {
            account_types: {
                create: data
            }
        }
    })

    await prisma.$disconnect();

    if(!CreateAccountType) return responseError("Failed to Create Account Type!");
    return responseSuccess("Success to Create Account Type");
}