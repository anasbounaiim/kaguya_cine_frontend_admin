// Parse YYYY-MM-DD to JS Date (locale)
export function parseDateStringToLocal(dateStr: string | undefined) {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); // JS month: 0-indexed
}

// Format JS Date to YYYY-MM-DD
export function formatDateToYMD(date: Date | undefined) {
  if (!date) return '';
  // Ajuste pour éviter décalage UTC
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}