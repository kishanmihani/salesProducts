export default function formatDateToUS(dateInput) {
  const date = new Date(dateInput);

  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  // Month short names
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const month = monthNames[date.getMonth()];

  return `${day}-${month}-${year}`; // DD MMM YYYY
}