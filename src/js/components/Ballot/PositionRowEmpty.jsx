import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import AppObservableStore from '../../stores/AppObservableStore';
import CandidateStore from '../../stores/CandidateStore';
import FriendStore from '../../stores/FriendStore';
import MeasureStore from '../../stores/MeasureStore';
import VoterStore from '../../stores/VoterStore';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import SvgImage from '../../common/components/Widgets/SvgImage';

const SignInModalSimple = React.lazy(() => import(/* webpackChunkName: 'SignInModalSimple' */ '../Settings/SignInModalSimple'));

class PositionRowEmpty extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allCachedPositionsForThisBallotItemLength: 0,
      showSignInModal: false,
    };
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
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
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
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
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
      // If profile not complete, start there
      if (!VoterStore.voterPhotoAndNameExist()) {
        console.log('Photo or name missing');
        // this.goToAccountSetup();
      } else if (!FriendStore.currentFriendsExist()) {
        // If no current friends, start import contacts/friends process
        console.log('No currentFriendsExist');
      } else {
        // If one or more friends, open message interface
        console.log('friendsExist');
      }
      AppObservableStore.setShowAskFriendsModal(true);
    } else {
      this.toggleShowSignInModal();
    }
  }

  goToAccountSetup () {
    historyPush('/setupaccount');
  }

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
    const avatar = normalizedImagePath('../../img/global/svg-icons/avatar-generic.svg');
    const imagePlaceholder = (
      <SvgImage imageName={avatar} />
    );
    return (
      <OuterWrapper>
        { showSignInModal && (
          <Suspense fallback={<></>}>
            <SignInModalSimple
              settingsAccountIsSignedInSubTitle={<></>}
              settingsAccountIsSignedInTitle={<></>}
              settingsAccountSignInTitle="Sign in to ask your friends."
              settingsAccountSignInSubTitle=""
              signedInTitle={<></>}
              signedOutTitle={<></>}
              toggleOnClose={this.closeSignInModal}
              uponSuccessfulSignIn={this.askFriendsSignInComplete}
            />
          </Suspense>
        )}
        <NoOneChoosesWrapper>
          Ask friends
        </NoOneChoosesWrapper>
        <CandidateEndorsementsContainer id={`PositionRowEmpty-${ballotItemWeVoteId}`} onClick={this.onClickAskFriends}>
          <RowItemWrapper>
            <OrganizationPhotoOuterWrapper>
              <OrganizationPhotoInnerWrapper>
                { imagePlaceholder }
              </OrganizationPhotoInnerWrapper>
            </OrganizationPhotoOuterWrapper>
            <HorizontalSpacer />
            <YesNoScoreTextWrapper>
              <AskFriendsText className="u-link-color-on-hover">
                {allCachedPositionsForThisBallotItemLength === 0 ? (
                  <>
                    No endorsements found for this candidate. Ask friends how they are going to vote.
                  </>
                ) : (
                  <>
                    Ask your friends how they are going to vote.
                  </>
                )}
              </AskFriendsText>
            </YesNoScoreTextWrapper>
          </RowItemWrapper>
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

const CandidateEndorsementsContainer = styled('div')`
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
`;

const NoOneChoosesWrapper = styled('div')`
  border-bottom: 1px solid #dcdcdc;
  color: #ccc;
  line-height: 20px;
  padding-left: 4px;
`;

const OuterWrapper = styled('div')`
  border-left: 1px dotted #dcdcdc;
  height: 100%;
  width: 124px;
`;

const HorizontalSpacer = styled('div')`
  border-bottom: 1px dotted #dcdcdc;
`;

const OrganizationPhotoInnerWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  height: 50px;
  width: 50px;
  justify-content: center;
  & img, & svg, & path {
    border: 1px solid #ccc;
    border-radius: 48px;
    width: 48px !important;
    height: 48px !important;
    max-width: 48px !important;
    display: flex;
    align-items: flex-start;
  }
`;

const OrganizationPhotoOuterWrapper = styled('div')`
  display: flex;
  justify-content: start;
  padding: 8px 3px 6px 4px;
  width: 128px;
`;

const RowItemWrapper = styled('div')`
  align-items: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const AskFriendsText = styled('div')`
  font-size: 14px;
  font-weight: normal;
  margin-top: 0;
`;

const YesNoScoreTextWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-flow: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 3px 3px 4px 4px;
  width: 124px;
`;

export default withTheme(withStyles(styles)(PositionRowEmpty));
