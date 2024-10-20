import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';
import {
  CampaignsHorizontallyScrollingContainer,
  CampaignsScrollingInnerWrapper,
  ChallengesScrollingOuterWrapper,
  LeftArrowInnerWrapper, LeftArrowOuterWrapper,
  MobileArrowsInnerWrapper, RightArrowInnerWrapper, RightArrowOuterWrapper,
  TitleAndMobileArrowsOuterWrapper,
} from '../Style/ScrollingStyles';

const ChallengeCardList = React.lazy(() => import(/* webpackChunkName: 'ChallengeCardList' */ './ChallengeCardList'));

// These are also declared in CandidateStore. Search for 'candidateForLoading1'.
const challengeListForLoading = [
  {
    challenge_we_vote_id: 'challengeForLoading1',
    ballot_item_display_name: '',
    ballot_guide_official_statement: '',
    challenge_photo_url_large: '',
    challenge_photo_url_medium: '',
    challenge_photo_url_tiny: '',
    contest_office_name: '',
    linked_campaignx_we_vote_id: 'campaignForLoading1',
    party: '',
  },
  {
    challenge_we_vote_id: 'challengeForLoading2',
    ballot_item_display_name: '',
    ballot_guide_official_statement: '',
    challenge_photo_url_large: '',
    challenge_photo_url_medium: '',
    challenge_photo_url_tiny: '',
    contest_office_name: '',
    linked_campaignx_we_vote_id: 'campaignForLoading1',
    party: '',
  },
  {
    challenge_we_vote_id: 'challengeForLoading3',
    ballot_item_display_name: '',
    ballot_guide_official_statement: '',
    challenge_photo_url_large: '',
    challenge_photo_url_medium: '',
    challenge_photo_url_tiny: '',
    contest_office_name: '',
    linked_campaignx_we_vote_id: 'campaignForLoading1',
    party: '',
  },
];
// React functional component example
function ChallengeListRootPlaceholder (props) {
  renderLog('ChallengeListRootPlaceholder functional component');
  const { classes, titleTextForList } = props;
  return (
    <ChallengeListRootPlaceholderWrapper>
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
      <ChallengesScrollingOuterWrapper>
        <LeftArrowOuterWrapper className="u-show-desktop-tablet">
          <LeftArrowInnerWrapper disableMobileLeftArrow id="candidateLeftArrowDesktop">
            &nbsp;
          </LeftArrowInnerWrapper>
        </LeftArrowOuterWrapper>
        <CampaignsScrollingInnerWrapper>
          <CampaignsHorizontallyScrollingContainer showRightGradient>
            <Suspense fallback={<span>&nbsp;</span>}>
              <ChallengeCardList
                incomingChallengeList={challengeListForLoading}
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
      </ChallengesScrollingOuterWrapper>
    </ChallengeListRootPlaceholderWrapper>
  );
}
ChallengeListRootPlaceholder.propTypes = {
  classes: PropTypes.object,
  titleTextForList: PropTypes.string,
};

const styles = () => ({
  arrowRoot: {
    fontSize: 24,
  },
});

const ChallengeListRootPlaceholderWrapper = styled('div')`
  margin-bottom: 25px;
`;

const WhatIsHappeningTitle = styled('h2')`
  font-size: 22px;
  text-align: left;
`;

export default withStyles(styles)(ChallengeListRootPlaceholder);
