import stringContains from '../../common/utils/stringContains';
import OrganizationStore from '../../stores/OrganizationStore';

// Resolve the organization weVoteId for a position, falling back to speaker_we_vote_id
// when it has the 'org' shape (some positions only carry the speaker id).
export function resolveOrganizationWeVoteId (position) {
  if (!position) return '';
  const orgId = position.organization_we_vote_id;
  if (orgId) return orgId;
  const speakerId = position.speaker_we_vote_id;
  if (speakerId && stringContains('org', speakerId)) return speakerId;
  return '';
}

// Returns the supporters/followers count for the org that authored the position.
export function getPositionFollowersCount (position) {
  const orgId = resolveOrganizationWeVoteId(position);
  return orgId ? OrganizationStore.getOrganizationFollowersCount(orgId) : 0;
}
