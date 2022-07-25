import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import { filter } from 'lodash-es';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import FriendActions from '../../actions/FriendActions';
import apiCalming from '../../common/utils/apiCalming';
import { formatDateMMMDoYYYY } from '../../common/utils/dateFormat';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import daysUntil from '../../common/utils/daysUntil';
import { renderLog } from '../../common/utils/logging';
import SuggestedContacts from './SuggestedContacts';
import { ModalTitleType1 } from '../Style/ModalType1Styles';
import BallotStore from '../../stores/BallotStore';
import FriendStore from '../../stores/FriendStore';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';
import SearchBar from '../Search/SearchBar';
import FriendList from './FriendList';

const MessageToFriendInputField = React.lazy(() => import(/* webpackChunkName: 'MessageToFriendInputField' */ './MessageToFriendInputField'));

class AskFriendsModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentFriendList: [],
      currentFriendListFilteredBySearch: [],
      electionDateInFutureFormatted: '',
      electionDateIsToday: false,
      messageToFriendDefault: '',
      numberOfIncreases: 0,
      numberOfItemsToDisplay: 20,
      searchFilterOn: false,
      searchTerm: '',
    };
  }

  componentDidMount () {
    if (apiCalming('friendListsAll', 5000)) {
      FriendActions.friendListsAll();
    }
    this.setElectionDateInformation();
    this.onFriendStoreChange();
    const currentFriendListUnsorted = FriendStore.currentFriends();
    // console.log('componentDidMount currentFriendListUnsorted:', currentFriendListUnsorted);
    const currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
    this.setState({
      currentFriendList,
    });
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    // window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount () {
    if (this.setMessageTimer) clearTimeout(this.setMessageTimer);
    this.ballotStoreListener.remove();
    this.friendStoreListener.remove();
  }

  onBallotStoreChange () {
    this.setElectionDateInformation();
  }

  onFriendStoreChange () {
    const currentFriendListUnsorted = FriendStore.currentFriends();
    // console.log('onFriendStoreChange currentFriendListUnsorted:', currentFriendListUnsorted);
    const currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
    const totalCurrentFriendListCount = currentFriendList.length;
    this.setState({
      currentFriendList,
      totalCurrentFriendListCount,
    });
  }

  onScroll = (event) => {
    const { numberOfIncreases } = this.state;
    const howFarHasItScrolled = event.target.scrollTop;
    // console.log('onScroll howFarHasItScrolled:', howFarHasItScrolled);
    const scrollDistanceThatTriggersIncrease = (1 + numberOfIncreases) * (0.9 * window.innerHeight);
    // console.log('scrollDistanceThatTriggersIncrease:', scrollDistanceThatTriggersIncrease);
    const showMoreItemsElement = document.querySelector('#showMoreItemsId');
    // console.log('Loading more: ', this.state.loadingMoreItems);
    if (showMoreItemsElement) {
      const { numberOfItemsToDisplay, totalCurrentFriendListCount } = this.state;
      if (numberOfItemsToDisplay < totalCurrentFriendListCount) {
        if (howFarHasItScrolled > scrollDistanceThatTriggersIncrease) {
          // this.setState({ loadingMoreItems: true });
          this.increaseNumberOfItemsToDisplay();
        }
      } else {
        // this.setState({ loadingMoreItems: false });
      }
    }
  }

  increaseNumberOfItemsToDisplay = () => {
    let { numberOfIncreases, numberOfItemsToDisplay } = this.state;
    // console.log('Number of ballot items before increment: ', numberOfItemsToDisplay);
    numberOfIncreases += 1;
    numberOfItemsToDisplay += 10;
    // console.log('Number of ballot items after increment: ', numberOfItemsToDisplay);

    clearTimeout(this.friendListLoadTimer);
    this.friendListLoadTimer = setTimeout(() => {
      this.setState({
        numberOfIncreases,
        numberOfItemsToDisplay,
      });
    }, 250);
  }

  createMessageToFriendDefault = () => {
    const { electionDateInFutureFormatted } = this.state;
    let messageToFriendDefault = '';
    // const electionDayText = ElectionStore.getElectionDayText(VoterStore.electionId());
    const electionDayText = BallotStore.currentBallotElectionDate;
    let electionDateFound = false;
    if (electionDayText !== undefined && electionDateInFutureFormatted) {
      const daysUntilElection = daysUntil(electionDayText);
      if (daysUntilElection === 0) {
        messageToFriendDefault += "I'm getting ready to vote today.";
        electionDateFound = true;
      } else if (daysUntilElection > 0) {
        messageToFriendDefault += `I'm getting ready for the election on ${electionDateInFutureFormatted}.`;
        electionDateFound = true;
      }
    }
    if (!electionDateFound) {
      messageToFriendDefault += "I'm getting ready to vote.";
    }
    messageToFriendDefault += ' Would you like to compare notes about how to vote?';
    this.setState({
      messageToFriendDefault,
    }, () => this.setMessageToFriendQueuedToSave());
  }

  setMessageToFriendQueuedToSave = () => {
    if (this.setMessageTimer) clearTimeout(this.setMessageTimer);
    this.setMessageTimer = setTimeout(() => {
      const { messageToFriendDefault } = this.state;
      const messageToFriendQueuedToSave = FriendStore.getMessageToFriendQueuedToSave();
      if (messageToFriendDefault !== messageToFriendQueuedToSave) {
        // If voter hasn't changed this, update this.
        FriendActions.messageToFriendQueuedToSave(messageToFriendDefault);
      }
    }, 500);
  }

  setElectionDateInformation = () => {
    // const electionDayText = ElectionStore.getElectionDayText(VoterStore.electionId());
    const electionDayText = BallotStore.currentBallotElectionDate;
    const electionDateFormatted = formatDateMMMDoYYYY(electionDayText);
    let electionDateInFutureFormatted = '';
    let electionDateIsToday = false;
    if (electionDayText !== undefined && electionDateFormatted) {
      const daysUntilElection = daysUntil(electionDayText);
      if (daysUntilElection === 0) {
        electionDateInFutureFormatted = electionDateFormatted;
        electionDateIsToday = true;
      } else if (daysUntilElection > 0) {
        electionDateInFutureFormatted = electionDateFormatted;
      }
    }
    this.setState({
      electionDateInFutureFormatted,
      electionDateIsToday,
    }, () => this.createMessageToFriendDefault());
  }

  searchFriends = (searchTerm) => {
    if (searchTerm.length === 0) {
      this.setState({
        currentFriendListFilteredBySearch: [],
        searchFilterOn: false,
        searchTerm: '',
      });
    } else {
      const searchTermLowercase = searchTerm.toLowerCase();
      const { currentFriendList } = this.state;
      const searchedFriendList = filter(currentFriendList,
        (voter) => voter.voter_display_name.toLowerCase().includes(searchTermLowercase));

      this.setState({
        currentFriendListFilteredBySearch: searchedFriendList,
        searchFilterOn: true,
        searchTerm,
      });
    }
  }

  clearSearch = () => {
    this.setState({
      searchFilterOn: false,
      searchTerm: '',
      currentFriendListFilteredBySearch: [],
    });
  }

  closeThisModal = () => {
    this.props.toggleFunction();
  }

  render () {
    renderLog('AskFriendsModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { location: { pathname } } = window;
    const {
      currentFriendListFilteredBySearch, electionDateInFutureFormatted,
      electionDateIsToday, numberOfItemsToDisplay, searchFilterOn, searchTerm,
      totalCurrentFriendListCount,
    } = this.state;
    let { currentFriendList } = this.state;
    if (searchFilterOn) {
      currentFriendList = currentFriendListFilteredBySearch;
    }
    const messageToFriend = FriendStore.getMessageToFriendQueuedToSave();

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(pathname); }}
      >
        <ModalTitleAreaAskFriendsCloseX>
          <IconButton
            aria-label="Close"
            onClick={this.closeThisModal}
            id="closeAskFriendsModal"
            size="large"
          >
            <Close />
          </IconButton>
        </ModalTitleAreaAskFriendsCloseX>
        <ModalTitleAreaAskFriendsTop>
          <div className="full-width">
            <ModalTitleType1>
              <span className="u-show-mobile">
                Ask your friends how they&apos;re voting
              </span>
              <span className="u-show-desktop-tablet">
                Ask your friends how they&apos;re going to vote
              </span>
            </ModalTitleType1>
          </div>
        </ModalTitleAreaAskFriendsTop>
        <ModalTitleAreaAskFriendsBottom>
          <div className="full-width">
            {totalCurrentFriendListCount > 0 && (
              <Suspense fallback={<></>}>
                <MessageToFriendInputField />
              </Suspense>
            )}
          </div>
        </ModalTitleAreaAskFriendsBottom>
        <DialogContent classes={{ root: classes.dialogContent }} onScroll={this.onScroll}>
          <div className="full-width">
            {totalCurrentFriendListCount > 10 && (
              <>
                <SearchBar
                  clearButton
                  searchButton
                  placeholder="Search by name"
                  searchFunction={this.searchFriends}
                  clearFunction={this.clearSearch}
                  searchUpdateDelayTime={0}
                />
                <br />
              </>
            )}
            <FriendListExternalWrapper>
              { (searchFilterOn && currentFriendList.length === 0) && (
                <p>
                  &quot;
                  {searchTerm}
                  &quot; not found
                </p>
              )}
              <FriendList
                electionDateInFutureFormatted={electionDateInFutureFormatted}
                electionDateIsToday={electionDateIsToday}
                friendList={currentFriendList}
                friendToggleOff
                increaseNumberOfItemsToDisplay={this.increaseNumberOfItemsToDisplay}
                messageToFriendButtonOn
                messageToFriendDefault={messageToFriend}
                numberOfItemsToDisplay={numberOfItemsToDisplay}
              />
            </FriendListExternalWrapper>
            <FriendListExternalWrapper>
              <SuggestedContacts askMode messageToFriendsInputOff />
            </FriendListExternalWrapper>
          </div>
          <div id="showMoreItemsId" />
        </DialogContent>
      </Dialog>
    );
  }
}
AskFriendsModal.propTypes = {
  classes: PropTypes.object,
  show: PropTypes.bool,
  toggleFunction: PropTypes.func.isRequired,
};

const styles = () => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 576px)': {
      maxWidth: '600px',
      width: '90%',
      height: '90%',
      margin: '0 auto',
      minWidth: 0,
      minHeight: 0,
      transitionDuration: '.25s',
    },
    minWidth: '100%',
    maxWidth: '100%',
    width: '100%',
    minHeight: '90%',
    maxHeight: '90%',
    height: '90%',
    margin: '0 0 64px 0',
  },
  dialogContent: {
    paddingBottom: 24,
    paddingTop: 8,
    background: 'white',
    display: 'flex',
    justifyContent: 'center',
  },
  continueButtonRoot: {
    width: '100%',
  },
});

const FriendListExternalWrapper = styled('div')`
  margin-bottom: 64px;
`;

const ModalTitleAreaAskFriendsCloseX = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 10px 12px 0 12px;
  z-index: 999;
`;

const ModalTitleAreaAskFriendsTop = styled('div')`
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 10px 24px 0 24px;
  z-index: 999;
  display: flex;
`;

const ModalTitleAreaAskFriendsBottom = styled('div')`
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 10px 24px 0 24px;
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  display: flex;
`;

export default withTheme(withStyles(styles)(AskFriendsModal));
