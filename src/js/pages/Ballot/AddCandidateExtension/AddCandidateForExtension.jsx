import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AddCandidateExtensionForm from './AddCandidateExtensionForm';
import { renderLog } from '../../../common/utils/logging';
import voterGuidePossibilityStore from '../../../stores/VoterGuidePossibilityStore';


// https://localhost:3000/add-candidate-for-extension?candidate_name=Phil%20Ting&candidate_we_vote_id=wv02cand40131&endorsement_page_url=https%3A%2F%2Fwww.sierraclub.org%2Fcalifornia%2F2020-endorsements&candidate_specific_endorsement_url=https%3A%2F%2Fwww.philting.com%2F&show_data=1
// https://quality.wevote.us/candidate-for-extension?candidate_name=DOYLE%20CANNING&candidate_we_vote_id=wv02cand63228&endorsement_page_url=http%3A%2F%2Fclimatehawksvote.com%2Fendorsements%2Fendorsements-2020%2F&candidate_specific_endorsement_url=&voter_guide_possibility_id=

const {
  candidate_name: candidateName, endorsement_page_url: endorsementPageUrl, candidate_specific_endorsement_url: candidateSpecificEndorsementUrl,
  show_data: showDevelopmentData,
} = Object.fromEntries(new URLSearchParams(document.location.search));

/**
 * Page containing a form that collects a new candidate endorsement
 * @returns {JSX.Element}
 */
export default function AddCandidateForExtension () {
  const [candidate, setCandidate] = useState({ candidateName, endorsementPageUrl, candidateSpecificEndorsementUrl });
  // const [voterGuidePossibilityIdValue, setVoterGuidePossibilityIdValue] = useState(voterGuidePossibilityStore.getVoterGuidePossibilityId());

  const getIDFunc = voterGuidePossibilityStore.getVoterGuidePossibilityId();

  // when the voter guide possibility store is updated, alert with ID
  useEffect(() => {
    const handleIdChange = (() => {
      // alert(voterGuidePossibilityStore.getVoterGuidePossibilityId());
      console.log(voterGuidePossibilityStore.getVoterGuidePossibilityId());
    });

    // listeners for a change in the voterGuidePossibilityId
    voterGuidePossibilityStore.addListener(handleIdChange);
    return () => voterGuidePossibilityStore.addListener(handleIdChange).remove;
  }, [getIDFunc]);


  renderLog('AddCandidateForExtension');  // Set LOG_RENDER_EVENTS to log all renders

  // const { allCachedPositionsForThisCandidate, candidate, organizationWeVoteId, scrolledDown, candidateWeVoteId, value } = this.state;
  console.log('AddCandidateForExtension render');

  const showDevStuff = showDevelopmentData || true;
  return (
    <Wrapper style={{ margin: '20px' }}>
      <a href="https://wevote.us">
        <AddCandidateLogo src="../../../../img/global/logos/we-vote-logo-wordmark-vertical-color-on-white-256x256.png" />
      </a>
      <AddCandidateHeader>Add Candidate</AddCandidateHeader>
      <IntroText>
        Please check that the following inputs contain the correct information, and fill out the candidate website box if possible.
      </IntroText>
      {showDevStuff && (
        <AddCandidateExtensionForm candidate={candidate} setCandidate={setCandidate} />
      )}
    </Wrapper>
  );
}

const Wrapper = styled('div')`
  height: 100vh;
  background: white;
  width: 410px;
`;

const IntroText = styled('div')`
  margin-bottom: 20px;
`;


const AddCandidateLogo = styled('img')`
  display: block;
  vertical-align: center;
  margin: 20px auto;
  height: 100px;
  width: 100px;
  //margin-top: 20px;
`;

const AddCandidateHeader = styled('h1')`
  font-size: 32px;
  font-weight: 500;
`;
