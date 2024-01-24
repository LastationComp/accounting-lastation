import { z } from "zod";
import { ParsingZod } from "../Handling/ParsingWithErrorZod";

export const EmployeeCreateInput = z.object({
  name: z
    .string({
      required_error: "Name Must be Filled!",
      invalid_type_error: "Name Must be a String!",
    })
    .max(100)
    .min(1),
  email: z
    .string({
      required_error: "Email Must be Filled!",
      invalid_type_error: "Email Must be a String!",
    })
    .email({
      message: "Email not Validated!",
    }),
  username: z
    .string({
      required_error: "Username Must be Filled!",
      invalid_type_error: "Username must be a String",
    })
    .max(100)
    .min(1),
});

export const EmployeesCreateValidate = (args: any) => {
    const result = EmployeeCreateInput.safeParse(args);
    return ParsingZod(result);
}
