import { Badge, IconButton, Menu, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Notifications } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import ActivityActions from '../../actions/ActivityActions';
import ActivityStore from '../../stores/ActivityStore';
import { createDescriptionOfFriendPosts } from '../../utils/activityUtils';
import apiCalming from '../../utils/apiCalming';
import { historyPush, isIOSAppOnMac, setIconBadgeMessageCount } from '../../utils/cordovaUtils';
import { timeFromDate } from '../../utils/dateFormat';
import { renderLog } from '../../utils/logging';
import { returnFirstXWords, startsWith } from '../../utils/textFormat';

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
      if (apiCalming('activityNoticeListRetrieve', 500)) {
        ActivityActions.activityNoticeListRetrieve();
      }
      if (apiCalming('activityNoticeListRetrieve', 500)) {
        ActivityActions.activityListRetrieve();
      }
      if (!isIOSAppOnMac()) setIconBadgeMessageCount(0);
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
    const allActivityNotices = ActivityStore.allActivityNotices();
    // console.log('allActivityNotices:', allActivityNotices);
    const activityNoticeIdListNotSeen = allActivityNotices
      .filter((activityNotice) => activityNotice.activity_notice_seen === false)
      .map((activityNotice) => activityNotice.activity_notice_id);
    // console.log('activityNoticeIdListNotSeen:', activityNoticeIdListNotSeen);
    const menuItemList = this.generateMenuItemList(allActivityNotices);
    if (!isIOSAppOnMac()) setIconBadgeMessageCount(activityNoticeIdListNotSeen.length);
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
    if (activityNotice && activityNotice.activity_tidbit_we_vote_id) {
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
    const maxNumberToShow = 10;
    const menuItemListActivities = allActivityNotices.map((activityNotice) => {
      // console.log('activityNotice:', activityNotice);
      if (!activityNotice.speaker_name || startsWith('Voter-', activityNotice.speaker_name)) {
        if (activityNotice.kind_of_notice && activityNotice.kind_of_notice === 'NOTICE_FRIEND_ENDORSEMENTS') {
          // Filter out friends with name problem
          return null;
        }
      }
      activityNoticeCount += 1;
      if (activityNoticeCount <= maxNumberToShow) {
        activityDescription = '';
        switch (activityNotice.kind_of_notice) {
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
                <ImageHandler
                  alt="Inviting"
                  imageUrl={activityNotice.speaker_profile_image_url_medium}
                  kind_of_image="CANDIDATE"
                />
              </MenuItemPhoto>
              <MenuItemText>
                <div>
                  <strong>
                    {activityNotice.speaker_name}
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
      <HeaderNotificationMenuWrapper>
        <IconButton
          aria-controls="headerNotificationsMenu"
          aria-haspopup="true"
          classes={menuOpen ? { root: classes.iconButtonRootSelected } : { root: classes.iconButtonRoot }}
          id="headerNotificationMenuIcon"
          onClick={this.handleClick}
        >
          {allActivityNoticesNotSeenCount ? (
            <Badge
              badgeContent={<BadgeCountWrapper>{allActivityNoticesNotSeenCount}</BadgeCountWrapper>}
              classes={{
                badge: classes.badgeClasses,
                anchorOriginTopRightRectangle: classes.anchorOriginTopRightRectangle,
              }}
              color="primary"
              max={9}
              style={{
                display: 'inline-block',
                height: '35px',
              }}
            >
              <Notifications />
            </Badge>
          ) : (
            <Notifications />
          )}
        </IconButton>
        <Menu
          id="headerNotificationsMenu"
          classes={{ list: classes.list, paper: classes.paper }}
          open={menuOpen}
          onClose={this.handleClose}
          elevation={2}
          getContentAnchorEl={null}
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
  anchorOriginTopRightRectangle: {
    right: 3,
    top: 11,
  },
  badgeClasses: {
    backgroundColor: 'rgba(250, 62, 62)',
    fontSize: 10,
    height: 15,
    minWidth: 15,
    width: 15,
  },
  iconButtonRoot: {
    color: 'rgba(17, 17, 17, .4)',
    outline: 'none !important',
    height: '48px',
    paddingTop: '4px !important',
    paddingBottom: '9px !important',
    paddingRight: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  iconButtonRootSelected: {
    color: '#2E3C5D',
    outline: 'none !important',
    height: '48px',
    paddingTop: '4px !important',
    paddingBottom: '9px !important',
    paddingRight: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  list: {
    padding: '0 !important',
  },
  menuItemClicked: {
    backgroundColor: 'white',
    borderRight: '1px solid #ddd',
    borderBottom: '.5px solid #ddd',
    borderLeft: '1px solid #ddd',
    display: 'flex',
    fontSize: '14px !important',
    padding: '8px 6px !important',
    textAlign: 'left',
    whiteSpace: 'normal',
    width: '100%',
  },
  menuItemNotClicked: {
    backgroundColor: '#e6ecfc',
    borderRight: '1px solid #ddd',
    borderBottom: '.5px solid #ddd',
    borderLeft: '1px solid #ddd',
    display: 'flex',
    fontSize: '14px !important',
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

const ActivityTime = styled.div`
  color: #999;
  font-size: 11px;
  font-weight: 400;
`;

const BadgeCountWrapper = styled.span`
  margin-top: -3px;
  margin-left: 1px;
`;

const HeaderNotificationMenuWrapper = styled.div`
  height: 48px;
  margin-right: 12px;
  @media (min-width: 576px) {
    margin-right: 24px;
  }
`;

const MenuItemInternalWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: flex-start;
`;

const MenuItemPhoto = styled.div`
  min-width: 48px;
`;

const MenuItemText = styled.div`
  margin-left: 12px;
`;

const NotificationsHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const NotificationsSettings = styled.div`
`;

const NotificationsTitle = styled.div`
  font-weight: 600;
`;

export default withStyles(styles)(HeaderNotificationMenu);
