export function formatNumberIndian(num) {
  if (num == null || num === "") return "";
  return Number(num).toLocaleString("en-IN");
}
