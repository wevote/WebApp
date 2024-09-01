import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import TruncateMarkup from 'react-truncate-markup';
import styled from 'styled-components';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import numberWithCommas from '../../utils/numberWithCommas';
import CampaignOwnersList from '../CampaignSupport/CampaignOwnersList';
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
function CampaignCardForListBody (props) {
  renderLog('CampaignCardForListBody');  // Set LOG_RENDER_EVENTS to log all renders
  const {
    campaignDescription, campaignSupported, campaignTitle, campaignXWeVoteId,
    hideCardMargins, inDraftMode, functionToUseToKeepHelping, functionToUseWhenProfileComplete,
    limitCardWidth, onCampaignClick, onCampaignClickLink,
    photoLargeUrl, profileImageBackgroundColor,
    supportersCount, supportersCountNextGoalWithFloor, tagIdBaseName, useVerticalCard,
  } = props;
  const politicalPartySvgNameWithPath = '../../img/global/svg-icons/political-party-unspecified.svg';

  // /////////////////////// START OF DISPLAY
  return (
    <CandidateCardForListWrapper limitCardWidth={limitCardWidth}>
      <OneCampaignOuterWrapper limitCardWidth={limitCardWidth}>
        <OneCampaignInnerWrapper
          useVerticalCard={limitCardWidth || useVerticalCard || isMobileScreenSize()}
        >
          <OneCampaignTextColumn hideCardMargins={hideCardMargins}>
            <TitleAndTextWrapper hideCardMargins={hideCardMargins}>
              <OneCampaignTitleLink>
                <Link
                  id="campaignCardDisplayName"
                  to={onCampaignClickLink()}
                >
                  {campaignTitle}
                </Link>
              </OneCampaignTitleLink>
              <SupportersWrapper>
                <SupportersCount>
                  {numberWithCommas(supportersCount)}
                  {' '}
                  {supportersCount === 1 ? 'supporter.' : 'supporters.'}
                </SupportersCount>
                {' '}
                {campaignSupported ? (
                  <SupportersActionLink>
                    Thank you for supporting!
                  </SupportersActionLink>
                ) : (
                  <SupportersActionLink
                    className="u-link-color u-link-underline u-cursor--pointer"
                    id="campaignCardLetsGetTo"
                    onClick={onCampaignClick}
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
                id="campaignCardDescription"
                onClick={onCampaignClick}
              >
                <TruncateMarkup
                  ellipsis="..."
                  lines={2}
                  tokenize="words"
                >
                  <div>
                    {campaignDescription}
                  </div>
                </TruncateMarkup>
              </OneCampaignDescription>
              <CampaignOwnersWrapper>
                <CampaignOwnersList campaignXWeVoteId={campaignXWeVoteId} compressedMode />
              </CampaignOwnersWrapper>
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
                  <BlockedIndicator onClick={this.onCampaignEditClick}>
                    Blocked: Changes Needed
                  </BlockedIndicator>
                </IndicatorButtonWrapper>
              )}
              {!!(!inDraftMode && !isSupportersCountMinimumExceeded && !inPrivateLabelMode) && (
                <IndicatorButtonWrapper onClick={this.onCampaignGetMinimumSupportersClick}>
                  <DraftModeIndicator>
                    Needs Five Supporters
                  </DraftModeIndicator>
                </IndicatorButtonWrapper>
              )}
            </IndicatorRow>
            <IndicatorRow>
              {inDraftMode && (
                <IndicatorDefaultButtonWrapper onClick={onCampaignClick}>
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
                  <DraftModeIndicator onClick={this.onCampaignEditClick}>
                    <span className="u-show-mobile">
                      Team Reviewing
                    </span>
                    <span className="u-show-desktop-tablet">
                      Team Still Reviewing
                    </span>
                  </DraftModeIndicator>
                </IndicatorButtonWrapper>
              )}
              {voterCanEditThisCampaign && (
                <IndicatorButtonWrapper>
                  <EditIndicator onClick={this.onCampaignEditClick}>
                    <span className="u-show-mobile">
                      Edit
                    </span>
                    <span className="u-show-desktop-tablet">
                      Edit Campaign
                    </span>
                  </EditIndicator>
                </IndicatorButtonWrapper>
              )}
              {(campaignSupported && !inDraftMode) && (
                <IndicatorButtonWrapper>
                  <EditIndicator onClick={this.onCampaignShareClick}>
                    <span className="u-show-mobile">
                      Share
                    </span>
                    <span className="u-show-desktop-tablet">
                      Share Campaign
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
                    campaignXWeVoteId={campaignXWeVoteId}
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
            onClick={onCampaignClick}
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
                    No candidate image available.
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
            onClick={onCampaignClick}
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
              </CampaignImageDesktopPlaceholder>
            )}
          </OneCampaignPhotoDesktopColumn>
        </OneCampaignInnerWrapper>
      </OneCampaignOuterWrapper>
    </CandidateCardForListWrapper>
  );
}
CampaignCardForListBody.propTypes = {
  campaignSupported: PropTypes.bool,
  campaignTitle: PropTypes.string.isRequired, // Changed to be required due to error where this shows as undefined [WV-379] when fetching from PoliticianStore 7/18/2024
  campaignXWeVoteId: PropTypes.string,
  campaignDescription: PropTypes.string,
  inDraftMode: PropTypes.bool,
  hideCardMargins: PropTypes.bool,
  limitCardWidth: PropTypes.bool,
  functionToUseToKeepHelping: PropTypes.func,
  functionToUseWhenProfileComplete: PropTypes.func,
  onCampaignClick: PropTypes.func,
  onCampaignClickLink: PropTypes.func,
  photoLargeUrl: PropTypes.string,
  profileImageBackgroundColor: PropTypes.string,
  supportersCount: PropTypes.number.isRequired,
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

const CampaignOwnersWrapper = styled('div')`
`;

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

export default withStyles(styles)(CampaignCardForListBody);
