import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
// import TruncateMarkup from 'react-truncate-markup';
import styled from 'styled-components';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
// import numberWithCommas from '../../utils/numberWithCommas';
// import ChallengeOwnersList from '../ChallengeInviteeListRoot/ChallengeOwnersList';
import {
  ChallengeImageDesktop,
  ChallengeImageDesktopPlaceholder,
  ChallengeImageMobile,
  ChallengeImageMobilePlaceholder,
  ChallengeImagePlaceholderText,
  CandidateCardForListWrapper,
  OneChallengeInnerWrapper,
  OneChallengeOuterWrapper,
  OneChallengePhotoDesktopColumn,
  OneChallengePhotoWrapperMobile,
  OneChallengeTextColumn,
  OneChallengeTitleLink,
  TitleAndTextWrapper,
  ChallengeCardForListWrapper,
} from '../Style/ChallengeCardStyles';
import { DraftModeIndicator, IndicatorDefaultButtonWrapper, IndicatorRow } from '../Style/CampaignIndicatorStyles';
import DesignTokenColors from '../Style/DesignTokenColors';
import SvgImage from '../Widgets/SvgImage';
import JoinedAndDaysLeft from '../Challenge/JoinedAndDaysLeft';

// React functional component example
function ChallengeCardForListBody (props) {
  renderLog('ChallengeCardForListBody');  // Set LOG_RENDER_EVENTS to log all renders
  const {
    challengeDescription, challengeSupported, challengeTitle, challengeWeVoteId,
    hideCardMargins, inDraftMode, joinedAndDaysLeftOff, functionToUseToKeepHelping, functionToUseWhenProfileComplete,
    limitCardWidth, onChallengeClick, onChallengeClickLink, onChallengeEditClick,
    photoLargeUrl, profileImageBackgroundColor,
    participantsCount, participantsCountNextGoalWithFloor, tagIdBaseName, useVerticalCard,
    voterCanEditThisChallenge,
  } = props;
  const politicalPartySvgNameWithPath = '../../img/global/svg-icons/political-party-unspecified.svg';
  // console.log('ChallengeCardForListBody functional component photoLargeUrl:', photoLargeUrl);

  // /////////////////////// START OF DISPLAY
  return (
    <ChallengeCardForListWrapper limitCardWidth={limitCardWidth}>
      <OneChallengeOuterWrapper limitCardWidth={limitCardWidth}>
        <OneChallengeInnerWrapper
          hideCardMargins={hideCardMargins}
          useVerticalCard={limitCardWidth || useVerticalCard || isMobileScreenSize()}
        >
          <OneChallengeTextColumn hideCardMargins={hideCardMargins}>
            <TitleAndTextWrapper hideCardMargins={hideCardMargins}>
              <OneChallengeTitleLink>
                <Link
                  id="challengeCardDisplayName"
                  to={onChallengeClickLink()}
                >
                  {challengeTitle}
                </Link>
              </OneChallengeTitleLink>
              {/*
              <SupportersWrapper>
                <SupportersCount>
                  {numberWithCommas(participantsCount)}
                  {' '}
                  {participantsCount === 1 ? 'participant.' : 'participants.'}
                </SupportersCount>
                {' '}
                {challengeSupported ? (
                  <SupportersActionLink>
                    Thank you for supporting!
                  </SupportersActionLink>
                ) : (
                  <SupportersActionLink
                    className="u-link-color u-link-underline u-cursor--pointer"
                    id="challengeCardLetsGetTo"
                    onClick={onChallengeClick}
                  >
                    Let&apos;s get to
                    {' '}
                    {numberWithCommas(participantsCountNextGoalWithFloor)}
                    !
                  </SupportersActionLink>
                )}
              </SupportersWrapper>
              <OneChallengeDescription
                className="u-cursor--pointer"
                id="challengeCardDescription"
                onClick={onChallengeClick}
              >
                <TruncateMarkup
                  ellipsis="..."
                  lines={2}
                  tokenize="words"
                >
                  <div>
                    {challengeDescription}
                  </div>
                </TruncateMarkup>
              </OneChallengeDescription>
              */}
              {/*
              <ChallengeOwnersWrapper>
                <ChallengeOwnersList challengeWeVoteId={challengeWeVoteId} compressedMode />
              </ChallengeOwnersWrapper>
              */}
            </TitleAndTextWrapper>
            {/*
            <IndicatorRow>
              {finalElectionDateInPast && (
                <IndicatorButtonWrapper>
                  <ElectionInPast>
                    Election in Past
                  </ElectionInPast>
                </IndicatorButtonWrapper>
              )}
              {isBlockedByWeVote && (
                <IndicatorButtonWrapper>
                  <BlockedIndicator onClick={this.onChallengeEditClick}>
                    Blocked: Changes Needed
                  </BlockedIndicator>
                </IndicatorButtonWrapper>
              )}
              {!!(!inDraftMode && !isSupportersCountMinimumExceeded && !inPrivateLabelMode) && (
                <IndicatorButtonWrapper onClick={this.onChallengeGetMinimumSupportersClick}>
                  <DraftModeIndicator>
                    Needs Five Supporters
                  </DraftModeIndicator>
                </IndicatorButtonWrapper>
              )}
            </IndicatorRow>
            */}
            <IndicatorRow>
              {inDraftMode && (
                <IndicatorDefaultButtonWrapper onClick={onChallengeClick}>
                  <DraftModeIndicator>
                    Draft
                  </DraftModeIndicator>
                </IndicatorDefaultButtonWrapper>
              )}
              {/*
              {!visibleOnThisSite && (
                <IndicatorButtonWrapper>
                  <DraftModeIndicator>
                    <span className="u-show-mobile">
                      Not Visible
                    </span>
                    <span className="u-show-desktop-tablet">
                      Not Visible On This Site
                    </span>
                  </DraftModeIndicator>
                </IndicatorButtonWrapper>
              )}
              {isInTeamReviewMode && (
                <IndicatorButtonWrapper>
                  <DraftModeIndicator onClick={this.onChallengeEditClick}>
                    <span className="u-show-mobile">
                      Team Reviewing
                    </span>
                    <span className="u-show-desktop-tablet">
                      Team Still Reviewing
                    </span>
                  </DraftModeIndicator>
                </IndicatorButtonWrapper>
              )}
              */}
              {/*
              {voterCanEditThisChallenge && (
                <IndicatorButtonWrapper>
                  <EditIndicator onClick={onChallengeEditClick}>
                    <span className="u-show-mobile">
                      Edit
                    </span>
                    <span className="u-show-desktop-tablet">
                      Edit Challenge
                    </span>
                  </EditIndicator>
                </IndicatorButtonWrapper>
              )}
              */}
              {/*
              {(challengeSupported && !inDraftMode) && (
                <IndicatorButtonWrapper>
                  <EditIndicator onClick={this.onChallengeShareClick}>
                    <span className="u-show-mobile">
                      Share
                    </span>
                    <span className="u-show-desktop-tablet">
                      Share Challenge
                    </span>
                  </EditIndicator>
                </IndicatorButtonWrapper>
              )}
            */}
            </IndicatorRow>
          </OneChallengeTextColumn>
          <OneChallengePhotoWrapperMobile
            className="u-cursor--pointer u-show-mobile"
            onClick={onChallengeClick}
          >
            {photoLargeUrl ? (
              <ChallengeImageContainer>
                <ChallengeImageMobilePlaceholder
                  id="cimp4"
                  profileImageBackgroundColor={profileImageBackgroundColor}
                  useVerticalCard={useVerticalCard}
                >
                  <ChallengeImageMobile
                    alt=""
                    src={photoLargeUrl}
                    style={useVerticalCard ? {
                      borderBottom: `1px solid ${DesignTokenColors.neutralUI100}`,
                      borderTop: `1px solid ${DesignTokenColors.neutralUI100}`,
                    } : {}}
                  />
                </ChallengeImageMobilePlaceholder>
                {!joinedAndDaysLeftOff && (
                  <JoinedDaysLeftOverlayMobile>
                    <JoinedAndDaysLeft challengeWeVoteId={challengeWeVoteId} />
                  </JoinedDaysLeftOverlayMobile>
                )}
              </ChallengeImageContainer>
            ) : (
              <ChallengeImageMobilePlaceholder
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
                  <ChallengeImagePlaceholderText>
                    No image available.
                  </ChallengeImagePlaceholderText>
                </SvgWatermarkWrapper>
              </ChallengeImageMobilePlaceholder>
            )}
          </OneChallengePhotoWrapperMobile>
          <OneChallengePhotoDesktopColumn
            className="u-cursor--pointer u-show-desktop-tablet"
            hideCardMargins={hideCardMargins}
            id={`${tagIdBaseName}PhotoDesktop`}
            limitCardWidth={limitCardWidth}
            onClick={onChallengeClick}
            profileImageBackgroundColor={profileImageBackgroundColor}
            useVerticalCard={useVerticalCard}
          >
            {photoLargeUrl ? (
              <ChallengeImageContainer>
                <>
                  {useVerticalCard ? (
                    <ChallengeImageDesktopPlaceholder
                      id="cidp4"
                      limitCardWidth={limitCardWidth}
                      profileImageBackgroundColor={profileImageBackgroundColor}
                      useVerticalCard={useVerticalCard}
                    >
                      <ChallengeImageDesktop
                        src={photoLargeUrl}
                        alt=""
                        style={useVerticalCard ? {
                          borderBottom: `1px solid ${DesignTokenColors.neutralUI100}`,
                          borderTop: `1px solid ${DesignTokenColors.neutralUI100}`,
                        } : {}}
                        width={limitCardWidth ? '257px' : '320px'}
                        height={limitCardWidth ? '157px' : '168px'}
                      />
                    </ChallengeImageDesktopPlaceholder>
                  ) : (
                    <ChallengeImageDesktop src={photoLargeUrl} alt="" width="117px" height="117px" />
                  )}
                </>
                {/* Joined and Days Left */}
                {!joinedAndDaysLeftOff && (
                  <JoinedDaysLeftOverlayDesktop>
                    <JoinedAndDaysLeft challengeWeVoteId={challengeWeVoteId} />
                  </JoinedDaysLeftOverlayDesktop>
                )}
              </ChallengeImageContainer>
            ) : (
              <ChallengeImageDesktopPlaceholder
                id="cidp5"
                limitCardWidth={limitCardWidth}
                profileImageBackgroundColor={profileImageBackgroundColor}
                useVerticalCard={useVerticalCard}
              >
                <ChallengeImagePlaceholderText>
                  <SvgImage
                    applyFillColor
                    color={DesignTokenColors.neutralUI300}
                    height="140px"
                    imageName={politicalPartySvgNameWithPath}
                    marginBottom="-10px"
                    opacity="0.33"
                  />
                  No image available.
                </ChallengeImagePlaceholderText>
              </ChallengeImageDesktopPlaceholder>
            )}
          </OneChallengePhotoDesktopColumn>
        </OneChallengeInnerWrapper>
      </OneChallengeOuterWrapper>
    </ChallengeCardForListWrapper>
  );
}
ChallengeCardForListBody.propTypes = {
  challengeSupported: PropTypes.bool,
  challengeTitle: PropTypes.string,
  challengeWeVoteId: PropTypes.string,
  challengeDescription: PropTypes.string,
  inDraftMode: PropTypes.bool,
  hideCardMargins: PropTypes.bool,
  joinedAndDaysLeftOff: PropTypes.bool,
  limitCardWidth: PropTypes.bool,
  functionToUseToKeepHelping: PropTypes.func,
  functionToUseWhenProfileComplete: PropTypes.func,
  onChallengeClick: PropTypes.func,
  onChallengeClickLink: PropTypes.func,
  photoLargeUrl: PropTypes.string,
  profileImageBackgroundColor: PropTypes.string,
  participantsCount: PropTypes.number,
  participantsCountNextGoalWithFloor: PropTypes.number,
  tagIdBaseName: PropTypes.string,
  useVerticalCard: PropTypes.bool,
};

const styles = (theme) => ({
  buttonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});
const ChallengeImageContainer = styled('div')`
  position: relative;
  width: 100%;
  height: auto;
`;
const JoinedDaysLeftOverlayMobile = styled('div')`
  position: absolute;
  top: 130px;
  left: 10px;
  `;
const JoinedDaysLeftOverlayDesktop = styled('div')`
  position: absolute;
  top: 175px;
  left: 10px;
// const ChallengeOwnersWrapper = styled('div')`
// `;

// export const FlexDivLeft = styled('div')`
//   align-items: center;
//   display: flex;
//   justify-content: start;
// `;

// export const SvgImageWrapper = styled('div')`
//   max-width: 25px;
//   min-width: 25px;
//   width: 25px;
// `;

export const SvgWatermarkWrapper = styled('div')`
`;

export default withStyles(styles)(ChallengeCardForListBody);
