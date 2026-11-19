// state_code is the election's home state. state_code_list is every state that
// has a ballot return for that election. A shared primary, general, or national
// election, or any election with no home state, belongs on each of those state
// pages. Any other election stays on its home state, so one stray ballot return
// does not list it under a different state.

function listIncludesState (election, stateCodeUpper) {
  const list = election.state_code_list || [];
  return list.some((code) => (code || '').toUpperCase() === stateCodeUpper);
}

function isSharedElection (election) {
  if (!(election.state_code || '').trim()) return true;
  const name = (election.election_name || '').toLowerCase();
  return name.includes('state primary') ||
    name.includes('general election') ||
    name.includes('national election');
}

export default function matchesStateCode (election, stateCode) {
  const stateCodeUpper = (stateCode || '').toUpperCase();
  const electionState = (election.state_code || '').toUpperCase();
  if (stateCodeUpper === 'NA') {
    // An empty state_code_list does not imply national. Some state elections
    // come back without that list populated.
    return electionState === 'NA' || listIncludesState(election, 'NA');
  }
  if (electionState === stateCodeUpper) return true;
  return isSharedElection(election) && listIncludesState(election, stateCodeUpper);
}
