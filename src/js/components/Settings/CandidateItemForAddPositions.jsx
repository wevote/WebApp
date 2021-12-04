import { withStyles, withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import CandidateStore from '../../stores/CandidateStore';
import SupportStore from '../../stores/SupportStore';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import { renderLog } from '../../common/utils/logging';
import ItemPositionStatementActionBar from '../Widgets/ItemPositionStatementActionBar';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const ItemActionBar = React.lazy(() => import(/* webpackChunkName: 'ItemActionBar' */ '../Widgets/ItemActionBar/ItemActionBar'));

class CandidateItemForAddPositions extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballotItemDisplayName: '',
      ballotItemWeVoteId: '',
      changeFound: false,
      componentDidMount: false,
      voterOpposesBallotItem: false,
      voterSupportsBallotItem: false,
      voterTextStatement: '',
      oneCandidate: {},
      // shouldFocusCommentArea: false,
      showPositionStatement: false,
    };
    this.togglePositionStatement = this.togglePositionStatement.bind(this);
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.onCandidateStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    // console.log('CandidateItemForAddPositions componentDidMount, organizationWeVoteId:', organizationWeVoteId);
    const { oneCandidate } = this.props;
    if (oneCandidate) {
      this.setState({
        ballotItemDisplayName: oneCandidate.ballot_item_display_name,
        ballotItemWeVoteId: oneCandidate.we_vote_id,
      });
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(oneCandidate.we_vote_id);
      if (ballotItemStatSheet) {
        const {
          voterOpposesBallotItem,
          voterSupportsBallotItem,
          voterTextStatement,
        } = ballotItemStatSheet;
        this.setState({
          voterOpposesBallotItem,
          voterSupportsBallotItem,
          voterTextStatement,
        });
      }
    }
    this.setState({
      componentDidMount: true,
      oneCandidate: this.props.oneCandidate,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.componentDidMount !== nextState.componentDidMount) {
      // console.log('this.state.componentDidMount: ', this.state.componentDidMount, ', nextState.componentDidMount: ', nextState.componentDidMount);
      return true;
    }
    if (this.state.changeFound !== nextState.changeFound) {
      // console.log('this.state.changeFound: ', this.state.changeFound, ', nextState.changeFound: ', nextState.changeFound);
      return true;
    }
    if (this.state.voterOpposesBallotItem !== nextState.voterOpposesBallotItem) {
      // console.log('this.state.voterOpposesBallotItem: ', this.state.voterOpposesBallotItem, ', nextState.voterOpposesBallotItem: ', nextState.voterOpposesBallotItem);
      return true;
    }
    if (this.state.voterSupportsBallotItem !== nextState.voterSupportsBallotItem) {
      // console.log('this.state.voterSupportsBallotItem: ', this.state.voterSupportsBallotItem, ', nextState.voterSupportsBallotItem: ', nextState.voterSupportsBallotItem);
      return true;
    }
    if (this.state.showPositionStatement !== nextState.showPositionStatement) {
      // console.log('this.state.showPositionStatement: ', this.state.showPositionStatement, ', nextState.showPositionStatement: ', nextState.showPositionStatement);
      return true;
    }
    if (this.state.voterTextStatement !== nextState.voterTextStatement) {
      // console.log('this.state.voterTextStatement: ', this.state.voterTextStatement, ', nextState.voterTextStatement: ', nextState.voterTextStatement);
      return true;
    }
    return false;
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('CandidateItemForAddPositions caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.supportStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onCandidateStoreChange () {
    const changeFound = false;
    this.setState({
      changeFound,
    });
  }

  onSupportStoreChange () {
    const { ballotItemWeVoteId } = this.state;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    if (ballotItemStatSheet) {
      const {
        voterOpposesBallotItem,
        voterSupportsBallotItem,
        voterTextStatement,
      } = ballotItemStatSheet;
      this.setState({
        voterOpposesBallotItem,
        voterSupportsBallotItem,
        voterTextStatement,
      });
    }
  }

  togglePositionStatement () {
    const { showPositionStatement } = this.state;
    this.setState({
      showPositionStatement: !showPositionStatement,
      // shouldFocusCommentArea: true,
    });
  }

  render () {
    renderLog('CandidateItemForAddPositions');  // Set LOG_RENDER_EVENTS to log all renders
    // const { classes, theme } = this.props;
    const { oneCandidate, showPositionStatement, voterOpposesBallotItem, voterSupportsBallotItem, voterTextStatement } = this.state;
    if (!oneCandidate || !oneCandidate.we_vote_id) {
      return null;
    }

    const commentDisplayDesktop = voterSupportsBallotItem || voterOpposesBallotItem || voterTextStatement || showPositionStatement ? (
      <ItemPositionStatementActionBarDesktopWrapper className="d-none d-sm-block u-min-50">
        <ItemPositionStatementActionBar
          ballotItemWeVoteId={this.state.ballotItemWeVoteId}
          ballotItemDisplayName={this.state.ballotItemDisplayName}
          commentEditModeOn={this.state.showPositionStatement}
          externalUniqueId="desktopPositionStatement"
          // shouldFocus={this.state.shouldFocusCommentArea}
          transitioning={this.state.transitioning}
          ballotItemType="CANDIDATE"
          shownInList
        />
      </ItemPositionStatementActionBarDesktopWrapper>
    ) :
      null;

    const commentDisplayMobile = voterSupportsBallotItem || voterOpposesBallotItem || voterTextStatement || showPositionStatement ? (
      <ItemPositionStatementActionBarMobileWrapper className="d-block d-sm-none u-min-50">
        <ItemPositionStatementActionBar
          ballotItemWeVoteId={this.state.ballotItemWeVoteId}
          ballotItemDisplayName={this.state.ballotItemDisplayName}
          externalUniqueId="mobilePositionStatement"
          // shouldFocus={this.state.shouldFocusCommentArea}
          transitioning={this.state.transitioning}
          ballotItemType="CANDIDATE"
          shownInList
          mobile
        />
      </ItemPositionStatementActionBarMobileWrapper>
    ) :
      null;

    const avatarCompressed = `card-main__avatar-compressed${isCordova() ? '-cordova' : ''}`;
    const avatarBackgroundImage = normalizedImagePath('../img/global/svg-icons/avatar-generic.svg');
    const candidatePartyText = oneCandidate.party && oneCandidate.party.length ? `${oneCandidate.party}` : '';
    return (
      <Wrapper>
        <CandidateTopRow>
          <Candidate>
            {/* Candidate Image */}
            <Suspense fallback={<></>}>
              <ImageHandler
                className={avatarCompressed}
                sizeClassName="icon-candidate-small u-push--sm "
                imageUrl={oneCandidate.candidate_photo_url_medium}
                alt="candidate-photo"
                kind_of_ballot_item="CANDIDATE"
                style={{ backgroundImage: { avatarBackgroundImage } }}
              />
            </Suspense>
            {/* Candidate Name */}
            <div>
              <h4 className="card-main__candidate-name card-main__candidate-name-link u-f5">
                {oneCandidate.ballot_item_display_name}
                <br />
                <span className="card-main__candidate-party-description">{candidatePartyText}</span>
              </h4>
            </div>
          </Candidate>
          {/* Action Buttons: Support/Oppose/Comment */}
          <Suspense fallback={<></>}>
            <ItemActionBar
              inModal={this.props.inModal}
              ballotItemDisplayName={oneCandidate.ballot_item_display_name}
              ballotItemWeVoteId={oneCandidate.we_vote_id}
              buttonsOnly
              externalUniqueId={`candidateItemForAddPositions-${oneCandidate.we_vote_id}`}
              positionPublicToggleWrapAllowed={this.props.numberOfCandidatesInList > 1}
              shareButtonHide
              togglePositionStatementFunction={this.togglePositionStatement}
            />
          </Suspense>
        </CandidateTopRow>
        {commentDisplayDesktop}
        {commentDisplayMobile}
      </Wrapper>
    );
  }
}
CandidateItemForAddPositions.propTypes = {
  oneCandidate: PropTypes.object,
  numberOfCandidatesInList: PropTypes.number,
  inModal: PropTypes.bool,
  // togglePositionStatement: PropTypes.func,
};

const styles = (theme) => ({
  cardHeaderIconRoot: {
    marginTop: '-.3rem',
    fontSize: 20,
    marginLeft: '.3rem',
  },
  cardFooterIconRoot: {
    fontSize: 14,
    margin: '0 0 .1rem .3rem',
    [theme.breakpoints.down('lg')]: {
      marginBottom: '.2rem',
    },
  },
});

const Wrapper = styled.div`
`;

const CandidateTopRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const Candidate = styled.div`
  display: flex;
  cursor: pointer;
`;

const ItemPositionStatementActionBarDesktopWrapper = styled.div`
  margin-bottom: 8px;
`;

const ItemPositionStatementActionBarMobileWrapper = styled.div`
  margin-bottom: 4px;
`;

export default withTheme(withStyles(styles)(CandidateItemForAddPositions));
