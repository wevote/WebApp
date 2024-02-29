import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import VoterGuidePossibilityActions from '../../../actions/VoterGuidePossibilityActions';
import { renderLog } from '../../../common/utils/logging';
import voterGuidePossibilityPositionStore from '../../../stores/VoterGuidePossibilityPositionStore';
import voterGuidePossibilityStore from '../../../stores/VoterGuidePossibilityStore';
import AddCandidateLoadingButton from './AddCandidateLoadingButton';


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
    const { candidateName, candidateSpecificEndorsementUrl, endorsementText, stance } = stateRef.current;
    if (voterGuidePossibilityIdValue !== 0) {
      // if the organization does exist, check if the candidate does
      console.log(candidate);
      const voterGuidePossibilityPositionId = voterGuidePossibilityPositionStore.getVoterGuidePossibilityPositionByCandidateName(candidateName);
      console.log(stateRef.current);
      // if the candidate already exists in the voter guide in the database
      if (voterGuidePossibilityPositionId === 0) {
        const possibilityPositionDictionary = {
          ballot_item_name: candidateName,
          more_info_url: candidateSpecificEndorsementUrl,
          statement_text: endorsementText,
          position_stance: stance,
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

  const onStanceChange = (event) => {
    setCandidate((prevInformation) => ({
      ...prevInformation,
      stance: event.target.value,
    }));
  };

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
    setFinished(true);
    return () => possibilityPositionListener.remove();
  };

  if (finished) {
    // After finish, and then a delay, message our Chrome extension to close the modal dialog that contains this page in an iFrame
    setTimeout(() => {
      // console.log('sending closeIFrameDialog message ---------------------');
      window.parent.postMessage('closeIFrameDialog', '*');
    }, 2000);
  }

  renderLog('AddCandidateExtensionForm');  // Set LOG_RENDER_EVENTS to log all renders

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
          InputLabelProps={{ style: { fontFamily: 'Poppins' } }}
          InputProps={{ style: { fontFamily: 'Poppins' } }}
          onBlur={handleBlur}
        />
        <CandidateTextField
          variant="outlined"
          fullWidth
          color="primary"
          label="Candidate Campaign Url"
          name="candidateSpecificEndorsementUrl"
          id="candidateSpecificEndorsementUrl"
          defaultValue={candidate.candidateSpecificEndorsementUrl}
          InputLabelProps={{ style: { fontFamily: 'Poppins' } }}
          InputProps={{ style: { fontFamily: 'Poppins' } }}
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
          InputLabelProps={{ style: { fontFamily: 'Poppins' } }}
          InputProps={{ style: { fontFamily: 'Poppins' } }}
          onBlur={handleBlur}
        />
        <CheckBoxArea>
          <CheckBoxContainer>
            <CheckBoxInput
              type="radio"
              name="stanceGroup"
              value="SUPPORT"
              id="support"
              checked={candidate.stance === 'SUPPORT'}
              onChange={onStanceChange}
            />
            <CheckBoxLabel htmlFor="support">Support</CheckBoxLabel>
          </CheckBoxContainer>
          <CheckBoxContainer>
            <CheckBoxInput
              type="radio"
              name="stanceGroup"
              value="OPPOSE"
              id="oppose"
              checked={candidate.stance === 'OPPOSE'}
              onChange={onStanceChange}
            />
            <CheckBoxLabel htmlFor="oppose">Oppose</CheckBoxLabel>
          </CheckBoxContainer>
          <CheckBoxContainer>
            <CheckBoxInput
              type="radio"
              name="stanceGroup"
              value="INFO_ONLY"
              id="infoOnly"
              checked={candidate.stance === 'INFO_ONLY'}
              onChange={onStanceChange}
            />
            <CheckBoxLabel htmlFor="infoOnly">Info Only</CheckBoxLabel>
          </CheckBoxContainer>
        </CheckBoxArea>
        <CandidateTextField
          variant="outlined"
          fullWidth
          multiline
          color="primary"
          label="Endorsement Text"
          name="endorsementText"
          // id="candidateURL"
          defaultValue={candidate.endorsementText}
          InputLabelProps={{
            style: { fontFamily: 'Poppins' },
            shrink: true,
          }}
          InputProps={{ style: { fontFamily: 'Poppins' } }}
          onBlur={handleBlur}
          rows="5"
          // maxRows="5"
        />
      </CandidateForm>
      <ButtonWrapper>
        <AddCandidateLoadingButton loading={loading} finished={finished} text="Submit" />
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
  font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  margin-bottom: 10px;
`;

const ButtonWrapper = styled('div')`
  display: grid;
  margin: auto auto;
`;

const CheckBoxArea  = styled('div')`
  margin: 15px 0 20px 30px;
`;

const CheckBoxContainer =  styled('span')`
  margin-right: 10px;
`;

const CheckBoxLabel =  styled('label')`
  margin: 0 12px 0 4px;
`;

const CheckBoxInput = styled('input')`
  transform: translateY(1px);
`;
