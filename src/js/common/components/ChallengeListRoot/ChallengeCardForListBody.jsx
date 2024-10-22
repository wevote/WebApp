import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import TruncateMarkup from 'react-truncate-markup';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import {
  ChallengeImageDesktop,
  ChallengeImageDesktopPlaceholder,
  ChallengeImageMobile,
  ChallengeImageMobilePlaceholder,
  ChallengeImagePlaceholderText,
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
    challengeTitle, challengeWeVoteId,
    hideCardMargins, inDraftMode, joinedAndDaysLeftOff,
    limitCardWidth, onChallengeClick, onChallengeClickLink,
    photoLargeUrl, profileImageBackgroundColor,
    tagIdBaseName, titleLengthRestricted, titleLinkOff, useVerticalCard,
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
                {titleLinkOff ? (
                  <>
                    {titleLengthRestricted ? (
                      <TruncateMarkup
                        ellipsis="..."
                        lines={2}
                        tokenize="words"
                      >
                        <span>
                          {challengeTitle}
                        </span>
                      </TruncateMarkup>
                    ) : (
                      <span>
                        {challengeTitle}
                      </span>
                    )}
                  </>
                ) : (
                  <Link
                    id="challengeCardDisplayName"
                    to={onChallengeClickLink()}
                  >
                    <span>
                      {titleLengthRestricted ? (
                        <TruncateMarkup
                          ellipsis="..."
                          lines={2}
                          tokenize="words"
                        >
                          <span>
                            {challengeTitle}
                          </span>
                        </TruncateMarkup>
                      ) : (
                        <span>
                          {challengeTitle}
                        </span>
                      )}
                    </span>
                  </Link>
                )}
              </OneChallengeTitleLink>
            </TitleAndTextWrapper>
            <IndicatorRow>
              {inDraftMode && (
                <IndicatorDefaultButtonWrapper onClick={onChallengeClick}>
                  <DraftModeIndicator>
                    Draft
                  </DraftModeIndicator>
                </IndicatorDefaultButtonWrapper>
              )}
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
  challengeTitle: PropTypes.string,
  challengeWeVoteId: PropTypes.string,
  inDraftMode: PropTypes.bool,
  hideCardMargins: PropTypes.bool,
  joinedAndDaysLeftOff: PropTypes.bool,
  limitCardWidth: PropTypes.bool,
  onChallengeClick: PropTypes.func,
  onChallengeClickLink: PropTypes.func,
  photoLargeUrl: PropTypes.string,
  profileImageBackgroundColor: PropTypes.string,
  tagIdBaseName: PropTypes.string,
  titleLengthRestricted: PropTypes.bool,
  titleLinkOff: PropTypes.bool,
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
`;

export const SvgWatermarkWrapper = styled('div')`
`;

export default withStyles(styles)(ChallengeCardForListBody);
