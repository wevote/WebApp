import { MailOutline, Notifications, Settings, CampaignRounded } from '@mui/icons-material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import AnalyticsActions from '../../actions/AnalyticsActions';
import VoterActions from '../../actions/VoterActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import VoterConstants from '../../constants/VoterConstants';
import VoterStore from '../../stores/VoterStore';
// import { PhoneAndroid } from '@mui/icons-material';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import { openSnackbar } from '../../common/components/Widgets/SnackNotifier';
import VoterEmailAddressEntry from './VoterEmailAddressEntry';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;


class SettingsNotifications extends Component {
  constructor (props) {
    super(props);
    this.state = {
      addEmailInterfaceOpen: false,
      // friendOpinionsOtherRegions: false,
      friendOpinionsOtherRegionsEmail: false,
      friendOpinionsYourBallotEmail: false,
      // friendRequestsEmail: false,
      newsletterOptIn: false,
      notificationsSavedStatus: '',
      // suggestedFriendsEmail: false,
      voterDailySummaryEmail: false,
    };

    this.updateNotificationSettings = this.updateNotificationSettings.bind(this);
  }

  // Set up this component upon first entry
  // componentWillMount is used in WebApp
  componentDidMount () {
    // console.log('SignIn componentDidMount');
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionAccountPage(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.timer) clearTimeout(this.timer);
  }

  onVoterStoreChange () {
    if (VoterStore.isVoterFound()) {
      const friendOpinionsOtherRegionsEmail = VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS_EMAIL);
      const friendOpinionsYourBallotEmail = VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_FRIEND_OPINIONS_YOUR_BALLOT_EMAIL);
      const voterDailySummaryEmail = VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_VOTER_DAILY_SUMMARY_EMAIL);
      const newsletterOptIn = VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
      this.setState({
        friendOpinionsOtherRegionsEmail,
        friendOpinionsYourBallotEmail,
        voterDailySummaryEmail,
        newsletterOptIn,
      });
    }
    const primaryEmailAddressDict = VoterStore.getPrimaryEmailAddressDict();
    let primaryEmailAddressExists = false;
    if (primaryEmailAddressDict && primaryEmailAddressDict.normalized_email_address) {
      primaryEmailAddressExists = true;
    }
    const voter = VoterStore.getVoter();
    this.setState({
      primaryEmailAddressExists,
      voter,
    });
  }

  openAddEmailInterface = () => {
    openSnackbar({ message: 'Please enter your email address.' });
    this.setState({
      addEmailInterfaceOpen: true,
    });
  }

  // // NOTIFICATION_FRIEND_REQUESTS: n/a, // In App: "New friend requests, and responses to your requests"
  // NOTIFICATION_FRIEND_REQUESTS_EMAIL: 2, // Email: "New friend requests, and responses to your requests"
  // NOTIFICATION_FRIEND_REQUESTS_SMS: 4, // SMS: "New friend requests, and responses to your requests"
  // // NOTIFICATION_SUGGESTED_FRIENDS: n/a, // In App: "Suggestions of people you may know"
  // NOTIFICATION_SUGGESTED_FRIENDS_EMAIL: 8, // Email: "Suggestions of people you may know"
  // NOTIFICATION_SUGGESTED_FRIENDS_SMS: 16, // SMS: "Suggestions of people you may know"
  // // NOTIFICATION_FRIEND_OPINIONS_YOUR_BALLOT: n/a, // In App: "Friends' opinions (on your ballot)"
  // NOTIFICATION_FRIEND_OPINIONS_YOUR_BALLOT_EMAIL: 32, // Email: "Friends' opinions (on your ballot)"
  // NOTIFICATION_FRIEND_OPINIONS_YOUR_BALLOT_SMS: 64, // SMS: "Friends' opinions (on your ballot)"
  // NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS: 128, // In App: "Friends' opinions (other regions)"
  // NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS_EMAIL: 256, // Email: "Friends' opinions (other regions)"
  // NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS_SMS: 512, // SMS: "Friends' opinions (other regions)"
  // # NOTIFICATION_VOTER_DAILY_SUMMARY = n/a  # In App: When a friend posts something, or reacts to another post
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

      const delayBeforeClear = 2000;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.setState({ notificationsSavedStatus: '' });
      }, delayBeforeClear);
    }
  }

  voterUpdateNotificationSettingsFlags (checked, selectedVoterConstant) {
    if (checked) {
      VoterActions.voterUpdateNotificationSettingsFlags(selectedVoterConstant);
    } else {
      VoterActions.voterUpdateNotificationSettingsFlags(VoterConstants.NOTIFICATION_ZERO, selectedVoterConstant);
    }
  }

  render () {
    renderLog('SettingsNotifications');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, externalUniqueId } = this.props;
    const {
      addEmailInterfaceOpen,
      friendOpinionsYourBallotEmail, // friendOpinionsYourBallotSms,
      // friendOpinionsOtherRegions,
      friendOpinionsOtherRegionsEmail, // friendOpinionsOtherRegionsSms,
      voterDailySummaryEmail, // voterDailySummarySms,
      // friendRequestsEmail, // friendRequestsSms,
      newsletterOptIn,
      notificationsSavedStatus, primaryEmailAddressExists,
      // suggestedFriendsEmail, // suggestedFriendsSms,
      voter,
    } = this.state;
    if (!voter) {
      return LoadingWheel;
    }

    return (
      <div className="">
        <Helmet title="Notifications - WeVote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="card">
          <div className="card-main">
            <NotificationsTableWrapper>
              <HeaderWrapper>
                <NotificationsIcon />
                <h1 className="h2" id="notificationTitleText">Notification Settings</h1>
                <div className="u-gray-mid">{notificationsSavedStatus}</div>
              </HeaderWrapper>
              <TableContainer>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell classes={{ root: classes.tableCellDescription }}>
                        &nbsp;
                      </TableCell>
                      <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                        <ColumnIcon>
                          <Notifications classes={{ root: classes.notificationsIconRoot }} />
                        </ColumnIcon>
                        <ColumnLabel className="u-no-break">In App</ColumnLabel>
                      </TableCell>
                      <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                        <ColumnIcon>
                          <MailOutline classes={{ root: classes.emailIconRoot }} />
                        </ColumnIcon>
                        <ColumnLabel>Email</ColumnLabel>
                      </TableCell>
                      {/* <TableCell align="center" classes={{ root: classes.tableCellColumn }}> */}
                      {/*  <PhoneAndroid classes={{ root: classes.smsIconRoot }} /> */}
                      {/*  <ColumnLabel>SMS</ColumnLabel> */}
                      {/* </TableCell> */}
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
                        <span className="u-show-desktop-tablet" id = "newFriendRequest_notification">
                          New friend requests, and responses to your requests
                        </span>
                      </TableCell>
                      <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                        <input
                          aria-label="show friend requests in app"
                          checked
                          disabled
                          type="checkbox"
                        />
                      </TableCell>
                      <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                        {primaryEmailAddressExists ? (
                          <input
                            aria-label="email friend requests"
                            checked
                            disabled
                            type="checkbox"
                          />
                        ) : (
                          <SettingsIconWrapper>
                            <Settings classes={{ root: classes.settingsIcon }} onClick={this.openAddEmailInterface} />
                          </SettingsIconWrapper>
                        )}
                        {/* <input */}
                        {/*  aria-label="text friend requests" */}
                        {/*  id="friendRequestsEmail" */}
                        {/*  type="checkbox" */}
                        {/*  name="friendRequestsEmail" */}
                        {/*  onChange={this.updateNotificationSettings} */}
                        {/*  checked={friendRequestsEmail} */}
                        {/* /> */}
                      </TableCell>
                      {/* <TableCell align="center" classes={{ root: classes.tableCellColumn }}> */}
                      {/*  <input */}
                      {/*    id="friendRequestsSms" */}
                      {/*    type="checkbox" */}
                      {/*    name="friendRequestsSms" */}
                      {/*    onChange={this.updateNotificationSettings} */}
                      {/*    checked={friendRequestsSms} */}
                      {/*  /> */}
                      {/* </TableCell> */}
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
                          <span className="u-show-desktop-tablet" id = "friendsOpinion_yourBallot_notification">
                            <span className="u-no-break">Friends&apos; opinions</span>
                            {' '}
                            <span className="u-no-break">(on your ballot)</span>
                          </span>
                        </TableCell>
                        <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                          <input
                            aria-label="show friends opinions from your ballot in app"
                            checked
                            disabled
                            type="checkbox"
                          />
                        </TableCell>
                        <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                          {primaryEmailAddressExists ? (
                            <input
                              aria-label="email friends opinions from your ballot"
                              id={`friendOpinionsYourBallotEmail-${externalUniqueId}`}
                              type="checkbox"
                              name="friendOpinionsYourBallotEmail"
                              onChange={this.updateNotificationSettings}
                              checked={friendOpinionsYourBallotEmail}
                            />
                          ) : (
                            <SettingsIconWrapper>
                              <Settings classes={{ root: classes.settingsIcon }} onClick={this.openAddEmailInterface} />
                            </SettingsIconWrapper>
                          )}
                        </TableCell>
                        {/* <TableCell align="center" classes={{ root: classes.tableCellColumn }}> */}
                        {/*  <input */}
                        {/*    aria-label="text friends opinions from your ballot" */}
                        {/*    id="friendOpinionsYourBallotSms" */}
                        {/*    type="checkbox" */}
                        {/*    name="friendOpinionsYourBallotSms" */}
                        {/*    onChange={this.updateNotificationSettings} */}
                        {/*    checked={friendOpinionsYourBallotSms} */}
                        {/*  /> */}
                        {/* </TableCell> */}
                      </TableRow>
                    )}
                    {/* ************************************************** */}
                    {/* *** NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS *** */}
                    <TableRow key="tableRow-friendOpinionsOtherRegions">
                      <TableCell
                        classes={{ root: classes.tableCellDescription }}
                        component="th"
                        scope="row"
                        id="friendsOpinion_allRegions_notification"
                      >
                        <span className="u-no-break">Friends&apos; opinions</span>
                        {' '}
                        <span className="u-no-break">(all regions)</span>
                      </TableCell>
                      <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                        <input
                          aria-label="show friends opinions from all regions in app"
                          checked
                          // checked={friendOpinionsOtherRegions}
                          disabled
                          id={`friendOpinionsOtherRegions-${externalUniqueId}`}
                          type="checkbox"
                          name="friendOpinionsOtherRegions"
                          onChange={this.updateNotificationSettings}
                        />
                      </TableCell>
                      <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                        {primaryEmailAddressExists ? (
                          <input
                            aria-label="email friends opinions from all regions"
                            id={`friendOpinionsOtherRegionsEmail-${externalUniqueId}`}
                            type="checkbox"
                            name="friendOpinionsOtherRegionsEmail"
                            onChange={this.updateNotificationSettings}
                            checked={friendOpinionsOtherRegionsEmail}
                          />
                        ) : (
                          <SettingsIconWrapper>
                            <Settings classes={{ root: classes.settingsIcon }} onClick={this.openAddEmailInterface} />
                          </SettingsIconWrapper>
                        )}
                      </TableCell>
                      {/* <TableCell align="center" classes={{ root: classes.tableCellColumn }}> */}
                      {/*  <input */}
                      {/*    aria-label="text friends opinions from all regions" */}
                      {/*    id="friendOpinionsOtherRegionsSms" */}
                      {/*    type="checkbox" */}
                      {/*    name="friendOpinionsOtherRegionsSms" */}
                      {/*    onChange={this.updateNotificationSettings} */}
                      {/*    checked={friendOpinionsOtherRegionsSms} */}
                      {/*  /> */}
                      {/* </TableCell> */}
                    </TableRow>
                    {/* *************************************** */}
                    {/* *** NOTIFICATION_VOTER_DAILY_SUMMARY *** */}
                    <TableRow key="tableRow-voterDailySummary">
                      <TableCell
                        classes={{ root: classes.tableCellDescription }}
                        component="th"
                        scope="row"
                        id="friendsActivity_notification"
                      >
                        <span className="u-no-break">Friends&apos; activity,</span>
                        {' '}
                        <span className="u-no-break">summarized daily</span>
                      </TableCell>
                      <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                        &nbsp;
                      </TableCell>
                      <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                        {primaryEmailAddressExists ? (
                          <input
                            aria-label="email summary of friends' posts, daily"
                            id={`voterDailySummaryEmail-${externalUniqueId}`}
                            type="checkbox"
                            name="voterDailySummaryEmail"
                            onChange={this.updateNotificationSettings}
                            checked={voterDailySummaryEmail}
                          />
                        ) : (
                          <SettingsIconWrapper>
                            <Settings classes={{ root: classes.settingsIcon }} onClick={this.openAddEmailInterface} />
                          </SettingsIconWrapper>
                        )}
                      </TableCell>
                      {/* <TableCell align="center" classes={{ root: classes.tableCellColumn }}> */}
                      {/*  <input */}
                      {/*    aria-label="text summary of friends' posts, daily" */}
                      {/*    id="voterDailySummarySms" */}
                      {/*    type="checkbox" */}
                      {/*    name="voterDailySummarySms" */}
                      {/*    onChange={this.updateNotificationSettings} */}
                      {/*    checked={voterDailySummarySms} */}
                      {/*  /> */}
                      {/* </TableCell> */}
                    </TableRow>
                    {/* ************************************** */}
                    {/* *** NOTIFICATION_NEWSLETTER_OPT_IN *** */}
                    {primaryEmailAddressExists && (
                      <TableRow key="tableRow-newsletterOptIn">
                        <TableCell
                          classes={{ root: classes.tableCellDescription }}
                          component="th"
                          scope="row"
                          id = "weVote_newsletter_notification"
                        >
                          WeVote newsletter
                        </TableCell>
                        <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                          &nbsp;
                        </TableCell>
                        <TableCell align="center" classes={{ root: classes.tableCellColumn }}>
                          <input
                            aria-label="email we vote newsletter"
                            id={`newsletterOptIn-${externalUniqueId}`}
                            type="checkbox"
                            name="newsletterOptIn"
                            onChange={this.updateNotificationSettings}
                            checked={newsletterOptIn}
                          />
                        </TableCell>
                        {/* <TableCell align="center" classes={{ root: classes.tableCellColumn }}> */}
                        {/*  <input */}
                        {/*    aria-label="newsletter not available by sms" */}
                        {/*    disabled */}
                        {/*    type="checkbox" */}
                        {/*  /> */}
                        {/* </TableCell> */}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </NotificationsTableWrapper>
            <VoterEmailAddressEntry hideSignInWithEmailForm={!addEmailInterfaceOpen} />
            {!addEmailInterfaceOpen && (
              <AddNewEmailWrapper>
                <div className="u-cursor--pointer u-link-color" onClick={this.openAddEmailInterface} id = "addEmailLink">
                  Add Email Address
                </div>
              </AddNewEmailWrapper>
            )}
          </div>
        </div>
      </div>
    );
  }
}
SettingsNotifications.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
};

const styles = () => ({
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

const AddNewEmailWrapper = styled('div')`
  margin-top: 12px;
`;

const ColumnIcon = styled('div')`
  margin-bottom: 0 !important;
`;

const ColumnLabel = styled('div')`
  color: #999;
  font-size: 10px;
  margin-top: -5px;
`;

const HeaderWrapper = styled('div')`
  display: flex;
  align-items: center;
  width: 100%;
`;

const NotificationsTableWrapper = styled('div')`
  margin-bottom: 15px;
`;

const SettingsIconWrapper = styled('div')`
  margin-left: 15px;
  margin-right: 15px;
`;

const NotificationsIcon = styled(CampaignRounded)`
  color: black;
  height: 25px;
  width: 25px;
  margin: 6px 8px 0 0;
`;

export default withStyles(styles)(SettingsNotifications);
