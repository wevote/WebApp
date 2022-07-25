import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import AddCandidateLoadingButton from './AddCandidateLoadingButton';
import { renderLog } from '../../../common/utils/logging';
import VoterGuidePossibilityActions from '../../../actions/VoterGuidePossibilityActions';
import voterGuidePossibilityStore from '../../../stores/VoterGuidePossibilityStore';
import voterGuidePossibilityPositionStore from '../../../stores/VoterGuidePossibilityPositionStore';


let possibilityListener;
let possibilityPositionListener;

/**
 * A form element utilizing Material UI to collect information about a candidate endorsement
 * @param props
 * @returns {JSX.Element}
 */
export default function AddCandidateExtensionForm (props) {
  const { candidate, setCandidate } = props;
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const stateRef = useRef();
  stateRef.current = candidate;

  // const urlToStrip = new URL(candidate.endorsementPageUrl);

  // const urlStripper = () => {
  //   let urlToStripString = urlToStrip.pathname.toString();
  //   if (urlToStripString.includes('/')) {
  //     for (let i = urlToStripString; i > 0; i--) {
  //       if (urlToStripString[i] !== '/') {
  //         urlToStripString = urlToStripString.substring(0, urlToStripString.length - 1);
  //       } else {
  //         urlToStripString = urlToStripString.substring(0, urlToStripString.length - 1);
  //         const newEndorsementURL = urlToStrip.protocol + urlToStrip.hostname + urlToStripString;
  //         VoterGuidePossibilityActions.voterGuidePossibilityRetrieve(newEndorsementURL);
  //       }
  //     }
  //   }
  // };

  const handlePossibilityPositionIDChange = (() => {
    const voterGuidePossibilityIdValue = voterGuidePossibilityStore.getVoterGuidePossibilityId();
    const { candidateName, candidateSpecificEndorsementUrl, endorsementText } = stateRef.current;
    if (voterGuidePossibilityIdValue !== 0) {
      // if the organization does exist, check if the candidate does
      console.log(candidate);
      const voterGuidePossibilityPositionId = voterGuidePossibilityPositionStore.getVoterGuidePossibilityPositionByCandidateName(candidateName, stateRef.current.endorsementPageUrl);
      console.log(stateRef.current);
      // if the candidate already exists in the voter guide in the database
      if (voterGuidePossibilityPositionId === 0) {
        const possibilityPositionDictionary = {
          ballot_item_name: candidateName,
          more_info_url: candidateSpecificEndorsementUrl,
          statement_text: endorsementText,
        };
        VoterGuidePossibilityActions.voterGuidePossibilityPositionSave(voterGuidePossibilityIdValue, voterGuidePossibilityPositionId, possibilityPositionDictionary);
        console.log('saved!');
        setFinished(true);
        possibilityPositionListener.remove();
      } else {
        console.log('This voter guide already has a position recorded for this candidate. Open the edit panel ...');
        possibilityPositionListener.remove();
      }
    } else {
      // TODO: write a function that will continuously strip down a url and search each time a slash is taken away
      // urlStripper();
      console.log("Can't find this voter guide. Please open the Edit Panel to select one or save.");
    }
    setFinished(true);
    // possibilityPositionListener.remove();
    // setTimeout(() => { window.close(); }, 1000);
  });

  const handleIdChange = (() => {
    const voterGuidePossibilityIdValue = voterGuidePossibilityStore.getVoterGuidePossibilityId();
    console.log(`VGPI is ${voterGuidePossibilityIdValue}`);
    VoterGuidePossibilityActions.voterGuidePossibilityPositionsRetrieve(voterGuidePossibilityIdValue);
  });

  // when the voter guide possibility store is updated, handle the change
  useEffect(() => {
    possibilityListener = voterGuidePossibilityStore.addListener(handleIdChange);
    return () => possibilityListener.remove;
  }, []);

  const handleBlur = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setCandidate((prevInformation) => ({
      ...prevInformation,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(JSON.stringify(candidate, null, 2));

    // passing endorsementPageUrl into the retrieve function to check if the database has an ID for it already.
    console.log(`endorsement url = ${candidate.endorsementPageUrl}`);
    if (!candidate.endorsementPageUrl.startsWith('https://') && !candidate.endorsementPageUrl.startsWith('http://')) {
      candidate.endorsementPageUrl = `https://${candidate.endorsementPageUrl}`;
    }
    console.log(`endorsement url = ${candidate.endorsementPageUrl}`);
    VoterGuidePossibilityActions.voterGuidePossibilityRetrieve(candidate.endorsementPageUrl);
    setLoading(true);
    possibilityPositionListener = voterGuidePossibilityPositionStore.addListener(handlePossibilityPositionIDChange);
    return () => possibilityPositionListener.remove;
  };

  renderLog('AddCandidateExtensionForm');  // Set LOG_RENDER_EVENTS to log all renders
  // console.log('AddCandidateExtensionForm render');

  return (
    <form onSubmit={handleSubmit}>
      <CandidateForm>
        <CandidateTextField
          required
          variant="outlined"
          fullWidth
          color="primary"
          label="Candidate Name"
          name="candidateName"
          id="candidateName"
          defaultValue={candidate.candidateName}
          InputLabelProps={{ style: { fontFamily: 'Nunito Sans' } }}
          InputProps={{ style: { fontFamily: 'Nunito Sans' } }}
          onBlur={handleBlur}
        />
        <CandidateTextField
          required
          variant="outlined"
          fullWidth
          color="primary"
          label="Endorsement Website"
          name="endorsementPageUrl"
          id="endorsementURL"
          defaultValue={candidate.endorsementPageUrl}
          InputLabelProps={{ style: { fontFamily: 'Nunito Sans' } }}
          InputProps={{ style: { fontFamily: 'Nunito Sans' } }}
          onBlur={handleBlur}
        />
        <CandidateTextField
          variant="outlined"
          fullWidth
          color="primary"
          label="Candidate-Specific Endorsement Url"
          name="candidateSpecificEndorsementUrl"
          id="candidateSpecificEndorsementUrl"
          defaultValue={candidate.candidateSpecificEndorsementUrl}
          InputLabelProps={{ style: { fontFamily: 'Nunito Sans' } }}
          InputProps={{ style: { fontFamily: 'Nunito Sans' } }}
          onBlur={handleBlur}
        />
        <CandidateTextField
          variant="outlined"
          fullWidth
          multiline
          color="primary"
          label="Endorsement Text"
          name="endorsementText"
          // id="candidateURL"
          defaultValue={candidate.endorsementText}
          InputLabelProps={{ style: { fontFamily: 'Nunito Sans' } }}
          InputProps={{ style: { fontFamily: 'Nunito Sans' } }}
          onBlur={handleBlur}
          rows="5"
          // maxRows="5"
        />
      </CandidateForm>
      <ButtonWrapper>
        <AddCandidateLoadingButton loading={loading} finished={finished} />
      </ButtonWrapper>
    </form>
  );
}
AddCandidateExtensionForm.propTypes = {
  candidate: PropTypes.object,
  setCandidate: PropTypes.func,
};

const CandidateForm = styled('div')`
  width: 410px;
`;

const CandidateTextField = styled(TextField)`
  display: block;
  font-family: "Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  margin-bottom: 10px;
`;

const ButtonWrapper = styled('div')`
  display: grid;
  margin: auto auto;
`;
