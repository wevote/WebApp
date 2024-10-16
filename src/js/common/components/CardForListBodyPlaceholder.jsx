import withStyles from '@mui/styles/withStyles';
// import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import isMobileScreenSize from '../utils/isMobileScreenSize';
import {
  ElectionYear,
  OneCampaignOuterWrapper,
  OneCampaignInnerWrapper,
  OneCampaignTextColumn,
  OneCampaignTitle,
  TitleAndTextWrapper,
  CampaignImageDesktopPlaceholder,
  CampaignImageMobilePlaceholder,
  CampaignImagePlaceholderText,
  CandidateCardForListWrapper,
  CardForListRow,
  CardRowsWrapper,
  OneCampaignPhotoWrapperMobile,
  OneCampaignPhotoDesktopColumn,
  StateName,
} from './Style/CampaignCardStyles';
import DesignTokenColors from './Style/DesignTokenColors';
import { renderLog } from '../utils/logging';

function CardForListBodyPlaceholder (props) {
  renderLog('CardForListBodyPlaceholder functional component');
  const { hideCardMargins, limitCardWidth, useVerticalCard } = props;
  return (
    <CardForListBodyPlaceholderWrapper>
      <CandidateCardForListWrapper>
        <OneCampaignOuterWrapper limitCardWidth={limitCardWidth}>
          <OneCampaignInnerWrapper
          hideCardMargins={hideCardMargins}
          useVerticalCard={limitCardWidth || useVerticalCard || isMobileScreenSize()}
          >
            <OneCampaignTextColumn hideCardMargins={hideCardMargins}>
              <TitleAndTextWrapper hideCardMargins={hideCardMargins}>
                <StateName>
                  &nbsp;
                </StateName>
                <OneCampaignTitle>
                  &nbsp;
                </OneCampaignTitle>
                <YearAndHeartDiv>
                  <ElectionYear>
                    &nbsp;
                  </ElectionYear>
                </YearAndHeartDiv>
                <SpaceBeforeThermometer />
                <PlaceholderThermometer />
                <CardRowsWrapper>
                  <CardForListRow>
                    <FlexDivLeft>
                      Party
                    </FlexDivLeft>
                  </CardForListRow>
                  <CardForListRow>
                    <FlexDivLeft>
                      Office Name
                    </FlexDivLeft>
                  </CardForListRow>
                </CardRowsWrapper>
              </TitleAndTextWrapper>
            </OneCampaignTextColumn>
            <OneCampaignPhotoWrapperMobile
            className={`${hideCardMargins ? '' : 'u-cursor--pointer'} u-show-mobile`}
            >
              <CampaignImageMobilePlaceholder
                id="cimp2"
                profileImageBackgroundColor={DesignTokenColors.neutralUI50}
                useVerticalCard={useVerticalCard}
              >
                <CampaignImagePlaceholderText>
                  No candidate image available.
                </CampaignImagePlaceholderText>
              </CampaignImageMobilePlaceholder>
            </OneCampaignPhotoWrapperMobile>
            <OneCampaignPhotoDesktopColumn
            className="u-cursor--pointer u-show-desktop-tablet"
            hideCardMargins={hideCardMargins}
            profileImageBackgroundColor={DesignTokenColors.neutralUI50}
            useVerticalCard={useVerticalCard}
            >
              <CampaignImageDesktopPlaceholder
                id="cidp5"
                limitCardWidth={limitCardWidth}
                profileImageBackgroundColor={DesignTokenColors.neutralUI50}
                useVerticalCard={useVerticalCard}
                hideCardMargins={hideCardMargins}
              >
                <CampaignImagePlaceholderText>
                  No candidate image available.
                </CampaignImagePlaceholderText>
              </CampaignImageDesktopPlaceholder>
            </OneCampaignPhotoDesktopColumn>
          </OneCampaignInnerWrapper>
        </OneCampaignOuterWrapper>
      </CandidateCardForListWrapper>
    </CardForListBodyPlaceholderWrapper>
  );
}
CardForListBodyPlaceholder.propTypes = {
  hideCardMargins: PropTypes.bool,
  limitCardWidth: PropTypes.bool,
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

export const CardForListBodyPlaceholderWrapper = styled('div')`
`;

const PlaceholderThermometer = styled('div')`
  background-color: ${DesignTokenColors.neutralUI200};
  height: ${({ height }) => height || '12px'};
  width: ${({ width }) => width || '100%'};
  margin-bottom: 8px;
  border-radius: 6px;
`;

export const SpaceBeforeThermometer = styled('div')`
  margin-bottom: 48px;
`;

export const YearAndHeartDiv = styled('div')`
  display: flex;
  justify-content: space-between;
`;

export default withStyles(styles)(CardForListBodyPlaceholder);
