import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import TagManager from 'react-gtm-module';
import { convertStateTextToStateCode, stateCodeMap } from '../../common/utils/addressFunctions';
import lookupPageNameAndPageTypeDict from '../../utils/lookupPageNameAndPageTypeDict';
import VoterStore from '../../stores/VoterStore';
// React functional component example
export default function FooterCandidateList () {
  const stateNameList = Object.values(stateCodeMap);
  let stateCode;
  let stateNamePhrase;
  let stateNamePhraseLowerCase;

  function handleClick (linkTo) {
    const {
      location: { pathname: currentPathname },
    } = window;
    const page = lookupPageNameAndPageTypeDict(currentPathname);
    const destinationPage = lookupPageNameAndPageTypeDict(linkTo);

    const dataLayerObject = {
      event: 'click',
      userDetails: {
        stateCode: VoterStore.getVoterStateCode(),
        userCohort: VoterStore.getAnalyticsUserCohort(),
        voterWeVoteId: VoterStore.getVoterWeVoteId(),
      },
      pageDetails: {
        pageName: page.pageName,
        pageType: page.pageType,
        pathname: currentPathname,
      },
      destinationDetails: {
        destinationPageName: destinationPage.pageName,
        destinationPageType: destinationPage.pageType,
        destinationPathname: linkTo,
      },
    };

    TagManager.dataLayer(dataLayerObject);

//    console.log(dataLayerObject);
  }

  return (
    <FooterCandidateListWrapper>
      <SimpleModeTitle id="whosRunningForOfficeSectionTitle">
        Who&apos;s running for office?
      </SimpleModeTitle>
      {stateNameList.map((stateName) => {
        stateCode = convertStateTextToStateCode(stateName);
        stateNamePhrase = `${stateName}-candidates`;
        stateNamePhraseLowerCase = stateNamePhrase
          .replace(/\s+/g, '-')
          .toLowerCase();
        // console.log('tempStateCode:', tempStateCode, ', stateAlreadySelected:', stateAlreadySelected);
        const linkTo = `/${stateNamePhraseLowerCase}/cs/`;

        return (
          <SimpleModeItemWrapper key={stateCode}>
            <Link
              id={`${stateNamePhraseLowerCase}_Link`}
              className="u-link-color"
              to={linkTo}
              onClick={() => handleClick(linkTo)}
            >
              {stateName}
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
