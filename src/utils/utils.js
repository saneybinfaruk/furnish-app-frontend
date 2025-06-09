export const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  // Format options
  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  };

  // Format the date
  const formattedDate = date.toLocaleDateString("en-US", options);

  // Rearrange the formatted date
  const [weekday, month, day, year] = formattedDate.split(" ");

  // Return in the desired format
  return `${day} ${month} ${year} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

export const formatDateTime2 = (dateString) => {
  const date = new Date(dateString?.replace(" ", "T")); // Ensure proper Date parsing

  // Define month names
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract date parts
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Extract and format time (24-hour format)
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Return formatted string
  return `${day}, ${month} ${year} ${hours}:${minutes}:${seconds}`;
};

export const FirstLetterUppercase = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};
