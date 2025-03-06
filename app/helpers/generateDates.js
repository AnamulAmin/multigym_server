import moment from "moment";

export function generateRecentDates() {
  const newDate = new Date();

  // Set the date to the first day of the current month
  newDate.setDate(1);

  // Subtract one day to get the last day of the previous month
  newDate.setDate(newDate.getDate() - 1);

  const dates = [];
  const today = new Date().getDate();
  const lastDayOfLastMonth = newDate.getDate();

  for (let day = today; day <= lastDayOfLastMonth; day++) {
    dates.push({
      _id: day,
    });
  }

  for (let day = 1; day <= today; day++) {
    dates.push({
      _id: day < 10 ? `0${day}` : day,
    });
  }

  return dates;
}

export function generateDates(year, month) {
  const dates = [];
  const currentDays = generateRecentDates();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const inputYear = new Date(year, month).getFullYear();
  const inputMonth = new Date(year, month).getMonth();
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push({
      _id: day < 10 ? `0${day}` : day,
    });
  }

  if (currentMonth === inputMonth && currentYear === inputYear) {
    return currentDays;
  }
  return dates;
}

export function convertDateData(year, month, data) {
  const days = generateDates(year, month);
  const result = days.map((day) => {
    const sales = data.find((s) => {
      return s._id === `${year}-${month < 10 ? `0${month}` : month}-${day._id}`;
    });

    // console.log(sales, "sales");

    return {
      label: day._id,
      totalAmount: sales ? sales.totalAmount : 0,
      totalSales: sales ? sales.count : 0,
    };
  });

  return result;
}
