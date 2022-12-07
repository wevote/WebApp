function orderByLastName (first, second) {
  const firstLastName = first.last_name || Number.MAX_VALUE;
  const secondLastName = second.last_name || Number.MAX_VALUE;
  if (firstLastName < secondLastName) return -1;
  if (firstLastName > secondLastName) return 1;
  return 0;
}

function orderByStateCode (first, second) {
  if (first.state_code === null && second.state_code === null) return 0;
  if (first.state_code === null) return 1;
  if (second.state_code === null) return -1;
  const firstStateCode = first.state_code || Number.MAX_VALUE;
  const secondStateCode = second.state_code || Number.MAX_VALUE;
  if (firstStateCode < secondStateCode) return -1;
  if (firstStateCode > secondStateCode) return 1;
  return 0;
}

export default function defaultVoterContactEmailSort (voterContactEmailList) {
  const voterContactEmailListSortedByLastName = voterContactEmailList.sort(orderByLastName);
  const voterContactEmailListSortedByStateCode = voterContactEmailListSortedByLastName.sort(orderByStateCode);
  return voterContactEmailListSortedByStateCode;
}
