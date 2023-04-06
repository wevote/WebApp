import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import normalizedImagePath from '../../../common/utils/normalizedImagePath';
import EditCandidateForExtensionForm from './EditCandidateForExtensionForm';
import VoterGuidePossibilityActions from '../../../actions/VoterGuidePossibilityActions';
import VoterGuidePossibilityStore from '../../../stores/VoterGuidePossibilityStore';
import VoterGuidePossibilityPositionStore from '../../../stores/VoterGuidePossibilityPositionStore';


const {
  candidate_name: candidateName, candidate_we_vote_id: candidateWeVoteId, possibility_position_id: possibilityPositionId, endorsement_page_url: endorsementPageUrl,
} = Object.fromEntries(new URLSearchParams(document.location.search));
let { candidate_specific_endorsement_url: candidateCampaignUrl } = Object.fromEntries(new URLSearchParams(document.location.search));

if (!candidateCampaignUrl) {
  candidateCampaignUrl = '';
}
let possibilityListener;
let possibilityPositionListener;

// https://wevotedeveloper.com:3000/candidate-for-extension?candidate_name=Jeanne%20Casteen&candidate_we_vote_id=&possibility_position_id=458390&endorsement_page_url=https%3A%2F%2Feverydistrict.us%2Fcandidates%2F2022-candidates%2F&candidate_specific_endorsement_url=
export default function EditCandidateForExtension ()  {
  const [candidate, setCandidate] = useState({ candidateName, candidateWeVoteId, possibilityPositionId, endorsementPageUrl, candidateCampaignUrl });

  const handlePossibilityPositionRetrieve = () => {
    let candidatePossibilityPosition = VoterGuidePossibilityPositionStore.getVoterGuidePossibilityPositionByCandidateId(candidateWeVoteId);
    const hasEmptyPositionObject = Object.keys(candidatePossibilityPosition).length === 0;
    if (hasEmptyPositionObject && possibilityPositionId && possibilityPositionId.length) {
      candidatePossibilityPosition = VoterGuidePossibilityPositionStore.getVoterGuidePossibilityPositionByPositionId(possibilityPositionId);
    }
    const voterGuidePossibilityID = VoterGuidePossibilityStore.getVoterGuidePossibilityId();
    // console.log('candidatePossibilityPosition', candidatePossibilityPosition);
    // extracting the endorsement text that is already in the database for this candidate's possibility position
    const { statement_text: statementText, possibility_position_id: candidatePossibilityPositionID, position_stance: stance } = candidatePossibilityPosition;
    // setting the state to include the endorsement text that is already in the database so that the form is pre-filled
    setCandidate({ ...candidate, voterGuidePossibilityID, candidatePossibilityPositionID, statementText, stance });
  };

  const handlePossibilityRetrieve = () => {
    const voterGuidePossibilityID = VoterGuidePossibilityStore.getVoterGuidePossibilityId();
    // console.log('handlePossibilityRetrieve candidate: ', candidate);
    VoterGuidePossibilityActions.voterGuidePossibilityPositionsRetrieve(voterGuidePossibilityID);
    possibilityPositionListener = VoterGuidePossibilityPositionStore.addListener(handlePossibilityPositionRetrieve);
    return () => possibilityPositionListener.remove;
  };

  useEffect(() => {
    VoterGuidePossibilityActions.voterGuidePossibilityRetrieve(endorsementPageUrl);
    possibilityListener = VoterGuidePossibilityStore.addListener(handlePossibilityRetrieve);
    return () => possibilityListener.remove;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
