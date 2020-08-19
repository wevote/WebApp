import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CandidateStore from '../../stores/CandidateStore';
import ItemActionBar from './ItemActionBar/ItemActionBar';
import ItemPositionStatementActionBar from './ItemPositionStatementActionBar';
import { renderLog } from '../../utils/logging';
import MeasureStore from '../../stores/MeasureStore';
import { stringContains } from '../../utils/textFormat';

class BallotItemSupportOpposeComment extends PureComponent {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    currentBallotIdInUrl: PropTypes.string,
    externalUniqueId: PropTypes.string,
    showPositionStatementActionBar: PropTypes.bool,
    showPositionPublicToggle: PropTypes.bool,
    hidePositionPublicToggle: PropTypes.bool,
    urlWithoutHash: PropTypes.string,
    inModal: PropTypes.bool,
  };

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

  componentWillReceiveProps (nextProps) {
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

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('BallotItemSupportOpposeComment caught error: ', `${error} with info: `, info);
  }

  passDataBetweenItemActionToItemPosition () {
    // this.setState(() => ({ shouldFocusCommentArea: true }));
  }

  togglePositionStatement () {
    this.setState(state => ({
      showPositionStatement: !state.showPositionStatement,
      // shouldFocusCommentArea: true,
    }));
  }

  render () {
    renderLog('BallotItemSupportOpposeComment');  // Set LOG_RENDER_EVENTS to log all renders
    const { currentBallotIdInUrl, externalUniqueId, showPositionStatementActionBar, showPositionPublicToggle, hidePositionPublicToggle, urlWithoutHash, inModal } = this.props;
    const { ballotItemDisplayName, ballotItemType, ballotItemWeVoteId, showPositionStatement, voterOpposesBallotItem, voterSupportsBallotItem, voterTextStatement } = this.state;

    if (!ballotItemWeVoteId) return null;

    let commentBoxIsVisible = false;
    if (showPositionStatementActionBar || voterSupportsBallotItem || voterOpposesBallotItem || voterTextStatement || showPositionStatement) {
      commentBoxIsVisible = true;
    }
    const itemActionBar = (
      <ItemActionBar
        showPositionPublicToggle={showPositionPublicToggle}
        inModal={inModal}
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
        transitioning={this.state.transitioning}
        urlWithoutHash={urlWithoutHash}
      />
    );

    const commentDisplayDesktop = showPositionStatementActionBar || voterSupportsBallotItem || voterOpposesBallotItem || voterTextStatement || showPositionStatement ? (
      <div className="d-none d-sm-block">
        <ItemPositionStatementActionBar
          showPositionPublicToggle={showPositionPublicToggle}
          inModal={inModal}
          showPositionStatementActionBar={showPositionStatementActionBar}
          ballotItemWeVoteId={ballotItemWeVoteId}
          ballotItemDisplayName={ballotItemDisplayName}
          commentEditModeOn={showPositionStatement}
          externalUniqueId={`${externalUniqueId}-desktop-fromBallotItemSupportOpposeComment-${ballotItemWeVoteId}`}
          // shouldFocus={this.state.shouldFocusCommentArea}
          transitioning={this.state.transitioning}
          ballotItemType={ballotItemType}
          shownInList
        />
      </div>
    ) :
      null;

    const commentDisplayMobile = showPositionStatementActionBar || voterSupportsBallotItem || voterOpposesBallotItem || voterTextStatement ? (
      <div className="d-block d-sm-none">
        <ItemPositionStatementActionBar
          showPositionPublicToggle={showPositionPublicToggle}
          inModal={inModal}
          showPositionStatementActionBar={showPositionStatementActionBar}
          ballotItemWeVoteId={ballotItemWeVoteId}
          ballotItemDisplayName={ballotItemDisplayName}
          hidePositionPublicToggle={hidePositionPublicToggle}
          // shouldFocus={this.state.shouldFocusCommentArea}
          transitioning={this.state.transitioning}
          ballotItemType={ballotItemType}
          externalUniqueId={`${externalUniqueId}-mobile-fromBallotItemSupportOpposeComment-${ballotItemWeVoteId}`}
          shownInList
          mobile
        />
      </div>
    ) :
      null;

    // console.log('White background from root: ', showPositionStatementActionBar);

    return (
      <Wrapper inModal={inModal} showPositionStatementActionBar={showPositionStatementActionBar}>
        {/* <BallotHeaderDivider className="u-show-mobile" /> */}
        <ActionBarWrapper inModal={inModal}>
          {/* Support/Oppose/Comment toggle here */}
          {itemActionBar}
        </ActionBarWrapper>
        <CommentDisplayWrapper inModal={inModal}>
          { commentDisplayDesktop }
          { commentDisplayMobile }
        </CommentDisplayWrapper>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
  background-color: ${({ showPositionStatementActionBar, inModal }) => (showPositionStatementActionBar || inModal ? '#eee' : 'white')} !important;
  padding: ${props => (props.showPositionStatementActionBar || props.inModal ? '12px 12px 0 12px' : '0')} !important;
  border-radius: 4px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    background-color: white;
    padding: 0;
  }
  margin-top: 12px;
`;

const ActionBarWrapper = styled.div`
  padding: 0px;
  margin-bottom: 12px;
`;

const CommentDisplayWrapper = styled.div`
  padding: 0px;
  padding-bottom: 12px;
`;


export default BallotItemSupportOpposeComment;
