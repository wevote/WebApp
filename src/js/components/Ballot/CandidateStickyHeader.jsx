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
      contest_office_name: officeName,
      we_vote_id: candidateWeVoteId,
      candidate_photo_url_medium: candidatePhotoUrl,
    } = candidate;
    console.log(candidate);
    return (
      <Wrapper>
        <Flex>
          <ColumnOne>
            <Profile>
              <Avatar src={candidatePhotoUrl} alt="candidate-photo" />
              <div>
                <Title>{displayName}</Title>
                <SubTitle>{officeName}</SubTitle>
              </div>
            </Profile>
          </ColumnOne>
          <ColumnTwo>
            <BallotItemSupportOpposeCountDisplay ballotItemWeVoteId={candidateWeVoteId} />
          </ColumnTwo>
        </Flex>
        <BallotCommentContainer>
          <BallotItemSupportOpposeComment
            ballotItemWeVoteId={candidateWeVoteId}
            showPositionStatementActionBar={false}
          />
        </BallotCommentContainer>
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
  padding: 16px;
  padding-top: 48px;
  top: 0;
  left: 0;
  background: white;
  z-index: 2;
  width: 100vw;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  animation: ${slideDown} 150ms ease-in;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 32px;
    padding-top: 48px;
  }
`;

const ColumnOne = styled.div`
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex: 1 1 0;
  }
  display: flex;
  align-items: flex-start; 
`;

const ColumnTwo = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: block;
    width: fit-content;
  }
`;

const Title = styled.h1`
  font-size: 16px;
  margin-bottom: 2px;
  margin-top: 0;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 22px;
    font-weight: bold;
  }
`;

const SubTitle = styled.p`
  font-size: 11px;
  margin: 0;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 15px;
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
  margin: 0 1em 1em 0;
`;

const Flex = styled.div`
  display: flex;
  jusitify-content: space-evenly;
  position: relative;
  top: 8px;
`;

const BallotCommentContainer = styled.div`
  width: fit-content;
  margin-top: 8px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: -16px;
  }
`;

export default CandidateStickyHeader;
