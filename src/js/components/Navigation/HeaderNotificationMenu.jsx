import { Notifications } from '@mui/icons-material';
import { Badge, IconButton, Menu, MenuItem } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import ActivityActions from '../../actions/ActivityActions';
import apiCalming from '../../common/utils/apiCalming';
import { isIOSAppOnMac, setIconBadgeMessageCount } from '../../common/utils/cordovaUtils';
import { timeFromDate } from '../../common/utils/dateFormat';
import historyPush from '../../common/utils/historyPush';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { isTablet } from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import returnFirstXWords from '../../common/utils/returnFirstXWords';
import ActivityStore from '../../stores/ActivityStore';
import VoterStore from '../../stores/VoterStore';
import { createDescriptionOfFriendPosts } from '../../utils/activityUtils';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));


class HeaderNotificationMenu extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activityNoticeIdListNotSeen: [],
      allActivityNoticesNotSeenCount: 0,
      menuItemList: [],
      menuOpen: false,
    };
  }

  componentDidMount () {
    // console.log('HeaderNotificationMenu componentDidMount, this.props: ', this.props);
    this.timer = setTimeout(() => {
      this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
      if (apiCalming('activityNoticeListRetrieve', 10000)) {
        ActivityActions.activityNoticeListRetrieve();
      }
      if (apiCalming('activityListRetrieve', 2000)) {
        ActivityActions.activityListRetrieve();
      }
      const firebaseEnabled = isWebApp();
      if (firebaseEnabled && !isIOSAppOnMac()) setIconBadgeMessageCount(0);
    }, 3000);
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('HeaderNotificationMenu caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    if (this.activityStoreListener) this.activityStoreListener.remove();
    clearTimeout(this.timer);
  }

  onActivityStoreChange () {
    const allActivityNotices = ActivityStore.allActivityNotices(); // this has no notification content from API
    // const allActivityNotices = ActivityStore.allActivity(); // this has notification data for me, but missing some things. seed
    // console.log('allActivityNotices:', allActivityNotices);
    const activityNoticeIdListNotSeen = allActivityNotices
      .filter((activityNotice) => activityNotice.activity_notice_seen === false)
      .map((activityNotice) => activityNotice.activity_notice_id);
    // console.log('activityNoticeIdListNotSeen:', activityNoticeIdListNotSeen);
    const menuItemList = this.generateMenuItemList(allActivityNotices);
    const firebaseEnabled = isWebApp();
    if (firebaseEnabled && !isIOSAppOnMac()) setIconBadgeMessageCount(activityNoticeIdListNotSeen.length);
    this.setState({
      activityNoticeIdListNotSeen,
      allActivityNoticesNotSeenCount: activityNoticeIdListNotSeen.length,
      menuItemList,
    });
  }

  onMenuItemClick (activityNotice) {
    if (activityNotice.activity_notice_id > 0) {
      ActivityActions.activityNoticeListRetrieve([activityNotice.activity_notice_id]);
    }
    this.handleClose();
    if (activityNotice && activityNotice.campaignx_we_vote_id) {
      if (activityNotice.campaignx_news_item_we_vote_id) {
        // window.open(`https://campaigns.wevote.us/id/${activityNotice.campaignx_we_vote_id}/u/${activityNotice.campaignx_news_item_we_vote_id}`, '_blank');
        historyPush(`/id/${activityNotice.campaignx_we_vote_id}/u/${activityNotice.campaignx_news_item_we_vote_id}`);
      } else {
        // window.open(`https://campaigns.wevote.us/id/${activityNotice.campaignx_we_vote_id}`, '_blank');
        historyPush(`/id/${activityNotice.campaignx_we_vote_id}/`);
      }
    } else if (activityNotice && activityNotice.activity_tidbit_we_vote_id) {
      historyPush(`/news/a/${activityNotice.activity_tidbit_we_vote_id}`);
    } else {
      historyPush('/news');
    }
  }

  onSettingsClick = () => {
    this.handleClose();
    historyPush('/settings/notifications');
  }

  generateMenuItemList = (allActivityNotices) => {
    const { classes } = this.props;
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    const menuItemList = [];
    menuItemList.push(
      <MenuItem
        className={classes.menuItemClicked}
        data-toggle="dropdown"
        id="notificationsHeader"
        key="notificationsHeader"
        onClick={this.onSettingsClick}
      >
        <NotificationsHeaderWrapper>
          <NotificationsTitle>
            Notifications
          </NotificationsTitle>
          <NotificationsSettings className="u-link-color">
            Settings
          </NotificationsSettings>
        </NotificationsHeaderWrapper>
      </MenuItem>,
    );
    if (!allActivityNotices || !allActivityNotices.length) {
      menuItemList.push(
        <MenuItem
          className={classes.menuItemClicked}
          data-toggle="dropdown"
          id="noActivities"
          key="noActivities"
        >
          No notifications
        </MenuItem>,
      );
      return menuItemList;
    }
    let activityNoticeCount = 0;
    let activityDescription = '';
    let activityTimeFromDate = '';
    const maxNumberOfActivityPostWordsToShow = 5;
    const maxNumberToShow = 8;
    const menuItemListActivities = allActivityNotices.map((activityNotice) => {
      // console.log('activityNotice:', activityNotice);
      if (!activityNotice.speaker_name || activityNotice.speaker_name.startsWith('Voter-')) {
        if (activityNotice.kind_of_notice && activityNotice.kind_of_notice === 'NOTICE_FRIEND_ENDORSEMENTS') {
          // Filter out friends with name problem
          return null;
        }
      }
      activityNoticeCount += 1;
      if (activityNoticeCount <= maxNumberToShow) {
        activityDescription = '';
        switch (activityNotice.kind_of_notice) {
          case 'NOTICE_CAMPAIGNX_FRIEND_HAS_SUPPORTED':
            activityDescription += ' supported "';
            activityDescription += returnFirstXWords(activityNotice.statement_text_preview, 8);
            activityDescription += '"';
            break;
          case 'NOTICE_CAMPAIGNX_NEWS_ITEM':
            activityDescription += ' sent update "';
            activityDescription += returnFirstXWords(activityNotice.statement_subject, 8);
            activityDescription += '"';
            break;
          case 'NOTICE_CAMPAIGNX_NEWS_ITEM_AUTHORED':
            if (activityNotice.statement_subject) {
              activityDescription += ' created update for the supporters of campaign "';
              activityDescription += returnFirstXWords(activityNotice.statement_subject, 8);
              activityDescription += '"';
            } else {
              activityDescription += ' updated supporters of campaign';
            }
            break;
          case 'NOTICE_CAMPAIGNX_SUPPORTER_INITIAL_RESPONSE':
            activityDescription += ' supported the campaign "';
            activityDescription += returnFirstXWords(activityNotice.statement_text_preview, 8);
            activityDescription += '"';
            break;
          default:
          case 'NOTICE_FRIEND_ENDORSEMENTS':
            activityDescription += ' ';
            activityDescription += createDescriptionOfFriendPosts(activityNotice.position_name_list);
            activityDescription += '.';
            break;
          case 'NOTICE_FRIEND_ACTIVITY_POSTS':
            if (activityNotice.statement_text_preview) {
              activityDescription += ' posted "';
              activityDescription += returnFirstXWords(activityNotice.statement_text_preview, maxNumberOfActivityPostWordsToShow);
              activityDescription += '..."';
            } else {
              activityDescription += ' posted.';
            }
            if (activityNotice.number_of_comments === 1) {
              activityDescription += ` (${activityNotice.number_of_comments} comment)`;
            } else if (activityNotice.number_of_comments > 1) {
              activityDescription += ` (${activityNotice.number_of_comments} comments)`;
            } else if (activityNotice.number_of_likes > 0) {
              activityDescription += ` (${activityNotice.number_of_likes} like)`;
            } else if (activityNotice.number_of_likes > 1) {
              activityDescription += ` (${activityNotice.number_of_likes} likes)`;
            }
            break;
        }
        activityTimeFromDate = timeFromDate(activityNotice.date_of_notice);
        return (
          <MenuItem
            className={activityNotice.activity_notice_clicked ? classes.menuItemClicked : classes.menuItemNotClicked}
            data-toggle="dropdown"
            id={`activityNoticeId${activityNotice.activity_notice_id}`}
            key={`activityNoticeId${activityNotice.activity_notice_id}`}
            onClick={() => this.onMenuItemClick(activityNotice)}
          >
            <MenuItemInternalWrapper>
              <MenuItemPhoto>
                <Suspense fallback={<></>}>
                  <ImageHandler
                    alt="Inviting"
                    imageUrl={activityNotice.speaker_profile_image_url_medium || activityNotice.speaker_profile_image_url_tiny}
                    kind_of_image="CANDIDATE"
                  />
                </Suspense>
              </MenuItemPhoto>
              <MenuItemText>
                <div>
                  <strong>
                    {activityNotice.speaker_voter_we_vote_id === voterWeVoteId ? 'YOU' : activityNotice.speaker_name.toUpperCase()}
                  </strong>
                  {' '}
                  {activityDescription}
                </div>
                {activityTimeFromDate && (
                  <ActivityTime>
                    {activityTimeFromDate}
                  </ActivityTime>
                )}
              </MenuItemText>
            </MenuItemInternalWrapper>
          </MenuItem>
        );
      } else {
        return [];
      }
    });
    return menuItemList.concat(menuItemListActivities);
  }

  handleClick = (event) => {
    const { activityNoticeIdListNotSeen } = this.state;
    ActivityActions.activityNoticeListRetrieve([], activityNoticeIdListNotSeen);
    ActivityActions.activityListRetrieve();
    this.setState({
      anchorEl: event.currentTarget,
      menuOpen: true,
    });
  }

  handleClose = () => {
    this.setState({
      anchorEl: null,
      menuOpen: false,
    });
  }


  render () {
    renderLog('HeaderNotificationMenu');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('HeaderNotificationMenu render');
    const { classes } = this.props;
    const { allActivityNoticesNotSeenCount, anchorEl, menuItemList, menuOpen } = this.state;

    return (
      <HeaderNotificationMenuWrapper id="HeaderNotificationMenuWrapper">
        <IconButton
          aria-label="IconButton"
          aria-controls="headerNotificationsMenu"
          aria-haspopup="true"
          classes={menuOpen ? { root: classes.iconButtonRootSelected } : { root: classes.iconButtonRoot }}
          id="headerNotificationMenuIcon"
          onClick={this.handleClick}
          size="large"
          // 'sx' refactored in the 'iconButtonRoot' and 'iconButtonRootSelected' classes below.
          // sx={isTablet() ? { marginTop: '5px', marginRight: '12px' } : {}}
        >
          {allActivityNoticesNotSeenCount ? (
            <Badge
              badgeContent={<BadgeCountWrapper>{allActivityNoticesNotSeenCount}</BadgeCountWrapper>}
              classes={{
                badge: classes.badgeClasses,
              }}
              color="primary"
              max={9}
              style={{
                display: 'inline-block',
                height: 40,
              }}
            >
              <StyledNotifications />
            </Badge>
          ) : (
            <StyledNotifications />
          )}
        </IconButton>
        <Menu
          id="headerNotificationsMenu"
          classes={isWebApp() ? { list: classes.listWebApp, paper: classes.paper } : { list: classes.listCordova, paper: classes.paper }}
          open={menuOpen}
          onClose={this.handleClose}
          elevation={2}
           anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            horizontal: 'right',
            vertical: 'top',
          }}
        >
          {menuItemList}
        </Menu>
      </HeaderNotificationMenuWrapper>
    );
  }
}
HeaderNotificationMenu.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  badgeClasses: {
    backgroundColor: 'rgba(250, 62, 62)',
    fontSize: 10,
    height: 15,
    marginRight: 1,
    marginTop: 11,
    minWidth: 15,
    width: 15,
  },
  iconButtonRoot: {
    color: 'rgba(17, 17, 17, .4)',
    outline: 'none !important',
    height: '48px',
    paddingTop: '4px !important',
    paddingRight: 0,
    paddingBottom: '9px !important',
    paddingLeft: 6,
    [theme.breakpoints.down('sm')]: {
      marginTop: '5px !important',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      marginTop: '4px !important',
      marginRight: '12px',
    },
    [theme.breakpoints.up('md')]: {
      marginTop: '3px !important',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  iconButtonRootSelected: {
    color: '#2E3C5D',
    outline: 'none !important',
    height: '48px',
    paddingTop: '4px !important',
    paddingRight: 0,
    paddingBottom: '9px !important',
    paddingLeft: 6,
    [theme.breakpoints.down('sm')]: {
      marginTop: '5px !important',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      marginTop: '4px !important',
      marginRight: '12px',
    },
    [theme.breakpoints.up('md')]: {
      marginTop: '3px !important',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  listCordova: {
    padding: '0 !important',
  },
  listWebApp: {
    padding: '0 !important',
    width: '100%',
  },
  menuItemClicked: {
    backgroundColor: 'white',
    borderRight: '1px solid #ddd',
    borderBottom: '.5px solid #ddd',
    borderLeft: '1px solid #ddd',
    color: DesignTokenColors.neutralUI600,
    display: 'flex',
    fontSize: '14px !important',
    fontWeight: '500',
    padding: '8px 6px !important',
    textAlign: 'left',
    whiteSpace: 'normal',
    width: '100%',
  },
  menuItemNotClicked: {
    backgroundColor: DesignTokenColors.info50,
    borderRight: '1px solid #ddd',
    borderBottom: '.5px solid #ddd',
    borderLeft: `5px solid ${DesignTokenColors.info900}`,
    color: DesignTokenColors.neutralUI700,
    display: 'flex',
    fontSize: '14px !important',
    fontWeight: '700',
    padding: '8px 6px !important',
    textAlign: 'left',
    whiteSpace: 'normal',
    width: '100%',
  },
  paper: {
    width: '420px !important',
    minWidth: '0 !important',
    maxWidth: '420px !important',
    padding: '0 !important',
    border: 'none !important',
    boxShadow: '0 2px 3px 2px #ccc',
    [theme.breakpoints.down('sm')]: {
      width: '300px !important',
      maxWidth: '320px !important',
    },
  },
});

const ActivityTime = styled('div')`
  color: ${DesignTokenColors.neutralUI400};
  font-size: 11px;
  font-weight: 400;
`;

const StyledNotifications = styled(Notifications)(({ theme }) => (`
  ${[theme.breakpoints.between('tabMin', 'tabLgMin')]}: {     // iPad mini (744), 9.7" (768), 11" (834)
      font-size: '25px';
  }
  ${[theme.breakpoints.between('tabMin', 'tabLgMin')]}: {     // iPad Pro 12.9" (1024)
      font-size: '32px';
  }
`));

const BadgeCountWrapper = styled('span')`
  margin-top: -3px;
  margin-left: -1px;
`;

const HeaderNotificationMenuWrapper = styled('div')`
  height: 48px;
  margin-right: 12px;
  @media (min-width: 576px) {
    margin-right: 24px;
  }
`;

const MenuItemInternalWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: flex-start;
`;

const MenuItemPhoto = styled('div')`
  min-width: 48px;
  * {
    border-radius: 24px;
    min-width: 48px;
  }
`;

const MenuItemText = styled('div')`
  margin-left: 12px;
`;

const NotificationsHeaderWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const NotificationsSettings = styled('div')`
`;

const NotificationsTitle = styled('div')`
  font-weight: 600;
`;

export default withStyles(styles)(HeaderNotificationMenu);
