import { keyframes } from '@emotion/react';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { isIOSAppOnMac, isIPad } from '../../common/utils/cordovaUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import { cordovaStickyHeaderPaddingTop } from '../../utils/cordovaOffsets';
import { standardBoxShadow } from '../Style/pageLayoutStyles';

const BallotItemSupportOpposeComment = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeComment' */ '../Widgets/BallotItemSupportOpposeComment'));
const BallotItemSupportOpposeScoreDisplay = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeScoreDisplay' */ '../Widgets/ScoreDisplay/BallotItemSupportOpposeScoreDisplay'));


class CandidateStickyHeader extends Component {
  render () {
    renderLog('CandidateStickyHeader');  // Set LOG_RENDER_EVENTS to log all renders
    const { candidate } = this.props;
    const {
      ballot_item_display_name: displayName,
      contest_office_name: officeName,
      we_vote_id: candidateWeVoteId,
      candidate_photo_url_medium: candidatePhotoUrl,
      party,
    } = candidate;

    // const descriptionText = `${party} candidate for ${officeName}`;
    // console.log(candidate);

    // descriptionText = toTitleCase(descriptionText);
    // console.log('CandidateStickyHeader, displayName/candidateWeVoteId:', displayName, candidateWeVoteId);

    return (
      <Wrapper ipad={isIPad() || isIOSAppOnMac()} isWebApp={isWebApp()}>
        <Container>
          <Flex>
            <ColumnOne>
              <Profile>
                {candidatePhotoUrl && <Avatar src={candidatePhotoUrl} alt="candidate-photo" />}
                <div>
                  <CandidateName>{displayName}</CandidateName>
                  <CandidateDescription>
                    <Bold>{party}</Bold>
                    {' '}
                    candidate for
                    {' '}
                    <Bold>{officeName}</Bold>
                  </CandidateDescription>
                </div>
              </Profile>
            </ColumnOne>
            <ColumnTwo>
              <Suspense fallback={<></>}>
                <BallotItemSupportOpposeScoreDisplay ballotItemWeVoteId={candidateWeVoteId} blockOnClickShowOrganizationModalWithPositions />
              </Suspense>
            </ColumnTwo>
          </Flex>
          <BallotCommentContainer>
            <Suspense fallback={<></>}>
              <BallotItemSupportOpposeComment
                ballotItemWeVoteId={candidateWeVoteId}
                externalUniqueId="candidateStickyHeader"
                showPositionStatementActionBar={false}
              />
            </Suspense>
          </BallotCommentContainer>
        </Container>
      </Wrapper>
    );
  }
}
CandidateStickyHeader.propTypes = {
  candidate: PropTypes.object,
  // weVoteId: PropTypes.string,
};

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

const Wrapper = styled('div', {
  shouldForwardProp: (prop) => !['ipad'].includes(prop),
})(({ ipad, theme }) => (`
  max-width: 100%;
  position: fixed;
  padding-right: 16px;
  padding-bottom: 0;
  padding-left: 16px;
  top: ${() => cordovaStickyHeaderPaddingTop()};
  left: 0;
  background: white;
  z-index: 2;
  width: 100vw;
  box-shadow: ${standardBoxShadow('wide')};
  animation: ${slideDown} 150ms ease-in;
  ${() => (isWebApp() ? 'margin-top: -16px;' : '')};
  ${theme.breakpoints.up('sm')} {
    padding-top: ${ipad ? '' : '0'};
  }
  ${theme.breakpoints.down('sm')} {
    ${() => (isWebApp() ? 'margin-top: -14px;' : '')};
  }
`));

const Bold = styled('span')`
  font-weight: 550;
`;

const Container = styled('div')`
  max-width: calc(960px - 18px);
  margin: 0 auto;
`;

const ColumnOne = styled('div')(({ theme }) => (`
  width: 100%;
  ${theme.breakpoints.up('sm')} {
    flex: 1 1 0;
  }
`));

const ColumnTwo = styled('div')(({ theme }) => (`
  float: right;
  ${theme.breakpoints.up('sm')} {
    display: block;
    width: fit-content;
  }
`));

// Defaults to style in mobile
const CandidateName = styled('h1')(({ theme }) => (`
  font-size: 14px;
  margin-bottom: 2px;
  margin-top: 8px;
  font-weight: bold;
  ${theme.breakpoints.up('md')} {
    margin-top: 0;
    font-size: 16px;
  }
`));

// Uses min-width. Parallel style is CandidateDescriptionMobile
const CandidateDescription = styled('div')(({ theme }) => (`
  display: block;
  ${theme.breakpoints.up('md')} {
    font-size: 14px;
    font-weight: 100;
  }
  ${theme.breakpoints.down('md')} {
    font-size: 12px;
    font-weight: 100;
    margin-top: 6px;
  }
`));

const Profile = styled('div')`
  display: flex;
  flex-flow: row nowrap;
`;

const Avatar = styled('img')`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: 0 1em 4px 0;
`;

const Flex = styled('div')`
  display: flex;
  justify-content: space-evenly;
  position: relative;
  top: 0;
`;

const BallotCommentContainer = styled('div')(({ theme }) => (`
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
  width: 100%;
  ${theme.breakpoints.down('sm')} {
  }
  > * {
    padding: 0;
  }
`));

export default CandidateStickyHeader;
