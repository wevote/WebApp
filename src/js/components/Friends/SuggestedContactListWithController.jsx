import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SuggestedContactList from './SuggestedContactList';
import SearchBar2024 from '../../common/components/Search/SearchBar2024';
import VoterActions from '../../actions/VoterActions';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import VoterStore from '../../stores/VoterStore';
import { SectionDescription } from '../Style/friendStyles';

const MessageToFriendInputField = React.lazy(() => import(/* webpackChunkName: 'MessageToFriendInputField' */ './MessageToFriendInputField'));

class SuggestedContactListWithController extends React.Component {
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
    if (apiCalming('voterContactListRetrieve', 20000)) {
      VoterActions.voterContactListRetrieve();
    }
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    window.addEventListener('scroll', this.onScroll);
    this.timer = setTimeout(() => {
      VoterActions.clearVoterContactEmailImportVariables();
    }, 500);
  }

  componentWillUnmount () {
    if (this.timer) clearTimeout(this.timer);
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
    voterContactEmailList = voterContactEmailList.sort(this.orderByIsFriend);
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

  getImportContactsLink = () => {
    const { location: { pathname } } = window;
    if (stringContains('setupaccount', pathname)) {
      return '/setupaccount/importcontacts';
    } else {
      return '/findfriends/importcontacts';
    }
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

  orderByIsFriend = (firstItem, secondItem) => {
    if (firstItem && firstItem.is_friend && secondItem && secondItem.is_friend) {
      return 0;
    } else if (firstItem && firstItem.is_friend) {
      return 1;
    } else if (secondItem && secondItem.is_friend) {
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
      // console.log('voterContactEmailList:', voterContactEmailList);
      const searchedFriendList = filter(voterContactEmailList,
        (contact) => (contact.display_name && contact.display_name.toLowerCase().includes(searchTermLowercase)) || (contact.email_address_text && contact.email_address_text.toLowerCase().includes(searchTermLowercase)) || (contact.city && contact.city.toLowerCase().includes(searchTermLowercase)) || (contact.state_code && contact.state_code.toLowerCase().includes(searchTermLowercase)));

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
    renderLog('SuggestedContactListWithController');  // Set LOG_RENDER_EVENTS to log all renders
    const { askMode, messageToFriendsInputOff, remindMode } = this.props;
    const {
      contactsWithAccountCount, currentFriendListFilteredBySearch,
      numberOfItemsToDisplay, searchFilterOn, searchTerm,
      voterContactEmailListCount,
    } = this.state;
    let { voterContactEmailList } = this.state;

    if (searchFilterOn) {
      voterContactEmailList = currentFriendListFilteredBySearch;
    }
    let sectionDescription;
    if (askMode) {
      sectionDescription = 'Asking a contact will send the message above and an invitation to be your friend on WeVote.';
    } else if (remindMode) {
      sectionDescription = (
        <>
          {/*
          {voterContactEmailListCount}
          {' '}
          friends found. Your reminder could help your friend use their vote!
          */}
        </>
      );
    }
    let messageToFriendType = 'inviteFriend'; // default
    if (askMode) {
      messageToFriendType = 'askFriend';
    } else if (remindMode) {
      messageToFriendType = 'remindContacts';
    }
    // console.log('voterContactEmailList:', voterContactEmailList);
    return (
      <SuggestedContactListControllerWrapper>
        {voterContactEmailListCount > 0 ? (
          <ContactListWrapper>
            {(askMode || remindMode) ? (
              <SectionDescription>
                {sectionDescription}
              </SectionDescription>
            ) : (
              <ContactsFoundText>
                {!!(contactsWithAccountCount) && (
                  <>
                    <strong>
                      {contactsWithAccountCount}
                      {' '}
                      found on WeVote
                    </strong>
                    ,
                    {' '}
                  </>
                )}
                {voterContactEmailListCount}
                {' '}
                {voterContactEmailListCount === 1 ? (
                  <>
                    contact
                  </>
                ) : (
                  <>
                    contacts
                  </>
                )}
                {!(contactsWithAccountCount) && (
                  <>
                    {' '}
                    found
                  </>
                )}
              </ContactsFoundText>
            )}
            {voterContactEmailListCount > 10 && (
              <>
                <SearchBar2024
                  clearButton
                  searchButton
                  placeholder="Search by name, email, city or state code"
                  searchFunction={this.searchFriends}
                  clearFunction={this.clearSearch}
                  searchUpdateDelayTime={250}
                />
              </>
            )}
            { (searchFilterOn && voterContactEmailList.length === 0) && (
              <p>
                &quot;
                {searchTerm}
                &quot; not found
              </p>
            )}
            {(!messageToFriendsInputOff && voterContactEmailListCount > 0) && (
              <MessageToSendWrapper>
                <Suspense fallback={<></>}>
                  <MessageToFriendInputField messageToFriendType={messageToFriendType} />
                </Suspense>
              </MessageToSendWrapper>
            )}
            <SuggestedContactListOuterWrapper>
              <SuggestedContactList
                askMode={askMode}
                numberOfItemsToDisplay={numberOfItemsToDisplay}
                remindMode={remindMode}
                voterContactEmailList={voterContactEmailList}
              />
            </SuggestedContactListOuterWrapper>
          </ContactListWrapper>
        ) : (
          <ContactListEmptyWrapper>
            <div>
              No contacts found. Would you like to
              {' '}
              <Link className="u-link-color" to={this.getImportContactsLink()}>import contacts</Link>
              ?
            </div>
          </ContactListEmptyWrapper>
        )}
        <div id="showMoreItemsId" />
      </SuggestedContactListControllerWrapper>
    );
  }
}
SuggestedContactListWithController.propTypes = {
  askMode: PropTypes.bool,
  messageToFriendsInputOff: PropTypes.bool,
  remindMode: PropTypes.bool,
};

const ContactListEmptyWrapper = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const ContactListWrapper = styled('div')`
  width: 100%;
`;

const ContactsFoundText = styled('div')`
  color: #999;
  font-size: 16px;
  // margin-top: 42px;
  padding: 0 13px;
`;

const MessageToSendWrapper = styled('div')`
  margin-top: 4px;
  width: 100%;
`;

const SuggestedContactListControllerWrapper = styled('div')`
`;

const SuggestedContactListOuterWrapper = styled('div')`
  margin-top: 24px;
`;

export default SuggestedContactListWithController;
