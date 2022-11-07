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
import AppObservableStore from '../../stores/AppObservableStore';
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
const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ '../SignIn/SignInOptionsPanel'));

const addressBookSVG = '../../../img/get-started/address-book.svg';

const NUMBER_OF_CONTACTS_WITH_ACCOUNT_NAMES_TO_SHOW = 7; // Maximum available coming from API server is currently 5
const NUMBER_OF_CONTACTS_WITH_ACCOUNT_IMAGES_TO_SHOW = 7; // Maximum available coming from API server is currently 5


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
      contactsWithAccountList,
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
    const { contactsWithAccountCount, contactsWithAccountList, voterContactEmailAugmentSequenceHasNextStep, voterContactEmailListCount } = this.state;
    const addressBookSVGSrc = normalizedImagePath(addressBookSVG);

    const desktopInlineButtonsOnInMobile = true;
    let desktopInlineButtonsOnBreakValue;
    if (desktopInlineButtonsOnInMobile) {
      desktopInlineButtonsOnBreakValue = 1;
    } else {
      desktopInlineButtonsOnBreakValue = isCordovaWide() ? 1000 : 'sm';
    }
    let isFirst;
    let contactWithAccountImageCount = 0;
    let contactWithAccountNameCount = 0;
    let contactsWithAccountNameList = <></>;
    let contactsWithAccountTotalNumber = 0;
    if (contactsWithAccountList) {
      contactsWithAccountTotalNumber = contactsWithAccountList.length;
    }
    let contactsImageHtmlArray = <></>;
    if (contactsWithAccountList) {
      const contactsWithAccountListSorted = contactsWithAccountList.sort(this.orderByPhotoExists);
      contactsWithAccountNameList = (
        <FriendNamesWrapper>
          {contactsWithAccountListSorted.map((contactWithAccount) => {
            // console.log('organization:', organization);
            if (contactWithAccount.display_name) {
              contactWithAccountNameCount += 1;
              if (contactWithAccountNameCount <= NUMBER_OF_CONTACTS_WITH_ACCOUNT_NAMES_TO_SHOW) {
                return (
                  <OneFriendName key={`ContactWithAccountImage-${contactWithAccount.voter_we_vote_id}-${contactWithAccountNameCount}`}>
                    {((contactWithAccountNameCount > 1) && (contactWithAccountNameCount === contactsWithAccountTotalNumber)) && (
                      <> and </>
                    )}
                    {contactWithAccount.display_name}
                    {(contactWithAccountNameCount < (contactsWithAccountTotalNumber - 1)) && (
                      <>, </>
                    )}
                  </OneFriendName>
                );
              } else if (contactWithAccountNameCount === (NUMBER_OF_CONTACTS_WITH_ACCOUNT_NAMES_TO_SHOW + 1)) {
                return (
                  <span className="u-no-break" key={`ContactWithAccountImage-${contactWithAccount.voter_we_vote_id}-${contactWithAccountNameCount}`}>
                    and
                    {' '}
                    {contactsWithAccountTotalNumber - contactWithAccountNameCount + 1}
                    {' '}
                    more.
                  </span>
                );
              } else {
                return null;
              }
            } else {
              return null;
            }
          })}
        </FriendNamesWrapper>
      );
      contactsImageHtmlArray = contactsWithAccountList.map((contactWithAccount) => {
        isFirst = contactWithAccountImageCount === 0;
        // console.log('organization:', organization);
        if (contactWithAccount.we_vote_hosted_profile_image_url_medium) {
          contactWithAccountImageCount += 1;
          if (contactWithAccountImageCount <= NUMBER_OF_CONTACTS_WITH_ACCOUNT_IMAGES_TO_SHOW) {
            return (
              <ContactWithAccountImage
                alt=""
                isFirst={isFirst}
                key={`ContactWithAccountImage-${contactWithAccountImageCount}`}
                contactWithAccountImageCount={contactWithAccountImageCount}
                src={contactWithAccount.we_vote_hosted_profile_image_url_medium}
                title={contactWithAccount.display_name}
              />
            );
          } else {
            return null;
          }
        } else {
          return null;
        }
      });
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
            {(contactsWithAccountCount > 0) && (
              <ContactsWithAccountWrapper>
                <ContactWithAccountsBlockWrapper>
                  {(contactWithAccountImageCount > 0) && (
                    <ContactWithAccountPreviewListImages>
                      {contactsImageHtmlArray.map((contactWithAccountImageHtml) => contactWithAccountImageHtml)}
                    </ContactWithAccountPreviewListImages>
                  )}
                  {contactsWithAccountNameList}
                </ContactWithAccountsBlockWrapper>
              </ContactsWithAccountWrapper>
            )}
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

const ContactsWithAccountWrapper = styled('div')`
`;

const ContactWithAccountPreviewListImages = styled('div')`
  align-items: center;
  display: flex;
  justify-content: start;
  margin-right: 2px;
`;

const ContactWithAccountsBlockWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  justify-content: center;
  margin-top: -3px;
`;

const ContactWithAccountImage = styled('img', {
  shouldForwardProp: (prop) => !['isFirst', 'contactWithAccountImageCount'].includes(prop),
})(({ isFirst, contactWithAccountImageCount }) => (`
  border: 2px solid #fff;
  border-radius: 24px;
  height: 48px;
  margin-top: 3px;
  ${!isFirst ? 'margin-left: -8px;' : ''}
  width: 48px;
  z-index: ${200 - contactWithAccountImageCount};
`));

const FriendNamesWrapper = styled('div')`
  color: #2E3C5D;
  font-size: 20px;
  text-align: center;
`;

const OneFriendName = styled('span')`
`;

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
