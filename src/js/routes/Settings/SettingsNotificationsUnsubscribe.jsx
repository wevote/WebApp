import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { MailOutline, PhoneAndroid, Settings } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import VoterActions from '../../actions/VoterActions';
import LoadingWheel from '../../components/LoadingWheel';
import BrowserPushMessage from '../../components/Widgets/BrowserPushMessage';
import webAppConfig from '../../config';
import VoterConstants from '../../constants/VoterConstants';
import VoterStore from '../../stores/VoterStore';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;


class SettingsNotificationsUnsubscribe extends Component {
  constructor (props) {
    super(props);
    this.state = {
      emailSubscriptionSecretKey: '',
      // friendOpinionsOtherRegions: false,
      friendOpinionsOtherRegionsEmail: false,
      friendOpinionsOtherRegionsSms: false,
      friendOpinionsYourBallotEmail: false,
      friendOpinionsYourBallotSms: false,
      // friendRequestsEmail: false,
      newsletterOptIn: false,
      notificationsSavedStatus: '',
      smsSubscriptionSecretKey: '',
      // suggestedFriendsEmail: false,
      voterDailySummaryEmail: false,
      voterDailySummarySms: false,
    };
    this.updateNotificationSettings = this.updateNotificationSettings.bind(this);
  }

  // Set up this component upon first entry
  // componentWillMount is used in WebApp
  componentDidMount () {
    // console.log('SignIn componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    let emailSubscriptionSecretKey = '';
    let smsSubscriptionSecretKey = '';
    const { match: { params } } = this.props;
    if (params) {
      if (params.email_subscription_secret_key) {
        emailSubscriptionSecretKey = params.email_subscription_secret_key;
        this.setState({
          emailSubscriptionSecretKey,
        });
        AnalyticsActions.saveActionUnsubscribeEmailPage(VoterStore.electionId());
      } else if (params.sms_subscription_secret_key) {
        smsSubscriptionSecretKey = params.sms_subscription_secret_key;
        this.setState({
          smsSubscriptionSecretKey,
        });
        AnalyticsActions.saveActionUnsubscribeSmsPage(VoterStore.electionId());
      }
    }
    // Retrieve the current settings values
    VoterActions.voterNotificationSettingsUpdateFromSecretKey(emailSubscriptionSecretKey, smsSubscriptionSecretKey);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.timer) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onVoterStoreChange () {
    const voterNotificationSettingsUpdateStatus = VoterStore.getVoterNotificationSettingsUpdateStatus();
    // console.log('onVoterStoreChange voterNotificationSettingsUpdateStatus:', voterNotificationSettingsUpdateStatus);
    let apiResponseReceived = false;
    let emailFound = false;
    let normalizedEmailAddressExists = false;
    let normalizedEmailAddress = '';
    let voterFound = false;
    if (voterNotificationSettingsUpdateStatus && voterNotificationSettingsUpdateStatus.apiResponseReceived) {
      ({ apiResponseReceived, emailFound, normalizedEmailAddress, voterFound } = voterNotificationSettingsUpdateStatus);
      normalizedEmailAddressExists = true;

      // Now set individual flag states
      const friendOpinionsOtherRegionsEmail = VoterStore.getNotificationSettingsFlagStateFromSecretKey(VoterConstants.NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS_EMAIL);
      const friendOpinionsYourBallotEmail = VoterStore.getNotificationSettingsFlagStateFromSecretKey(VoterConstants.NOTIFICATION_FRIEND_OPINIONS_YOUR_BALLOT_EMAIL);
      const voterDailySummaryEmail = VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_VOTER_DAILY_SUMMARY_EMAIL);
      const newsletterOptIn = VoterStore.getNotificationSettingsFlagStateFromSecretKey(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);

      this.setState({
        friendOpinionsOtherRegionsEmail,
        friendOpinionsYourBallotEmail,
        voterDailySummaryEmail,
        newsletterOptIn,
      });
    }
    this.setState({
      apiResponseReceived,
      emailFound,
      normalizedEmailAddress,
      normalizedEmailAddressExists,
      voterFound,
    });
  }

  // NOTIFICATION_FRIEND_REQUESTS: n/a, // In App: "New friend requests, and responses to your requests"
  // NOTIFICATION_FRIEND_REQUESTS_EMAIL: 2, // Email: "New friend requests, and responses to your requests"
  // NOTIFICATION_FRIEND_REQUESTS_SMS: 4, // SMS: "New friend requests, and responses to your requests"
  // NOTIFICATION_SUGGESTED_FRIENDS: n/a, // In App: "Suggestions of people you may know"
  // NOTIFICATION_SUGGESTED_FRIENDS_EMAIL: 8, // Email: "Suggestions of people you may know"
  // NOTIFICATION_SUGGESTED_FRIENDS_SMS: 16, // SMS: "Suggestions of people you may know"
  // NOTIFICATION_FRIEND_OPINIONS_YOUR_BALLOT: n/a, // In App: "Friends' opinions (on your ballot)"
  // NOTIFICATION_FRIEND_OPINIONS_YOUR_BALLOT_EMAIL: 32, // Email: "Friends' opinions (on your ballot)"
  // NOTIFICATION_FRIEND_OPINIONS_YOUR_BALLOT_SMS: 64, // SMS: "Friends' opinions (on your ballot)"
  // NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS: 128, // In App: "Friends' opinions (other regions)"
  // NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS_EMAIL: 256, // Email: "Friends' opinions (other regions)"
  // NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS_SMS: 512, // SMS: "Friends' opinions (other regions)"
  // NOTIFICATION_VOTER_DAILY_SUMMARY = n/a  # In App: When a friend posts something, or reacts to another post
  // NOTIFICATION_VOTER_DAILY_SUMMARY_EMAIL = 1024  # Email: When a friend posts something, or reacts to another post
  // NOTIFICATION_VOTER_DAILY_SUMMARY_SMS = 2048  # SMS: When a friend posts something, or reacts to another post
  updateNotificationSettings (event) {
    let notificationsSavedStatusDisplay = true;
    // if (event.target.name === 'friendRequestsEmail') {
    //   this.voterUpdateNotificationSettingsFlags(event.target.checked, VoterConstants.NOTIFICATION_FRIEND_REQUESTS_EMAIL);
    //   this.setState({ friendRequestsEmail: (event.target.checked) });
    // } else if (event.target.name === 'suggestedFriendsEmail') {
    //   this.voterUpdateNotificationSettingsFlags(event.target.checked, VoterConstants.NOTIFICATION_SUGGESTED_FRIENDS_EMAIL);
    //   this.setState({ suggestedFriendsEmail: (event.target.checked) });
    // } else
    if (event.target.name === 'friendOpinionsYourBallotEmail') {
      this.voterUpdateNotificationSettingsFlags(event.target.checked, VoterConstants.NOTIFICATION_FRIEND_OPINIONS_YOUR_BALLOT_EMAIL);
      this.setState({ friendOpinionsYourBallotEmail: (event.target.checked) });
    } else if (event.target.name === 'friendOpinionsOtherRegions') {
      this.voterUpdateNotificationSettingsFlags(event.target.checked, VoterConstants.NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS);
      // this.setState({ friendOpinionsOtherRegions: (event.target.checked) });
    } else if (event.target.name === 'friendOpinionsOtherRegionsEmail') {
      this.voterUpdateNotificationSettingsFlags(event.target.checked, VoterConstants.NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS_EMAIL);
      this.setState({ friendOpinionsOtherRegionsEmail: (event.target.checked) });
    } else if (event.target.name === 'voterDailySummaryEmail') {
      this.voterUpdateNotificationSettingsFlags(event.target.checked, VoterConstants.NOTIFICATION_VOTER_DAILY_SUMMARY_EMAIL);
      this.setState({ voterDailySummaryEmail: (event.target.checked) });
    } else if (event.target.name === 'newsletterOptIn') {
      this.voterUpdateNotificationSettingsFlags(event.target.checked, VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
      this.setState({ newsletterOptIn: (event.target.checked) });
    } else {
      notificationsSavedStatusDisplay = false;
    }
    if (notificationsSavedStatusDisplay) {
      this.setState({ notificationsSavedStatus: 'Saved' });

      if (this.timer) clearTimeout(this.timer);
      const delayBeforeClear = 2000;
      this.timer = setTimeout(() => {
        this.setState({ notificationsSavedStatus: '' });
      }, delayBeforeClear);
    }
  }

  voterUpdateNotificationSettingsFlags (checked, selectedVoterConstant) {
    const { emailSubscriptionSecretKey, smsSubscriptionSecretKey } = this.state;
    if (checked) {
      VoterActions.voterNotificationSettingsUpdateFromSecretKey(emailSubscriptionSecretKey, smsSubscriptionSecretKey, selectedVoterConstant);
    } else {
      VoterActions.voterNotificationSettingsUpdateFromSecretKey(emailSubscriptionSecretKey, smsSubscriptionSecretKey, VoterConstants.NOTIFICATION_ZERO, selectedVoterConstant);
    }
  }

  render () {
    renderLog('SettingsNotificationsUnsubscribe');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      apiResponseReceived,
      emailFound,
      friendOpinionsYourBallotEmail, friendOpinionsYourBallotSms,
      // friendOpinionsOtherRegions,
      friendOpinionsOtherRegionsEmail, friendOpinionsOtherRegionsSms,
      voterDailySummaryEmail, voterDailySummarySms,
      // friendRequestsEmail,
      friendRequestsSms,
      newsletterOptIn,
      normalizedEmailAddress, normalizedEmailAddressExists,
      // normalizedSmsPhoneNumber,
      normalizedSmsPhoneNumberExists,
      notificationsSavedStatus,
      // suggestedFriendsEmail, // suggestedFriendsSms,
      voterFound,
    } = this.state;
    if (!apiResponseReceived) {
      return LoadingWheel;
    }

    if (!voterFound && !emailFound) {
      return (
        <Wrapper>
          <Helmet title="Notification Settings - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <ContentArea className="card">
            <div className="card-main">
              <div className="h2">
                Could Not Find Notification Settings
              </div>
              <ViewOnWeVoteWrapper>
                <Button
                  classes={{ root: classes.ballotButtonRoot }}
                  color="primary"
                  variant="contained"
                  onClick={() => historyPush('/settings/notifications')}
                >
                  <Settings classes={{ root: classes.ballotButtonIconRoot }} />
                  View on We Vote
                </Button>
              </ViewOnWeVoteWrapper>
            </div>
          </ContentArea>
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <Helmet title="Notification Settings - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <ContentArea className="card">
          <div className="card-main">
            <div>
              <HeaderWrapper>
                <div className="h2">
                  Notification Settings
                  {normalizedEmailAddressExists && (
                    <>
                      {' '}
                      for
                      {' '}
                      <strong>{normalizedEmailAddress}</strong>
                    </>
                  )}
                </div>
              </HeaderWrapper>
              {normalizedEmailAddressExists && (
                <IntroductionText>
                  <div>
                    <strong>
                      Not your email address?
                    </strong>
                    {' '}
                    This message was probably forwarded to you from a friend.
                    {' '}
                    Instead of making changes here, please contact them directly to stop receiving forwarded emails.
                  </div>
                </IntroductionText>
              )}
              <TableContainer>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell classes={{ root: classes.tableCellDescription }}>
                        <div className="u-gray-mid">{notificationsSavedStatus}</div>
                      </TableCell>
                      {normalizedEmailAddressExists && (
                        <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                          <ColumnIcon>
                            <MailOutline classes={{ root: classes.emailIconRoot }} />
                          </ColumnIcon>
                          <ColumnLabel>Email</ColumnLabel>
                        </TableCell>
                      )}
                      {normalizedSmsPhoneNumberExists && (
                        <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                          <PhoneAndroid classes={{ root: classes.smsIconRoot }} />
                          <ColumnLabel>SMS</ColumnLabel>
                        </TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* ************************************ */}
                    {/* *** NOTIFICATION_FRIEND_REQUESTS *** */}
                    <TableRow key="tableRow-friendRequests">
                      <TableCell
                        classes={{ root: classes.tableCellDescription }}
                        component="th"
                        scope="row"
                      >
                        <span className="u-show-mobile">
                          <span className="u-no-break">Friend requests</span>
                        </span>
                        <span className="u-show-desktop-tablet">
                          New friend requests, and responses to your requests
                        </span>
                      </TableCell>
                      {normalizedEmailAddressExists && (
                        <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                          <input
                            aria-label="email friend requests"
                            checked
                            disabled
                            type="checkbox"
                          />
                          {/* <input */}
                          {/*  aria-label="email friend requests" */}
                          {/*  id="friendRequestsEmail" */}
                          {/*  type="checkbox" */}
                          {/*  name="friendRequestsEmail" */}
                          {/*  onChange={this.updateNotificationSettings} */}
                          {/*  checked={friendRequestsEmail} */}
                          {/* /> */}
                        </TableCell>
                      )}
                      {normalizedSmsPhoneNumberExists && (
                        <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                          <input
                            aria-label="text friend requests"
                            id="friendRequestsSms"
                            type="checkbox"
                            name="friendRequestsSms"
                            onChange={this.updateNotificationSettings}
                            checked={friendRequestsSms}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                    {/* ************************************** */}
                    {/* *** NOTIFICATION_SUGGESTED_FRIENDS *** */}
                    {/* <TableRow key="tableRow-suggestedFriends"> */}
                    {/*  <TableCell */}
                    {/*    classes={{ root: classes.tableCellDescription }} */}
                    {/*    component="th" */}
                    {/*    scope="row" */}
                    {/*  > */}
                    {/*    <span className="u-show-mobile"> */}
                    {/*      <span className="u-no-break">Suggested friends</span> */}
                    {/*    </span> */}
                    {/*    <span className="u-show-desktop-tablet"> */}
                    {/*      Suggestions of people you may know */}
                    {/*    </span> */}
                    {/*  </TableCell> */}
                    {/*  <TableCell align="center" classes={{ root: classes.tableCellColumn }}> */}
                    {/*    <input */}
                    {/*      aria-label="show suggested friends in app" */}
                    {/*      checked */}
                    {/*      disabled */}
                    {/*      type="checkbox" */}
                    {/*    /> */}
                    {/*  </TableCell> */}
                    {/*  <TableCell align="center" classes={{ root: classes.tableCellColumn }}> */}
                    {/*    <input */}
                    {/*      aria-label="email suggested friends notices" */}
                    {/*      id="suggestedFriendsEmail" */}
                    {/*      type="checkbox" */}
                    {/*      name="suggestedFriendsEmail" */}
                    {/*      onChange={this.updateNotificationSettings} */}
                    {/*      checked={suggestedFriendsEmail} */}
                    {/*    /> */}
                    {/*  </TableCell> */}
                    {/*  /!* <TableCell align="center" classes={{ root: classes.tableCellColumn }}> *!/ */}
                    {/*  /!*  <input *!/ */}
                    {/*  /!*    aria-label="text suggested friends notices" *!/ */}
                    {/*  /!*    id="suggestedFriendsSms" *!/ */}
                    {/*  /!*    type="checkbox" *!/ */}
                    {/*  /!*    name="suggestedFriendsSms" *!/ */}
                    {/*  /!*    onChange={this.updateNotificationSettings} *!/ */}
                    {/*  /!*    checked={suggestedFriendsSms} *!/ */}
                    {/*  /!*  /> *!/ */}
                    {/*  /!* </TableCell> *!/ */}
                    {/* </TableRow> */}
                    {/* ************************************************ */}
                    {/* *** NOTIFICATION_FRIEND_OPINIONS_YOUR_BALLOT *** */}
                    {nextReleaseFeaturesEnabled && (
                      <TableRow key="tableRow-friendOpinionsYourBallot">
                        <TableCell
                          classes={{ root: classes.tableCellDescription }}
                          component="th"
                          scope="row"
                        >
                          <span className="u-show-mobile">
                            <span className="u-no-break">Friends&apos; opinions</span>
                            {' '}
                            <span className="u-no-break">(your ballot)</span>
                          </span>
                          <span className="u-show-desktop-tablet">
                            <span className="u-no-break">Friends&apos; opinions</span>
                            {' '}
                            <span className="u-no-break">(on your ballot)</span>
                          </span>
                        </TableCell>
                        {normalizedEmailAddressExists && (
                          <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                            <input
                              aria-label="email friends opinions from your ballot"
                              id="friendOpinionsYourBallotEmail"
                              type="checkbox"
                              name="friendOpinionsYourBallotEmail"
                              onChange={this.updateNotificationSettings}
                              checked={friendOpinionsYourBallotEmail}
                            />
                          </TableCell>
                        )}
                        {normalizedSmsPhoneNumberExists && (
                          <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                            <input
                              aria-label="text friends opinions from your ballot"
                              id="friendOpinionsYourBallotSms"
                              type="checkbox"
                              name="friendOpinionsYourBallotSms"
                              onChange={this.updateNotificationSettings}
                              checked={friendOpinionsYourBallotSms}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    )}
                    {/* ************************************************** */}
                    {/* *** NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS *** */}
                    <TableRow key="tableRow-friendOpinionsOtherRegions">
                      <TableCell
                        classes={{ root: classes.tableCellDescription }}
                        component="th"
                        scope="row"
                      >
                        <span className="u-no-break">Friends&apos; opinions</span>
                        {' '}
                        <span className="u-no-break">(all regions)</span>
                      </TableCell>
                      {normalizedEmailAddressExists && (
                        <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                          <input
                            aria-label="email friends opinions from all regions"
                            id="friendOpinionsOtherRegionsEmail"
                            type="checkbox"
                            name="friendOpinionsOtherRegionsEmail"
                            onChange={this.updateNotificationSettings}
                            checked={friendOpinionsOtherRegionsEmail}
                          />
                        </TableCell>
                      )}
                      {normalizedSmsPhoneNumberExists && (
                        <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                          <input
                            aria-label="text friends opinions from all regions"
                            id="friendOpinionsOtherRegionsSms"
                            type="checkbox"
                            name="friendOpinionsOtherRegionsSms"
                            onChange={this.updateNotificationSettings}
                            checked={friendOpinionsOtherRegionsSms}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                    {/* *************************************** */}
                    {/* *** NOTIFICATION_VOTER_DAILY_SUMMARY *** */}
                    <TableRow key="tableRow-voterDailySummary">
                      <TableCell
                        classes={{ root: classes.tableCellDescription }}
                        component="th"
                        scope="row"
                      >
                        <span className="u-no-break">Friends&apos; activity,</span>
                        {' '}
                        <span className="u-no-break">summarized daily</span>
                      </TableCell>
                      {normalizedEmailAddressExists && (
                        <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                          <input
                            aria-label="email summary of friends' posts, daily"
                            id="voterDailySummaryEmail"
                            type="checkbox"
                            name="voterDailySummaryEmail"
                            onChange={this.updateNotificationSettings}
                            checked={voterDailySummaryEmail}
                          />
                        </TableCell>
                      )}
                      {normalizedSmsPhoneNumberExists && (
                        <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                          <input
                            aria-label="text friends opinions from all regions"
                            id="voterDailySummarySms"
                            type="checkbox"
                            name="voterDailySummarySms"
                            onChange={this.updateNotificationSettings}
                            checked={voterDailySummarySms}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                    {/* ************************************** */}
                    {/* *** NOTIFICATION_NEWSLETTER_OPT_IN *** */}
                    {normalizedEmailAddressExists && (
                      <TableRow key="tableRow-newsletterOptIn">
                        <TableCell
                          classes={{ root: classes.tableCellDescription }}
                          component="th"
                          scope="row"
                        >
                          <span className="u-show-mobile">
                            We Vote Newsletter
                          </span>
                          <span className="u-show-desktop-tablet">
                            I would like to receive the We Vote newsletter
                          </span>
                        </TableCell>
                        <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                          <input
                            aria-label="email we vote newsletter"
                            id="newsletterOptIn"
                            type="checkbox"
                            name="newsletterOptIn"
                            onChange={this.updateNotificationSettings}
                            checked={newsletterOptIn}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <ViewOnWeVoteWrapper>
                <Button
                  classes={{ root: classes.ballotButtonRoot }}
                  color="primary"
                  variant="contained"
                  onClick={() => historyPush('/settings/notifications')}
                >
                  <Settings classes={{ root: classes.ballotButtonIconRoot }} />
                  View on We Vote
                </Button>
              </ViewOnWeVoteWrapper>
            </div>
          </div>
        </ContentArea>
      </Wrapper>
    );
  }
}
SettingsNotificationsUnsubscribe.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = () => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  ballotButtonRoot: {
    width: 250,
  },
  emailIconRoot: {
    color: 'rgb(171, 177, 191)',
  },
  notificationsIconRoot: {
    color: 'rgb(171, 177, 191)',
  },
  settingsIcon: {
    color: '#999',
    marginTop: '-5px',
    marginLeft: '3px',
    width: 16,
    height: 16,
  },
  smsIconRoot: {
    color: 'rgb(171, 177, 191)',
  },
  tableCellColumn: {
    paddingTop: 0,
    paddingRight: 6,
    paddingBottom: 0,
    paddingLeft: 6,
  },
  tableCellDescription: {
    paddingLeft: 0,
    paddingRight: 6,
  },
});

const ColumnIcon = styled.div`
  margin-bottom: 0px !important;
`;

const ColumnLabel = styled.div`
  color: #999;
  font-size: 10px;
  margin-top: -5px;
`;

const ContentArea = styled.div`
  max-width: 750px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const IntroductionText = styled.div`
  margin-top: 0px;
  margin-bottom: 0px;
`;

const ViewOnWeVoteWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 15px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-left: 15px;
  margin-right: 15px;
`;

export default withStyles(styles)(SettingsNotificationsUnsubscribe);
