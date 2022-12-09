import withStyles from '@mui/styles/withStyles';
import { Button } from '@mui/material';
import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import BallotActions from '../../actions/BallotActions';
import VoterActions from '../../actions/VoterActions';
import apiCalming from '../../common/utils/apiCalming';
import { isCordovaWide } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import DownloadAppsButtons from '../Remind/DownloadAppsButtons';
import Reassurance from '../SetUpAccount/Reassurance';
import { reassuranceTextRemindContacts } from '../Remind/reassuranceTextRemindContacts';
// import NextStepButtons from '../FriendIntro/NextStepButtons';
import AppObservableStore from '../../common/stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import {
  DesktopNextButtonsInnerWrapper, DesktopNextButtonsOuterWrapperUShowDesktopTablet,
} from '../Style/NextButtonStyles';
import { RemindContactsImportText, RemindMainImageImg } from '../Style/RemindStyles';
import {
  SetUpAccountContactsText,
  SetUpAccountContactsTextWrapper,
  SetUpAccountTitle, SetUpAccountTop,
} from '../Style/SetUpAccountStyles';

const AddContactsFromGoogleButton = React.lazy(() => import(/* webpackChunkName: 'AddContactsFromGoogleButton' */ '../SetUpAccount/AddContactsFromGoogleButton'));
const ContactsImportedPreview = React.lazy(() => import(/* webpackChunkName: 'ContactsImportedPreview' */ './ContactsImportedPreview'));
const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ '../SignIn/SignInOptionsPanel'));

const addressBookSVG = '../../../img/get-started/address-book.svg';


class FindFriendsStart extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterContactEmailListCount: 0,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (apiCalming('friendListsAll', 30000)) {
      FriendActions.friendListsAll();
    }
    if (apiCalming('voterBallotItemsRetrieve', 120000)) {
      BallotActions.voterBallotItemsRetrieve();
    }
    if (apiCalming('voterContactListRetrieve', 20000)) {
      VoterActions.voterContactListRetrieve();
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const voterContactEmailList = VoterStore.getVoterContactEmailList();
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();
    const contactsWithAccountList = filter(voterContactEmailList, (contact) => contact.voter_we_vote_id);
    const contactsWithAccountCount = contactsWithAccountList.length;
    this.setState({
      contactsWithAccountCount,
      voterContactEmailAugmentSequenceHasNextStep: VoterStore.getVoterContactEmailAugmentSequenceHasNextStep(),
      voterContactEmailListCount,
    });
  }

  goToBeTheFirstFriend = () => {
    const { location: { pathname: currentPathname } } = window;
    AppObservableStore.setSetUpAccountBackLinkPath(currentPathname);
    const setUpAccountEntryPath = '/findfriends/signin';
    AppObservableStore.setSetUpAccountEntryPath(setUpAccountEntryPath);
    historyPush(setUpAccountEntryPath);
  }

  render () {
    renderLog('FindFriendsStart');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { contactsWithAccountCount, voterContactEmailAugmentSequenceHasNextStep, voterContactEmailListCount } = this.state;
    const addressBookSVGSrc = normalizedImagePath(addressBookSVG);

    const desktopInlineButtonsOnInMobile = true;
    let desktopInlineButtonsOnBreakValue;
    if (desktopInlineButtonsOnInMobile) {
      desktopInlineButtonsOnBreakValue = 1;
    } else {
      desktopInlineButtonsOnBreakValue = isCordovaWide() ? 1000 : 'sm';
    }
    const pigsCanFly = false;
    return (
      <>
        {(voterContactEmailListCount > 0) ? (
          <FindFriendsStartWithContactsWrapper>
            <SetUpAccountTop>
              <SetUpAccountTitle>
                {contactsWithAccountCount ? (
                  <>
                    {contactsWithAccountCount}
                    {' '}
                    of your friends
                    {' '}
                    {contactsWithAccountCount === 1 ? 'is' : 'are'}
                    {' '}
                    already on We Vote
                    {' '}
                  </>
                ) : (
                  <>
                    {voterContactEmailAugmentSequenceHasNextStep ? (
                      <>
                        Checking for your friends in
                        {' '}
                        <span className="u-no-break">We Vote...</span>
                      </>
                    ) : (
                      <>
                        We couldn&apos;t match any of your contacts with other members of
                        {' '}
                        <span className="u-no-break">We Vote</span>
                      </>
                    )}
                  </>
                )}
              </SetUpAccountTitle>
              <SetUpAccountContactsTextWrapper>
                <SetUpAccountContactsText>
                  {!!(!contactsWithAccountCount && voterContactEmailListCount) && (
                    <>
                      Be the first in your network of
                      {' '}
                      {voterContactEmailListCount}
                      {' '}
                      contacts to join We Vote.
                      <br />
                    </>
                  )}
                </SetUpAccountContactsText>
              </SetUpAccountContactsTextWrapper>
            </SetUpAccountTop>
            <Suspense fallback={<></>}>
              <ContactsImportedPreview showOnlyContactsWithAccounts />
            </Suspense>
            <SignInOptionsPanelWrapper>
              <Suspense fallback={<></>}>
                <SignInOptionsPanel
                  pleaseSignInTitle={(contactsWithAccountCount > 0) ? 'Sign in to connect with your friends' : ''}
                  pleaseSignInSubTitle={(contactsWithAccountCount > 0) ? 'After you sign in, you will be able to choose which friends to collaborate with.' : ''}
                />
              </Suspense>
            </SignInOptionsPanelWrapper>
          </FindFriendsStartWithContactsWrapper>
        ) : (
          <FindFriendsStartWrapper>
            <SetUpAccountTitle>
              Find what your friends are saying
              {' '}
              <span className="u-no-break">
                on We Vote
              </span>
            </SetUpAccountTitle>
            <SetUpAccountContactsTextWrapper>
              <RemindContactsImportText>
                It is so much easier to figure out how to vote when you see what your friends recommend. If you import your contacts,
                {' '}
                <span className="u-no-break">
                  We Vote will
                </span>
                {' '}
                find your friends and suggest connections.
              </RemindContactsImportText>
            </SetUpAccountContactsTextWrapper>
            <ImageOuterWrapper>
              <MainImageWrapper>
                <div>
                  <RemindMainImageImg src={addressBookSVGSrc} alt="" />
                </div>
              </MainImageWrapper>
            </ImageOuterWrapper>
            <div>
              <Suspense fallback={<></>}>
                <AddContactsFromGoogleButton darkButton />
              </Suspense>
            </div>
            <DesktopNextButtonsOuterWrapperUShowDesktopTablet breakValue={desktopInlineButtonsOnBreakValue}>
              <DesktopNextButtonsInnerWrapper>
                <Button
                  classes={{ root: classes.addContactsManuallyLink }}
                  onClick={this.goToBeTheFirstFriend}
                >
                  <span className="u-no-break">
                    Or be the first of your friends to join
                  </span>
                </Button>
              </DesktopNextButtonsInnerWrapper>
            </DesktopNextButtonsOuterWrapperUShowDesktopTablet>
            <Reassurance displayState={1} reassuranceText={reassuranceTextRemindContacts} />
            {(isWebApp() && pigsCanFly) && (
              <DownloadAppsButtons />
            )}
          </FindFriendsStartWrapper>
        )}
      </>
    );
  }
}
FindFriendsStart.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  addContactsManuallyLink: {
    boxShadow: 'none !important',
    color: '#065FD4',
    marginTop: 10,
    padding: '0 20px',
    textTransform: 'none',
    width: 250,
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
});

const MainImageWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const ImageOuterWrapper = styled('div')`
  margin-bottom: 24px;
  margin-top: 24px;
  width: 100%;
`;

const FindFriendsStartWithContactsWrapper = styled('div')`
  margin-bottom: 48px;
  margin-top: 36px;
`;

const FindFriendsStartWrapper = styled('div')`
  margin-bottom: 48px;
  margin-top: 36px;
`;

const SignInOptionsPanelWrapper = styled('div')(({ theme }) => (`
  margin-top: 32px;
  ${theme.breakpoints.up('sm')} {
    min-width: 500px;
  }
`));

export default withStyles(styles)(FindFriendsStart);
