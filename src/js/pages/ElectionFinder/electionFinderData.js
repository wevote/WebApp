// Mock Data — DELETE THIS FILE when wiring up real API.
// Replace getElectionDetail and getElectionsForState with Action/Store calls
// in ElectionFinderForState.jsx and ElectionFinderForElection.jsx.
const MOCK_ELECTIONS = {
  IL: {
    upcoming: [
      { id: 'il-march-17-primaries', name: 'March 17 Primaries' },
      { id: 'il-may-3-primaries', name: 'May 3 Primaries' },
    ],
    past: [
      { id: 'il-nov-5-midterms', name: 'November 5 Midterms' },
      { id: 'il-june-28-runoff', name: 'June 28 Runoff' },
      { id: 'il-march-15-primaries-2024', name: 'March 15 Primaries' },
      { id: 'il-nov-3-general-2022', name: 'November 3 General' },
      { id: 'il-june-28-primary-2022', name: 'June 28 Primary' },
    ],
  },
  CA: {
    upcoming: [
      { id: 'ca-march-5-primaries', name: 'March 5 Primaries' },
    ],
    past: [
      { id: 'ca-nov-5-general', name: 'November 5 General' },
      { id: 'ca-june-7-primary', name: 'June 7 Primary' },
    ],
  },
};

const MOCK_ELECTION_DETAILS = {
  'il-march-17-primaries': {
    name: 'March 17 Primaries',
    stateCode: 'IL',
    offices: [
      {
        id: 'office-1',
        name: 'IL State Attorney General',
        candidates: [
          { id: 'c1', name: 'John Dough', party: 'Democrat' },
          { id: 'c2', name: 'Jane Smith', party: 'Republican' },
          { id: 'c3', name: 'Robert Attorney', party: 'Democrat' },
          { id: 'c4', name: 'Emily Johnson', party: 'Independent' },
        ],
      },
      {
        id: 'office-2',
        name: 'IL State Representative',
        candidates: [
          { id: 'c5', name: 'John Dough', party: 'Democrat' },
          { id: 'c6', name: 'John Attorney', party: 'Democrat' },
          { id: 'c7', name: 'Sarah Williams', party: 'Republican' },
        ],
      },
      {
        id: 'office-3',
        name: 'IL Attorney General',
        candidates: [
          { id: 'c8', name: 'Michael Brown', party: 'Democrat' },
          { id: 'c9', name: 'Lisa Attorney Davis', party: 'Republican' },
        ],
      },
    ],
  },
};

export function getElectionDetail (electionId) {
  if (MOCK_ELECTION_DETAILS[electionId]) {
    return MOCK_ELECTION_DETAILS[electionId];
  }
  return {
    name: 'Sample Election',
    stateCode: '',
    offices: [
      {
        id: 'office-fallback-1',
        name: 'State Office',
        candidates: [
          { id: 'fb1', name: 'John Dough', party: 'Democrat' },
          { id: 'fb2', name: 'Jane Smith', party: 'Republican' },
        ],
      },
    ],
  };
}

export function getElectionsForState (stateCode) {
  return MOCK_ELECTIONS[stateCode] || { upcoming: [], past: []};
}
