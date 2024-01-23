export const ParsingZod = (args: any) => {
  if (!args?.success)
    return {
      success: false,
      message: args?.error?.issues[0]?.message,
    };

  return args;
};
