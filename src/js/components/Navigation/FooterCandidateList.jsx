import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { convertStateTextToStateCode, stateCodeMap } from '../../common/utils/addressFunctions';

// React functional component example
export default function FooterCandidateList () {
  const stateNameList = Object.values(stateCodeMap);
  let stateCode;
  let stateNamePhrase;
  let stateNamePhraseLowerCase;
  return (
    <FooterCandidateListWrapper>
      <SimpleModeTitle>
        Who&apos;s running for office?
      </SimpleModeTitle>
      {stateNameList.map((stateName) => {
        stateCode = convertStateTextToStateCode(stateName);
        stateNamePhrase = `${stateName}-candidates`;
        stateNamePhraseLowerCase = stateNamePhrase.replace(/\s+/g, '-').toLowerCase();
        // console.log('tempStateCode:', tempStateCode, ', stateAlreadySelected:', stateAlreadySelected);
        return (
          <SimpleModeItemWrapper key={stateCode}>
            <Link className="u-link-color" to={`/${stateNamePhraseLowerCase}/cs/`}>
              {stateName}
              {' '}
              candidates
            </Link>
          </SimpleModeItemWrapper>
        );
      })}
    </FooterCandidateListWrapper>
  );
}

const FooterCandidateListWrapper = styled('span')`
  align-items: center;
  display: flex;
  flex-flow: column;
  margin-top: 10px; // To match BallotElectionListWithFilters
`;

const SimpleModeItemWrapper = styled('div')`
  cursor: pointer;
  margin-top: 12px;
`;

const SimpleModeTitle = styled('h2')`
  margin: 0 !important;
  font-size: 18px;
  font-weight: 600;
  text-align: left !important;
  margin-bottom: 6px !important;
`;
