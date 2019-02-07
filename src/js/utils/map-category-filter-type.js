export default function mapCategoryFilterType (rawFilterType) {
  const BALLOT_ITEM_FILTER_TYPES = ["Federal", "State", "Measure", "Local"];
  return BALLOT_ITEM_FILTER_TYPES.find(item => item.toLowerCase() === rawFilterType.toLowerCase());
}
