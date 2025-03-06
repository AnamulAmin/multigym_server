export const generateMonthlyData = (data) => {
  const startDate = 1;
  const endDate = new Date(data.endDate).getDate();
  const yearDate = new Date(data.startDate).getFullYear();
  const monthDate = new Date(data.startDate).getMonth();

  const lastDate = new Date(yearDate, monthDate + 1, 0).getDate();

  console.log("asdfsdf", data.startDate, data.endDate, startDate, lastDate);

  const monthlyData = [];

  for (let i = startDate; i <= lastDate; i++) {
    const date = new Date(data.startDate);
    const fullDate = `${yearDate}-${
      monthDate < 9 ? `0${monthDate + 1}` : monthDate + 1
    }-${i < 10 ? `0${i}` : i}`;
    date.setDate(i);

    const { isMachDate, feesData } = isMachDateAndFindFees({
      date: fullDate,
      data: data.data,
    });

    if (isMachDate) {
      monthlyData.push({
        date: i < 10 ? `0${i}` : i,
        admissionFees: feesData?.totalPackageFees,
        packageFees: feesData?.totalAdmissionFees,
        total:
          feesData?.totalPackageFees +
          feesData?.totalAdmissionFees -
          feesData?.discount,
        discount: feesData?.discount,
      });
    } else {
      monthlyData.push({
        date: i < 10 ? `0${i}` : i,
        admissionFees: 0,
        packageFees: 0,
        total: 0,
        discount: 0,
      });
    }
  }

  return monthlyData;
};

export const generateMonthlyTransactionData = (data) => {
  const startDate = 1;
  const endDate = new Date(data.endDate).getDate();
  const yearDate = new Date(data.startDate).getFullYear();
  const monthDate = new Date(data.startDate).getMonth();

  const lastDate = new Date(yearDate, monthDate + 1, 0).getDate();

  console.log("asdfsdf", data.startDate, data.endDate, startDate, lastDate);

  const monthlyData = [];

  for (let i = startDate; i <= lastDate; i++) {
    const date = new Date(data.startDate);
    const fullDate = `${yearDate}-${
      monthDate < 9 ? `0${monthDate + 1}` : monthDate + 1
    }-${i < 10 ? `0${i}` : i}`;
    date.setDate(i);

    const { isMachDate, feesData } = isMachDateAndFindFees({
      date: fullDate,
      data: data.data,
    });

    if (isMachDate) {
      const totalIncome =
        feesData?.totalIncome +
        feesData?.totalPackageFees +
        feesData?.totalAdmissionFees;
      const totalExpense = feesData?.totalExpense + feesData?.discount;
      monthlyData.push({
        date: i < 10 ? `0${i}` : i,
        income: totalIncome,
        expense: totalExpense,
        total: totalIncome - totalExpense,
      });
    } else {
      monthlyData.push({
        date: i < 10 ? `0${i}` : i,
        income: 0,
        expense: 0,
        total: 0,
      });
    }
  }

  return monthlyData;
};

const isMachDateAndFindFees = (data) => {
  const dates = data.data.map((item) => item._id);

  const isMachDate = dates.includes(data.date);
  const feesData = data.data.find((item) => item._id === data.date);

  return { isMachDate, feesData };
};
