export const submitValidate = (fieldsName: any[] = [], oldData: any = {}, newData: any = {}) => {
  let result = true;

  fieldsName.every((field) => {
    if (oldData[field]?.toString().trim() !== newData[field]?.toString().trim()) result = false;
    if (result) return true;
    return false;
  });

  return result;
};
