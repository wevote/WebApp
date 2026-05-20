const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "2026-03-17" -> "Mar 17, 2026"
export default function formatDateLong (dateString) {
  if (!dateString) return '';
  const [y, m, d] = dateString.split('-');
  return `${MONTH_ABBR[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}
