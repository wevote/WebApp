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
import { stringContains } from '../../utils/textFormat';

class ShareButtonFooter extends Component {
  static propTypes = {
    classes: PropTypes.object,
    pathname: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      candidateShare: false,
      currentFullUrlToShare: '',
      hideShareButtonFooter: false,
      measureShare: false,
      officeShare: false,
      openShareButtonDrawer: false,
      shareFooterStep: '',
      showingOneCompleteYourProfileModal: false,
      showShareButton: true,
    };
  }

  componentDidMount () {
    const { pathname } = this.props;
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    const showingOneCompleteYourProfileModal = AppStore.showingOneCompleteYourProfileModal();
    const currentFullUrl = window.location.href || '';
    const currentFullUrlToShare = currentFullUrl.replace('/modal/share', '');
    const candidateShare = pathname.startsWith('/candidate');
    const measureShare = pathname.startsWith('/measure');
    const officeShare = pathname.startsWith('/office');
    this.setState({
      candidateShare,
      currentFullUrlToShare,
      measureShare,
      officeShare,
      showingOneCompleteYourProfileModal,
    });
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
  }

  onAppStoreChange () {
    const { openShareButtonDrawer } = this.state;
    const scrolledDown = AppStore.getScrolledDown();
    const hideShareButtonFooter = scrolledDown && !openShareButtonDrawer;
    // console.log('scrolledDown:', scrolledDown, ', hideShareButtonFooter:', hideShareButtonFooter);
    const showingOneCompleteYourProfileModal = AppStore.showingOneCompleteYourProfileModal();
    this.setState({
      showingOneCompleteYourProfileModal,
      hideShareButtonFooter,
    });
  }

  handleShareButtonClick = () => {
    const { pathname } = this.props;
    const currentFullUrl = window.location.href || '';
    const currentFullUrlToShare = currentFullUrl.replace('/modal/share', '');
    const candidateShare = pathname.startsWith('/candidate');
    const measureShare = pathname.startsWith('/measure');
    const officeShare = pathname.startsWith('/office');
    this.setState({
      candidateShare,
      currentFullUrlToShare,
      measureShare,
      officeShare,
      openShareButtonDrawer: true,
      shareFooterStep: '',
      showShareButton: false,
    });
  }

  handleCloseShareButtonDrawer = () => {
    this.setState({
      openShareButtonDrawer: false,
      shareFooterStep: '',
      showShareButton: true,
    });
  }

  handleBackButtonClick = () => {
    this.setState({
      ballotShareOptions: false,
      ballotShareOptionsWithOpinions: false,
      shareFooterStep: '',
    });
  }

  openShareOptions = (withOpinions = false) => {
    // console.log('SettingsDomain openPaidAccountUpgradeModal');
    const { candidateShare, measureShare, officeShare } = this.state;
    let shareFooterStep;
    if (candidateShare) {
      if (withOpinions) {
        shareFooterStep = 'candidateShareOptionsWithOpinions';
      } else {
        shareFooterStep = 'candidateShareOptions';
      }
    } else if (measureShare) {
      if (withOpinions) {
        shareFooterStep = 'measureShareOptionsWithOpinions';
      } else {
        shareFooterStep = 'measureShareOptions';
      }
    } else if (officeShare) {
      if (withOpinions) {
        shareFooterStep = 'officeShareOptionsWithOpinions';
      } else {
        shareFooterStep = 'officeShareOptions';
      }
      // Default to ballot
    } else if (withOpinions) {
      shareFooterStep = 'ballotShareOptionsWithOpinions';
    } else {
      shareFooterStep = 'ballotShareOptions';
    }
    this.setState({
      ballotShareOptions: true,
      ballotShareOptionsWithOpinions: false,
      shareFooterStep,
    });
  }

  openShareModal (shareFooterStep) {
    AppActions.setShowShareModal(true);
    AppActions.setShareModalStep(shareFooterStep);
    const { pathname } = window.location;
    if (!stringContains('/modal/share', pathname)) {
      const pathnameWithModalShare = `${pathname}/modal/share`;
      historyPush(pathnameWithModalShare);
    }
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
      ballotShareOptions, ballotShareOptionsWithOpinions,
      candidateShare, currentFullUrlToShare,
      hideShareButtonFooter, measureShare, officeShare, openShareButtonDrawer, shareFooterStep,
      showingOneCompleteYourProfileModal, showShareButton,
    } = this.state;
    const { showFooterBar } = getApplicationViewBooleans(pathname);

    // Hide if scrolled down the page
    if (hideShareButtonFooter) {
      return null;
    }
    let emailSubjectEncoded = '';
    let emailBodyEncoded = '';
    let linkToBeShared = '';
    let linkToBeSharedUrlEncoded = '';
    if (stringContains('WithOpinions', shareFooterStep)) {
      linkToBeShared = '';
    } else {
      linkToBeShared = currentFullUrlToShare;
    }
    linkToBeSharedUrlEncoded = encodeURI(linkToBeShared);
    const twitterTextEncoded = encodeURI('Check out this cool ballot tool!');
    if (shareFooterStep === 'ballotShareOptions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    } else if (shareFooterStep === 'ballotShareOptionsWithOpinions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    } else if (shareFooterStep === 'candidateShareOptions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    } else if (shareFooterStep === 'candidateShareOptionsWithOpinions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    } else if (shareFooterStep === 'measureShareOptions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    } else if (shareFooterStep === 'measureShareOptionsWithOpinions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    } else if (shareFooterStep === 'officeShareOptions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    } else if (shareFooterStep === 'officeShareOptionsWithOpinions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    }
    const shareButtonClasses = classes.buttonDefault;
    let shareMenuTextDefault;
    let shareMenuTextWithOpinions;
    if (candidateShare) {
      shareMenuTextDefault = 'Candidate';
      shareMenuTextWithOpinions = 'Candidate + Your Opinions';
    } else if (measureShare) {
      shareMenuTextDefault = 'Measure';
      shareMenuTextWithOpinions = 'Measure + Your Opinions';
    } else if (officeShare) {
      shareMenuTextDefault = 'Office';
      shareMenuTextWithOpinions = 'Office + Your Opinions';
    } else {
      // Default to ballot
      shareMenuTextDefault = 'Ballot';
      shareMenuTextWithOpinions = 'Ballot + Your Opinions';
    }
    linkToBeSharedUrlEncoded = encodeURI(linkToBeShared);
    const featureStillInDevelopment = false;
    return (
      <Wrapper pinToBottom={!showFooterBar} className={showingOneCompleteYourProfileModal ? 'u-z-index-1000' : 'u-z-index-9000'}>
        {showShareButton && (
          <Button
            aria-controls="shareMenuFooter"
            aria-haspopup="true"
            classes={{ root: shareButtonClasses }}
            color="primary"
            id="shareButtonFooter"
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
          anchor="bottom"
          className="u-z-index-9010"
          direction="up"
          id="shareMenuFooter"
          onClose={this.handleCloseShareButtonDrawer}
          open={openShareButtonDrawer}
        >
          <Container
            shareOptionsMode={(
              (shareFooterStep === 'ballotShareOptions') ||
              (shareFooterStep === 'ballotShareOptionsWithOpinions') ||
              (shareFooterStep === 'candidateShareOptions') ||
              (shareFooterStep === 'candidateShareOptionsWithOpinions') ||
              (shareFooterStep === 'measureShareOptions') ||
              (shareFooterStep === 'measureShareOptionsWithOpinions') ||
              (shareFooterStep === 'officeShareOptions') ||
              (shareFooterStep === 'officeShareOptionsWithOpinions')
            )}
          >
            {(shareFooterStep === 'ballotShareOptions') ||
              (shareFooterStep === 'ballotShareOptionsWithOpinions') ||
              (shareFooterStep === 'candidateShareOptions') ||
              (shareFooterStep === 'candidateShareOptionsWithOpinions') ||
              (shareFooterStep === 'measureShareOptions') ||
              (shareFooterStep === 'measureShareOptionsWithOpinions') ||
              (shareFooterStep === 'officeShareOptions') ||
              (shareFooterStep === 'officeShareOptionsWithOpinions') ? (
                <>
                  <ModalTitleArea>
                    {(ballotShareOptions || ballotShareOptionsWithOpinions) ? (
                      <Button
                        className={classes.backButton}
                        color="primary"
                        id="shareButtonFooterBack"
                        onClick={this.handleBackButtonClick}
                      >
                        <ArrowBackIos className={classes.backButtonIcon} />
                        Back
                      </Button>
                    ) : null}
                    <Title>
                      Share:
                      {' '}
                      <strong>
                        {(shareFooterStep === 'ballotShareOptions') && 'Ballot for this Election'}
                        {(shareFooterStep === 'ballotShareOptionsWithOpinions') && 'Ballot + Your Opinions for this Election'}
                        {(shareFooterStep === 'candidateShareOptions') && 'Candidate'}
                        {(shareFooterStep === 'candidateShareOptionsWithOpinions') && 'Candidate + Your Opinions'}
                        {(shareFooterStep === 'measureShareOptions') && 'Measure'}
                        {(shareFooterStep === 'measureShareOptionsWithOpinions') && 'Measure + Your Opinions'}
                        {(shareFooterStep === 'officeShareOptions') && 'Office'}
                        {(shareFooterStep === 'officeShareOptionsWithOpinions') && 'Office + Your Opinions'}
                      </strong>
                    </Title>
                    {(shareFooterStep === 'ballotShareOptions') && (
                      <SubTitle>Share a link to this election so that your friends can get ready to vote. Your opinions are NOT included.</SubTitle>
                    )}
                    {(shareFooterStep === 'ballotShareOptionsWithOpinions') && (
                      <SubTitle>Share a link to all of your opinions for this election.</SubTitle>
                    )}
                    {(shareFooterStep === 'candidateShareOptions') && (
                      <SubTitle>Share a link to this candidate. Your opinions are NOT included.</SubTitle>
                    )}
                    {(shareFooterStep === 'candidateShareOptionsWithOpinions') && (
                      <SubTitle>Share a link to this candidate. All of your opinions for this election are included.</SubTitle>
                    )}
                    {(shareFooterStep === 'measureShareOptions') && (
                      <SubTitle>Share a link to this measure/proposition. Your opinions are NOT included.</SubTitle>
                    )}
                    {(shareFooterStep === 'measureShareOptionsWithOpinions') && (
                      <SubTitle>Share a link to this measure/proposition. All of your opinions for this election are included.</SubTitle>
                    )}
                    {(shareFooterStep === 'officeShareOptions') && (
                      <SubTitle>Share a link to this office. Your opinions are NOT included.</SubTitle>
                    )}
                    {(shareFooterStep === 'officeShareOptionsWithOpinions') && (
                      <SubTitle>Share a link to this office. All of your opinions for this election are included.</SubTitle>
                    )}
                  </ModalTitleArea>
                  {(!featureStillInDevelopment && isMobile() && navigator.share) ? (
                    <Flex>
                      {featureStillInDevelopment ? null : (
                        <ShareModalOption
                          noLink
                          onClickFunction={() => this.openShareModal('friends')}
                          background="#2E3C5D"
                          icon={<img src="../../../img/global/svg-icons/we-vote-icon-square-color.svg" alt="" />}
                          title="We Vote Friends"
                        />
                      )}
                      <ShareModalOption
                        copyLink
                        link={linkToBeShared}
                        background="#2E3C5D"
                        icon={<FileCopyOutlinedIcon />}
                        title="Copy Link"
                      />
                      <ShareModalOption
                        noLink
                        onClickFunction={() => this.openNativeShare(linkToBeShared, 'Open Share')}
                        background="#2E3C5D"
                        icon={<Reply />}
                        title="Share"
                      />
                    </Flex>
                  ) : (
                    <Flex>
                      <ShareModalOption
                        background="#3b5998"
                        icon={<i className="fab fa-facebook-f" />}
                        link={`https://www.facebook.com/sharer/sharer.php?u=${linkToBeSharedUrlEncoded}&t=WeVote`}
                        target="_blank"
                        title="Facebook"
                      />
                      <ShareModalOption
                        background="#38A1F3"
                        icon={<i className="fab fa-twitter" />}
                        link={`https://twitter.com/share?text=${twitterTextEncoded}&url=${linkToBeSharedUrlEncoded}`}
                        title="Twitter"
                      />
                      <ShareModalOption
                        background="#2E3C5D"
                        icon={<Mail />}
                        link={`mailto:?subject=${emailSubjectEncoded}&body=${emailBodyEncoded}`}
                        title="Email"
                      />
                      <ShareModalOption
                        background="#2E3C5D"
                        copyLink
                        icon={<FileCopyOutlinedIcon />}
                        link={linkToBeShared}
                        title="Copy Link"
                      />
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
                    <MenuItem className={classes.menuItem} onClick={() => this.openShareOptions()}>
                      <MenuFlex>
                        <MenuIcon>
                          <i className="fas fa-list" />
                        </MenuIcon>
                        <MenuText>
                          {shareMenuTextDefault}
                        </MenuText>
                      </MenuFlex>
                    </MenuItem>
                    <MenuSeparator />
                    {featureStillInDevelopment ? null : (
                      <MenuItem className={classes.menuItem} onClick={() => this.openShareOptions(true)}>
                        <MenuFlex>
                          <MenuIcon>
                            <Comment />
                          </MenuIcon>
                          <MenuText>
                            {shareMenuTextWithOpinions}
                          </MenuText>
                        </MenuFlex>
                      </MenuItem>
                    )}
                  </MenuItemsWrapper>
                  <Button className={classes.cancelButton} fullWidth onClick={this.handleCloseShareButtonDrawer} variant="outlined" color="primary">
                    Cancel
                  </Button>
                </>
              )
            }
          </Container>
        </Drawer>
      </Wrapper>
    );
  }
}

const styles = () => ({
  buttonDefault: {
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
  padding: ${props => (props.shareOptionsMode ? '16px 16px 32px' : '24px 16px 32px')};
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

export default withStyles(styles)(ShareButtonFooter);
