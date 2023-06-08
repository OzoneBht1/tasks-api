export const selectFields = (errorData) => {
  const newArr = [];

  errorData.map((errField) => {
    newArr.push({
      message: errField.msg,
      path: errField.path,
      location: errField.location,
    });
  });

  return newArr;
};
