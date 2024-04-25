import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import {
  CampaignsHorizontallyScrollingContainer,
  CampaignsScrollingInnerWrapper,
  CampaignsScrollingOuterWrapper,
  LeftArrowInnerWrapper, LeftArrowOuterWrapper,
  MobileArrowsInnerWrapper, RightArrowInnerWrapper, RightArrowOuterWrapper,
  TitleAndMobileArrowsOuterWrapper,
} from '../../common/components/Style/ScrollingStyles';

const CandidateCardList = React.lazy(() => import(/* webpackChunkName: 'CandidateCardList' */ '../CandidateListRoot/CandidateCardList'));

// These are also declared in CandidateStore. Search for 'candidateForLoading1'.
const candidateListForLoading = [
  {
    we_vote_id: 'candidateForLoading1',
    ballot_item_display_name: 'Loading...',
    ballot_guide_official_statement: 'Candidate data is loading now...',
    candidate_photo_url_large: '',
    candidate_photo_url_medium: '',
    candidate_photo_url_tiny: '',
    contest_office_name: '',
    linked_campaignx_we_vote_id: 'campaignForLoading1',
    party: '',
  },
  {
    we_vote_id: 'candidateForLoading2',
    ballot_item_display_name: 'Loading...',
    ballot_guide_official_statement: 'Candidate data is loading now...',
    candidate_photo_url_large: '',
    candidate_photo_url_medium: '',
    candidate_photo_url_tiny: '',
    contest_office_name: '',
    linked_campaignx_we_vote_id: 'campaignForLoading1',
    party: '',
  },
  {
    we_vote_id: 'candidateForLoading3',
    ballot_item_display_name: 'Loading...',
    ballot_guide_official_statement: 'Candidate data is loading now...',
    candidate_photo_url_large: '',
    candidate_photo_url_medium: '',
    candidate_photo_url_tiny: '',
    contest_office_name: '',
    linked_campaignx_we_vote_id: 'campaignForLoading1',
    party: '',
  },
];
// React functional component example
function CandidateListRootPlaceholder (props) {
  renderLog('CandidateListRootPlaceholder functional component');
  const { classes, titleTextForList } = props;
  return (
    <CandidateListRootPlaceholderWrapper>
      <TitleAndMobileArrowsOuterWrapper>
        <WhatIsHappeningTitle>
          {titleTextForList}
        </WhatIsHappeningTitle>
        <MobileArrowsInnerWrapper className="u-show-mobile">
          <LeftArrowInnerWrapper disableMobileLeftArrow id="candidateLeftArrowMobile">
            <ArrowBackIos classes={{ root: classes.arrowRoot }} />
          </LeftArrowInnerWrapper>
          <RightArrowInnerWrapper id="candidateRightArrowMobile">
            <ArrowForwardIos classes={{ root: classes.arrowRoot }} />
          </RightArrowInnerWrapper>
        </MobileArrowsInnerWrapper>
      </TitleAndMobileArrowsOuterWrapper>
      <CampaignsScrollingOuterWrapper>
        <LeftArrowOuterWrapper className="u-show-desktop-tablet">
          <LeftArrowInnerWrapper disableMobileLeftArrow id="candidateLeftArrowDesktop">
            &nbsp;
          </LeftArrowInnerWrapper>
        </LeftArrowOuterWrapper>
        <CampaignsScrollingInnerWrapper>
          <CampaignsHorizontallyScrollingContainer showRightGradient>
            <Suspense fallback={<span>&nbsp;</span>}>
              <CandidateCardList
                incomingCandidateList={candidateListForLoading}
                useVerticalCard
              />
            </Suspense>
          </CampaignsHorizontallyScrollingContainer>
        </CampaignsScrollingInnerWrapper>
        <RightArrowOuterWrapper className="u-show-desktop-tablet">
          <RightArrowInnerWrapper id="candidateRightArrowDesktop">
            <ArrowForwardIos classes={{ root: classes.arrowRoot }} />
          </RightArrowInnerWrapper>
        </RightArrowOuterWrapper>
      </CampaignsScrollingOuterWrapper>
    </CandidateListRootPlaceholderWrapper>
  );
}
CandidateListRootPlaceholder.propTypes = {
  classes: PropTypes.object,
  titleTextForList: PropTypes.string,
};

const styles = () => ({
  arrowRoot: {
    fontSize: 24,
  },
});

const CandidateListRootPlaceholderWrapper = styled('div')`
  margin-bottom: 25px;
`;

const WhatIsHappeningTitle = styled('h2')`
  font-size: 22px;
  text-align: left;
`;

export default withStyles(styles)(CandidateListRootPlaceholder);
