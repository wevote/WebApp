import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import PropTypes from 'prop-types';
import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import isMobileScreenSize from '../utils/isMobileScreenSize';
import extractPoliticianDetailsFromUrl from '../utils/extractPoliticianDetailsFromUrl';
import {
  CampaignActionButtonsWrapper,
  CandidateCardForListWrapper,
  CardForListRow,
  CardRowsWrapper,
  OneCampaignInnerWrapper,
  OneCampaignOuterWrapper,
  OneCampaignPhotoDesktopColumn,
  OneCampaignPhotoWrapperMobile,
  OneCampaignTextColumn,
  OneCampaignTitle,
  StateName,
  TitleAndTextWrapper,
} from './Style/CampaignCardStyles';
import { renderLog } from '../utils/logging';

const SpaceBeforeThermometer = styled('div')`
  margin-bottom: 8px;
`;

const YearAndHeartDiv = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const FlexDivLeft = styled('div')`
  align-items: center;
  display: flex;
  justify-content: start;
`;

const SvgImageWrapper = styled('div')`
  max-width: 25px;
  min-width: 25px;
  width: 25px;
`;

function CardForListBodySkeleton (props) {
  renderLog('CardForListBodySkeleton');
  const { hideCardMargins, hideItemActionBar, limitCardWidth, showPoliticianOpenInNewWindow, useVerticalCard } = props;
  const useVerticalLayout = limitCardWidth || useVerticalCard || isMobileScreenSize();
  const location = useLocation();
  const { state: stateFromUrl, name: nameFromUrl } = extractPoliticianDetailsFromUrl(location.pathname);

  return (
    <CandidateCardForListWrapper limitCardWidth={limitCardWidth}>
      <OneCampaignOuterWrapper limitCardWidth={limitCardWidth}>
        <OneCampaignInnerWrapper
          hideCardMargins={hideCardMargins}
          useVerticalCard={useVerticalLayout}
        >
          <OneCampaignTextColumn hideCardMargins={hideCardMargins}>
            <TitleAndTextWrapper hideCardMargins={hideCardMargins}>
              {/* State: prefer URL-derived text while API is still loading */}
              {stateFromUrl ? (
                <StateName>
                  {stateFromUrl}
                </StateName>
              ) : (
                <Skeleton variant="text" width={80} height={12} sx={{ mb: 0.5 }} />
              )}
              {/* Name + optional Launch icon */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                {nameFromUrl ? (
                  <OneCampaignTitle>
                    {nameFromUrl}
                  </OneCampaignTitle>
                ) : (
                  <Skeleton variant="text" width={200} height={24} />
                )}
                {showPoliticianOpenInNewWindow && (
                  <Skeleton variant="rounded" width={14} height={14} sx={{ borderRadius: 0.5 }} />
                )}
              </Box>
              {/* Year + Heart */}
              <YearAndHeartDiv>
                <Skeleton variant="text" width={36} height={12} />
                {!useVerticalLayout && (
                  <Skeleton variant="rounded" width={60} height={36} sx={{ borderRadius: 2 }} />
                )}
              </YearAndHeartDiv>
              <SpaceBeforeThermometer />
              {/* Thermometer */}
              {useVerticalLayout && (
                <>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Skeleton variant="rounded" width={60} height={36} sx={{ borderRadius: 2 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Skeleton variant="text" width="70%" height={18} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" width="50%" height={18} />
                    </Box>
                  </Box>
                  <Skeleton variant="rounded" width="100%" height={12} sx={{ borderRadius: 6, mb: 1 }} />
                </>
              )}
              {/* Party + Office rows (match CardForListBody: SvgImageWrapper 25px + icon 18px + text) */}
              <CardRowsWrapper>
                <CardForListRow>
                  <FlexDivLeft>
                    <SvgImageWrapper>
                      <Skeleton variant="rounded" width={18} height={18} sx={{ borderRadius: 0.5 }} />
                    </SvgImageWrapper>
                    <Skeleton variant="text" width="60%" height={14} />
                  </FlexDivLeft>
                </CardForListRow>
                <CardForListRow>
                  <FlexDivLeft>
                    <SvgImageWrapper>
                      <Skeleton variant="rounded" width={18} height={18} sx={{ borderRadius: 0.5 }} />
                    </SvgImageWrapper>
                    <Skeleton variant="text" width="80%" height={14} />
                  </FlexDivLeft>
                </CardForListRow>
              </CardRowsWrapper>
            </TitleAndTextWrapper>
            {!hideItemActionBar && (
              <CampaignActionButtonsWrapper>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
                </Box>
              </CampaignActionButtonsWrapper>
            )}
          </OneCampaignTextColumn>
          {/* Mobile image */}
          <OneCampaignPhotoWrapperMobile className="u-show-mobile">
            <Skeleton
              variant="rounded"
              width="100%"
              height={157}
              sx={{ borderRadius: 2 }}
            />
          </OneCampaignPhotoWrapperMobile>
          {/* Desktop image */}
          <OneCampaignPhotoDesktopColumn
            className="u-show-desktop-tablet"
            hideCardMargins={hideCardMargins}
            limitCardWidth={limitCardWidth}
            useVerticalCard={useVerticalLayout}
          >
            <Skeleton
              variant="rounded"
              width={limitCardWidth ? 276 : useVerticalLayout ? '100%' : 224}
              height={limitCardWidth ? 157 : useVerticalLayout ? 200 : 117}
              sx={{ borderRadius: 2 }}
            />
          </OneCampaignPhotoDesktopColumn>
        </OneCampaignInnerWrapper>
      </OneCampaignOuterWrapper>
    </CandidateCardForListWrapper>
  );
}
CardForListBodySkeleton.propTypes = {
  hideCardMargins: PropTypes.bool,
  hideItemActionBar: PropTypes.bool,
  limitCardWidth: PropTypes.bool,
  showPoliticianOpenInNewWindow: PropTypes.bool,
  useVerticalCard: PropTypes.bool,
};

export default CardForListBodySkeleton;
