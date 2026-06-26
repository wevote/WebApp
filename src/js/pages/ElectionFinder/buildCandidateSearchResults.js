// Pure helper for Election Finder search. Given the already state-scoped election
// list, the cached candidate list (from CandidateStore.getCandidateList()), the
// current search text, and the selected state code, returns the unioned, deduped
// set of "result elections". Each result is the original election object augmented
// with a `matchedOffices` array describing which offices/candidates matched.
//
// An election is included when its name/date matches the query (existing behavior)
// OR when it contains a candidate whose name matches. Results are deduped by
// google_civic_election_id, and candidates whose election is not present in
// scopedElectionList are dropped (we have no election row to attach them to).
//
// matchedOffices shape: [{ officeWeVoteId, officeName, candidates: [candidate, ...] }]
// Elections that matched only by name carry an empty matchedOffices array.

import { convertStateCodeToStateText } from '../../common/utils/addressFunctions';

function getCandidateName (candidate) {
  return candidate.ballot_item_display_name || candidate.candidate_name || '';
}

function getElectionSearchText (election) {
  const parts = [
    election.election_name,
    election.election_day_text,
  ];

  if (election.state_code && election.state_code !== 'NA') {
    parts.push(convertStateCodeToStateText(election.state_code));
    parts.push(election.state_code); // optional: match "AL" as well as "Alabama"
  }

  return parts.filter(Boolean).join(' ').toLowerCase();
}

export default function buildCandidateSearchResults (scopedElectionList, candidateList, searchText, selectedStateCode) {
  const lowerSearch = (searchText || '').toLowerCase().trim();
  if (!lowerSearch) return scopedElectionList;

  const electionById = {};
  scopedElectionList.forEach((election) => {
    electionById[parseInt(election.google_civic_election_id, 10)] = election;
  });

  // Elections matched by name or date
  const matchedElectionIds = new Set();
  scopedElectionList.forEach((election) => {
    const nameHit = getElectionSearchText(election).includes(lowerSearch);
    if (nameHit) matchedElectionIds.add(parseInt(election.google_civic_election_id, 10));
  });

  // Candidate matches grouped by election -> office
  const stateFilter = (selectedStateCode || '').toUpperCase();
  const officesByElectionId = {};
  (candidateList || []).forEach((candidate) => {
    if (!getCandidateName(candidate).toLowerCase().includes(lowerSearch)) return;
    if (stateFilter && candidate.state_code && candidate.state_code.toUpperCase() !== stateFilter) return;
    const electionId = parseInt(candidate.google_civic_election_id, 10);
    if (!electionId || !(electionId in electionById)) return;

    if (!(electionId in officesByElectionId)) officesByElectionId[electionId] = {};
    const officeKey = candidate.contest_office_we_vote_id || candidate.contest_office_name || 'unknown';
    if (!(officeKey in officesByElectionId[electionId])) {
      officesByElectionId[electionId][officeKey] = {
        officeWeVoteId: candidate.contest_office_we_vote_id || '',
        officeName: candidate.contest_office_name || '',
        candidates: [],
      };
    }
    officesByElectionId[electionId][officeKey].candidates.push(candidate);
    matchedElectionIds.add(electionId);
  });

  // Build augmented results, preserving the scopedElectionList ordering
  const results = [];
  scopedElectionList.forEach((election) => {
    const electionId = parseInt(election.google_civic_election_id, 10);
    if (!matchedElectionIds.has(electionId)) return;
    const officeMap = officesByElectionId[electionId] || {};
    results.push({ ...election, matchedOffices: Object.values(officeMap) });
  });
  return results;
}
