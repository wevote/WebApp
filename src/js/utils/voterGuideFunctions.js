// For functions related to voterGuides

export default function convertVoterGuideToElection (voterGuide) {
  if (!voterGuide || !voterGuide.google_civic_election_id || !voterGuide.election_day_text) {
    return false;
  }
  return {
    google_civic_election_id: voterGuide.google_civic_election_id,
    election_description_text: voterGuide.election_description_text,
    election_name: voterGuide.election_description_text,
    election_day_text: voterGuide.election_day_text,
    original_text_for_map_search: '',
    ballot_returned_we_vote_id: '',
    ballot_location_shortcut: '',
  };
}
