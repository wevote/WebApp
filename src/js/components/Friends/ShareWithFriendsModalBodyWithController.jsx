import { filter } from 'lodash-es';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
// import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import FriendActions from '../../actions/FriendActions';
import apiCalming from '../../common/utils/apiCalming';
import { formatDateMMMDoYYYY } from '../../common/utils/dateFormat';
import daysUntil from '../../common/utils/daysUntil';
import { renderLog } from '../../common/utils/logging';
import BallotStore from '../../stores/BallotStore';
import FriendStore from '../../stores/FriendStore';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';
import SearchBar from '../Search/SearchBar';
import FriendList from './FriendList';

const SuggestedContacts = React.lazy(() => import(/* webpackChunkName: 'SuggestedContacts' */ './SuggestedContacts'));

class ShareWithFriendsModalBodyWithController extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentFriendList: [],
      currentFriendListFilteredBySearch: [],
      electionDateInFutureFormatted: '',
      electionDateIsToday: false,
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
    });
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

  render () {
    renderLog('ShareWithFriendsModalBodyWithController');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      currentFriendListFilteredBySearch, electionDateInFutureFormatted,
      electionDateIsToday, numberOfItemsToDisplay, searchFilterOn, searchTerm,
      totalCurrentFriendListCount,
    } = this.state;
    let { currentFriendList } = this.state;
    if (searchFilterOn) {
      currentFriendList = currentFriendListFilteredBySearch;
    }
    const messageToFriendType = 'shareWithFriend';

    return (
      <ShareWithFriendsModalBody>
        <div className="full-width">
          {totalCurrentFriendListCount > 10 && (
            <>
              <SearchBar
                clearButton
                searchButton
                placeholder="Search by name"
                searchFunction={this.searchFriends}
                clearFunction={this.clearSearch}
                searchUpdateDelayTime={250}
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
              messageToFriendType={messageToFriendType}
              numberOfItemsToDisplay={numberOfItemsToDisplay}
            />
          </FriendListExternalWrapper>
          <FriendListExternalWrapper>
            <Suspense fallback={<></>}>
              <SuggestedContacts askMode messageToFriendsInputOff />
            </Suspense>
          </FriendListExternalWrapper>
        </div>
        <div id="showMoreItemsId" />
      </ShareWithFriendsModalBody>
    );
  }
}
ShareWithFriendsModalBodyWithController.propTypes = {
};

const styles = () => ({
});

const FriendListExternalWrapper = styled('div')`
  margin-bottom: 64px;
`;

const ShareWithFriendsModalBody = styled('div')`
`;

export default withTheme(withStyles(styles)(ShareWithFriendsModalBodyWithController));
