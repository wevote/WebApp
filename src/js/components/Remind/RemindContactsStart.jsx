import withStyles from '@mui/styles/withStyles';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import BallotActions from '../../actions/BallotActions';
import VoterActions from '../../actions/VoterActions';
import { publicFigureQuotes } from '../../common/constants/whyVoteQuotes';
import apiCalming from '../../common/utils/apiCalming';
import { isCordovaWide } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import DownloadAppsButtons from './DownloadAppsButtons';
import WhyVoteQuote from './WhyVoteQuote';
import Reassurance from '../SetUpAccount/Reassurance';
import { reassuranceTextRemindContacts } from './reassuranceTextRemindContacts';
import NextStepButtons from '../FriendIntro/NextStepButtons';
import AppObservableStore from '../../stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import {
  DesktopNextButtonsInnerWrapper, DesktopNextButtonsOuterWrapperUShowDesktopTablet,
} from '../Style/NextButtonStyles';
import { RemindContactsImportText, RemindMainImageImg } from '../Style/RemindStyles';
import {
  SetUpAccountContactsTextWrapper,
  SetUpAccountTitle,
} from '../Style/SetUpAccountStyles';
import SuggestedContactListWithController from '../Friends/SuggestedContactListWithController';

const AddContactsFromGoogleButton = React.lazy(() => import(/* webpackChunkName: 'AddContactsFromGoogleButton' */ '../SetUpAccount/AddContactsFromGoogleButton'));
const MessageToFriendInputField = React.lazy(() => import(/* webpackChunkName: 'MessageToFriendInputField' */ '../Friends/MessageToFriendInputField'));

const addressBookSVG = '../../../img/get-started/address-book.svg';


class RemindContactsStart extends Component {
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
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();
    this.setState({
      voterContactEmailListCount,
    });
  }

  goToAddContactsManually = () => {
    historyPush('/remind/addcontacts');
  }

  goToImportContacts = () => {
    const { location: { pathname: currentPathname } } = window;
    AppObservableStore.setSetUpAccountBackLinkPath(currentPathname);
    const setUpAccountEntryPath = '/remind/importcontacts';
    AppObservableStore.setSetUpAccountEntryPath(setUpAccountEntryPath);
    historyPush(setUpAccountEntryPath);
  }

  goToEditMessage = () => {
    const { location: { pathname: currentPathname } } = window;
    AppObservableStore.setSetUpAccountBackLinkPath(currentPathname);
    const setUpAccountEntryPath = '/remind/message';
    AppObservableStore.setSetUpAccountEntryPath(setUpAccountEntryPath);
    historyPush(setUpAccountEntryPath);
  }

  render () {
    renderLog('RemindContactsStart');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { voterContactEmailListCount } = this.state;
    const addressBookSVGSrc = normalizedImagePath(addressBookSVG);

    const desktopInlineButtonsOnInMobile = true;
    let desktopInlineButtonsOnBreakValue;
    if (desktopInlineButtonsOnInMobile) {
      desktopInlineButtonsOnBreakValue = 1;
    } else {
      desktopInlineButtonsOnBreakValue = isCordovaWide() ? 1000 : 'sm';
    }
    const pigsCanFly = false;
    const startWithImportContacts = false;
    const testQuotes = true;
    return (
      <>
        {(voterContactEmailListCount > 0) ? (
          <RemindContactsStartWithContactsWrapper>
            <SetUpAccountTitle>
              Remind 3 of your friends
              {' '}
              <span className="u-no-break">
                to vote today
              </span>
            </SetUpAccountTitle>
            <div>
              <SuggestedContactListWithController remindMode />
            </div>
          </RemindContactsStartWithContactsWrapper>
        ) : (
          <>
            {testQuotes ? (
              <RemindContactsStartWrapper>
                <SetUpAccountTitle>
                  Remind 3 of your friends
                  {' '}
                  <span className="u-no-break">
                    to vote today
                  </span>
                </SetUpAccountTitle>
                <SetUpAccountContactsTextWrapper>
                  <RemindContactsImportText>
                    Polls predict fewer than 50% of eligible Americans will vote in the next election.
                    {' '}
                    <span className="u-no-break">
                      Let&apos;s change that!
                    </span>
                  </RemindContactsImportText>
                </SetUpAccountContactsTextWrapper>
                <DesktopNextButtonsOuterWrapperUShowDesktopTablet>
                  <DesktopNextButtonsInnerWrapper>
                    <NextStepButtons
                      classes={classes}
                      desktopMode
                      nextStepButtonText="Get started" // Choose friends to remind
                      onClickNextButton={this.goToEditMessage}
                      skipForNowOff
                    />
                  </DesktopNextButtonsInnerWrapper>
                </DesktopNextButtonsOuterWrapperUShowDesktopTablet>
                <WhyVoteQuoteBlockOuterWrapper>
                  <WhyVoteQuoteBlock>
                    {publicFigureQuotes.map((oneQuote) => (
                      <WhyVoteQuote
                        key={`whyVoteQuote-${oneQuote.testimonialAuthor}`}
                        imageUrl={oneQuote.imageUrl}
                        testimonial={oneQuote.testimonial}
                        testimonialAuthor={oneQuote.testimonialAuthor}
                      />
                    ))}
                  </WhyVoteQuoteBlock>
                </WhyVoteQuoteBlockOuterWrapper>
              </RemindContactsStartWrapper>
            ) : (
              <RemindContactsStartWrapper>
                <SetUpAccountTitle>
                  Remind 3 of your friends
                  {' '}
                  <span className="u-no-break">
                    to vote today
                  </span>
                </SetUpAccountTitle>
                <SetUpAccountContactsTextWrapper>
                  <RemindContactsImportText>
                    Polls predict fewer than 50% of eligible Americans will vote in the next election.
                    {' '}
                    <span className="u-no-break">
                      Let&apos;s change that!
                    </span>
                    {!startWithImportContacts && (
                      <>
                        <br />
                        <br />
                        Personalized messages work best.
                      </>
                    )}
                  </RemindContactsImportText>
                </SetUpAccountContactsTextWrapper>
                {startWithImportContacts ? (
                  <>
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
                          onClick={this.goToAddContactsManually}
                        >
                          Or add contacts manually
                        </Button>
                      </DesktopNextButtonsInnerWrapper>
                    </DesktopNextButtonsOuterWrapperUShowDesktopTablet>
                    <Reassurance displayState={1} reassuranceText={reassuranceTextRemindContacts} />
                    {(isWebApp() && pigsCanFly) && (
                      <DownloadAppsButtons />
                    )}
                  </>
                ) : (
                  <>
                    <MessageToSendWrapper>
                      <Suspense fallback={<></>}>
                        <MessageToFriendInputField messageToFriendType="remindContacts" />
                      </Suspense>
                    </MessageToSendWrapper>
                    <DesktopNextButtonsOuterWrapperUShowDesktopTablet>
                      <DesktopNextButtonsInnerWrapper>
                        <NextStepButtons
                          classes={classes}
                          desktopMode
                          nextStepButtonText="Choose who to remind"
                          onClickNextButton={this.goToImportContacts}
                          skipForNowOff
                        />
                      </DesktopNextButtonsInnerWrapper>
                    </DesktopNextButtonsOuterWrapperUShowDesktopTablet>
                  </>
                )}
              </RemindContactsStartWrapper>
            )}
          </>
        )}
      </>
    );
  }
}
RemindContactsStart.propTypes = {
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

const MessageToSendWrapper = styled('div')`
  margin-top: 24px;
  margin-bottom: 24px;
  width: 100%;
`;

const RemindContactsStartWithContactsWrapper = styled('div')`
  margin-bottom: 48px;
  margin-top: 36px;
`;

const RemindContactsStartWrapper = styled('div')`
  margin-bottom: 48px;
  margin-top: 36px;
`;

const WhyVoteQuoteBlock = styled('div')`
  max-width: 450px;
`;

const WhyVoteQuoteBlockOuterWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
  margin-top: 36px;
  width: 100%;
`;

export default withStyles(styles)(RemindContactsStart);
