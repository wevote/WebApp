import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import TruncateMarkup from 'react-truncate-markup';
import styled from 'styled-components';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import numberWithCommas from '../../utils/numberWithCommas';
// import ChallengeOwnersList from '../ChallengeSupport/ChallengeOwnersList';
import {
  CampaignActionButtonsWrapper,
  CampaignImageDesktop, CampaignImageDesktopPlaceholder,
  CampaignImageMobile, CampaignImageMobilePlaceholder,
  CampaignImagePlaceholderText,
  // CampaignPoliticianImageDesktop, CampaignPoliticianImageMobile,
  CandidateCardForListWrapper, OneCampaignDescription,
  OneCampaignInnerWrapper, OneCampaignOuterWrapper,
  OneCampaignPhotoDesktopColumn, OneCampaignPhotoWrapperMobile,
  OneCampaignTextColumn, OneCampaignTitleLink, SupportersActionLink,
  SupportersCount, SupportersWrapper, TitleAndTextWrapper,
} from '../Style/CampaignCardStyles';
import DesignTokenColors from '../Style/DesignTokenColors';
import SvgImage from '../Widgets/SvgImage';

const SupportButtonBeforeCompletionScreen = React.lazy(() => import(/* webpackChunkName: 'SupportButtonBeforeCompletionScreen' */ '../CampaignSupport/SupportButtonBeforeCompletionScreen'));

// React functional component example
function ChallengeCardForListBody (props) {
  renderLog('ChallengeCardForListBody');  // Set LOG_RENDER_EVENTS to log all renders
  const {
    challengeDescription, challengeSupported, challengeTitle, challengeWeVoteId,
    hideCardMargins, inDraftMode, functionToUseToKeepHelping, functionToUseWhenProfileComplete,
    limitCardWidth, onChallengeClick, onChallengeClickLink,
    photoLargeUrl, profileImageBackgroundColor,
    supportersCount, supportersCountNextGoalWithFloor, tagIdBaseName, useVerticalCard,
  } = props;
  const politicalPartySvgNameWithPath = '../../img/global/svg-icons/political-party-unspecified.svg';

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
              <OneCampaignTitleLink>
                <Link
                  id="challengeCardDisplayName"
                  to={onChallengeClickLink()}
                >
                  {challengeTitle}
                </Link>
              </OneCampaignTitleLink>
              {/*
              <SupportersWrapper>
                <SupportersCount>
                  {numberWithCommas(supportersCount)}
                  {' '}
                  {supportersCount === 1 ? 'supporter.' : 'supporters.'}
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
                    {numberWithCommas(supportersCountNextGoalWithFloor)}
                    !
                  </SupportersActionLink>
                )}
              </SupportersWrapper>
              <OneCampaignDescription
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
              </OneCampaignDescription>
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
            <IndicatorRow>
              {inDraftMode && (
                <IndicatorDefaultButtonWrapper onClick={onChallengeClick}>
                  <DraftModeIndicator>
                    Draft
                  </DraftModeIndicator>
                </IndicatorDefaultButtonWrapper>
              )}
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
              {voterCanEditThisChallenge && (
                <IndicatorButtonWrapper>
                  <EditIndicator onClick={this.onChallengeEditClick}>
                    <span className="u-show-mobile">
                      Edit
                    </span>
                    <span className="u-show-desktop-tablet">
                      Edit Challenge
                    </span>
                  </EditIndicator>
                </IndicatorButtonWrapper>
              )}
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
            </IndicatorRow>
            */}
            <CampaignActionButtonsWrapper>
              {!inDraftMode && (
                <Suspense fallback={<span>&nbsp;</span>}>
                  <SupportButtonBeforeCompletionScreen
                    challengeWeVoteId={challengeWeVoteId}
                    functionToUseToKeepHelping={functionToUseToKeepHelping}
                    functionToUseWhenProfileComplete={functionToUseWhenProfileComplete}
                    inButtonFullWidthMode
                    // inCompressedMode
                  />
                </Suspense>
              )}
            </CampaignActionButtonsWrapper>
          </OneCampaignTextColumn>
          <OneCampaignPhotoWrapperMobile
            className="u-cursor--pointer u-show-mobile"
            onClick={onChallengeClick}
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
                    No image available.
                  </CampaignImagePlaceholderText>
                </SvgWatermarkWrapper>
              </CampaignImageMobilePlaceholder>
            )}
          </OneCampaignPhotoWrapperMobile>
          <OneCampaignPhotoDesktopColumn
            className="u-cursor--pointer u-show-desktop-tablet"
            hideCardMargins={hideCardMargins}
            id={`${tagIdBaseName}PhotoDesktop`}
            limitCardWidth={limitCardWidth}
            onClick={onChallengeClick}
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
                      width={limitCardWidth ? '257px' : '320px'}
                      height={limitCardWidth ? '157px' : '168px'}
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
                  <SvgImage
                    applyFillColor
                    color={DesignTokenColors.neutralUI300}
                    height="140px"
                    imageName={politicalPartySvgNameWithPath}
                    marginBottom="-10px"
                    opacity="0.33"
                  />
                  No image available.
                </CampaignImagePlaceholderText>
              </CampaignImageDesktopPlaceholder>
            )}
          </OneCampaignPhotoDesktopColumn>
        </OneCampaignInnerWrapper>
      </OneCampaignOuterWrapper>
    </CandidateCardForListWrapper>
  );
}
ChallengeCardForListBody.propTypes = {
  challengeSupported: PropTypes.bool,
  challengeTitle: PropTypes.string,
  challengeWeVoteId: PropTypes.string,
  challengeDescription: PropTypes.string,
  inDraftMode: PropTypes.bool,
  hideCardMargins: PropTypes.bool,
  limitCardWidth: PropTypes.bool,
  functionToUseToKeepHelping: PropTypes.func,
  functionToUseWhenProfileComplete: PropTypes.func,
  onChallengeClick: PropTypes.func,
  onChallengeClickLink: PropTypes.func,
  photoLargeUrl: PropTypes.string,
  profileImageBackgroundColor: PropTypes.string,
  supportersCount: PropTypes.number,
  supportersCountNextGoalWithFloor: PropTypes.number,
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
