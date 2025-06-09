export const monthlySales = () => ({
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Monthly Sales",
      backgroundColor: "green",
      fill: true,
      tension: 0.4,
      data: [2, 10, 8, 6, 7, 8, 7, 9, 7, 7, 6, 7],
    },
  ],
});

export const weeklySales = () => ({
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Weekly Sales",
      backgroundColor: "#42A5F5",
      data: [120, 150, 170, 200, 180, 220, 250],
      fill: true,
      tension: 0.4,
    },
  ],
});

export const orderStatus = () => ({
  labels: ["Processing", "Shipped", "Completed", "Cancelled"],
  datasets: [
    {
      backgroundColor: ["gray", "orange", "green", "red"],
      data: [45, 62, 21, 45],
    },
  ],
});

export const option = {
  responsive: true,
  maintainAspectRatio: false,
};
