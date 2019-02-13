export default function getGroupedFilterSecondClass (index, length) {
  if (index === 0) return "groupedFilterFirst";
  if (index === length - 1) return "groupedFilterLast";
  return "groupedFilterMiddle";
}
