import { keyframes } from '@emotion/react';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import MeasureStore from '../../stores/MeasureStore';
import { cordovaStickyHeaderPaddingTop } from '../../utils/cordovaOffsets';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));
const BallotItemSupportOpposeComment = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeComment' */ '../Widgets/BallotItemSupportOpposeComment'));
const BallotItemSupportOpposeScoreDisplay = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeScoreDisplay' */ '../Widgets/ScoreDisplay/BallotItemSupportOpposeScoreDisplay'));


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
    renderLog('MeasureStickyHeader');  // Set LOG_RENDER_EVENTS to log all renders
    const { measureWeVoteId } = this.props;
    const { ballotItemDisplayName } = this.state;
    const ballotItemDisplay = ballotItemDisplayName ? ballotItemDisplayName.split(':') : [];
    return (
      <MeasureStickyHeaderWrapper>
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
                  <Suspense fallback={<></>}>
                    <ReadMore
                      textToDisplay={ballotItemDisplay[1]}
                      numberOfLines={2}
                    />
                  </Suspense>
                )}
              </MobileSubtitle>
            </ColumnOne>
            <ColumnTwo>
              <Suspense fallback={<></>}>
                <BallotItemSupportOpposeScoreDisplay ballotItemWeVoteId={measureWeVoteId} />
              </Suspense>
            </ColumnTwo>
          </Flex>
          <MeasureCommentContainer>
            <Suspense fallback={<></>}>
              <BallotItemSupportOpposeComment
                ballotItemWeVoteId={measureWeVoteId}
                externalUniqueId="measureStickyHeader"
                showPositionStatementActionBar={false}
              />
            </Suspense>
          </MeasureCommentContainer>
        </Container>
      </MeasureStickyHeaderWrapper>
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

const MeasureStickyHeaderWrapper = styled('div')`
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
  box-shadow: ${standardBoxShadow('wide')};
  //animation: ${slideDown} 150ms ease-in;
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

const Title = styled('h1')(({ theme }) => (`
  font-size: ${() => (isCordova() ? '16px' : '18px')};
  margin-bottom: 2px;
  margin-top: 8px;
  font-weight: ${() => (isCordova() ? '500' : 'bold')};
  ${theme.breakpoints.up('md')} {
    margin-top: 0;
    font-size: ${() => (isCordova() ? '16px' : '22px')};
  }
`));

const SubTitle = styled('p')(({ theme }) => (`
  display: none;
  ${theme.breakpoints.up('md')} {
    font-size: 15px;
    display: block;
  }
`));

const MobileSubtitle = styled('h2')(({ theme }) => (`
  display: none;
  ${theme.breakpoints.down('md')} {
    font-size: 14px;
    display: block;
    font-weight: 400;
  }
`));

const Profile = styled('div')`
  display: flex;
  flex-flow: row;
`;

const Flex = styled('div')`
  display: flex;
  justify-content: space-evenly;
  position: relative;
  top: 8px;
`;

const MeasureCommentContainer = styled('div')(({ theme }) => (`
  width: fit-content;
  margin-top: ${() => (isWebApp() ? '8px' : '')};;
  ${theme.breakpoints.down('sm')} {
    padding-top: ${() => (isWebApp() ? '8px' : '')};
  }
  > * {
    padding: 0;
  }
`));

export default MeasureStickyHeader;
