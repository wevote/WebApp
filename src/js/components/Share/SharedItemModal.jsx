import { Close, Info } from '@mui/icons-material';
import { Button, Dialog, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import BallotActions from '../../actions/BallotActions';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterActions from '../../actions/VoterActions';
import ShareActions from '../../common/actions/ShareActions';
import ShareStore from '../../common/stores/ShareStore';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import { formatDateToMonthDayYear } from '../../common/utils/dateFormat';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import VoterConstants from '../../constants/VoterConstants';
import BallotStore from '../../stores/BallotStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaFooterHeight, cordovaNetworkNextButtonTop } from '../../utils/cordovaOffsets';
import { isSpeakerTypeOrganization, isSpeakerTypePublicFigure } from '../../utils/organization-functions';
import { convertToInteger } from '../../common/utils/textFormat';
import PersonalizedScoreIntroBody from '../CompleteYourProfile/PersonalizedScoreIntroBody';
import FriendToggle from '../Friends/FriendToggle';
import StepsChips from '../Widgets/StepsChips';
import SharedItemIntroduction from './SharedItemIntroduction';
import apiCalming from '../../common/utils/apiCalming';

const FollowToggle = React.lazy(() => import(/* webpackChunkName: 'FollowToggle' */ '../Widgets/FollowToggle'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ '../SignIn/SignInOptionsPanel'));

class SharedItemModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentSlideIndex: 0,
      hideSharedByIntro: false,
      isFollowing: false,
      voterLinkedOrganizationWeVoteId: '',
      maxSlideIndex: 2,
      organizationName: '',
      organizationPhotoUrlMedium: '',
      organizationWeVoteId: '',
      personalizedScoreIntroWatchedThisSession: false,
      sharedByOrganizationWeVoteId: '',
      slideHtmlContentDict: {},
    };
    this.nextSlide = this.nextSlide.bind(this);
    this.previousSlide = this.previousSlide.bind(this);
  }

  componentDidMount () {
    // console.log('SharedItemModal componentDidMount');
    this.onBallotStoreChange();
    this.onVoterStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { sharedItemCode } = this.props;
    if (sharedItemCode) {
      const sharedItem = ShareStore.getSharedItemByCode(sharedItemCode);
      const {
        shared_by_organization_type: sharedByOrganizationType,
        shared_by_organization_we_vote_id: sharedByOrganizationWeVoteId,
        shared_by_voter_we_vote_id: sharedByVoterWeVoteId,
      } = sharedItem;
      if (sharedByOrganizationWeVoteId) {
        this.setState({
          sharedByOrganizationType,
          sharedByOrganizationWeVoteId,
          sharedByVoterWeVoteId,
        });
        const organization = OrganizationStore.getOrganizationByWeVoteId(sharedByOrganizationWeVoteId);
        // console.log('SharedItemModal onOrganizationStoreChange organization:', organization);
        if (organization && organization.organization_name) {
          // While typing 'Tom Smith' in the org field, without the following line, when you get to 'Tom ', autosaving trims and overwrites it to 'Tom' before you can type the 'S'
          // console.log('onOrganizationStoreChange: \'' + organization.organization_name + "' '" + this.state.organizationName + "'");
          if (!organization.organization_name.startsWith('Voter-wv') && organization.organization_name.trim() !== this.state.organizationName.trim()) {
            this.setState({
              organizationName: organization.organization_name,
              organizationPhotoUrlMedium: organization.organization_photo_url_medium,
            });
          }
        }
        if (organization) {
          this.setState({
            organizationWeVoteId: organization.organization_we_vote_id,
          });
        }
      } else {
        ShareActions.sharedItemRetrieveByCode(sharedItemCode);
      }
    }
    // console.log('sharedItemCode:', sharedItemCode);
    const electionDayText = BallotStore.currentBallotElectionDate;
    if (!electionDayText) {
      if (apiCalming('voterBallotItemsRetrieve', 30000)) {
        BallotActions.voterBallotItemsRetrieve(0, '', '');
      }
    }
    this.setState({
      sharedItemCode,
    });
  }

  componentDidUpdate () {
    this.scrollToTop();
  }

  componentWillUnmount () {
    // console.log('SharedItemModal componentWillUnmount');
    this.ballotStoreListener.remove();
    this.organizationStoreListener.remove();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onBallotStoreChange () {
    // DALE 2022-03-29 This should be updated to use /src/js/common/utils/daysUntil if we keep this code after the interface rework
    const electionDayText = BallotStore.currentBallotElectionDate;
    // console.log('electionDayText:', electionDayText);
    if (electionDayText) {
      const electionDayTextDateFormatted = electionDayText && window.moment ? window.moment(electionDayText).format('MM/DD/YYYY') : '--x--';
      // console.log('electionDayTextFormatted: ', electionDayTextFormatted, ', electionDayTextDateFormatted:', electionDayTextDateFormatted);
      const electionDate = new Date(electionDayTextDateFormatted);
      if (electionDate) {
        const electionTime = new Date(electionDate).getTime();
        const currentTime = new Date().getTime();

        const distance = electionTime - currentTime;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        this.setState({
          days,
          electionDate,
        });
      }
    }
  }

  onOrganizationStoreChange () {
    const { sharedByOrganizationWeVoteId } = this.state;
    const organization = OrganizationStore.getOrganizationByWeVoteId(sharedByOrganizationWeVoteId);
    // console.log('SharedItemModal onOrganizationStoreChange organization:', organization);
    if (organization && organization.organization_name) {
      // console.log('onOrganizationStoreChange: \'' + organization.organization_name + "' '" + this.state.organizationName + "'");
      if (!organization.organization_name.startsWith('Voter-wv') && organization.organization_name.trim() !== this.state.organizationName.trim()) {
        this.setState({
          organizationName: organization.organization_name,
          organizationPhotoUrlMedium: organization.organization_photo_url_medium,
        });
      }
    }
    if (organization) {
      const organizationWeVoteId = organization.organization_we_vote_id;
      this.setState({
        isFollowing: OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId),
        organizationWeVoteId,
      });
    }
  }

  onShareStoreChange () {
    // console.log('SharedItemModal onShareStoreChange');
    const { sharedItemCode } = this.state;
    if (sharedItemCode) {
      const sharedItem = ShareStore.getSharedItemByCode(sharedItemCode);
      const {
        shared_by_organization_type: sharedByOrganizationType,
        shared_by_organization_we_vote_id: sharedByOrganizationWeVoteId,
        shared_by_voter_we_vote_id: sharedByVoterWeVoteId,
      } = sharedItem;
      const organization = OrganizationStore.getOrganizationByWeVoteId(sharedByOrganizationWeVoteId);
      // console.log('SharedItemModal onShareStoreChange sharedItem:', sharedItem, ', organization:', organization);
      if (organization && organization.organization_name) {
        // console.log('onOrganizationStoreChange: \'' + organization.organization_name + "' '" + this.state.organizationName + "'");
        if (!organization.organization_name.startsWith('Voter-wv') && organization.organization_name.trim() !== this.state.organizationName.trim()) {
          this.setState({
            organizationName: organization.organization_name,
            organizationPhotoUrlMedium: organization.organization_photo_url_medium,
          });
        }
      } else {
        OrganizationActions.organizationRetrieve(sharedByOrganizationWeVoteId);
      }
      if (organization) {
        this.setState({
          organizationWeVoteId: organization.organization_we_vote_id,
        });
      }
      this.setState({
        sharedByOrganizationType,
        sharedByOrganizationWeVoteId,
        sharedByVoterWeVoteId,
      });
    }
  }

  onVoterStoreChange () {
    this.setState({
      voterIsSignedIn: VoterStore.getVoterIsSignedIn(),
      voterLinkedOrganizationWeVoteId: VoterStore.getLinkedOrganizationWeVoteId(),
    }, this.updateSlideshowVariables);
  }

  closeSharedItemModalLocal = () => {
    // console.log('SharedItemModal closeSharedItemModalLocal');
    const { personalizedScoreIntroWatchedThisSession } = this.state;
    if (personalizedScoreIntroWatchedThisSession) {
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    }
    if (this.props.closeSharedItemModal) {
      this.props.closeSharedItemModal();
    }
  };

  markPersonalizedScoreIntroCompleted = () => {
    // We don't want to set this in the API server until the onboarding modal is closed
    this.setState({
      personalizedScoreIntroWatchedThisSession: true,
    });
  }

  personalizedScoreIntroModalToggle = () => {
    // Nothing to do
  }

  personalizedScoreStepAdvanced = () => {
    this.scrollToTop();
  }

  updateSlideshowVariables = () => {
    const { organizationName, voterIsSignedIn } = this.state;
    // We want to show two or three slides, because we need to take training opportunities.
    let maxSlideIndex = 2; // Default
    let showCloseModalTextOnThisSlideIndex = 2;
    const slideHtmlContentDict = {};
    let voterSignInHtml;
    if (voterIsSignedIn) {
      voterSignInHtml = (
        <SignInWrapper id="voterSignInWrapper">
          <IntroductionTopHeader>
            You are signed in and ready to go!
          </IntroductionTopHeader>
        </SignInWrapper>
      );
    } else {
      voterSignInHtml = (
        <SignInWrapper id="voterSignInWrapper">
          <IntroHeader>
            Do you already have an account?
            {' '}
            <IntroHeaderOptional>
              (Optional)
            </IntroHeaderOptional>
          </IntroHeader>
          <Suspense fallback={<></>}>
            <SignInOptionsPanel
              pleaseSignInTextOff
              inModal
            />
          </Suspense>
        </SignInWrapper>
      );
    }
    slideHtmlContentDict[0] = (
      <IntroductionWrapper id="introductionWrapper">
        <IntroductionTopHeader>
          {organizationName ? (
            <>
              {organizationName}
              {' '}
              has invited you to We Vote.
            </>
          ) : (
            <>
              You&apos;ve been invited to We Vote.
            </>
          )}
        </IntroductionTopHeader>
        <SharedItemIntroduction />
      </IntroductionWrapper>
    );
    const personalizedScoreHtml = (
      <PersonalizedScoreWrapper id="personalizedScoreWrapper">
        <SlideShowTitle>
          What&apos;s a Personalized Score?
        </SlideShowTitle>
        <PersonalizedScoreDescription>
          <PersonalizedScoreIntroBody
            markPersonalizedScoreIntroCompleted={this.markPersonalizedScoreIntroCompleted}
            show
            stepAdvanced={this.personalizedScoreStepAdvanced}
            toggleFunction={this.personalizedScoreIntroModalToggle}
          />
        </PersonalizedScoreDescription>
      </PersonalizedScoreWrapper>
    );
    maxSlideIndex = 2;
    showCloseModalTextOnThisSlideIndex = 2;
    slideHtmlContentDict[1] = personalizedScoreHtml;
    slideHtmlContentDict[2] = voterSignInHtml;
    const stepLabels = ['Shared Page Introduction', 'Personalized Score', 'Signed In'];
    this.setState({
      maxSlideIndex,
      showCloseModalTextOnThisSlideIndex,
      slideHtmlContentDict,
      stepLabels,
    });
  }

  scrollToTop = () => {
    // console.log('scrollToTop');
    const introductionWrapper = document.getElementById('introductionWrapper');
    if (introductionWrapper) {
      // console.log('introductionWrapper found');
      introductionWrapper.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const personalizedScoreWrapper = document.getElementById('personalizedScoreWrapper');
    if (personalizedScoreWrapper) {
      // console.log('personalizedScoreWrapper found');
      personalizedScoreWrapper.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const voterSignInWrapper = document.getElementById('voterSignInWrapper');
    if (voterSignInWrapper) {
      // console.log('voterSignInWrapper found');
      voterSignInWrapper.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToSpecificSlide = (index) => {
    const { maxSlideIndex } = this.state;
    // console.log('goToSpecificSlide index:', index);
    const minSlideIndex = 0;
    if (index <= maxSlideIndex && index >= minSlideIndex) {
      const hideSharedByIntro = index !== 0;
      this.setState({
        currentSlideIndex: index,
        hideSharedByIntro,
      });
    }
  }

  nextSlide () {
    const { currentSlideIndex, maxSlideIndex } = this.state;
    // console.log('nextSlide currentSlideIndex:', currentSlideIndex);
    if (currentSlideIndex < maxSlideIndex) {
      const nextSlideIndex = currentSlideIndex + 1;
      const hideSharedByIntro = nextSlideIndex !== 0;
      this.setState({
        currentSlideIndex: currentSlideIndex + 1,
        hideSharedByIntro,
      });
    }
  }

  previousSlide () {
    // console.log('previousSlide, currentSlideIndex:', currentSlideIndex);
    const { currentSlideIndex } = this.state;
    const minSlideIndex = 0;
    if (currentSlideIndex > minSlideIndex) {
      const nextSlideIndex = currentSlideIndex - 1;
      const hideSharedByIntro = nextSlideIndex !== 0;
      this.setState({
        currentSlideIndex: nextSlideIndex,
        hideSharedByIntro,
      });
    }
  }

  render () {
    renderLog('SharedItemModal');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('SharedItemModal render');
    const { classes } = this.props;
    const {
      currentSlideIndex, days, electionDate,
      hideSharedByIntro, isFollowing, isFriend,
      organizationName, organizationPhotoUrlMedium, organizationWeVoteId,
      personalizedScoreIntroCompleted,
      sharedByOrganizationType, sharedByOrganizationWeVoteId, sharedByVoterWeVoteId,
      sharedItemCode, showCloseModalTextOnThisSlideIndex, slideHtmlContentDict, stepLabels,
      voterLinkedOrganizationWeVoteId,
    } = this.state;

    if (!sharedItemCode) {
      return null;
    }
    if (!slideHtmlContentDict || slideHtmlContentDict.length === 0) {
      return null;
    }
    let showCountDownDays = (days && electionDate);
    if (convertToInteger(days) < 0) {
      showCountDownDays = false;
    }

    const sharingContextText = 'has shared this page with you.';
    const slideHtmlContent = slideHtmlContentDict[currentSlideIndex];
    const isLookingAtSelf = voterLinkedOrganizationWeVoteId === organizationWeVoteId;
    const withButtons = !isLookingAtSelf;
    let textNextToInfoIcon = null;
    const nameForNextToInfoIcon = organizationName || 'This person';
    const nameForNextToInfoIconMidSentence = organizationName || 'this person';
    const avatarCompressed = 'card-main__avatar-compressed';
    const avatarBackgroundImage = normalizedImagePath('../img/global/svg-icons/avatar-generic.svg');

    if (isFriend) {
      textNextToInfoIcon = `${nameForNextToInfoIcon}'s opinions will be added to your personalized scores. `;
    } else if (isFollowing) {
      textNextToInfoIcon = `${nameForNextToInfoIcon}'s opinions will be added to your scores. Add friend to see friend's-only opinions.`;
    } else {
      textNextToInfoIcon = `Click Add friend, or Follow to see ${nameForNextToInfoIconMidSentence}'s opinions. (Friends also see friend's-only opinions.)`;
    }
    return (
      <Dialog
        id="sharedItemModal"
        open={this.props.show}
        onClose={this.closeSharedItemModalLocal}
        classes={{
          paper: clsx(classes.dialogPaper, {
            [classes.codeVerifyCordova]: isCordova(),
          }),
          root: classes.dialogRoot,
        }}
      >
        <ContentWrapper>
          <ModalTitleArea hideSharedByIntro={hideSharedByIntro} withButtons={withButtons}>
            <ModalTitleOneRow>
              {showCountDownDays && (
                <ElectionCountdownText>
                  <ElectionCountdownDays>
                    {days}
                    {' '}
                    days
                  </ElectionCountdownDays>
                  {' '}
                  until your next election on
                  {' '}
                  <span className="u-no-break">
                    {formatDateToMonthDayYear(electionDate)}
                    .
                  </span>
                </ElectionCountdownText>
              )}
              <IconButton
                aria-label="Close"
                className={classes.closeButtonAbsolute}
                onClick={this.closeSharedItemModalLocal}
                id="closeSharedItemModal"
                size="large"
              >
                <Close />
              </IconButton>
            </ModalTitleOneRow>
            {!!(sharedByOrganizationWeVoteId && organizationName && !hideSharedByIntro) && (
              <SharedByOrganizationOuterWrapper>
                <SharedByOrganizationInnerWrapper>
                  <SharedByOrganizationTopRow>
                    <SharedByOrganization
                      id={`sharedByOrganizationWeVoteId-${sharedByOrganizationWeVoteId}`}
                    >
                      {/* SharedByOrganization Image */}
                      <OrganizationImageWrapper>
                        <Suspense fallback={<></>}>
                          <ImageHandler
                            className={avatarCompressed}
                            sizeClassName="icon-candidate-small u-push--sm "
                            imageUrl={organizationPhotoUrlMedium}
                            alt={`${organizationName}`}
                            kind_of_ballot_item="CANDIDATE"
                            style={{ backgroundImage: { avatarBackgroundImage } }}
                          />
                        </Suspense>
                      </OrganizationImageWrapper>
                      {/* SharedByOrganization Name */}
                      <OrganizationNameColumn>
                        <OrganizationNameText>
                          {!organizationName ? 'Loading name...' : organizationName}
                        </OrganizationNameText>
                        <SharedContextText>{sharingContextText}</SharedContextText>
                      </OrganizationNameColumn>
                    </SharedByOrganization>
                    {!isLookingAtSelf && (
                      <OpinionsAddedToPersonalizedScore>
                        <Info classes={{ root: classes.informationIcon }} />
                        <OpinionsAddedText>
                          {textNextToInfoIcon}
                        </OpinionsAddedText>
                      </OpinionsAddedToPersonalizedScore>
                    )}
                  </SharedByOrganizationTopRow>
                  <SharedByOrganizationBottomRow>
                    <ActionButtonsRow>
                      { !!(!isSpeakerTypeOrganization(sharedByOrganizationType) && !isSpeakerTypePublicFigure(sharedByOrganizationType)) && (
                        <FriendToggleWrapper>
                          <FriendToggle
                            lightModeOn
                            otherVoterWeVoteId={sharedByVoterWeVoteId}
                            showFriendsText
                          />
                        </FriendToggleWrapper>
                      )}
                      <SharedItemFollowToggleWrapper>
                        <Suspense fallback={<></>}>
                          <FollowToggle
                            lightModeOn
                            organizationWeVoteId={sharedByOrganizationWeVoteId}
                            platformType="allPlatforms"
                            showFollowingText
                          />
                        </Suspense>
                      </SharedItemFollowToggleWrapper>
                    </ActionButtonsRow>
                  </SharedByOrganizationBottomRow>
                </SharedByOrganizationInnerWrapper>
              </SharedByOrganizationOuterWrapper>
            )}
          </ModalTitleArea>
          <ModalContent
            style={{ padding: `${isWebApp() ? 'undefined' : '37px 0 2px 0'}` }}
          >
            <ModalContentInnerWrapper
              hideSharedByIntro={hideSharedByIntro}
              withButtons={withButtons}
            >
              {slideHtmlContent}
              <br />
              <br />
              <br />
            </ModalContentInnerWrapper>
          </ModalContent>
        </ContentWrapper>
        <FooterBarWrapper style={{ height: `${cordovaFooterHeight()}` }}>
          <StepsOuterWrapper>
            <StepsWrapper width={personalizedScoreIntroCompleted ? 86 : 210}>
              <StepsChips onSelectStep={this.goToSpecificSlide} selected={currentSlideIndex} chips={stepLabels} mobile />
            </StepsWrapper>
          </StepsOuterWrapper>
          <SharedItemTwoButtonsWrapper>
            <BackButtonWrapper>
              <Button
                classes={{ root: classes.nextButtonRoot }}
                color="primary"
                disabled={currentSlideIndex === 0}
                fullWidth
                id="voterGuideSettingsPositionsSeeFullBallot"
                onClick={this.previousSlide}
                style={{ top: `${cordovaNetworkNextButtonTop()}` }}
                variant="outlined"
              >
                Back
              </Button>
            </BackButtonWrapper>
            <NextButtonWrapper>
              <Button
                color="primary"
                id="sharedItemModalContinueButton"
                variant="contained"
                classes={{ root: classes.nextButtonRoot }}
                onClick={currentSlideIndex === showCloseModalTextOnThisSlideIndex ? this.closeSharedItemModalLocal : this.nextSlide}
              >
                {currentSlideIndex === showCloseModalTextOnThisSlideIndex ? (
                  <span>
                    <span className="u-show-mobile">
                      Done!
                    </span>
                    <span className="u-show-desktop-tablet">
                      Continue to Shared Page
                    </span>
                  </span>
                ) : 'Next'}
              </Button>
            </NextButtonWrapper>
          </SharedItemTwoButtonsWrapper>
        </FooterBarWrapper>
      </Dialog>
    );
  }
}
SharedItemModal.propTypes = {
  classes: PropTypes.object,
  show: PropTypes.bool,
  closeSharedItemModal: PropTypes.func,
  sharedItemCode: PropTypes.string,
};

const styles = (theme) => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    // overflow: 'scroll',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '720px',
      width: '85%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
  },
  dialogRoot: {
    [theme.breakpoints.down('sm')]: {
      zIndex: '5000 !important',
    },
  },
  closeButtonAbsolute: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 6,
  },
  codeVerifyCordova: {
    top: '9%',
    bottom: 'unset',
    height: 'unset',
    minHeight: 'unset',
    margin: '5px',
  },
  indicator: {
    backgroundColor: theme.palette.primary.main,
    height: 2.5,
  },
  informationIcon: {
    width: 16,
    height: 16,
  },
  nextButtonRoot: {
    width: '100%',
  },
});

const ActionButtonsRow = styled('div')`
  display: flex;
  justify-content: flex-start;
  // margin-top: 10px;
`;

const BackButtonWrapper = styled('div')`
  padding-right: 12px;
  width: 100%;
  @media(min-width: 520px) {
    padding-right: 12px;
  }
`;

const ContentWrapper = styled('div')`
  overflow-y: auto;
`;

const ElectionCountdownDays = styled('span')(({ theme }) => (`
  font-size: 24px;
  ${theme.breakpoints.down('md')} {
    font-size: 18px;
  }
  ${theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
`));

const ElectionCountdownText = styled('h3')(({ theme }) => (`
  font-size: 14px;
  font-weight: 700;
  color: #2E3C5D !important;
  padding-bottom: 8px;
  width: 100%;
  text-align: center;
  ${theme.breakpoints.down('md')} {
    font-size: 12px;
    margin-left: 2px;
    margin-top: 2px;
    text-align: center;
  }
  ${theme.breakpoints.down('sm')} {
    font-size: 10px;
    margin-left: 2px;
    margin-top: 2px;
    text-align: left;
  }
`));

const FooterBarWrapper = styled('div')(({ theme }) => (`
  background: #fff;
  border-top: 1px solid #eee;
  bottom: 0;
  position: absolute;
  width: 100%;
  ${theme.breakpoints.down('md')} {
    box-shadow: ${standardBoxShadow('wide')};
  }
  @media print{
    display: none;
  }
`));

const SharedItemFollowToggleWrapper = styled('div')`
`;

const FriendToggleWrapper = styled('div')`
  padding-right: 8px;
`;

const IntroductionWrapper = styled('div')`
  margin: 0 15px;
  margin-bottom: 45px;
`;

const IntroHeader = styled('div')(({ theme }) => (`
  color: #2e3c5d;
  font-size: 20px;
  font-weight: 600;
  padding-top: 20px;
  padding-bottom: 0;
  text-align: left;
  ${theme.breakpoints.down('sm')} {
    font-size: 16px;
    padding-top: 20px;
  }
`));

const IntroHeaderOptional = styled('span')`
  color: #999;
  font-weight: 400;
`;

const IntroductionTopHeader = styled('div')(({ theme }) => (`
  color: #2e3c5d;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  padding-top: 20px;
  padding-bottom: 0;
  text-align: center;
  ${theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`));

// const ModalTitleSharedByHidden = `
//   height: 40px;
//   ${theme.breakpoints.down('sm')} {
//     height: 40px;
//   }
// `;

const ModalTitleSharedByShown = `
  // height: 177px;
`;

const ModalTitleArea = styled('div', {
  shouldForwardProp: (prop) => !['hideSharedByIntro'].includes(prop),
})(({ hideSharedByIntro, theme }) => (`
  background: #fff;
  box-shadow: 0 20px 40px -25px #999;
  padding: 8px;
  z-index: 999;
  position: absolute;
  top: 0;
  width: 100%;
  ${hideSharedByIntro ? (`
      height: 40px;
      ${theme.breakpoints.down('sm')} {
        height: 40px;
      }
    `) : ModalTitleSharedByShown}
`));

const ModalTitleOneRow = styled('div')`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

// const ModalContentSharedByHidden = `
//   // background: green;
//   margin: 50px 0 0 0 !important;
//   ${theme.breakpoints.down('sm')} {
//     margin: 46px 0 0 0 !important;
//   }
// `;

// const ModalContentSharedByShown = `
//   // background: red;
//   margin: 190px 0 0 0 !important;
//   ${theme.breakpoints.down('sm')} {
//     margin: 147px 0 0 0 !important;
//   }
// `;

const ModalContent = styled('div')`
  height: ${isWebApp() ? 'unset' : 'unset'};
  width: 100%;
`;

const ModalContentInnerWrapper = styled('div', {
  shouldForwardProp: (prop) => !['hideSharedByIntro'].includes(prop),
})(({ hideSharedByIntro, theme }) => (`
  ${hideSharedByIntro ? (`
    margin: 50px 0 0 0 !important;
    ${theme.breakpoints.down('sm')} {
      margin: 46px 0 0 0 !important;
    }
  `) : (`
    margin: 190px 0 0 0 !important;
    ${theme.breakpoints.down('sm')} {
      margin: 147px 0 0 0 !important;
    }
  `)}
`));

const NextButtonWrapper = styled('div')`
  width: 100%;
`;

const OpinionsAddedToPersonalizedScore = styled('div')(({ theme }) => (`
  color: ${theme.colors.grayMid};
  display: flex;
  font-size: 12px;
  justify-content: flex-start;
  margin-bottom: 4px;
  margin-top: 4px;
  ${theme.breakpoints.down('sm')} {
    font-size: 10px;
  }
`));

const OpinionsAddedText = styled('div')`
  margin-left: 4px;
`;

const OrganizationImageWrapper = styled('div')`
  margin-top: 6px !important;
`;

const OrganizationNameColumn = styled('div')`
`;

const OrganizationNameText = styled('div')`
  font-size: 22px;
  font-weight: 600;
`;

const PersonalizedScoreDescription = styled('div')(({ theme }) => (`
  font-size: 16px;
  padding-bottom: 12px;
  ${theme.breakpoints.down('sm')} {
    padding-bottom: 30px;
  }
`));

const PersonalizedScoreWrapper = styled('div')`
  margin: 0 15px;
  margin-bottom: 45px;
`;

const SharedByOrganizationOuterWrapper = styled('div')(({ theme }) => (`
  display: flex;
  justify-content: center;
  width: 100% !important;
  ${theme.breakpoints.up('md')} {
    position: relative;
  }
`));

const SharedByOrganizationInnerWrapper = styled('div')`
  margin: 0 !important;
  max-width: 450px;
  padding: 0 4px 12px 4px !important;
  transition: all 200ms ease-in;
`;

const SharedByOrganization = styled('div')`
  display: flex;
  flex-grow: 8;
`;

const SharedByOrganizationTopRow = styled('div')`
`;

const SharedByOrganizationBottomRow = styled('div')`
  // padding-bottom: 10px;
`;

const SharedContextText = styled('div')`
  color: #555;
  font-size: 14px;
`;

const SignInWrapper = styled('div')`
  margin: 30px 15px 60px 15px;
`;

const SlideShowTitle = styled('h3')(({ theme }) => (`
  font-weight: bold;
  font-size: 24px;
  margin-top:  16px;
  ${theme.breakpoints.down('sm')} {
    font-size: 20px;
    margin-top: 32px;
  }
`));

const StepsOuterWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
  padding-top: 4px;
  width: 100%;
`;

const StepsWrapper = styled('div', {
  shouldForwardProp: (prop) => !['width'].includes(prop),
})(({ width }) => (`
  width: ${`${width}px`};
`));

const SharedItemTwoButtonsWrapper = styled('div')`
  width: 100%;
  padding: 4px 8px 12px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default withTheme(withStyles(styles)(SharedItemModal));

