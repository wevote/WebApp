import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Comment from '@material-ui/icons/Comment';
import { Menu, MenuItem } from '@material-ui/core/esm'; // , Tooltip
import Reply from '@material-ui/icons/Reply';
import { withStyles } from '@material-ui/core/styles';
import AppActions from '../../actions/AppActions';
import { historyPush } from '../../utils/cordovaUtils';
import { stringContains } from '../../utils/textFormat';

class ShareButtonDesktopTablet extends Component {
  static propTypes = {
    classes: PropTypes.object,
    candidateShare: PropTypes.bool,
    measureShare: PropTypes.bool,
    officeShare: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null,
    };
    this.handleShareButtonClick = this.handleShareButtonClick.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
  }

  handleShareButtonClick (event) {
    this.setState({ anchorEl: event.currentTarget, open: true });
  }

  handleCloseMenu () {
    this.setState({ anchorEl: null, open: false });
  }

  openShareModal (withOpinions = false) {
    const { candidateShare, measureShare, officeShare } = this.props;
    let shareModalStep;
    if (candidateShare) {
      if (withOpinions) {
        shareModalStep = 'candidateShareOptionsWithOpinions';
      } else {
        shareModalStep = 'candidateShareOptions';
      }
    } else if (measureShare) {
      if (withOpinions) {
        shareModalStep = 'measureShareOptionsWithOpinions';
      } else {
        shareModalStep = 'measureShareOptions';
      }
    } else if (officeShare) {
      if (withOpinions) {
        shareModalStep = 'officeShareOptionsWithOpinions';
      } else {
        shareModalStep = 'officeShareOptions';
      }
      // Default to ballot
    } else if (withOpinions) {
      shareModalStep = 'ballotShareOptionsWithOpinions';
    } else {
      shareModalStep = 'ballotShareOptions';
    }

    AppActions.setShowShareModal(true);
    AppActions.setShareModalStep(shareModalStep);
    const { pathname } = window.location;
    if (!stringContains('/modal/share', pathname)) {
      const pathnameWithModalShare = `${pathname}${pathname.endsWith('/') ? '' : '/'}modal/share`;
      historyPush(pathnameWithModalShare);
    }
  }

  render () {
    const { candidateShare, classes, measureShare, officeShare } = this.props;
    const { anchorEl } = this.state;

    let shareButtonClasses;
    let shareMenuTextDefault;
    let shareMenuTextWithOpinions;
    if (candidateShare) {
      shareButtonClasses = classes.buttonCandidate;
      shareMenuTextDefault = 'Candidate';
      shareMenuTextWithOpinions = 'Candidate + Your Opinions';
    } else if (measureShare) {
      shareButtonClasses = classes.buttonCandidate;
      shareMenuTextDefault = 'Measure';
      shareMenuTextWithOpinions = 'Measure + Your Opinions';
    } else if (officeShare) {
      shareButtonClasses = classes.buttonCandidate;
      shareMenuTextDefault = 'Office';
      shareMenuTextWithOpinions = 'Office + Your Opinions';
    } else {
      // Default to ballot
      shareButtonClasses = classes.buttonDefault;
      shareMenuTextDefault = 'Ballot';
      shareMenuTextWithOpinions = 'Ballot + Your Opinions';
    }
    const featureStillInDevelopment = true;
    return (
      <>
        <Button
          aria-controls="shareMenuDesktopTablet"
          aria-haspopup="true"
          classes={{ root: shareButtonClasses }}
          color="primary"
          id="shareButtonDesktopTablet"
          onClick={this.handleShareButtonClick}
          variant="contained"
        >
          <Icon>
            <Reply
              classes={{ root: classes.shareIcon }}
            />
          </Icon>
          Share
        </Button>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          className="u-z-index-5020"
          classes={{ paper: classes.paper }}
          id="shareMenuDesktopTablet"
          elevation={2}
          getContentAnchorEl={null}
          onClose={this.handleCloseMenu}
          open={this.state.open}
          transformOrigin={{
            horizontal: 'right',
            vertical: 'top',
          }}
        >
          <MenuArrow />
          <MenuItem className={classes.menuItem} onClick={() => this.openShareModal()}>
            <MenuFlex>
              <MenuIcon>
                <i className="fas fa-list" />
              </MenuIcon>
              <MenuText>
                {shareMenuTextDefault}
              </MenuText>
              {/* <MenuInfo> - TURNED OFF BECAUSE OF TOOLTIP Z-INDEX PROBLEM */}
              {/*  <Tooltip */}
              {/*    arrow */}
              {/*    // classes={{ root: classes.toolTip }} */}
              {/*    // className="u-z-index-5030" */}
              {/*    enterDelay={300} */}
              {/*    // style={{ zIndex: '20000 !important' }} */}
              {/*    title="Share a link to this election so that your friends can get ready to vote. Your opinions are not included." */}
              {/*  > */}
              {/*    <i className="fas fa-info-circle" /> */}
              {/*  </Tooltip> */}
              {/* </MenuInfo> */}
            </MenuFlex>
          </MenuItem>
          <MenuSeparator />
          {featureStillInDevelopment ? null : (
            <MenuItem className={classes.menuItem} onClick={() => this.openShareModal(true)}>
              <MenuFlex>
                <MenuIcon>
                  <Comment />
                </MenuIcon>
                <MenuText>
                  {shareMenuTextWithOpinions}
                </MenuText>
                {/* <MenuInfo> - TURNED OFF BECAUSE OF TOOLTIP Z-INDEX PROBLEM */}
                {/*  <Tooltip title="Share a link to the choices you've made for this election so that your friends can get ready to vote. This includes your public and friend's-only opinions." arrow enterDelay={300}> */}
                {/*    <i className="fas fa-info-circle" /> */}
                {/*  </Tooltip> */}
                {/* </MenuInfo> */}
              </MenuFlex>
            </MenuItem>
          )}
        </Menu>
      </>
    );
  }
}

const styles = () => ({
  paper: {
    borderRadius: '2px !important',
    marginTop: '10px !important',
    overflowX: 'visible !important',
    overflowY: 'visible !important',
  },
  buttonDefault: {
    padding: '2px 12px',
  },
  buttonCandidate: {
    padding: '2px 12px',
    width: 160,
  },
  menuItem: {
    zIndex: '9 !important',
    padding: '0 !important',
    marginBottom: '-2px !important',
    paddingBottom: '1px !important',
    '&:last-child': {
      paddingBottom: '0 !important',
      paddingTop: '1px !important',
    },
    '&:hover': {
      background: '#efefef',
    },
  },
  shareIcon: {
    transform: 'scaleX(-1)',
    position: 'relative',
    top: -1,
  },
  toolTip: {
    zIndex: '5030 !important',
  },
});

const Icon = styled.span`
  margin-right: 4px;
`;

const MenuFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 10px 8px 10px 18px;
`;

const MenuIcon = styled.div`
  width: 20px !important;
  height: 20px !important;
  top: -2px;
  position: relative;
  & * {
    width: 20px !important;
    height: 20px !important;
    min-width: 20px !important;
    min-height: 20px !important;
  }
  & svg {
    position: relative;
    left: -2px;
  }
`;

const MenuText = styled.div`
  margin-left: 12px;
  margin-right: 12px;
`;

// const MenuInfo = styled.div`
//   margin-left: auto;
//   margin-top: 1px;
//   padding-left: 10px;
//   // z-index: 5030 !important;
// `;

const MenuSeparator = styled.div`
  height: 2px;
  background: #efefef;
  width: 80%;
  margin: 0 auto;
  position: absolute;
  left: 10%;
  z-index: 0 !important;
`;

const MenuArrow = styled.div`
  width: 12px;
  height: 12px;
  transform: rotate(45deg);
  background: white;
  position: absolute;
  top: -7px;
  left: calc(75%);
  border-top: 1px solid #e7e7e7;
  border-left: 1px solid #e7e7e7;
`;

export default withStyles(styles)(ShareButtonDesktopTablet);
