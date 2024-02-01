export const generateAccHeaderTable = (col: any[]) => {
  const oldCol = [
    {
      key: 'no',
      label: 'NO',
    },
  ];

  const newCol = col.map((column, i) => {
    return {
      key: column.toString().toLocaleLowerCase().replaceAll(' ', '_'),
      label: column,
    };
  });
  return [...oldCol, ...newCol];
};
