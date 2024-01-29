import { z } from "zod";
import { validateFormat } from "./AccountingFormat";
import { ParsingZod } from "../Handling/ParsingWithErrorZod";


export const AccountTypeCreateInput = z.object({
    name: z.string({
        required_error: "Name must be filled!",
        invalid_type_error: "Name must be a string!"
    })
    .max(50)
    .min(1)
    .refine(validateFormat, {message: "Name format invalid!"}),
    normal_balance: z.boolean({
        invalid_type_error: "Normal Balance must be a Boolean!"
    }),
    code: z.string({
        required_error: "Code must be Filled!",
        invalid_type_error: "Code must be a string!"
    })
    .max(100)
    .min(1)
    .regex(/^[a-z0-9]+(?:[-.][a-z0-9]+)*$/, {
        message: "Code Format Invalid! Following lowercase a-z or number.",
    })
})

export const AccountTypeUpdateInput = z.object({
    name: z.string({
        required_error: "Name must be Filled!",
        invalid_type_error: "Name must be a String!"
    })
    .max(50)
    .min(1)
    .refine(validateFormat, {message: "Name Format Invalid!"}),
    normal_balance: z.boolean({
        invalid_type_error: "Normal Balance must be a Boolean!"
    }),
    code: z.string({
        required_error: "Code must be filled!",
        invalid_type_error: "Code must be a String!"
    })
    .max(50)
    .min(1)
    .regex(/^[a-z0-9]+(?:[-.][a-z0-9]+)*$/, {
        message: "Code Format Invalid! Following lowercase a-z or number."
    })
})

export const AccountTypeCreateValidator = (args: any) => {
    const result = AccountTypeCreateInput.safeParse(args);
    return ParsingZod(result);
}

export const AccountTypeUpdateValidator = (args: any) => {
    const result = AccountTypeUpdateInput.safeParse(args);
    return ParsingZod(result);
}

