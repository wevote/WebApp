import { Box, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../components/Style/DesignTokenColors';
import { CampaignSubSectionTitleWrapper, CommentsListWrapper } from '../../components/Style/CampaignDetailsStyles';
import { renderLog } from '../../utils/logging';

// Keep in sync with PoliticianDetailsPage PoliticianEndorsementsList startingNumberOfPositionsToDisplay
const ENDORSEMENT_SKELETON_CARD_COUNT = 5;

//  Reserve vertical space so the loaded endorsements area (title + composer + up to five endorsements)
//  is less likely to be shorter than this placeholder, reducing CLS when real content mounts. 
const EndorsementsSkeletonRoot = styled('div')(({ theme }) => ({
  minHeight: '480px',
  [theme.breakpoints.up('md')]: {
    minHeight: '680px',
  },
}));

const ComposerOuter = styled('div')`
  align-items: flex-start;
  background-color: ${DesignTokenColors.caution50};
  display: flex;
  gap: 10px;
  margin: 12px 0 26px 0;
  padding: 6px;
`;

const ComposerMain = styled('div')`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  width: 100%;
`;

const CardRow = styled('div')`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${DesignTokenColors.neutralUI200};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const CardCol = styled('div')`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

const TopRow = styled('div')`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
`;

const NameAndActions = styled('div')`
  align-items: center;
  display: flex;
  flex: 1;
  gap: 8px;
  min-width: 0;
`;

const FooterRow = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
`;

function TitleSkeleton () {
  return (
    <CampaignSubSectionTitleWrapper>
      <Skeleton component="div" variant="text" width="82%" height={36} sx={{ maxWidth: 480 }} />
    </CampaignSubSectionTitleWrapper>
  );
}

function ComposerSkeleton () {
  return (
    <ComposerOuter>
      <Skeleton variant="circular" width={43} height={43} />
      <ComposerMain>
        {/* ModalDisplayTemplateB CommentContainer + InputBox: ~56–64px tall on desktop */}
        <Skeleton variant="rounded" height={56} sx={{ borderRadius: 2, width: '100%' }} />
        <Box display="flex" gap={1} sx={{ mt: 0.25 }}>
          <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
        </Box>
      </ComposerMain>
    </ComposerOuter>
  );
}

function EndorsementCardSkeleton () {
  return (
    <CardRow>
      <Skeleton variant="circular" width={40} height={40} />
      <CardCol>
        <TopRow>
          <NameAndActions>
            <Skeleton variant="text" width={160} height={24} />
          </NameAndActions>
          <Box display="flex" gap={0.5}>
            <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: 1 }} />
          </Box>
        </TopRow>
        <Skeleton variant="text" width="100%" height={18} />
        <Skeleton variant="text" width="96%" height={18} />
        <Skeleton variant="text" width="88%" height={18} />
        <Skeleton variant="text" width="72%" height={18} />
        <Skeleton variant="text" width="58%" height={18} />
        <FooterRow>
          <Skeleton variant="text" width="55%" height={16} />
          <Skeleton variant="rounded" width={28} height={28} sx={{ borderRadius: 1 }} />
        </FooterRow>
      </CardCol>
    </CardRow>
  );
}

function FeedSkeletonList () {
  return (
    <>
      {Array.from({ length: ENDORSEMENT_SKELETON_CARD_COUNT }, (_, index) => (
        <EndorsementCardSkeleton key={`endorsement-skeleton-${index}`} />
      ))}
    </>
  );
}


//  Loading placeholders for "What people are saying", opinion composer, endorsements feed.
//  variant "full": title + composer + feed (before politician id is available).
//  variant "feedOnly": endorsement cards only (positions hydrating or lazy chunk loading).
 
export default function PoliticianDetailsEndorsementsSkeleton ({ variant = 'full' }) {
  renderLog('PoliticianDetailsEndorsementsSkeleton');

  if (variant === 'feedOnly') {
    return (
      <Box
        sx={{
          minHeight: { xs: 420, md: 560 },
        }}
      >
        <FeedSkeletonList />
      </Box>
    );
  }

  return (
    <EndorsementsSkeletonRoot>
      <TitleSkeleton />
      <ComposerSkeleton />
      <CommentsListWrapper>
        <FeedSkeletonList />
      </CommentsListWrapper>
    </EndorsementsSkeletonRoot>
  );
}

PoliticianDetailsEndorsementsSkeleton.propTypes = {
  variant: PropTypes.oneOf(['full', 'feedOnly']),
};
