import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import SuggestedContactList from '../Friends/SuggestedContactList';
import SearchBar from '../Search/SearchBar';
import VoterActions from '../../actions/VoterActions';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import {
  SetUpAccountContactsText,
  SetUpAccountContactsTextWrapper,
  SetUpAccountTitle,
  SetUpAccountTop,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';

const MessageToFriendInputField = React.lazy(() => import(/* webpackChunkName: 'MessageToFriendInputField' */ '../Friends/MessageToFriendInputField'));

class SetUpAccountInviteContacts extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      currentFriendListFilteredBySearch: [],
      numberOfItemsToDisplay: 20,
      searchFilterOn: false,
      searchTerm: '',
      totalListCount: 0,
      voterContactEmailListCount: 0,
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.onVoterStoreChange();
    VoterActions.voterContactListRetrieve();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    window.addEventListener('scroll', this.onScroll);
  }

  componentDidUpdate (prevProps) {
    // console.log('SetUpAccountInviteContacts componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      this.props.goToNextStep();
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    window.removeEventListener('scroll', this.onScroll);
  }

  onVoterStoreChange () {
    const voterContactEmailListRaw = VoterStore.getVoterContactEmailList();
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();

    let voterContactEmailList = voterContactEmailListRaw;
    voterContactEmailList = voterContactEmailList.sort(this.orderByCity);
    voterContactEmailList = voterContactEmailList.sort(this.orderByStateCode);
    voterContactEmailList = voterContactEmailList.sort(this.orderByExistingAccountExists);
    voterContactEmailList = voterContactEmailList.sort(this.orderByIgnored);
    const contactsWithAccountList = filter(voterContactEmailList, (contact) => contact.voter_we_vote_id);
    const contactsWithAccountCount = contactsWithAccountList.length;

    this.setState({
      contactsWithAccountCount,
      totalListCount: voterContactEmailList.length,
      voterContactEmailList,
      voterContactEmailListCount,
    });
  }

  orderByCity = (firstItem, secondItem) => {
    if (firstItem && firstItem.city && secondItem && secondItem.city && (firstItem.city.length > 0 && secondItem.city.length > 0)) {
      return firstItem.city.localeCompare(secondItem.city);
    } else if (firstItem && firstItem.city && firstItem.city.length > 0) {
      return -1;
    } else if (secondItem && secondItem.city && secondItem.city.length > 0) {
      return 1;
    } else {
      return 0;
    }
  }

  orderByStateCode = (firstItem, secondItem) => {
    if (firstItem && firstItem.state_code && secondItem && secondItem.state_code && (firstItem.state_code.length > 0 && secondItem.state_code.length > 0)) {
      return firstItem.state_code.localeCompare(secondItem.state_code);
    } else if (firstItem && firstItem.state_code && firstItem.state_code.length > 0) {
      return -1;
    } else if (secondItem && secondItem.state_code && secondItem.state_code.length > 0) {
      return 1;
    } else {
      return 0;
    }
  }

  orderByExistingAccountExists = (firstContact, secondContact) => {
    const secondContactHasAccount = secondContact && secondContact.voter_we_vote_id && secondContact.voter_we_vote_id.length ? 1 : 0;
    const firstContactHasAccount = firstContact && firstContact.voter_we_vote_id && firstContact.voter_we_vote_id.length ? 1 : 0;
    return secondContactHasAccount - firstContactHasAccount;
  };

  orderByIgnored = (firstItem, secondItem) => {
    if (firstItem && firstItem.ignore_contact && secondItem && secondItem.ignore_contact) {
      return 0;
    } else if (firstItem && firstItem.ignore_contact) {
      return 1;
    } else if (secondItem && secondItem.ignore_contact) {
      return -1;
    } else {
      return 0;
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

  onScroll = () => {
    const showMoreItemsElement =  document.querySelector('#showMoreItemsId');
    // console.log('showMoreItemsElement: ', showMoreItemsElement);
    // console.log('Loading more: ', this.state.loadingMoreItems);
    if (showMoreItemsElement) {
      const { numberOfItemsToDisplay, totalListCount } = this.state;
      if (numberOfItemsToDisplay < totalListCount) {
        if (showMoreItemsElement.getBoundingClientRect().bottom <= window.innerHeight) {
          // this.setState({ loadingMoreItems: true });
          this.increaseNumberOfItemsToDisplay();
        }
      } else {
        // this.setState({ loadingMoreItems: false });
      }
    }
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
      const { voterContactEmailList } = this.state;
      const searchedFriendList = filter(voterContactEmailList,
        (contact) => contact.display_name.toLowerCase().includes(searchTermLowercase));

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
    renderLog('SetUpAccountInviteContacts');  // Set LOG_RENDER_EVENTS to log all renders
    const { contactsWithAccountCount, currentFriendListFilteredBySearch, numberOfItemsToDisplay, searchFilterOn, searchTerm, voterContactEmailListCount } = this.state;
    let { voterContactEmailList } = this.state;

    if (searchFilterOn) {
      voterContactEmailList = currentFriendListFilteredBySearch;
    }
    const messageToFriendDefault = '';
    const pigsCanFly = false;
    // console.log('voterContactEmailList:', voterContactEmailList);
    return (
      <StepCenteredWrapper>
        <SetUpAccountTop>
          <SetUpAccountTitle>
            Add friends from contacts
          </SetUpAccountTitle>
          <SetUpAccountContactsTextWrapper>
            <SetUpAccountContactsText>
              Add friends you feel comfortable discussing politics with.
            </SetUpAccountContactsText>
          </SetUpAccountContactsTextWrapper>
        </SetUpAccountTop>
        <MessageToSendWrapper>
          {(voterContactEmailListCount > 0 && pigsCanFly) && (
            <Suspense fallback={<></>}>
              <MessageToFriendInputField messageToFriendDefault={messageToFriendDefault} />
            </Suspense>
          )}
        </MessageToSendWrapper>
        <ContactListWrapper>
          <ContactsFoundText>
            {voterContactEmailListCount}
            {' '}
            contacts,
            {!!(contactsWithAccountCount) && (
              <>
                {' '}
                {contactsWithAccountCount}
                {' '}
                found on We Vote
              </>
            )}
          </ContactsFoundText>
          {voterContactEmailListCount > 10 && (
            <>
              <SearchBar
                clearButton
                searchButton
                placeholder="Search your contacts by name"
                searchFunction={this.searchFriends}
                clearFunction={this.clearSearch}
                searchUpdateDelayTime={0}
              />
              <br />
            </>
          )}
          { (searchFilterOn && voterContactEmailList.length === 0) && (
            <p>
              &quot;
              {searchTerm}
              &quot; not found
            </p>
          )}
          <SuggestedContactList
            numberOfItemsToDisplay={numberOfItemsToDisplay}
            voterContactEmailList={voterContactEmailList}
          />
        </ContactListWrapper>
        <div id="showMoreItemsId" />
      </StepCenteredWrapper>
    );
  }
}
SetUpAccountInviteContacts.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  nextButtonClicked: PropTypes.bool,
};

const ContactListWrapper = styled('div')`
  width: 100%;
`;

const ContactsFoundText = styled('div')`
  color: #999;
  font-size: 16px;
  padding: 0 13px;
`;

const MessageToSendWrapper = styled('div')`
  margin-top: 42px;
  width: 100%;
`;

export default SetUpAccountInviteContacts;
