import format from "date-fns/format";
import isValid from "date-fns/isValid";

export function formatDate(date: number | Date) {
  return isValid(date) ? format(date, "do MMMM yyyy") : "N/A";
}
export function DateFormat(dateString: string): string {
  // Create a Date object from the string
  const date = new Date(dateString);

  // Define month names
  const monthNames = [
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
  ];

  // Extract the date components
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Create a formatted date string
  const formattedDate = `${month} ${day}, ${year}`;

  return formattedDate;
}
