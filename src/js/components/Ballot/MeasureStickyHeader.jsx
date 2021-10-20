import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import MeasureStore from '../../stores/MeasureStore';
import { cordovaStickyHeaderPaddingTop } from '../../utils/cordovaOffsets';
import { isCordova, isIOSAppOnMac, isIPad } from '../../utils/cordovaUtils';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../Widgets/ReadMore'));
const BallotItemSupportOpposeComment = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeComment' */ '../Widgets/BallotItemSupportOpposeComment'));
const BallotItemSupportOpposeCountDisplay = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeCountDisplay' */ '../Widgets/BallotItemSupportOpposeCountDisplay'));


class MeasureStickyHeader extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // measureWeVoteId: props.measureWeVoteId,
    };
  }

  componentDidMount () {
    this.onMeasureStoreChange();
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
  }

  onMeasureStoreChange () {
    const measure = MeasureStore.getMeasure(this.props.measureWeVoteId);
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
    });
  }

  render () {
    const { measureWeVoteId } = this.props;
    const { ballotItemDisplayName } = this.state;
    const ballotItemDisplay = ballotItemDisplayName ? ballotItemDisplayName.split(':') : [];
    return (
      <Wrapper ipad={isIPad() || isIOSAppOnMac()}>
        <Container>
          <Flex>
            <ColumnOne>
              <Profile>
                <div>
                  <Title>{ballotItemDisplay[0]}</Title>
                  <SubTitle>{ballotItemDisplay[1]}</SubTitle>
                </div>
              </Profile>
              <MobileSubtitle className="u-show-mobile-tablet">
                {!!(ballotItemDisplay[1]) && (
                  <ReadMore
                    textToDisplay={ballotItemDisplay[1]}
                    numberOfLines={2}
                  />
                )}
              </MobileSubtitle>
            </ColumnOne>
            <ColumnTwo>
              <BallotItemSupportOpposeCountDisplay ballotItemWeVoteId={measureWeVoteId} />
            </ColumnTwo>
          </Flex>
          <BallotCommentContainer>
            <BallotItemSupportOpposeComment
              ballotItemWeVoteId={measureWeVoteId}
              externalUniqueId="measureStickyHeader"
              showPositionStatementActionBar={false}
            />
          </BallotCommentContainer>
        </Container>
      </Wrapper>
    );
  }
}
MeasureStickyHeader.propTypes = {
  measureWeVoteId: PropTypes.string,
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
  padding-bottom: 8px;
  padding-left: 16px;
  top: ${() => cordovaStickyHeaderPaddingTop()};
  left: 0;
  background: white;
  z-index: 2;
  width: 100vw;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  animation: ${slideDown} 150ms ease-in;
  // @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
  //   padding-top: ${({ ipad }) => (ipad ? '' : '48px')};
  // }
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

const Title = styled.h1`
  font-size: ${() => (isCordova() ? '16px' : '18px')};
  margin-bottom: 2px;
  margin-top: 8px;
  font-weight: ${() => (isCordova() ? '500' : 'bold')};
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 0;
    font-size: ${() => (isCordova() ? '16px' : '22px')};
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
    font-size: 14px;
    display: block;
    font-weight: 400;
  }
`;

const Profile = styled.div`
  display: flex;
  flex-flow: row;
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

export default MeasureStickyHeader;
