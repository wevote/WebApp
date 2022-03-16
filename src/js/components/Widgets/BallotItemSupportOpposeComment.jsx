import PropTypes from 'prop-types';
import React, { PureComponent, Suspense } from 'react';
import styled from '@mui/material/styles/styled';
import passBool from '../../common/utils/passBool';
import CandidateStore from '../../stores/CandidateStore';
import MeasureStore from '../../stores/MeasureStore';
import { isAndroidSizeMD } from '../../common/utils/cordovaUtils';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import { stringContains } from '../../utils/textFormat';

const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ './ItemActionBar/ItemActionBar'));
const ItemPositionStatementActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemPositionStatementActionBar' */ './ItemPositionStatementActionBar2020'));


class BallotItemSupportOpposeComment extends PureComponent {
  constructor (props) {
    super(props);

    this.popover_state = {};

    this.state = {
      ballotItemDisplayName: '',
      ballotItemType: '',
      ballotItemWeVoteId: '',
      // componentDidMountFinished: false,
      showPositionStatement: false,
      // shouldFocusCommentArea: false,
    };
    this.passDataBetweenItemActionToItemPosition = this.passDataBetweenItemActionToItemPosition.bind(this);
    this.togglePositionStatement = this.togglePositionStatement.bind(this);
  }

  componentDidMount () {
    // console.log('BallotItemSupportOpposeComment, componentDidMount, this.props: ', this.props);
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    let ballotItemDisplayName = '';
    let ballotItemType;
    let isCandidate = false;
    let isMeasure = false;
    if (stringContains('cand', this.props.ballotItemWeVoteId)) {
      const candidate = CandidateStore.getCandidate(this.props.ballotItemWeVoteId);
      ballotItemDisplayName = candidate.ballot_item_display_name || '';
      ballotItemType = 'CANDIDATE';
      isCandidate = true;
    } else if (stringContains('meas', this.props.ballotItemWeVoteId)) {
      const measure = MeasureStore.getMeasure(this.props.ballotItemWeVoteId);
      ballotItemDisplayName = measure.ballot_item_display_name || '';
      ballotItemType = 'MEASURE';
      isMeasure = true;
    }
    this.setState({
      ballotItemDisplayName,
      ballotItemType,
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
      // componentDidMountFinished: true,
      isCandidate,
      isMeasure,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('BallotItemSupportOpposeComment, componentWillReceiveProps');
    let ballotItemDisplayName = '';
    let ballotItemType;
    let isCandidate = false;
    let isMeasure = false;
    if (stringContains('cand', nextProps.ballotItemWeVoteId)) {
      const candidate = CandidateStore.getCandidate(nextProps.ballotItemWeVoteId);
      ballotItemDisplayName = candidate.ballot_item_display_name || '';
      ballotItemType = 'CANDIDATE';
      isCandidate = true;
    } else if (stringContains('meas', nextProps.ballotItemWeVoteId)) {
      const measure = MeasureStore.getMeasure(nextProps.ballotItemWeVoteId);
      ballotItemDisplayName = measure.ballot_item_display_name || '';
      ballotItemType = 'MEASURE';
      isMeasure = true;
    }
    this.setState({
      ballotItemDisplayName,
      ballotItemType,
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
      isCandidate,
      isMeasure,
    });
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('BallotItemSupportOpposeComment caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.measureStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onCandidateStoreChange () {
    if (this.state.isCandidate) {
      const { ballotItemWeVoteId } = this.state;
      const candidate = CandidateStore.getCandidate(ballotItemWeVoteId);
      const ballotItemDisplayName = candidate.ballot_item_display_name || '';
      this.setState({
        ballotItemDisplayName,
      });
    }
  }

  onMeasureStoreChange () {
    if (this.state.isMeasure) {
      const { ballotItemWeVoteId } = this.state;
      const measure = MeasureStore.getMeasure(ballotItemWeVoteId);
      const ballotItemDisplayName = measure.ballot_item_display_name || '';
      this.setState({
        ballotItemDisplayName,
      });
    }
  }

  passDataBetweenItemActionToItemPosition () {
    // this.setState(() => ({ shouldFocusCommentArea: true }));
  }

  togglePositionStatement () {
    this.setState((state) => ({
      showPositionStatement: !state.showPositionStatement,
      // shouldFocusCommentArea: true,
    }));
  }

  render () {
    renderLog('BallotItemSupportOpposeComment');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      currentBallotIdInUrl, externalUniqueId, showPositionStatementActionBar,
      showPositionPublicToggle, hidePositionPublicToggle, urlWithoutHash, inModal,
    } = this.props;
    const inModal2 = inModal || false;
    const {
      ballotItemDisplayName, ballotItemType, ballotItemWeVoteId,
      showPositionStatement, transitioning,
      voterOpposesBallotItem, voterSupportsBallotItem,
      voterTextStatement,
    } = this.state;

    if (!ballotItemWeVoteId) return null;

    let commentBoxIsVisible = false;
    if (showPositionStatementActionBar || voterSupportsBallotItem || voterOpposesBallotItem || voterTextStatement || showPositionStatement) {
      commentBoxIsVisible = true;
    }
    const itemActionBar = (
      <ItemActionBar
        showPositionPublicToggle={showPositionPublicToggle}
        inModal={inModal2}
        showPositionStatementActionBar={showPositionStatementActionBar}
        ballotItemDisplayName={ballotItemDisplayName}
        ballotItemWeVoteId={ballotItemWeVoteId}
        commentButtonHide={commentBoxIsVisible}
        commentButtonHideInMobile
        currentBallotIdInUrl={currentBallotIdInUrl}
        externalUniqueId={`${externalUniqueId}-ballotItemSupportOpposeComment-${ballotItemWeVoteId}`}
        shareButtonHide
        hidePositionPublicToggle={hidePositionPublicToggle}
        supportOrOpposeHasBeenClicked={this.passDataBetweenItemActionToItemPosition}
        togglePositionStatementFunction={this.togglePositionStatement}
        transitioning={transitioning}
        urlWithoutHash={urlWithoutHash}
      />
    );

    const commentDisplayDesktop = showPositionStatementActionBar || voterSupportsBallotItem || voterOpposesBallotItem || voterTextStatement || showPositionStatement ? (
      <div className="d-none d-sm-block">
        <Suspense fallback={<></>}>
          <ItemPositionStatementActionBar
            showPositionPublicToggle={showPositionPublicToggle}
            inModal={inModal2}
            showPositionStatementActionBar={showPositionStatementActionBar}
            ballotItemWeVoteId={ballotItemWeVoteId}
            ballotItemDisplayName={ballotItemDisplayName}
            commentEditModeOn={showPositionStatement}
            externalUniqueId={`${externalUniqueId}-desktop-fromBallotItemSupportOpposeComment-${ballotItemWeVoteId}`}
            // shouldFocus={this.state.shouldFocusCommentArea}
            transitioning={transitioning}
            ballotItemType={ballotItemType}
            shownInList
          />
        </Suspense>
      </div>
    ) :
      null;

    const commentDisplayMobile = showPositionStatementActionBar || voterSupportsBallotItem || voterOpposesBallotItem || voterTextStatement ? (
      <div className="d-block d-sm-none">
        <Suspense fallback={<></>}>
          <ItemPositionStatementActionBar
            showPositionPublicToggle={showPositionPublicToggle}
            inModal={inModal2}
            showPositionStatementActionBar={showPositionStatementActionBar}
            ballotItemWeVoteId={ballotItemWeVoteId}
            ballotItemDisplayName={ballotItemDisplayName}
            hidePositionPublicToggle={hidePositionPublicToggle}
            // shouldFocus={this.state.shouldFocusCommentArea}
            transitioning={transitioning}
            ballotItemType={ballotItemType}
            externalUniqueId={`${externalUniqueId}-mobile-fromBallotItemSupportOpposeComment-${ballotItemWeVoteId}`}
            shownInList
            mobile
          />
        </Suspense>
      </div>
    ) :
      null;

    // console.log('White background from root: ', showPositionStatementActionBar);

    return (
      <Wrapper inmodal={passBool(inModal2)} showpositionstatementactionbar={passBool(showPositionStatementActionBar)} crunched={passBool(isCordova() && !inModal2)}>
        {/* <BallotHeaderDivider className="u-show-mobile" /> */}
        <ActionBarWrapper inModal={inModal2} crunched={isCordova() && !inModal2}>
          {/* Support/Oppose/Comment toggle here */}
          <Suspense fallback={<></>}>
            {itemActionBar}
          </Suspense>
        </ActionBarWrapper>
        <CommentDisplayWrapper inmodal={passBool(inModal2)} crunched={passBool(isCordova() && !inModal2)}>
          { commentDisplayDesktop }
          { commentDisplayMobile }
        </CommentDisplayWrapper>
      </Wrapper>
    );
  }
}
BallotItemSupportOpposeComment.propTypes = {
  ballotItemWeVoteId: PropTypes.string,
  currentBallotIdInUrl: PropTypes.string,
  externalUniqueId: PropTypes.string,
  showPositionStatementActionBar: PropTypes.bool,
  showPositionPublicToggle: PropTypes.bool,
  hidePositionPublicToggle: PropTypes.bool,
  urlWithoutHash: PropTypes.string,
  inModal: PropTypes.bool,
};

function wrapperPadding (props) {
  const padString = isAndroidSizeMD() ? '8px 0px 8px 4px' : '8px 12px 8px 12px';
  return props.showpositionstatementactionbar || props.inModal ? padString : '0';
}

const Wrapper = styled('div')`
  width: ${() => (isAndroidSizeMD() ? '95%' : '100%')};
  // background-color: ${({ showpositionstatementactionbar, inModal }) => (showpositionstatementactionbar || inModal ? '#eee' : 'white')} !important;
  background-color: white !important;
  padding: ${(props) => wrapperPadding(props)} !important;
  border-radius: 4px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    background-color: white;
    padding: 0;
  }
  margin-top: ${(crunched) => (crunched ? '0' : '12px')};
`;

const ActionBarWrapper = styled('div')`
  padding: 0;
  margin-bottom: ${(crunched) => (crunched ? '3px' : '12px')};
`;

const CommentDisplayWrapper = styled('div')`
  padding: 0;
  padding-bottom: ${(crunched) => (crunched ? '0' : '12px')};
`;


export default BallotItemSupportOpposeComment;
