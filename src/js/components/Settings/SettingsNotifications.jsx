import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MailOutline from '@material-ui/icons/MailOutline';
import Notifications from '@material-ui/icons/Notifications';
import Settings from '@material-ui/icons/Settings';
import AnalyticsActions from '../../actions/AnalyticsActions';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import { openSnackbar } from '../Widgets/SnackNotifier';
import VoterActions from '../../actions/VoterActions';
import VoterConstants from '../../constants/VoterConstants';
import VoterEmailAddressEntry from './VoterEmailAddressEntry';
import VoterStore from '../../stores/VoterStore';
// import PhoneAndroid from '@material-ui/icons/PhoneAndroid';
import webAppConfig from '../../config';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;


class SettingsNotifications extends Component {
  static propTypes = {
    classes: PropTypes.object,
    externalUniqueId: PropTypes.string,
  };

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
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onVoterStoreChange () {
    if (VoterStore.isVoterFound()) {
      const friendOpinionsOtherRegionsEmail = VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_FRIEND_OPINIONS_OTHER_REGIONS_EMAIL);
      const friendOpinionsYourBallotEmail = VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_FRIEND_OPINIONS_YOUR_BALLOT_EMAIL);
      const newsletterOptIn = VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
      this.setState({
        friendOpinionsOtherRegionsEmail,
        friendOpinionsYourBallotEmail,
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
    } else if (event.target.name === 'newsletterOptIn') {
      this.voterUpdateNotificationSettingsFlags(event.target.checked, VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
      this.setState({ newsletterOptIn: (event.target.checked) });
    } else {
      notificationsSavedStatusDisplay = false;
    }
    if (notificationsSavedStatusDisplay) {
      this.setState({ notificationsSavedStatus: 'Saved' });

      clearTimeout(this.timer);
      const delayBeforeClear = 2000;
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
        <Helmet title="Notifications - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="card">
          <div className="card-main">
            <div>
              <HeaderWrapper>
                <div className="h2">Notification Settings</div>
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
                        <span className="u-show-desktop-tablet">
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
                          <span className="u-show-desktop-tablet">
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
                    {/* ************************************** */}
                    {/* *** NOTIFICATION_NEWSLETTER_OPT_IN *** */}
                    {primaryEmailAddressExists && (
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
                            aria-label="newsletter not available in app"
                            disabled
                            type="checkbox"
                          />
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
            </div>
            <VoterEmailAddressEntry hideSignInWithEmail={!addEmailInterfaceOpen} />
            {!addEmailInterfaceOpen && (
              <AddNewEmailWrapper>
                <div className="u-cursor--pointer u-link-color" onClick={this.openAddEmailInterface}>
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

const AddNewEmailWrapper = styled.div`
  margin-top: 12px;
`;

const ColumnIcon = styled.div`
  margin-bottom: 0px !important;
`;

const ColumnLabel = styled.div`
  color: #999;
  font-size: 10px;
  margin-top: -5px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const SettingsIconWrapper = styled.div`
  margin-left: 15px;
  margin-right: 15px;
`;

export default withStyles(styles)(SettingsNotifications);
