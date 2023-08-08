import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import normalizedImagePath from '../../../common/utils/normalizedImagePath';
import EditCandidateForExtensionForm from './EditCandidateForExtensionForm';
import VoterGuidePossibilityActions from '../../../actions/VoterGuidePossibilityActions';
import VoterGuidePossibilityStore from '../../../stores/VoterGuidePossibilityStore';
import VoterGuidePossibilityPositionStore from '../../../stores/VoterGuidePossibilityPositionStore';


const params = Object.fromEntries(new URLSearchParams(document.location.search));
const {
  candidate_name: candidateName, candidate_we_vote_id: candidateWeVoteId, possibility_position_id: possibilityPositionId,
  endorsement_page_url: endorsementPageUrl, statement_text: statementText, position_stance: stance, voter_guide_possibility_id: voterGuidePossibilityId,
} = params;
// console.log(params);

let { more_info_url: candidateCampaignUrl } = Object.fromEntries(new URLSearchParams(document.location.search));

if (!candidateCampaignUrl) {
  candidateCampaignUrl = '';
}
let possibilityListener;
let possibilityPositionListener;

// https://wevotedeveloper.com:3000/candidate-for-extension?candidate_name=Jeanne%20Casteen&candidate_we_vote_id=&possibility_position_id=458390&endorsement_page_url=https%3A%2F%2Feverydistrict.us%2Fcandidates%2F2022-candidates%2F&candidate_specific_endorsement_url=&statement_text=332pm
export default function EditCandidateForExtension ()  {
  const [candidate, setCandidate] = useState({ candidateName, candidateWeVoteId, possibilityPositionId, endorsementPageUrl, candidateCampaignUrl, statementText, stance, voterGuidePossibilityId });

  const handlePossibilityPositionRetrieve = () => {
    let candidatePossibilityPosition = VoterGuidePossibilityPositionStore.getVoterGuidePossibilityPositionByCandidateId(candidateWeVoteId);
    const hasEmptyPositionObject = Object.keys(candidatePossibilityPosition).length === 0;
    if (hasEmptyPositionObject) {
      // 5/2/23, this is messed up (but works!) -- the possibilityPositionId, comes in as candidateWeVoteId
      candidatePossibilityPosition = VoterGuidePossibilityPositionStore.getVoterGuidePossibilityPositionByPositionId(candidateWeVoteId);
    }
    // console.log('candidatePossibilityPosition', candidatePossibilityPosition);
    const { $ } = window;
    if (!$.isEmptyObject(candidatePossibilityPosition)) {
      const {
        ballot_item_name: candidateNameFromStore,
        more_info_url: candidateCampaignUrlFromStore,
        organization_we_vote_id: candidateWeVoteIdFromStore,
        statement_text: statementTextFromStore,
        position_stance: stanceFromStore,
        possibility_position_id: candidatePossibilityPositionIdFromStore,
      } = candidatePossibilityPosition;
      setCandidate({
        ...candidate,
        candidateName: candidateNameFromStore,
        candidateWeVoteId: candidateWeVoteIdFromStore,
        possibilityPositionId: candidatePossibilityPositionIdFromStore,
        endorsementPageUrl,   // from request url param
        candidateCampaignUrl: candidateCampaignUrlFromStore,
        statementText: statementTextFromStore,
        stance: stanceFromStore,
      });
    }
  };

  const handlePossibilityRetrieve = () => {
    const bestVoterGuidePossibilityID = voterGuidePossibilityId || VoterGuidePossibilityStore.getVoterGuidePossibilityId();
    console.log('handlePossibilityRetrieve candidate: ', candidate);
    VoterGuidePossibilityActions.voterGuidePossibilityPositionsRetrieve(bestVoterGuidePossibilityID);
    possibilityPositionListener = VoterGuidePossibilityPositionStore.addListener(handlePossibilityPositionRetrieve);
    return () => possibilityPositionListener.remove;
  };

  useEffect(() => {
    VoterGuidePossibilityActions.voterGuidePossibilityRetrieve(endorsementPageUrl, voterGuidePossibilityId);
    possibilityListener = VoterGuidePossibilityStore.addListener(handlePossibilityRetrieve);
    return () => possibilityListener.remove;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // With empty array, this will only run once ... similar to componentDidMount
  useEffect(() => {
    console.log('I will run only once');
    if (voterGuidePossibilityId) {
      VoterGuidePossibilityActions.voterGuidePossibilityPositionsRetrieve(voterGuidePossibilityId);
    }
  }, []);

  return (
    <CandidateForExtensionWrapper>
      <a href="https://wevote.us" target="_blank" rel="noreferrer">
        <CandidateLogo src={normalizedImagePath('/img/global/svg-icons/we-vote-icon-square-color-dark.svg')} />
      </a>
      <CandidateHeader>Edit Candidate</CandidateHeader>
      <IntroText>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Make changes to this candidate's endorsement information.
      </IntroText>
      <EditCandidateForExtensionForm candidate={candidate} setCandidate={setCandidate} />
    </CandidateForExtensionWrapper>
  );
}
const CandidateForExtensionWrapper = styled('div')`
  background: white;
  height: 100vh;
  margin: 0 20px 20px 20px;
  width: 410px;
`;
const CandidateHeader = styled('h1')`
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 5px;
  margin-top: 0;
`;
const CandidateLogo = styled('img')`
  display: block;
  margin: 0 auto;
  max-height: 11%;
  vertical-align: center;
  //margin-top: 20px;
`;
const IntroText = styled('div')`
  margin-bottom: 15px;
`;
