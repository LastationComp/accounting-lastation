import { responseError, responseSuccess } from "@/app/_lib/Handling/Response";
import { prisma } from "@/app/_lib/Prisma/Client";
import { AccountTypeUpdateValidator } from "@/app/_lib/Validator/AccountType";

export async function POST(req:Request, route: {params: {id: string}}) {
    const body = await req.json();

    const accountTypesId = route.params.id;
    const license_key = body.license_key;
    const result = AccountTypeUpdateValidator(body);

    if(!result.success) return responseError(result);

    const validated = result.data;

    let data: any = {
        name: validated.name,
        normal_balance: validated.normal_balance,
        code: validated.code
    }

    const validationCode = await prisma.accountTypes.findFirst({
        where: {
            code: validated.code,
            id: {
                not: accountTypesId
            }
        },
        select: {
            name: true
        }
    })

    if(validationCode?.name) return responseError("Code Already Used! Please input another code.");

    const UpdateAccountType = await prisma.accountTypes.update({
        where: {
            id: accountTypesId,
            employee: {
                company: {
                    license_key: license_key
                }
            }
        },
        data: data
    });

    await prisma.$disconnect();

    if(!UpdateAccountType) return responseError("Failed to Update Account Type");

    return responseSuccess("Success to Update Account Type");
    
}