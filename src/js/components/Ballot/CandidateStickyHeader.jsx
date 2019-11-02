import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import BallotItemSupportOpposeComment from '../Widgets/BallotItemSupportOpposeComment';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import { cordovaStickyHeaderPaddingTop } from '../../utils/cordovaOffsets';
import { renderLog } from '../../utils/logging';

class CandidateStickyHeader extends Component {
  static propTypes = {
    candidate: PropTypes.object,
    // weVoteId: PropTypes.string,
  };

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
      <Wrapper cordovaPaddingTop={cordovaStickyHeaderPaddingTop()}>
        <Container>
          <Flex>
            <ColumnOne>
              <Profile>
                {candidatePhotoUrl && <Avatar src={candidatePhotoUrl} alt="candidate-photo" />}
                <div>
                  <CandidateName>{displayName}</CandidateName>
                  <CandidateDescriptionDesktop>
                    <Bold>{party}</Bold>
                    {' '}
                    candidate for
                    {' '}
                    <Bold>{officeName}</Bold>
                  </CandidateDescriptionDesktop>
                </div>
              </Profile>
              <CandidateDescriptionMobile className="u-show-mobile-tablet">
                <Bold>{party}</Bold>
                {' '}
                candidate for
                {' '}
                <Bold>{officeName}</Bold>
              </CandidateDescriptionMobile>
            </ColumnOne>
            <ColumnTwo>
              <BallotItemSupportOpposeCountDisplay ballotItemWeVoteId={candidateWeVoteId} />
            </ColumnTwo>
          </Flex>
          <BallotCommentContainer>
            <BallotItemSupportOpposeComment
              ballotItemWeVoteId={candidateWeVoteId}
              externalUniqueId="candidateStickyHeader"
              showPositionStatementActionBar={false}
            />
          </BallotCommentContainer>
        </Container>
      </Wrapper>
    );
  }
}

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
  padding-top: ${({ cordovaPaddingTop }) => (cordovaPaddingTop || '48px')};
  padding-right: 16px;
  padding-bottom: 0;
  padding-left: 16px;
  top: 0;
  left: 0;
  background: white;
  z-index: 2;
  width: 100vw;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  animation: ${slideDown} 150ms ease-in;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-top: 48px;
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
const CandidateDescriptionDesktop = styled.p`
  display: none;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
    display: block;
    font-weight: 100;
  }
`;

// Uses max-width. Parallel style is CandidateDescriptionDesktop
const CandidateDescriptionMobile = styled.h2`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 12px;
    display: block;
    font-weight: 100;
  }
`;

const Profile = styled.div`
  display: flex;
  flex-flow: row;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: 0 1em 4px 0;
`;

const Flex = styled.div`
  display: flex;
  jusitify-content: space-evenly;
  position: relative;
  top: 0px;
`;

// margin-top: 8px;
// padding-top: 8px;
const BallotCommentContainer = styled.div`
  margin-top: 0px;
  margin-bottom: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  width: fit-content;
  width: 100%;
  @media (max-width : ${({ theme }) => theme.breakpoints.sm}) {
  }
  > * {
    padding: 0;
  }
`;

export default CandidateStickyHeader;
