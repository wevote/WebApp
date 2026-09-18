import { HowToVote, Launch } from '@mui/icons-material';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TruncateMarkup from 'react-truncate-markup';
import styled from 'styled-components';
import webAppConfig from '../../config';
import AppObservableStore from '../stores/AppObservableStore';
import { convertStateCodeToStateText } from '../utils/addressFunctions';
import { getYearFromUltimateElectionDate } from '../utils/dateFormat';
import highlightSearchText from '../utils/highlightSearchText';
import historyPush from '../utils/historyPush';
import { isCordova, isWebApp } from '../utils/isCordovaOrWebApp';
import isMobileScreenSize from '../utils/isMobileScreenSize';
import { renderLog } from '../utils/logging';
import { CampaignActionButtonsWrapper, CampaignImageDesktop, CampaignImageDesktopPlaceholder, CampaignImageMobile, CampaignImageMobilePlaceholder, CampaignImagePlaceholderText, CandidateCardForListWrapper, CardForListRow, CardRowsWrapper, ElectionYear, OneCampaignDescription, OneCampaignInnerWrapper, OneCampaignOuterWrapper, OneCampaignPhotoDesktopColumn, OneCampaignPhotoWrapperMobile, OneCampaignTextColumn, OneCampaignTitle, OneCampaignTitleLink, StateName, TitleAndTextWrapper } from './Style/CampaignCardStyles';
import DesignTokenColors from './Style/DesignTokenColors';
import HeartFavoriteToggleLoader from './Widgets/HeartFavoriteToggle/HeartFavoriteToggleLoader';
import SvgImage from './Widgets/SvgImage';
import extractPoliticianDetailsFromUrl from '../utils/extractPoliticianDetailsFromUrl';
import lookupPageNameAndPageTypeDict from '../../utils/lookupPageNameAndPageTypeDict';
import ClaimedProfileIcon from './Widgets/ClaimedProfileIcon';

const CampaignSupportThermometer = React.lazy(() => import(/* webpackChunkName: 'CampaignSupportThermometer' */ './CampaignSupport/CampaignSupportThermometer'));
const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../../components/Widgets/ItemActionBar/ItemActionBar'));
const OfficeHeldNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeHeldNameText' */ './Widgets/OfficeHeldNameText'));
const OfficeNameText = React.lazy(() => import(/* webpackChunkName: 'OfficeNameText' */ './Widgets/OfficeNameText'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ './Widgets/OpenExternalWebSite'));

// React functional component example
function CardForListBody (props) {
  renderLog('CardForListBody');  // Set LOG_RENDER_EVENTS to log all renders
  const {
    ballotItemDisplayName,
    candidateWeVoteId, classes, districtName, finalElectionDateInPast, hideCardMargins,
    hideItemActionBar, isClaimedProfile, limitCardWidth, linkedCampaignXWeVoteId, officeName,
    onDisplayNameClick, photoLargeUrl, politicalParty, politicianBasePath,
    politicianDescription, politicianWeVoteId, profileImageBackgroundColor,
    searchText, showPoliticianOpenInNewWindow, stateCode,
    supportPolitician, tagIdBaseName,
    ultimateElectionDate,
    useCampaignSupportThermometer, useOfficeHeld,
    usePoliticianWeVoteIdForBallotItem, useVerticalCard,
  } = props;
  // console.log('CardForListBody supportPolitician: ', supportPolitician, ', useCampaignSupportThermometer:', useCampaignSupportThermometer);

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
    politicalPartySvgNameWithPath = '../../img/global/svg-icons/political-party-green-party.svg';
  } else if (['Libertarian', 'Libertarian Party'].includes(politicalParty)) {
    politicalPartySvgNameWithPath = '../../img/global/svg-icons/political-party-libertarian.svg';
  } else if (['Working Families', 'Working Families Party'].includes(politicalParty)) {
    politicalPartySvgNameWithPath = '../../img/global/svg-icons/political-party-working-families.svg';
  }
  const politicianDetailsURL = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}${politicianBasePath}`;
  const destinationPage = lookupPageNameAndPageTypeDict(politicianBasePath);
  // console.log('politicianBasePath:', politicianBasePath);
  // console.log('CardForListBody politicianDetailsURL:', politicianDetailsURL, ', destinationPage: ', destinationPage);
  const location = useLocation();
  const { state: stateFromUrl, name: nameFromUrl } = extractPoliticianDetailsFromUrl(location.pathname);

  // /////////////////////// START OF DISPLAY
  return (
    <CandidateCardForListWrapper id={`cardForListBodyWrapper-${candidateWeVoteId || politicianWeVoteId}`} limitCardWidth={limitCardWidth}>
      <OneCampaignOuterWrapper limitCardWidth={limitCardWidth}>
        <OneCampaignInnerWrapper
          hideCardMargins={hideCardMargins}
          useVerticalCard={limitCardWidth || useVerticalCard || isMobileScreenSize()}
        >
          <OneCampaignTextColumn hideCardMargins={hideCardMargins}>
            <TitleAndTextWrapper hideCardMargins={hideCardMargins}>
              {(stateName || stateFromUrl) && (
                <StateName id={`stateName-${stateCode}-${candidateWeVoteId}`}>
                  {stateName || stateFromUrl}
                </StateName>
              )}
              {hideCardMargins && isWebApp() ? (
                <OneCampaignTitle>
                  {highlightSearchText(ballotItemDisplayName || nameFromUrl, searchText)}
                  {showPoliticianOpenInNewWindow && (
                    <LaunchIconWrapper>
                      <Suspense fallback={<Skeleton variant="rounded" width={16} height={14} sx={{ display: 'inline-block', borderRadius: 0.5 }} />}>
                        <OpenExternalWebSite
                          linkIdAttribute="openPoliticianPage"
                          url={politicianDetailsURL}
                          target="_blank"
                          className="open-web-site open-web-site__no-right-padding"
                          candidateWeVoteId={candidateWeVoteId}
                          politicianWeVoteId={politicianWeVoteId}
                          body={(
                            <span>
                              <Launch
                                style={{
                                  height: 14,
                                  marginLeft: 2,
                                  marginTop: '-3px',
                                  width: 14,
                                }}
                              />
                            </span>
                          )}
                          destinationPageName={destinationPage.pageName}
                          destinationPageType={destinationPage.pageType}
                          trackingOn
                        />
                      </Suspense>
                    </LaunchIconWrapper>
                  )}
                </OneCampaignTitle>
              ) : (
                <OneCampaignTitleLink>
                  <Link
                    className={isCordova() ? 'u-link-color u-link-underline' : ''}
                    id={`${tagIdBaseName}DisplayName`}
                    to={politicianBasePath}
                    onClick={(e) => {
                      if (onDisplayNameClick) {
                        e.preventDefault();
                        onDisplayNameClick();
                        return;
                      }
                      if (isCordova()) {
                        AppObservableStore.setShowOrganizationModal(false);
                      }
                    }}
                  >
                    {highlightSearchText(ballotItemDisplayName || nameFromUrl, searchText)}
                  </Link>
                </OneCampaignTitleLink>
              )}
              <YearAndHeartDiv>
                <ElectionYear largeDisplay={!useCampaignSupportThermometer}>
                  {!!(electionDateYear) && (
                    <>
                      {electionDateYear}
                    </>
                  )}
                </ElectionYear>
                {!useCampaignSupportThermometer && (
                  <>
                    {/* {source} */}
                    <HeartFavoriteToggleLoader campaignXWeVoteId={linkedCampaignXWeVoteId} supportPolitician={supportPolitician} />
                  </>
                )}
              </YearAndHeartDiv>
              <SpaceBeforeThermometer />
              {useCampaignSupportThermometer && (
                <Suspense fallback={(
                  <Box>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Skeleton variant="rounded" width={60} height={36} sx={{ borderRadius: 2 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Skeleton variant="text" width="70%" height={18} sx={{ mb: 0.5 }} />
                        <Skeleton variant="text" width="50%" height={18} />
                      </Box>
                    </Box>
                    <Skeleton variant="rounded" width="100%" height={12} sx={{ borderRadius: 6 }} />
                  </Box>
                )}>  {/* CORDOVA_TOKEN_AT_CLOSE_OF_A_MULTI_LINE_FALLBACK_DO_NOT_REMOVE */}
                  <CampaignSupportThermometer
                    campaignXWeVoteId={linkedCampaignXWeVoteId}
                    finalElectionDateInPast={finalElectionDateInPast}
                    supportPolitician={supportPolitician}
                  />
                </Suspense>
              )}
              <CardRowsWrapper>
                <CardForListRow>
                  <FlexDivLeft>
                    <SvgImageWrapper>
                      {politicalParty ? (
                        <SvgImage imageName={politicalPartySvgNameWithPath} stylesTextIncoming="width: 18px;" />
                      ) : (
                        <Skeleton variant="rounded" width={18} height={18} sx={{ borderRadius: 0.5 }} />
                      )}
                    </SvgImageWrapper>
                    {politicalParty ? (
                      <PoliticalPartyDiv>{highlightSearchText(politicalParty, searchText)}</PoliticalPartyDiv>
                    ) : (
                      <Skeleton variant="text" width={80} height={14} />
                    )}
                  </FlexDivLeft>
                </CardForListRow>
                <CardForListRow>
                  <Suspense fallback={(
                    <FlexDivLeft>
                      <SvgImageWrapper>
                        <Skeleton variant="rounded" width={18} height={18} sx={{ borderRadius: 0.5 }} />
                      </SvgImageWrapper>
                      <Skeleton variant="text" width="80%" height={14} />
                    </FlexDivLeft>
                  )}>  {/* CORDOVA_TOKEN_AT_CLOSE_OF_A_MULTI_LINE_FALLBACK_DO_NOT_REMOVE */}
                    {useOfficeHeld ? (
                      <FlexDivLeft>
                        {(districtName || officeName) && (
                          <SvgImageWrapper>
                            <HowToVote classes={{ root: classes.howToVoteRoot }} />
                          </SvgImageWrapper>
                        )}
                        <OfficeNameWrapper>
                          <OfficeHeldNameText
                            inCard
                            districtName={districtName}
                            officeName={officeName}
                            searchText={searchText}
                          />
                        </OfficeNameWrapper>
                      </FlexDivLeft>
                    ) : (
                      <FlexDivLeft>
                        {(districtName || officeName) && (
                          <SvgImageWrapper>
                            <HowToVote classes={{ root: classes.howToVoteRoot }} />
                          </SvgImageWrapper>
                        )}
                        <OfficeNameWrapper>
                          <OfficeNameText
                            districtName={districtName}
                            inCard
                            officeName={officeName}
                            searchText={searchText}
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
                        onClick={hideCardMargins ? null : () => historyPush(politicianBasePath)}
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
                  className={`${!hideCardMargins && 'u-cursor--pointer '}`}
                  id={`${tagIdBaseName}Description`}
                  onClick={hideCardMargins ? null : () => historyPush(politicianBasePath)}
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
                <Suspense fallback={(
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
                    <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
                  </Box>
                )}>  {/* CORDOVA_TOKEN_AT_CLOSE_OF_A_MULTI_LINE_FALLBACK_DO_NOT_REMOVE */}
                  {(finalElectionDateInPast || usePoliticianWeVoteIdForBallotItem) ? (
                    <ItemActionBar
                      ballotItemWeVoteId={candidateWeVoteId}
                      ballotItemDisplayName={ballotItemDisplayName}
                      campaignXWeVoteId={linkedCampaignXWeVoteId}
                      commentButtonHide
                      // externalUniqueId={`${idBaseName}ForList-ItemActionBar-${politicianWeVoteId}-${externalUniqueId}`}
                      hidePositionPublicToggle
                      inCard
                      politicianWeVoteId={politicianWeVoteId}
                      positionPublicToggleWrapAllowed
                      shareButtonHide
                      useHelpDefeatOrHelpWin
                      // useSupportWording
                    />
                  ) : (
                    <ItemActionBar
                      ballotItemWeVoteId={candidateWeVoteId}
                      ballotItemDisplayName={ballotItemDisplayName}
                      campaignXWeVoteId={linkedCampaignXWeVoteId}
                      commentButtonHide
                      // externalUniqueId={`${idBaseName}ForList-ItemActionBar-${politicianWeVoteId}-${externalUniqueId}`}
                      hidePositionPublicToggle
                      inCard
                      politicianWeVoteId={politicianWeVoteId}
                      positionPublicToggleWrapAllowed
                      shareButtonHide
                      useHelpDefeatOrHelpWin
                      // useSupportWording
                    />
                  )}
                </Suspense>
              </CampaignActionButtonsWrapper>
            )}
          </OneCampaignTextColumn>
          <OneCampaignPhotoWrapperMobile
            className={`${hideCardMargins ? 'u-show-mobile' : 'u-cursor--pointer u-show-mobile'}`}
            id={`${tagIdBaseName}PhotoMobile`}
            onClick={hideCardMargins ? null : () => historyPush(politicianBasePath)}
          >
            {photoLargeUrl ? (
              <PoliticianImageContainer>
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
                    loading="eager"
                    fetchpriority="high"
                  />
                </CampaignImageMobilePlaceholder>
                {isClaimedProfile && (
                  <ClaimedProfileOverlay onClick={(e) => e.stopPropagation()}>
                    <ClaimedProfileIcon />
                  </ClaimedProfileOverlay>
                )}
              </PoliticianImageContainer>
            ) : (
              <PoliticianImageContainer>
                <CampaignImageMobilePlaceholder
                  id="cimp2"
                  profileImageBackgroundColor={profileImageBackgroundColor}
                  useVerticalCard={useVerticalCard}
                >
                  <SvgWatermarkWrapper>
                    <SvgImage
                      applyFillColor
                      color={DesignTokenColors.neutralUI300}
                      height="100px"
                      imageName={politicalPartySvgNameWithPath}
                      marginBottom="-10px"
                      opacity="0.33"
                    />
                    <CampaignImagePlaceholderText>
                      No candidate image available.
                    </CampaignImagePlaceholderText>
                  </SvgWatermarkWrapper>
                </CampaignImageMobilePlaceholder>
                {isClaimedProfile && (
                  <ClaimedProfileOverlay onClick={(e) => e.stopPropagation()}>
                    <ClaimedProfileIcon />
                  </ClaimedProfileOverlay>
                )}
              </PoliticianImageContainer>
            )}
          </OneCampaignPhotoWrapperMobile>
          <OneCampaignPhotoDesktopColumn
            className={`${!hideCardMargins && 'u-cursor--pointer '} u-show-desktop-tablet`}
            hideCardMargins={hideCardMargins}
            id={`${tagIdBaseName}PhotoDesktop`}
            limitCardWidth={limitCardWidth}
            onClick={hideCardMargins ? null : () => {
              if (onDisplayNameClick) {
                onDisplayNameClick();
                return;
              }
              historyPush(politicianBasePath);
            }}
            profileImageBackgroundColor={profileImageBackgroundColor}
            useVerticalCard={useVerticalCard}
          >
            {photoLargeUrl ? (
              <PoliticianImageContainer>
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
                        loading="eager"
                        fetchpriority="high"
                      />
                    </CampaignImageDesktopPlaceholder>
                  ) : (
                    <CampaignImageDesktop src={photoLargeUrl} alt="" width="117px" height="117px" />
                  )}
                </>
                {isClaimedProfile && (
                  <ClaimedProfileOverlay onClick={(e) => e.stopPropagation()}>
                    <ClaimedProfileIcon />
                  </ClaimedProfileOverlay>
                )}
              </PoliticianImageContainer>
            ) : (
              <PoliticianImageContainer>
                <CampaignImageDesktopPlaceholder
                  id="cidp5"
                  limitCardWidth={limitCardWidth}
                  profileImageBackgroundColor={profileImageBackgroundColor}
                  useVerticalCard={useVerticalCard}
                >
                  <CampaignImagePlaceholderText>
                    <SvgImage
                      applyFillColor
                      color={DesignTokenColors.neutralUI300}
                      height="140px"
                      imageName={politicalPartySvgNameWithPath}
                      marginBottom="-10px"
                      opacity="0.33"
                    />
                    No candidate image available.
                  </CampaignImagePlaceholderText>
                  {isClaimedProfile && (
                    <ClaimedProfileOverlay onClick={(e) => e.stopPropagation()}>
                      <ClaimedProfileIcon />
                    </ClaimedProfileOverlay>
                  )}
                </CampaignImageDesktopPlaceholder>
              </PoliticianImageContainer>
            )}
          </OneCampaignPhotoDesktopColumn>
        </OneCampaignInnerWrapper>
      </OneCampaignOuterWrapper>
    </CandidateCardForListWrapper>
  );
}
CardForListBody.propTypes = {
  source: PropTypes.string,
  ballotItemDisplayName: PropTypes.string.isRequired, // Changed to be required due to error where this shows as undefined [WV-379] when fetching from PoliticianStore 7/18/2024
  candidateWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  districtName: PropTypes.string,
  finalElectionDateInPast: PropTypes.bool,
  hideCardMargins: PropTypes.bool,
  hideItemActionBar: PropTypes.bool,
  isClaimedProfile: PropTypes.bool,
  limitCardWidth: PropTypes.bool,
  linkedCampaignXWeVoteId: PropTypes.string,
  officeName: PropTypes.string,
  onDisplayNameClick: PropTypes.func,
  photoLargeUrl: PropTypes.string,
  politicalParty: PropTypes.string,
  politicianBasePath: PropTypes.string.isRequired,
  politicianDescription: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
  profileImageBackgroundColor: PropTypes.string,
  searchText: PropTypes.string,
  showPoliticianOpenInNewWindow: PropTypes.bool,
  stateCode: PropTypes.string,
  supportPolitician: PropTypes.bool,
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

const LaunchIconWrapper = styled('span')`
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

export const SvgWatermarkWrapper = styled('div')`
`;

export const YearAndHeartDiv = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const PoliticianImageContainer = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ClaimedProfileOverlay = styled('div')`
  position: absolute;
  bottom: -14px;
  right: 5%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 50%;
  padding: 3px;
  z-index: 2;
  cursor: default;
  pointer-events: auto;
`;

export default withStyles(styles)(CardForListBody);
