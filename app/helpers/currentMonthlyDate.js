const currentMonthlyDate = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startDate = `${year}-${month > 9 ? month : `0${month}`}-01`;
  const endDate = `${year}-${month > 9 ? month : `0${month}`}-${lastDate}`;

  console.log("asdfsdf", startDate, endDate);

  return { startDate, endDate };
};

export default currentMonthlyDate;
