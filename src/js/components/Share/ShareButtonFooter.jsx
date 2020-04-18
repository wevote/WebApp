import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import Button from '@material-ui/core/Button';
import Comment from '@material-ui/icons/Comment';
import { Drawer, MenuItem } from '@material-ui/core/esm';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import Mail from '@material-ui/icons/Mail';
import Reply from '@material-ui/icons/Reply';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import { getApplicationViewBooleans } from '../../utils/applicationUtils';
import { historyPush } from '../../utils/cordovaUtils';
import isMobile from '../../utils/isMobile';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import ShareActions from '../../actions/ShareActions';
import ShareModalOption from './ShareModalOption';
import ShareStore from '../../stores/ShareStore';
import { stringContains } from '../../utils/textFormat';
import VoterStore from '../../stores/VoterStore';

class ShareButtonFooter extends Component {
  static propTypes = {
    classes: PropTypes.object,
    pathname: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      allOpinions: false,
      candidateShare: false,
      currentFullUrlToShare: '',
      hideShareButtonFooter: false,
      measureShare: false,
      officeShare: false,
      openShareButtonDrawer: false,
      shareFooterStep: '',
      showingOneCompleteYourProfileModal: false,
      showShareButton: true,
      showShareModal: false,
      showSignInModal: false,
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    const { pathname } = this.props;
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const showingOneCompleteYourProfileModal = AppStore.showingOneCompleteYourProfileModal();
    const showShareModal = AppStore.showShareModal();
    const showSignInModal = AppStore.showSignInModal();
    const currentFullUrl = window.location.href || '';
    const currentFullUrlToShare = currentFullUrl.replace('/modal/share', '');
    const candidateShare = pathname.startsWith('/candidate');
    const measureShare = pathname.startsWith('/measure');
    const officeShare = pathname.startsWith('/office');
    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare);
    const urlWithSharedItemCodeAllOpinions = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, true);
    // console.log('ShareButtonFooter componentDidMount urlWithSharedItemCode:', urlWithSharedItemCode, ', urlWithSharedItemCodeAllOpinions:', urlWithSharedItemCodeAllOpinions);
    if (!urlWithSharedItemCode || !urlWithSharedItemCodeAllOpinions) {
      ShareActions.sharedItemSave(currentFullUrlToShare);
    }
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      candidateShare,
      currentFullUrlToShare,
      measureShare,
      officeShare,
      showingOneCompleteYourProfileModal,
      showShareModal,
      showSignInModal,
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
      voterIsSignedIn,
    });
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppStoreChange () {
    const { openShareButtonDrawer } = this.state;
    const scrolledDown = AppStore.getScrolledDown();
    const hideShareButtonFooter = scrolledDown && !openShareButtonDrawer;
    // console.log('scrolledDown:', scrolledDown, ', hideShareButtonFooter:', hideShareButtonFooter);
    const showingOneCompleteYourProfileModal = AppStore.showingOneCompleteYourProfileModal();
    const showShareModal = AppStore.showShareModal();
    const showSignInModal = AppStore.showSignInModal();
    this.setState({
      hideShareButtonFooter,
      showingOneCompleteYourProfileModal,
      showShareModal,
      showSignInModal,
    });
  }

  onShareStoreChange () {
    // console.log('SharedModal onShareStoreChange');
    const currentFullUrl = window.location.href || '';
    const currentFullUrlToShare = currentFullUrl.replace('/modal/share', '').toLowerCase();
    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare);
    const urlWithSharedItemCodeAllOpinions = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, true);
    // console.log('SharedModal onShareStoreChange urlWithSharedItemCode:', urlWithSharedItemCode, ', urlWithSharedItemCodeAllOpinions:', urlWithSharedItemCodeAllOpinions);
    const showSignInModal = AppStore.showSignInModal();
    this.setState({
      currentFullUrlToShare,
      showSignInModal,
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    const currentFullUrl = window.location.href || '';
    const currentFullUrlToShare = currentFullUrl.replace('/modal/share', '').toLowerCase();
    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare);
    const urlWithSharedItemCodeAllOpinions = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, true);
    if (!urlWithSharedItemCode || !urlWithSharedItemCodeAllOpinions) {
      ShareActions.sharedItemRetrieveByFullUrl(currentFullUrlToShare);
    }
    const showSignInModal = AppStore.showSignInModal();
    this.setState({
      currentFullUrlToShare,
      showSignInModal,
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
      voterIsSignedIn,
    });
  }

  setStep (shareFooterStep) {
    let allOpinions = false;
    if (stringContains('AllOpinions', shareFooterStep)) {
      allOpinions = true;
    }
    const showSignInModal = AppStore.showSignInModal();
    this.setState({
      allOpinions,
      shareFooterStep,
      showSignInModal,
    });
    this.openSignInModalIfWeShould(shareFooterStep);
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
      allOpinions: false,
      shareFooterStep: '',
    });
  }

  openShareOptions = (allOpinions = false) => {
    // console.log('ShareButtonFooter openShareOptions');
    const { candidateShare, measureShare, officeShare, voterIsSignedIn } = this.state;
    let shareFooterStep;
    if (candidateShare) {
      if (allOpinions) {
        shareFooterStep = 'candidateShareOptionsAllOpinions';
      } else {
        shareFooterStep = 'candidateShareOptions';
      }
    } else if (measureShare) {
      if (allOpinions) {
        shareFooterStep = 'measureShareOptionsAllOpinions';
      } else {
        shareFooterStep = 'measureShareOptions';
      }
    } else if (officeShare) {
      if (allOpinions) {
        shareFooterStep = 'officeShareOptionsAllOpinions';
      } else {
        shareFooterStep = 'officeShareOptions';
      }
      // Default to ballot
    } else if (allOpinions) {
      shareFooterStep = 'ballotShareOptionsAllOpinions';
    } else {
      shareFooterStep = 'ballotShareOptions';
    }
    this.setState({
      allOpinions,
    });
    this.setStep(shareFooterStep);
  }

  openSignInModalIfWeShould = (shareFooterStep) => {
    const { voterIsSignedIn } = this.state;
    console.log('ShareButtonFooter openSignInModalIfWeShould, shareFooterStep:', shareFooterStep, ', voterIsSignedIn:', voterIsSignedIn);
    if (stringContains('AllOpinions', shareFooterStep)) {
      if (!voterIsSignedIn) {
        AppActions.setShowSignInModal(true);
        this.setState({
          shareFooterStep: shareFooterStep.replace('AllOpinions', ''),
        });
      }
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

  openShareModal (shareFooterStep) {
    AppActions.setShowShareModal(true);
    AppActions.setShareModalStep(shareFooterStep);
    const { pathname } = window.location;
    if (!stringContains('/modal/share', pathname)) {
      const pathnameWithModalShare = `${pathname}/modal/share`;
      historyPush(pathnameWithModalShare);
    }
  }

  doNotIncludeOpinions (shareFooterStep) {
    if (stringContains('AllOpinions', shareFooterStep)) {
      const newShareFooterStep = shareFooterStep.replace('AllOpinions', '');
      this.setStep(newShareFooterStep);
    }
  }

  includeOpinions (shareFooterStep) {
    const { voterIsSignedIn } = this.state;
    // console.log('ShareButtonFooter includeOpinions shareFooterStep:', shareFooterStep, ', voterIsSignedIn:', voterIsSignedIn);
    if (!stringContains('AllOpinions', shareFooterStep)) {
      if (voterIsSignedIn) {
        const newShareFooterStep = `${shareFooterStep}AllOpinions`;
        this.setStep(newShareFooterStep);
      } else {
        AppActions.setShowSignInModal(true);
      }
    }
  }

  render () {
    const { classes, pathname } = this.props;
    const {
      allOpinions,
      candidateShare, currentFullUrlToShare,
      hideShareButtonFooter, measureShare, officeShare, openShareButtonDrawer, shareFooterStep,
      showingOneCompleteYourProfileModal, showShareButton,
      showShareModal, showSignInModal,
      urlWithSharedItemCode, urlWithSharedItemCodeAllOpinions,
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
    if (stringContains('AllOpinions', shareFooterStep)) {
      if (urlWithSharedItemCodeAllOpinions) {
        linkToBeShared = urlWithSharedItemCodeAllOpinions;
      } else {
        linkToBeShared = currentFullUrlToShare;
      }
    } else if (urlWithSharedItemCode) {
      linkToBeShared = urlWithSharedItemCode;
    } else {
      linkToBeShared = currentFullUrlToShare;
    }
    linkToBeSharedUrlEncoded = encodeURI(linkToBeShared);
    const twitterTextEncoded = encodeURI('Check out this cool ballot tool!');
    if (shareFooterStep === 'ballotShareOptions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    } else if (shareFooterStep === 'ballotShareOptionsAllOpinions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    } else if (shareFooterStep === 'candidateShareOptions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    } else if (shareFooterStep === 'candidateShareOptionsAllOpinions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    } else if (shareFooterStep === 'measureShareOptions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    } else if (shareFooterStep === 'measureShareOptionsAllOpinions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    } else if (shareFooterStep === 'officeShareOptions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    } else if (shareFooterStep === 'officeShareOptionsAllOpinions') {
      emailSubjectEncoded = encodeURI('Ready to vote?');
      emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    }
    const shareButtonClasses = classes.buttonDefault;
    let shareMenuTextDefault;
    let shareMenuTextAllOpinions;
    if (candidateShare) {
      shareMenuTextDefault = 'Candidate';
      shareMenuTextAllOpinions = 'Candidate + Your Opinions';
    } else if (measureShare) {
      shareMenuTextDefault = 'Measure';
      shareMenuTextAllOpinions = 'Measure + Your Opinions';
    } else if (officeShare) {
      shareMenuTextDefault = 'Office';
      shareMenuTextAllOpinions = 'Office + Your Opinions';
    } else {
      // Default to ballot
      shareMenuTextDefault = 'Ballot';
      shareMenuTextAllOpinions = 'Ballot + Your Opinions';
    }
    linkToBeSharedUrlEncoded = encodeURI(linkToBeShared);
    const featureStillInDevelopment = true;
    return (
      <Wrapper
        className={showingOneCompleteYourProfileModal || showShareModal || showSignInModal ? 'u-z-index-1000' : 'u-z-index-9000'}
        pinToBottom={!showFooterBar}
      >
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
              (shareFooterStep === 'ballotShareOptionsAllOpinions') ||
              (shareFooterStep === 'candidateShareOptions') ||
              (shareFooterStep === 'candidateShareOptionsAllOpinions') ||
              (shareFooterStep === 'measureShareOptions') ||
              (shareFooterStep === 'measureShareOptionsAllOpinions') ||
              (shareFooterStep === 'officeShareOptions') ||
              (shareFooterStep === 'officeShareOptionsAllOpinions')
            )}
          >
            {(shareFooterStep === 'ballotShareOptions') ||
              (shareFooterStep === 'ballotShareOptionsAllOpinions') ||
              (shareFooterStep === 'candidateShareOptions') ||
              (shareFooterStep === 'candidateShareOptionsAllOpinions') ||
              (shareFooterStep === 'measureShareOptions') ||
              (shareFooterStep === 'measureShareOptionsAllOpinions') ||
              (shareFooterStep === 'officeShareOptions') ||
              (shareFooterStep === 'officeShareOptionsAllOpinions') ? (
                <>
                  <ModalTitleArea>
                    <Button
                      className={classes.backButton}
                      color="primary"
                      id="shareButtonFooterBack"
                      onClick={this.handleBackButtonClick}
                    >
                      <ArrowBackIos className={classes.backButtonIcon} />
                      Back
                    </Button>
                    <Title>
                      Share:
                      {' '}
                      <strong>
                        {(shareFooterStep === 'ballotShareOptions') && 'Ballot'}
                        {(shareFooterStep === 'ballotShareOptionsAllOpinions') && 'Ballot + Your Opinions'}
                        {(shareFooterStep === 'candidateShareOptions') && 'Candidate'}
                        {(shareFooterStep === 'candidateShareOptionsAllOpinions') && 'Candidate + Your Opinions'}
                        {(shareFooterStep === 'measureShareOptions') && 'Measure'}
                        {(shareFooterStep === 'measureShareOptionsAllOpinions') && 'Measure + Your Opinions'}
                        {(shareFooterStep === 'officeShareOptions') && 'Office'}
                        {(shareFooterStep === 'officeShareOptionsAllOpinions') && 'Office + Your Opinions'}
                      </strong>
                    </Title>
                    <SubTitle>
                      {(shareFooterStep === 'ballotShareOptions') && (
                        <>Share a link to this election so that your friends can get ready to vote.</>
                      )}
                      {(shareFooterStep === 'ballotShareOptionsAllOpinions') && (
                        <>Share a link to all of your opinions for this year.</>
                      )}
                      {(shareFooterStep === 'candidateShareOptions') && (
                        <>Share a link to this candidate.</>
                      )}
                      {(shareFooterStep === 'candidateShareOptionsAllOpinions') && (
                        <>Share a link to this candidate.</>
                      )}
                      {(shareFooterStep === 'measureShareOptions') && (
                        <>Share a link to this measure/proposition.</>
                      )}
                      {(shareFooterStep === 'measureShareOptionsAllOpinions') && (
                        <>Share a link to this measure/proposition.</>
                      )}
                      {(shareFooterStep === 'officeShareOptions') && (
                        <>Share a link to this office.</>
                      )}
                      {(shareFooterStep === 'officeShareOptionsAllOpinions') && (
                        <>Share a link to this office.</>
                      )}
                      {stringContains('AllOpinions', shareFooterStep) ? (
                        <>
                          {' '}
                          All of your opinions for this year are included.
                          {' '}
                          <span className="u-link-color u-underline u-cursor--pointer" onClick={() => this.doNotIncludeOpinions(shareFooterStep)}>
                            Don&apos;t include your opinions.
                          </span>
                        </>
                      ) : (
                        <>
                          {' '}
                          Your opinions are NOT included.
                          {' '}
                          <span className="u-link-color u-underline u-cursor--pointer" onClick={() => this.includeOpinions(shareFooterStep)}>
                            Include your opinions.
                          </span>
                        </>
                      )
                      }
                    </SubTitle>
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
                          uniqueExternalId="shareButtonFooter-Friends"
                        />
                      )}
                      <ShareModalOption
                        copyLink
                        link={linkToBeShared}
                        background="#2E3C5D"
                        icon={<FileCopyOutlinedIcon />}
                        title="Copy Link"
                        uniqueExternalId="shareButtonFooter-CopyLink"
                      />
                      <ShareModalOption
                        noLink
                        onClickFunction={() => this.openNativeShare(linkToBeShared, 'Open Share')}
                        background="#2E3C5D"
                        icon={<Reply />}
                        title="Share"
                        uniqueExternalId="shareButtonFooter-NativeShare"
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
                        uniqueExternalId="shareButtonFooter-Facebook"
                      />
                      <ShareModalOption
                        background="#38A1F3"
                        icon={<i className="fab fa-twitter" />}
                        link={`https://twitter.com/share?text=${twitterTextEncoded}&url=${linkToBeSharedUrlEncoded}`}
                        title="Twitter"
                        uniqueExternalId="shareButtonFooter-Twitter"
                      />
                      <ShareModalOption
                        background="#2E3C5D"
                        icon={<Mail />}
                        link={`mailto:?subject=${emailSubjectEncoded}&body=${emailBodyEncoded}`}
                        title="Email"
                        uniqueExternalId="shareButtonFooter-Email"
                      />
                      <ShareModalOption
                        background="#2E3C5D"
                        copyLink
                        icon={<FileCopyOutlinedIcon />}
                        link={linkToBeShared}
                        title="Copy Link"
                        uniqueExternalId="shareButtonFooter-CopyLink"
                      />
                    </Flex>
                  )}
                  {allOpinions && (
                    <OpenExternalWebSite
                      url={linkToBeShared}
                      target="_blank"
                      // title={this.props.title}
                      className="u-no-underline"
                      body={(
                        <Button className={classes.cancelButton} variant="contained" fullWidth color="primary">
                          Preview
                        </Button>
                      )}
                    />
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
                    <MenuItem className={classes.menuItem} onClick={() => this.openShareOptions(true)}>
                      <MenuFlex>
                        <MenuIcon>
                          <Comment />
                        </MenuIcon>
                        <MenuText>
                          {shareMenuTextAllOpinions}
                        </MenuText>
                      </MenuFlex>
                    </MenuItem>
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
  padding: 0;
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  ${({ noBoxShadowMode }) => ((noBoxShadowMode) ? '@media (max-width: 376px) {\n    padding: 8px 6px;\n  }' : '')}
`;

const Title = styled.h3`
  font-weight: normal;
  font-size: 20px;
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
