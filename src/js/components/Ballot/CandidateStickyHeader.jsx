import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import BallotItemSupportOpposeComment from '../Widgets/BallotItemSupportOpposeComment';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';

class CandidateStickyHeader extends Component {
  static propTypes = {
    candidate: PropTypes.object,
    // weVoteId: PropTypes.string,
  };

  render () {
    const { candidate } = this.props;
    const {
      ballot_item_display_name: displayName,
      we_vote_id: candidateWeVoteId,
      candidate_photo_url_medium: candidatePhotoUrl,
    } = candidate;
    console.log(candidate);
    return (
      <Wrapper>
        <MeasureInfo>
          <Profile>
            <Avatar src={candidatePhotoUrl} alt="candidate-photo" />
            <Title>{displayName}</Title>
          </Profile>

          <BallotItemSupportOpposeCountDisplay ballotItemWeVoteId={candidateWeVoteId} />
        </MeasureInfo>
        <ActionContainer>
          <BallotItemSupportOpposeComment
            ballotItemWeVoteId={candidateWeVoteId}
            showPositionStatementActionBar={false}
          />
          <hr />
        </ActionContainer>
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
  position: fixed;
  padding-top: 48px;
  padding-left: 32px;
  top: 0;
  left: 0;
  background: white;
  z-index: 2;
  width: 100vw;
  display: flex;
  flex-flow: column;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  animation: ${slideDown} 150ms ease-in;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-left: 16px;
  }
`;

const MeasureInfo = styled.div`
  max-width: 60%;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 22px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 16px;
    margin: auto 0;
  }
`;
/*
const SubTitle = styled.p`
  font-size: 18px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 12px;
  }
`;
*/
const Profile = styled.div`
  display: flex;
  flex-flow: row;
`;

const ActionContainer = styled.div`
  margin-top: -24px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-top: -12px;
    margin-left: -12px;
  }
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: 1em 1em 1em 0;
`;

export default CandidateStickyHeader;
