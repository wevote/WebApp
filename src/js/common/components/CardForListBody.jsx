import withStyles from '@mui/styles/withStyles';
import { HowToVote } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import TruncateMarkup from 'react-truncate-markup';
import styled from 'styled-components';
import { renderLog } from '../utils/logging';
import {
  // BottomActionButtonEmptyWrapper,
  // BottomActionButtonWrapper,
  CampaignActionButtonsWrapper,
  CampaignImageDesktop,
  CampaignImageDesktopPlaceholder,
  CampaignImageMobile,
  CampaignImageMobilePlaceholder,
  CampaignImagePlaceholderText,
  CandidateCardForListWrapper,
  CardForListRow, CardRowsWrapper,
  ElectionYear,
  OneCampaignDescription,
  OneCampaignInnerWrapper,
  OneCampaignOuterWrapper,
  OneCampaignPhotoDesktopColumn,
  OneCampaignPhotoWrapperMobile,
  OneCampaignTextColumn,
  OneCampaignTitle,
  OneCampaignTitleLink,
  StateName,
  // SupportersActionLink,
  // SupportersCount,
  // SupportersWrapper,
  TitleAndTextWrapper,
} from './Style/CampaignCardStyles';
// import CampaignStore from '../stores/CampaignStore';
import { convertStateCodeToStateText } from '../utils/addressFunctions';
import { getYearFromUltimateElectionDate } from '../utils/dateFormat';
import historyPush from '../utils/historyPush';
import isMobileScreenSize from '../utils/isMobileScreenSize';
import DesignTokenColors from './Style/DesignTokenColors';
import HeartFavoriteToggleLoader from './Widgets/HeartFavoriteToggle/HeartFavoriteToggleLoader';
import SvgImage from './Widgets/SvgImage';

const CampaignSupportThermometer = React.lazy(() => import(/* webpackChunkName: 'CampaignSupportThermometer' */ './CampaignSupport/CampaignSupportThermometer'));
const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../../components/Widgets/ItemActionBar/ItemActionBar'));
const OfficeHeldNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeHeldNameText' */ './Widgets/OfficeHeldNameText'));
const OfficeNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeNameText' */ './Widgets/OfficeNameText'));

// React functional component example
function CardForListBody (props) {
  renderLog('CardForListBody');  // Set LOG_RENDER_EVENTS to log all renders
  const {
    ballotItemDisplayName, // campaignSupported,
    candidateWeVoteId, classes, districtName, finalElectionDateInPast, hideCardMargins,
    hideItemActionBar, limitCardWidth, linkedCampaignXWeVoteId, officeName,
    photoLargeUrl, politicalParty, politicianBaseBath,  // pathToUseToKeepHelping
    politicianDescription, politicianWeVoteId, profileImageBackgroundColor,
    stateCode, tagIdBaseName, // supportersCount, supportersCountNextGoalRaw,
    ultimateElectionDate,
    useCampaignSupportThermometer, useOfficeHeld,
    usePoliticianWeVoteIdForBallotItem, useVerticalCard,
  } = props;
  // const supportersCountNextGoal = supportersCountNextGoalRaw || 0;
  // let supportersCountNextGoalWithFloor = supportersCountNextGoal || CampaignStore.getCampaignXSupportersCountNextGoalDefault();
  // console.log('supportersCount:', supportersCount, 'supportersCountNextGoal:', supportersCountNextGoal, 'supportersCountNextGoalWithFloor:', supportersCountNextGoalWithFloor);
  // if (supportersCount && supportersCountNextGoalWithFloor < supportersCount) {
  //   const nextGoal = supportersCount + 50;
  //   supportersCountNextGoalWithFloor = Math.floor(nextGoal / 50) * 50;
  // }
  const stateName = convertStateCodeToStateText(stateCode);
  const electionDateYear = getYearFromUltimateElectionDate(ultimateElectionDate);
  let politicalPartySvgNameWithPath = '../../img/global/svg-icons/political-party-unspecified.svg';
  if (['Democrat', 'Democratic'].includes(politicalParty)) {
    politicalPartySvgNameWithPath = '../../img/global/svg-icons/political-party-democrat.svg';
  } else if (['Republican', 'Republican Party'].includes(politicalParty)) {
    politicalPartySvgNameWithPath = '../../img/global/svg-icons/political-party-republican.svg';
  } else if (['Green', 'Green Party'].includes(politicalParty)) {
    politicalPartySvgNameWithPath = '../../img/global/svg-icons/political-party-green-party.svg'
  } else if (['Libertarian', 'Libertarian Party'].includes(politicalParty)) {
    politicalPartySvgNameWithPath = '../../img/global/svg-icons/political-party-libertarian.svg'
  } else if (['Working', 'Working Families Party'].includes(politicalParty)) {
    politicalPartySvgNameWithPath = '../../img/global/svg-icons/political-party-working-families.svg'
  } 

  // /////////////////////// START OF DISPLAY
  return (
    <CandidateCardForListWrapper limitCardWidth={limitCardWidth}>
      <OneCampaignOuterWrapper limitCardWidth={limitCardWidth}>
        <OneCampaignInnerWrapper
          hideCardMargins={hideCardMargins}
          useVerticalCard={limitCardWidth || useVerticalCard || isMobileScreenSize()}
        >
          <OneCampaignTextColumn hideCardMargins={hideCardMargins}>
            <TitleAndTextWrapper hideCardMargins={hideCardMargins}>
              {stateName && (
                <StateName>
                  {stateName}
                </StateName>
              )}
              {hideCardMargins ? (
                <OneCampaignTitle>
                  {ballotItemDisplayName}
                </OneCampaignTitle>
              ) : (
                <OneCampaignTitleLink>
                  <Link
                    // className="u-link-color u-link-underline"
                    id={`${tagIdBaseName}DisplayName`}
                    to={politicianBaseBath}
                  >
                    {ballotItemDisplayName}
                  </Link>
                </OneCampaignTitleLink>
              )}
              <YearAndHeartDiv>
                <ElectionYear largeDisplay={!useCampaignSupportThermometer}>
                  {!!(electionDateYear) && (
                    <>{electionDateYear}</>
                  )}
                </ElectionYear>
                {!useCampaignSupportThermometer && (
                  <HeartFavoriteToggleLoader campaignXWeVoteId={linkedCampaignXWeVoteId} />
                )}
              </YearAndHeartDiv>
              <SpaceBeforeThermometer />
              {useCampaignSupportThermometer && (
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignSupportThermometer
                    campaignXWeVoteId={linkedCampaignXWeVoteId}
                    finalElectionDateInPast={finalElectionDateInPast}
                  />
                </Suspense>
              )}
              <CardRowsWrapper>
                {politicalParty && (
                  <CardForListRow>
                    <FlexDivLeft>
                      <SvgImageWrapper>
                        <SvgImage imageName={politicalPartySvgNameWithPath} stylesTextIncoming="width: 18px;" />
                      </SvgImageWrapper>
                      <PoliticalPartyDiv>{politicalParty}</PoliticalPartyDiv>
                    </FlexDivLeft>
                  </CardForListRow>
                )}
                <CardForListRow>
                  <Suspense fallback={<></>}>
                    {useOfficeHeld ? (
                      <FlexDivLeft>
                        <SvgImageWrapper>
                          <HowToVote classes={{ root: classes.howToVoteRoot }} />
                        </SvgImageWrapper>
                        <OfficeNameWrapper>
                          <OfficeHeldNameText
                            inCard
                            districtName={districtName}
                            officeName={officeName}
                          />
                        </OfficeNameWrapper>
                      </FlexDivLeft>
                    ) : (
                      <FlexDivLeft>
                        <SvgImageWrapper>
                          <HowToVote classes={{ root: classes.howToVoteRoot }} />
                        </SvgImageWrapper>
                        <OfficeNameWrapper>
                          <OfficeNameText
                            districtName={districtName}
                            inCard
                            officeName={officeName}
                            showOfficeName
                          />
                        </OfficeNameWrapper>
                      </FlexDivLeft>
                    )}
                  </Suspense>
                </CardForListRow>
              </CardRowsWrapper>
              {/*
              <>
                {finalElectionDateInPast ? (
                  <SupportersWrapper>
                    {(!supportersCount || supportersCount === 0) ? (
                      <SupportersCount>
                        0 supporters.
                        {' '}
                      </SupportersCount>
                    ) : (
                      <SupportersCount>
                        {numberWithCommas(supportersCount)}
                        {' '}
                        {supportersCount === 1 ? 'supporter.' : 'supporters.'}
                        {' '}
                      </SupportersCount>
                    )}
                    {campaignSupported && (
                      <SupportersActionLink>
                        Thank you for supporting!
                      </SupportersActionLink>
                    )}
                  </SupportersWrapper>
                ) : (
                  <SupportersWrapper>
                    {(!supportersCount || supportersCount === 0) ? (
                      <SupportersCount>
                        Be the first.
                        {' '}
                      </SupportersCount>
                    ) : (
                      <SupportersCount>
                        {numberWithCommas(supportersCount)}
                        {' '}
                        {supportersCount === 1 ? 'supporter.' : 'supporters.'}
                      </SupportersCount>
                    )}
                    {' '}
                    {campaignSupported ? (
                      <SupportersActionLink>
                        Thank you for supporting!
                      </SupportersActionLink>
                    ) : (
                      <SupportersActionLink
                        className="u-link-color u-link-underline u-cursor--pointer"
                        id={`${tagIdBaseName}LetsGetTo`}
                        onClick={hideCardMargins ? null : () => historyPush(politicianBaseBath)}
                      >
                        Let&apos;s get to
                        {' '}
                        {numberWithCommas(supportersCountNextGoalWithFloor)}
                        !
                      </SupportersActionLink>
                    )}
                  </SupportersWrapper>
                )}
              </>
              */}
              {politicianDescription && (
                <OneCampaignDescription
                  className="u-cursor--pointer"
                  id={`${tagIdBaseName}Description`}
                  onClick={hideCardMargins ? null : () => historyPush(politicianBaseBath)}
                >
                  <TruncateMarkup
                    ellipsis="..."
                    lines={2}
                    tokenize="words"
                  >
                    <div>
                      {politicianDescription}
                    </div>
                  </TruncateMarkup>
                </OneCampaignDescription>
              )}
              {/*
              <CampaignOwnersWrapper>
                <CampaignOwnersList campaignXWeVoteId={campaignXWeVoteId} compressedMode />
              </CampaignOwnersWrapper>
              */}
            </TitleAndTextWrapper>
            {!hideItemActionBar && (
              <CampaignActionButtonsWrapper>
                <Suspense fallback={<></>}>
                  {(finalElectionDateInPast || usePoliticianWeVoteIdForBallotItem) ? (
                    <ItemActionBar
                      ballotItemWeVoteId={politicianWeVoteId}
                      ballotItemDisplayName={ballotItemDisplayName}
                      commentButtonHide
                      // externalUniqueId={`${idBaseName}ForList-ItemActionBar-${politicianWeVoteId}-${externalUniqueId}`}
                      hidePositionPublicToggle
                      inCard
                      positionPublicToggleWrapAllowed
                      shareButtonHide
                      // useSupportWording
                    />
                  ) : (
                    <ItemActionBar
                      ballotItemWeVoteId={candidateWeVoteId}
                      ballotItemDisplayName={ballotItemDisplayName}
                      commentButtonHide
                      // externalUniqueId={`${idBaseName}ForList-ItemActionBar-${politicianWeVoteId}-${externalUniqueId}`}
                      hidePositionPublicToggle
                      inCard
                      positionPublicToggleWrapAllowed
                      shareButtonHide
                      // useSupportWording
                    />
                  )}
                </Suspense>
              </CampaignActionButtonsWrapper>
            )}
          </OneCampaignTextColumn>
          <OneCampaignPhotoWrapperMobile
            className={`${hideCardMargins ? '' : 'u-cursor--pointer'} u-show-mobile`}
            id={`${tagIdBaseName}PhotoMobile`}
            onClick={hideCardMargins ? null : () => historyPush(politicianBaseBath)}
          >
            {photoLargeUrl ? (
              <CampaignImageMobilePlaceholder
                id="cimp4"
                profileImageBackgroundColor={profileImageBackgroundColor}
                useVerticalCard={useVerticalCard}
              >
                <CampaignImageMobile
                  alt=""
                  src={photoLargeUrl}
                  style={useVerticalCard ? {
                    borderBottom: `1px solid ${DesignTokenColors.neutralUI100}`,
                    borderTop: `1px solid ${DesignTokenColors.neutralUI100}`,
                  } : {}}
                />
              </CampaignImageMobilePlaceholder>
            ) : (
              <CampaignImageMobilePlaceholder
                id="cimp2"
                profileImageBackgroundColor={profileImageBackgroundColor}
                useVerticalCard={useVerticalCard}
              >
                <CampaignImagePlaceholderText>
                  No image provided
                </CampaignImagePlaceholderText>
              </CampaignImageMobilePlaceholder>
            )}
          </OneCampaignPhotoWrapperMobile>
          <OneCampaignPhotoDesktopColumn
            className="u-cursor--pointer u-show-desktop-tablet"
            hideCardMargins={hideCardMargins}
            id={`${tagIdBaseName}PhotoDesktop`}
            limitCardWidth={limitCardWidth}
            onClick={hideCardMargins ? null : () => historyPush(politicianBaseBath)}
            profileImageBackgroundColor={profileImageBackgroundColor}
            useVerticalCard={useVerticalCard}
          >
            {photoLargeUrl ? (
              <>
                {useVerticalCard ? (
                  <CampaignImageDesktopPlaceholder
                    id="cidp4"
                    limitCardWidth={limitCardWidth}
                    profileImageBackgroundColor={profileImageBackgroundColor}
                    useVerticalCard={useVerticalCard}
                  >
                    <CampaignImageDesktop
                      src={photoLargeUrl}
                      alt=""
                      style={useVerticalCard ? {
                        borderBottom: `1px solid ${DesignTokenColors.neutralUI100}`,
                        borderTop: `1px solid ${DesignTokenColors.neutralUI100}`,
                      } : {}}
                      width={limitCardWidth ? '157px' : '200px'}
                      height={limitCardWidth ? '157px' : '200px'}
                    />
                  </CampaignImageDesktopPlaceholder>
                ) : (
                  <CampaignImageDesktop src={photoLargeUrl} alt="" width="117px" height="117px" />
                )}
              </>
            ) : (
              <CampaignImageDesktopPlaceholder
                id="cidp5"
                limitCardWidth={limitCardWidth}
                profileImageBackgroundColor={profileImageBackgroundColor}
                useVerticalCard={useVerticalCard}
              >
                <CampaignImagePlaceholderText>
                  No image provided
                </CampaignImagePlaceholderText>
              </CampaignImageDesktopPlaceholder>
            )}
          </OneCampaignPhotoDesktopColumn>
        </OneCampaignInnerWrapper>
      </OneCampaignOuterWrapper>
    </CandidateCardForListWrapper>
  );
}
CardForListBody.propTypes = {
  ballotItemDisplayName: PropTypes.string, // PropTypes.string.isRequired,
  candidateWeVoteId: PropTypes.string,
  districtName: PropTypes.string,
  finalElectionDateInPast: PropTypes.bool,
  hideCardMargins: PropTypes.bool,
  hideItemActionBar: PropTypes.bool,
  limitCardWidth: PropTypes.bool,
  linkedCampaignXWeVoteId: PropTypes.string,
  officeName: PropTypes.string,
  photoLargeUrl: PropTypes.string,
  politicalParty: PropTypes.string,
  politicianBaseBath: PropTypes.string.isRequired,
  politicianDescription: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
  profileImageBackgroundColor: PropTypes.string,
  stateCode: PropTypes.string,
  // supportersCount: PropTypes.number.isRequired,
  // supportersCountNextGoalRaw: PropTypes.number,
  tagIdBaseName: PropTypes.string,
  ultimateElectionDate: PropTypes.number,
  useCampaignSupportThermometer: PropTypes.bool,
  useOfficeHeld: PropTypes.bool,
  usePoliticianWeVoteIdForBallotItem: PropTypes.bool,
  useVerticalCard: PropTypes.bool,
};

const styles = () => ({
  howToVoteRoot: {
    color: '#999',
    height: 18,
    // marginRight: 3,
    width: 18,
  },
});

export const FlexDivLeft = styled('div')`
  align-items: center;
  display: flex;
  justify-content: start;
`;

export const OfficeNameWrapper = styled('div')`
`;

export const PoliticalPartyDiv = styled('div')`
`;

export const SpaceBeforeThermometer = styled('div')`
  margin-bottom: 8px;
`;

export const SvgImageWrapper = styled('div')`
  max-width: 25px;
  min-width: 25px;
  width: 25px;
`;

export const YearAndHeartDiv = styled('div')`
  display: flex;
  justify-content: space-between;
`;

export default withStyles(styles)(CardForListBody);
