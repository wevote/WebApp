import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import AppObservableStore from '../../stores/AppObservableStore';
import CandidateStore from '../../stores/CandidateStore';
import MeasureStore from '../../stores/MeasureStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import SvgImage from '../../common/components/Widgets/SvgImage';
import {
  CandidateEndorsementsContainer,
  EmptyPhotoOuterWrapper,
  EmptyText,
  EmptyTextWrapper,
  HorizontalSpacer,
  OrganizationPhotoInnerWrapper,
  PositionRowItemEmptyWrapper,
} from '../Style/PositionRowListStyles';

const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../SignIn/SignInModal'));

class PositionRowEmpty extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allCachedPositionsForThisBallotItemLength: 0,
      showSignInModal: false,
    };
    this.askFriendsSignInComplete = this.askFriendsSignInComplete.bind(this);
    this.closeSignInModal = this.closeSignInModal.bind(this);
    this.onClickAskFriends = this.onClickAskFriends.bind(this);
    this.toggleShowSignInModal = this.toggleShowSignInModal.bind(this);
  }

  componentDidMount () {
    // console.log('PositionRowEmpty componentDidMount');
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowEmpty componentDidMount, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    } else if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
    }
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    if (allCachedPositionsForThisBallotItem) {
      const allCachedPositionsForThisBallotItemLength = Object.keys(allCachedPositionsForThisBallotItem).length;
      this.setState({
        allCachedPositionsForThisBallotItemLength,
      });
    }
    this.setState({
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    });
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.measureStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onCandidateStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowEmpty onCandidateStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      if (allCachedPositionsForThisBallotItem) {
        const allCachedPositionsForThisBallotItemLength = Object.keys(allCachedPositionsForThisBallotItem).length;
        this.setState({
          allCachedPositionsForThisBallotItemLength,
        });
      }
    }
  }

  onMeasureStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowEmpty onMeasureStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(ballotItemWeVoteId);
      if (allCachedPositionsForThisBallotItem) {
        const allCachedPositionsForThisBallotItemLength = Object.keys(allCachedPositionsForThisBallotItem).length;
        this.setState({
          allCachedPositionsForThisBallotItemLength,
        });
      }
    }
  }

  onVoterStoreChange () {
    this.setState({
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
    });
  }

  onClickAskFriends () {
    const { voterIsSignedIn } = this.state;
    if (voterIsSignedIn) {
      AppObservableStore.setShowAskFriendsModal(true);
    } else {
      this.toggleShowSignInModal();
    }
  }

  // goToAccountSetup () {
  //   historyPush('/setupaccount');
  // }

  closeSignInModal () {
    this.setState({
      showSignInModal: false,
    });
  }

  askFriendsSignInComplete () {
    this.setState({
      showSignInModal: false,
    }, () => AppObservableStore.setShowAskFriendsModal(true));
  }

  toggleShowSignInModal () {
    const { showSignInModal } = this.state;
    this.setState({
      showSignInModal: !showSignInModal,
    });
  }

  render () {
    renderLog('PositionRowEmpty');  // Set LOG_RENDER_EVENTS to log all renders
    const { ballotItemWeVoteId } = this.props;
    const { allCachedPositionsForThisBallotItemLength, showSignInModal } = this.state;
    if (allCachedPositionsForThisBallotItemLength > 0) {
      return null;
    }
    const avatar = normalizedImagePath('../../img/global/svg-icons/avatar-generic.svg');
    const imagePlaceholder = (
      <SvgImage imageName={avatar} />
    );
    return (
      <OuterWrapper>
        { showSignInModal && (
          <Suspense fallback={<></>}>
            <SignInModal
              signInTitle="Sign in to ask your friends"
              signInSubTitle=""
              toggleOnClose={this.closeSignInModal}
              uponSuccessfulSignIn={this.askFriendsSignInComplete}
            />
          </Suspense>
        )}
        <NoOneChoosesWrapper>
          Undecided
        </NoOneChoosesWrapper>
        <CandidateEndorsementsContainer id={`PositionRowEmpty-${ballotItemWeVoteId}`} onClick={this.onClickAskFriends}>
          <PositionRowItemEmptyWrapper>
            <EmptyPhotoOuterWrapper>
              <OrganizationPhotoInnerWrapper>
                { imagePlaceholder }
              </OrganizationPhotoInnerWrapper>
            </EmptyPhotoOuterWrapper>
            <HorizontalSpacer />
            <EmptyTextWrapper>
              <EmptyText className="u-cursor--pointer u-link-color-on-hover">
                Ask your friends how they are going to vote.
              </EmptyText>
            </EmptyTextWrapper>
          </PositionRowItemEmptyWrapper>
        </CandidateEndorsementsContainer>
      </OuterWrapper>
    );
  }
}
PositionRowEmpty.propTypes = {
  ballotItemWeVoteId: PropTypes.string.isRequired,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const NoOneChoosesWrapper = styled('div')`
  border-bottom: 1px solid #dcdcdc;
  color: #999;
  line-height: 20px;
  padding-left: 4px;
`;

const OuterWrapper = styled('div')`
  height: 100%;
  width: 124px;
`;

export default withTheme(withStyles(styles)(PositionRowEmpty));
