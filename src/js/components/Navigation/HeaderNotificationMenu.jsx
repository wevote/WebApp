import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Notifications } from '@material-ui/icons';
import { Badge, IconButton, Menu, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ActivityActions from '../../actions/ActivityActions';
import ActivityStore from '../../stores/ActivityStore';
import { historyPush } from '../../utils/cordovaUtils';
import ImageHandler from '../ImageHandler';
import { renderLog } from '../../utils/logging';
import { timeFromDate } from '../../utils/textFormat';

class HeaderNotificationMenu extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
  }

  componentDidMount () {
    // console.log('HeaderBackTo componentDidMount, this.props: ', this.props);
    this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
    ActivityActions.activityNoticeListRetrieve();
    ActivityActions.activityListRetrieve();
  }

  componentWillUnmount () {
    this.activityStoreListener.remove();
  }

  onActivityStoreChange () {
    const allActivityNotices = ActivityStore.allActivityNotices();
    const menuItemList = this.generateMenuItemList(allActivityNotices);
    this.setState({
      allActivityNoticesCount: allActivityNotices.length,
      menuItemList,
    });
  }

  onMenuItemClick (speakerOrganizationWeVoteId) {
    this.handleClose();
    historyPush(`/voterguide/${speakerOrganizationWeVoteId}`);
  }

  onSettingsClick = () => {
    historyPush('/settings/notifications');
  }

  generateMenuItemList = (allActivityNotices) => {
    const { classes } = this.props;
    const menuItemList = [];
    menuItemList.push(
      <MenuItem
        className={classes.menuItem}
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
          className={classes.menuItem}
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
    const menuItemListActivities = allActivityNotices.map((activityNotice) => {
      activityNoticeCount += 1;
      if (activityNoticeCount <= 3) {
        activityDescription = '';
        if (activityNotice.new_positions_entered_count === 0) {
          return null;
        } else if (activityNotice.new_positions_entered_count === 1) {
          activityDescription += ' added a new opinion.';
        } else if (activityNotice.new_positions_entered_count > 1) {
          activityDescription += ` added ${activityNotice.new_positions_entered_count} new opinions.`;
        }
        activityTimeFromDate = timeFromDate(activityNotice.date_of_notice);
        return (
          <MenuItem
            className={classes.menuItem}
            data-toggle="dropdown"
            id={`activityNoticeId${activityNotice.id}`}
            key={`activityNoticeId${activityNotice.id}`}
            onClick={() => this.onMenuItemClick(activityNotice.speaker_organization_we_vote_id)}
          >
            <>
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
            </>
          </MenuItem>
        );
      } else {
        return [];
      }
    });
    return menuItemList.concat(menuItemListActivities);
  }

  handleClick = (event) => {
    ActivityActions.activityNoticeListRetrieve();
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
    const { allActivityNoticesCount, anchorEl, menuItemList, menuOpen } = this.state;

    return (
      <HeaderNotificationMenuWrapper>
        <IconButton
          aria-controls="headerNotificationsMenu"
          aria-haspopup="true"
          classes={menuOpen ? { root: classes.iconButtonRootSelected } : { root: classes.iconButtonRoot }}
          id="headerNotificationMenuIcon"
          onClick={this.handleClick}
        >
          {allActivityNoticesCount ? (
            <Badge
              badgeContent={<BadgeCountWrapper isNumberOne={allActivityNoticesCount === 1}>{allActivityNoticesCount}</BadgeCountWrapper>}
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

const styles = theme => ({
  anchorOriginTopRightRectangle: {
    right: 3,
    top: 11,
  },
  badgeClasses: {
    backgroundColor: 'rgba(250, 62, 62)',
    fontSize: 10,
    height: 12,
    minWidth: 12,
    width: 12,
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
  menuItem: {
    backgroundColor: 'white',
    borderRight: '1px solid #ddd',
    borderBottom: '.5px solid #ddd',
    borderLeft: '1px solid #ddd',
    display: 'flex',
    fontSize: '14px !important',
    padding: '8px 6px !important',
    textAlign: 'left',
    whiteSpace: 'auto',
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
  margin-top: ${props => (props.isNumberOne ? '-1px' : '0')};
  margin-left: ${props => (props.isNumberOne ? '1px' : '0')};
`;

const HeaderNotificationMenuWrapper = styled.div`
  height: 48px;
  margin-right: 12px;
  @media (min-width: 576px) {
    margin-right: 24px;
  }
`;

const MenuItemPhoto = styled.div`
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
