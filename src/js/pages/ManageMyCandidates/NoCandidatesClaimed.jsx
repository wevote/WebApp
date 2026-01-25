import React, { Suspense, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import CandidateListRootPlaceholder from '../../components/CampaignsHome/CandidateListRootPlaceholder';
import PoliticianListRoot from '../../components/PoliticianListRoot/PoliticianListRoot';
import PoliticianStore from '../../common/stores/PoliticianStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import searchIcon from '../../../img/global/svg-icons/search.svg';
import VoterStore from '../../stores/VoterStore';

const FirstPoliticianListController = React.lazy(() => import('../../components/PoliticianListRoot/FirstPoliticianListController'));

const NoCandidateClaimed = () => {
  const [searchText, setSearchText] = useState('');
  const [politicianListToShow, setPoliticianListToShow] = useState([]);
  const [politicianListTimeStampOfChange, setPoliticianListTimeStampOfChange] = useState(0);
  const [numberOfPoliticiansResults, setNumberOfPoliticiansResults] = useState(0);
  const listModeFiltersAvailable = useMemo(() => ([]), []);
  const listModeFiltersTimeStampOfChange = 0;
  const [stateCode, setStateCode] = useState(VoterStore.getStateCode() || VoterStore.getStateCodeFromIPAddress());

  let subtitleText = 'Are you part of a candidate\'s team or managing your own campaign?\nHere\'s what you can do to help them win:';

  useEffect(() => {
    const onPoliticianStoreChange = () => {
      const politicianList = PoliticianStore.getPoliticianList();
      setPoliticianListToShow(politicianList || []);
      setPoliticianListTimeStampOfChange(Date.now());
    };
    const politicianStoreListener = PoliticianStore.addListener(onPoliticianStoreChange);
    onPoliticianStoreChange();
    return () => {
      politicianStoreListener.remove();
    };
  }, []);

  useEffect(() => {
    const onVoterStoreChange = () => {
      setStateCode(VoterStore.getStateCode() || VoterStore.getStateCodeFromIPAddress());
    };
    const voterStoreListener = VoterStore.addListener(onVoterStoreChange);
    onVoterStoreChange();
    return () => {
      voterStoreListener.remove();
    };
  }, []);

  useEffect(() => {
    if (searchText.length <= 1) {
      setPoliticianListToShow([]);
      setPoliticianListTimeStampOfChange(Date.now());
      setNumberOfPoliticiansResults(0);
    }
  }, [searchText]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handleNumberOfPoliticiansResults = (listResults) => {
    setNumberOfPoliticiansResults(listResults);
  };

  const shouldShowPoliticians = searchText.length > 1 && politicianListToShow && politicianListToShow.length > 0;
  const isSearching = searchText.length > 0;

  return (
    <Container>
        <PageKicker>for candidate staff:</PageKicker>
      <Header>
        <Title>Improve your candidate's presence on WeVote & build support</Title>
        <Subtitle>
            {subtitleText}
        </Subtitle>
        <List>
          <li>Improve and edit your candidate's presence and rally support</li>
          <li>Import your supporters and potential voters to build your base</li>
          <li>Ask people to publicly support your candidate on WeVote</li>
          <li>Encourage people to share opinions and personal stories about your candidate</li>
          <li>Help supporters spread the word by inviting their friends</li>
        </List>
        <p>
            Together, we can build momentum and get your candidate elected.
        </p>
      </Header>

      <SearchBox>
        <p className="search-header">Claim your candidate's profile to get started</p>
        <SearchBarWrapper>
          <SearchIconStyled src={searchIcon} alt="" aria-hidden="true" />
          <SearchBar
            type="text"
            placeholder="Search for your candidate"
            value={searchText}
            onChange={handleSearchChange}
          />
        </SearchBarWrapper>
      </SearchBox>

      {shouldShowPoliticians && (
        <WhatIsHappeningSection $useMinimumHeight={!isSearching && numberOfPoliticiansResults > 0}>
          <Suspense fallback={<span><CandidateListRootPlaceholder titleTextForList="Politicians" /></span>}>
            <PoliticianListRoot
              hideIfNoResults
              handleNumberOfResults={handleNumberOfPoliticiansResults}
              incomingList={politicianListToShow}
              incomingListTimeStampOfChange={politicianListTimeStampOfChange}
              listModeFilters={listModeFiltersAvailable}
              listModeFiltersTimeStampOfChange={listModeFiltersTimeStampOfChange}
              searchText={searchText}
              stateCode={stateCode}
              titleTextForList=""
            />
          </Suspense>
        </WhatIsHappeningSection>
      )}
      <Suspense fallback={<></>}>
        <FirstPoliticianListController searchText={searchText} stateCode={stateCode} />
      </Suspense>

      <ManageCandidatesLink href="/managecandidates">
        Candidates I&apos;m Managing
      </ManageCandidatesLink>
    </Container>
  );
};

export default NoCandidateClaimed;

const Container = styled.div`
  padding-top: 82px;
  max-width: 800px;
  margin: auto;
  text-align: left;
`;

const PageKicker = styled.h2`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 13px;
  font-weight: 500;
  font-style: medium;
  letter-spacing: 0.06em;
  line-height: 115%;
  margin: 0 0 4px;
  text-transform: uppercase;
`;

const Header = styled.div`
  margin: 6px 0 12px;
`;

const Title = styled.h1`
    color: ${DesignTokenColors.neutralUI900};
    font-size: 32px;
    font-weight: 500;
    font-style: medium;
    line-height: 115%;
    margin: 0 0 30px;
`;

const Subtitle = styled.p`
  font-weight: 500;
  font-size: semibold;
  color: #444;
  font-size: 18px;
  white-space: pre-line;
`;

const List = styled.ul`
  line-height: 1.7;
  color: #333;
  font-style: regular;
  font-size: 16px;
  font-weight: 400;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
`;

const SearchBox = styled.div`
  background: ${DesignTokenColors.primary50};
  width: 608px;
  height: 185px;
  border-radius: 20px;
  border: 1px solid ${DesignTokenColors.neutralUI100};
  padding: 1.25rem;
  margin-top: 32px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
  .search-header {
    font-size: 20px;
    font-weight: 600;
    font-style: semibold;
    line-height: 100%;
    margin-bottom: 0.5rem;
    color: ${DesignTokenColors.neutralUI900};
  }
`;

const ManageCandidatesLink = styled.a`
  display: inline-block;
  margin-top: 20px;
  color: ${DesignTokenColors.primary600};
  font-weight: 500;
  text-decoration: underline;
`;

const SearchBarWrapper = styled.div`
  position: relative;
  width: 520.686767578125px;
  height: 52.5062255859375px;
`;

const SearchIconStyled = styled.img`
  position: absolute;
  left: 16px;
  top: 43%;
  border: 2.48px
  transform: translateY(-45%);
  color: ${DesignTokenColors.neutralUI600};
  width: 28px;
  height: 24px;
  pointer-events: none;
`;

const SearchBar = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 50px;
  padding: 0.75rem 1rem 0.75rem 3.25rem;
  margin-top: 0.5rem;
  font-size: 1rem;
  outline: none;
  &::placeholder {
    color: ${DesignTokenColors.neutralUI600};
    font-weight: 500;
    font-style: medium;
    font-size: 18px;
    line-height: 100%;
    opacity: 1;
  }
`;

const WhatIsHappeningSection = styled.div`
  ${({ $useMinimumHeight }) => ($useMinimumHeight ? 'height: 460px; min-height: 460px;' : '')}
  margin-top: 32px;
  margin-left: -12px;
`;
