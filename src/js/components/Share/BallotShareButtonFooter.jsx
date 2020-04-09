import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import Button from '@material-ui/core/Button';
import Comment from '@material-ui/icons/Comment';
import { Drawer, MenuItem } from '@material-ui/core/esm';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import Mail from '@material-ui/icons/Mail';
import Reply from '@material-ui/icons/Reply';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { getApplicationViewBooleans } from '../../utils/applicationUtils';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import isMobile from '../../utils/isMobile';
import ShareModalOption from './ShareModalOption';
import { historyPush } from '../../utils/cordovaUtils';

class BallotShareButtonFooter extends Component {
  static propTypes = {
    classes: PropTypes.object,
    pathname: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      hideBallotShareButtonFooter: false,
      openShareButtonDrawer: false,
      showingOneCompleteYourProfileModal: false,
      showShareButton: true,
    };
  }

  componentDidMount () {
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    const showingOneCompleteYourProfileModal = AppStore.showingOneCompleteYourProfileModal();
    const currentFullUrl = window.location.href || '';
    const ballotFullUrl = currentFullUrl.replace('/modal/share', '');
    this.setState({
      ballotFullUrl,
      showingOneCompleteYourProfileModal,
    });
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
  }

  onAppStoreChange () {
    const { openShareButtonDrawer } = this.state;
    const scrolledDown = AppStore.getScrolledDown();
    const hideBallotShareButtonFooter = scrolledDown && !openShareButtonDrawer;
    // console.log('scrolledDown:', scrolledDown, ', hideBallotShareButtonFooter:', hideBallotShareButtonFooter);
    const showingOneCompleteYourProfileModal = AppStore.showingOneCompleteYourProfileModal();
    this.setState({
      showingOneCompleteYourProfileModal,
      hideBallotShareButtonFooter,
    });
  }

  handleShareButtonClick = () => {
    this.setState({
      openShareButtonDrawer: true,
      showShareButton: false,
    });
  }

  handleCloseShareButtonDrawer = () => {
    this.setState({
      openShareButtonDrawer: false,
      showShareButton: true,
    });
  }

  handleBackButtonClick = () => {
    // console.log('SettingsDomain openPaidAccountUpgradeModal');
    this.setState({
      ballotShareOptions: false,
      ballotShareOptionsWithOpinions: false,
    });
  }

  openBallotShareOptions = () => {
    // console.log('SettingsDomain openPaidAccountUpgradeModal');
    this.setState({
      ballotShareOptions: true,
      ballotShareOptionsWithOpinions: false,
    });
  }

  openBallotShareOptionsWithOpinions = () => {
    // console.log('SettingsDomain openPaidAccountUpgradeModal');
    this.setState({
      ballotShareOptions: false,
      ballotShareOptionsWithOpinions: true,
    });
  }

  openShareModal (shareModalStep) {
    const { pathname } = window.location;
    const pathnameWithModalShare = `${pathname}/modal/share`;
    historyPush(pathnameWithModalShare);
    AppActions.setShareModalStep(shareModalStep);
  }

  openNativeShare (linkToBeShared, shareTitle = '') {
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        url: linkToBeShared,
      }).catch(console.error);
    } else {
      console.log('Could not open native share.');
    }
  }

  render () {
    const { classes, pathname } = this.props;
    const {
      ballotFullUrl, ballotShareOptions, ballotShareOptionsWithOpinions,
      hideBallotShareButtonFooter, openShareButtonDrawer, showingOneCompleteYourProfileModal, showShareButton,
    } = this.state;
    const { showFooterBar } = getApplicationViewBooleans(pathname);

    // Hide if scrolled down the page
    if (hideBallotShareButtonFooter) {
      return null;
    }
    let linkToBeShared = '';
    let linkToBeSharedUrlEncoded = '';
    if (ballotShareOptionsWithOpinions) {
      linkToBeShared = '';
    } else {
      linkToBeShared = ballotFullUrl;
    }
    linkToBeSharedUrlEncoded = encodeURI(linkToBeShared);
    const twitterTextEncoded = encodeURI('Check out this cool ballot tool!');
    const featureStillInDevelopment = true;
    return (
      <Wrapper pinToBottom={!showFooterBar} className={showingOneCompleteYourProfileModal ? 'u-z-index-1000' : 'u-z-index-9000'}>
        {showShareButton && (
          <Button
            aria-controls="share-menu"
            aria-haspopup="true"
            className={classes.button}
            color="primary"
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
        )}
        <Drawer
          id="share-menu"
          anchor="bottom"
          className="u-z-index-9010"
          direction="up"
          onClose={this.handleCloseShareButtonDrawer}
          open={openShareButtonDrawer}
        >
          <Container ballotShareOptionsMode={(ballotShareOptions || ballotShareOptionsWithOpinions)}>
            {(ballotShareOptions || ballotShareOptionsWithOpinions) ? (
              <>
                <ModalTitleArea>
                  {(ballotShareOptions || ballotShareOptionsWithOpinions) ? (
                    <Button className={classes.backButton} color="primary" onClick={this.handleBackButtonClick}>
                      <ArrowBackIos className={classes.backButtonIcon} />
                      Back
                    </Button>
                  ) : null}
                  <Title>
                    Share:
                    {' '}
                    <strong>Ballot</strong>
                  </Title>
                  <SubTitle>Share a link to this election so that your friends can get ready to vote. Your opinions are not included.</SubTitle>
                </ModalTitleArea>
                {(isMobile() && navigator.share) ? (
                  <Flex>
                    {featureStillInDevelopment ? null : <ShareModalOption noLink onClickFunction={() => this.openShareModal('friends')} background="#2E3C5D" icon={<img src="../../../img/global/svg-icons/we-vote-icon-square-color.svg" />} title="We Vote Friends" />}
                    <ShareModalOption copyLink link={linkToBeShared} background="#2E3C5D" icon={<FileCopyOutlinedIcon />} title="Copy Link" />
                    <ShareModalOption noLink onClickFunction={() => this.openNativeShare(linkToBeShared, 'Share Ballot')} background="#2E3C5D" icon={<Reply />} title="Share" />
                  </Flex>
                ) : (
                  <Flex>
                    <ShareModalOption link={`https://www.facebook.com/sharer/sharer.php?u=${linkToBeSharedUrlEncoded}&t=WeVote`} target="_blank" background="#3b5998" icon={<i className="fab fa-facebook-f" />} title="Facebook" />
                    <ShareModalOption link={`https://twitter.com/share?text=${twitterTextEncoded}&url=${linkToBeSharedUrlEncoded}`} background="#38A1F3" icon={<i className="fab fa-twitter" />} title="Twitter" />
                    <ShareModalOption link="mailto:" background="#2E3C5D" icon={<Mail />} title="Email" />
                    <ShareModalOption copyLink link={linkToBeShared} background="#2E3C5D" icon={<FileCopyOutlinedIcon />} title="Copy Link" />
                  </Flex>
                )}
                {ballotShareOptionsWithOpinions && (
                  <Button className={classes.cancelButton} variant="contained" fullWidth color="primary">
                    Preview
                  </Button>
                )}
                <Button className={classes.cancelButton} fullWidth onClick={this.handleCloseShareButtonDrawer} variant="outlined" color="primary">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <MenuItemsWrapper>
                  <MenuItem className={classes.menuItem} onClick={this.openBallotShareOptions}>
                    <MenuFlex>
                      <MenuIcon>
                        <i className="fas fa-list" />
                      </MenuIcon>
                      <MenuText>
                        Ballot
                      </MenuText>
                    </MenuFlex>
                  </MenuItem>
                  <MenuSeparator />
                  {featureStillInDevelopment ? null : (
                    <MenuItem className={classes.menuItem} onClick={this.openBallotShareOptionsWithOpinions}>
                      <MenuFlex>
                        <MenuIcon>
                          <Comment />
                        </MenuIcon>
                        <MenuText>
                          Ballot + Your Opinions
                        </MenuText>
                      </MenuFlex>
                    </MenuItem>
                  )}
                </MenuItemsWrapper>
                <Button className={classes.cancelButton} fullWidth onClick={this.handleCloseShareButtonDrawer} variant="outlined" color="primary">
                  Cancel
                </Button>
              </>
            )}
          </Container>
        </Drawer>
      </Wrapper>
    );
  }
}

const styles = () => ({
  button: {
    padding: '0 12px',
    width: '100%',
    boxShadow: 'none !important',
    borderRadius: '0 !important',
    height: '45px !important',
  },
  backButton: {
    marginBottom: 6,
    marginLeft: -8,
  },
  backButtonIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 12,
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
});

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  bottom: ${props => (props.pinToBottom ? '0' : '57px')};
  display: block;
  @media (min-width: 576px) {
    display: none;
  }
`;

const Container = styled.div`
  margin: 0 auto;
  max-width: 576px;
  padding: ${props => (props.ballotShareOptionsMode ? '16px 16px 32px' : '24px 16px 32px')};
`;

const ModalTitleArea = styled.div`
  text-align: left;
  width: 100%;
  padding: 0 16px 16px 16px;
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  ${({ noBoxShadowMode }) => ((noBoxShadowMode) ? '@media (max-width: 376px) {\n    padding: 8px 6px;\n  }' : '')}
`;

const Title = styled.h3`
  font-weight: normal;
  font-size: 24px;
  color: black;
  margin-top: 0;
  margin-bottom: 12px;
`;

const SubTitle = styled.div`
  margin-top: 0;
  font-size: 14px;
  width: 100%;
`;

const MenuItemsWrapper = styled.div`
  padding: 16px 0;
`;

const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px 0 12px 0;
  justify-content: center;
  max-width: 320px !important;
  margin: 0 auto;
`;

const Icon = styled.span`
  margin-right: 4px;
`;

const MenuFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 14px 12px;
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
`;

// const MenuInfo = styled.div`
//   margin-left: auto;
//   margin-top: 1px;
//   padding-left: 10px;
// `;

const MenuSeparator = styled.div`
  height: 2px;
  background: #efefef;
  width: 80%;
  margin: 0 auto;
  position: absolute;
  left: 10%;
  z-index: 0 !important;
  @media (min-width: 568px) {
    width: 448px !important;
    margin: 0 auto;
  }
`;

export default withStyles(styles)(BallotShareButtonFooter);
