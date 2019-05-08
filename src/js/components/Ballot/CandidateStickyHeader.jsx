import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import BallotItemSupportOpposeComment from '../Widgets/BallotItemSupportOpposeComment';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import { toTitleCase } from '../../utils/textFormat';

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
      party,
    } = candidate;

    let descriptionText = `${party} candidate for ${officeName}`;
    console.log(candidate);

    descriptionText = toTitleCase(descriptionText);

    return (
      <Wrapper>
        <Container>
          <Flex>
            <ColumnOne>
              <Profile>
                <Avatar src={candidatePhotoUrl} alt="candidate-photo" />
                <div>
                  <Title>{displayName}</Title>
                  <SubTitle>{descriptionText}</SubTitle>
                </div>
              </Profile>
              <MobileSubtitle className="u-show-mobile-tablet">
                {descriptionText}
              </MobileSubtitle>
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

const Title = styled.h1`
  font-size: 16px;
  margin-bottom: 2px;
  font-size: 26px;
  margin-top: 8px;
  font-weight: bold;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 0;
    font-size: 22px;
  }
`;

const SubTitle = styled.p`
  display: none;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 15px;
    display: block;
  }
`;

const MobileSubtitle = styled.h2`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 18px;
    display: block;
    font-weight: 400;
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
  @media (max-width : ${({ theme }) => theme.breakpoints.sm}) {
    padding-top: 8px;
  }
  > * {
    padding: 0;
  }
`;

export default CandidateStickyHeader;
