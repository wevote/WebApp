import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled, { keyframes } from 'styled-components';
import { cordovaStickyHeaderPaddingTop } from '../../utils/cordovaOffsets';
import { isIOSAppOnMac, isIPad } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';

const BallotItemSupportOpposeComment = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeComment' */ '../Widgets/BallotItemSupportOpposeComment'));
const BallotItemSupportOpposeCountDisplay = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeCountDisplay' */ '../Widgets/BallotItemSupportOpposeCountDisplay'));


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
      <Wrapper ipad={isIPad() || isIOSAppOnMac()}>
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
                <BallotItemSupportOpposeCountDisplay ballotItemWeVoteId={candidateWeVoteId} />
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

const Wrapper = styled.div`
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
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  animation: ${slideDown} 150ms ease-in;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-top: ${({ ipad }) => (ipad ? '' : '0px')};
  }
`;

const Bold = styled.span`
  font-weight: 550;
`;

const Container = styled.div`
  max-width: calc(960px - 18px);
  margin: 0 auto;
`;

const ColumnOne = styled.div`
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex: 1 1 0;
  }
`;

const ColumnTwo = styled.div`
  float: right;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: block;
    width: fit-content;
  }
`;

// Defaults to style in mobile
const CandidateName = styled.h1`
  font-size: 14px;
  margin-bottom: 2px;
  margin-top: 8px;
  font-weight: bold;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 0;
    font-size: 16px;
  }
`;

// Uses min-width. Parallel style is CandidateDescriptionMobile
const CandidateDescription = styled.div`
  display: block;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
    font-weight: 100;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 12px;
    font-weight: 100;
    margin-top: 6px;
  }
`;

const Profile = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: 0 1em 4px 0;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-evenly;
  position: relative;
  top: 0;
`;

const BallotCommentContainer = styled.div`
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
  width: 100%;
  @media (max-width : ${({ theme }) => theme.breakpoints.sm}) {
  }
  > * {
    padding: 0;
  }
`;

export default CandidateStickyHeader;
