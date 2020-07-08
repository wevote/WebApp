import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import BallotStore from '../../stores/BallotStore';
import BallotActions from '../../actions/BallotActions';
import { cordovaFooterHeight, cordovaNetworkNextButtonTop } from '../../utils/cordovaOffsets';
import { hasIPhoneNotch, isCordova, isWebApp } from '../../utils/cordovaUtils';
import FollowToggle from '../Widgets/FollowToggle';
import FriendToggle from '../Friends/FriendToggle';
import ImageHandler from '../ImageHandler';
import { isSpeakerTypeOrganization, isSpeakerTypePublicFigure } from '../../utils/organization-functions';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';
import ShareActions from '../../actions/ShareActions';
import SharedItemIntroduction from './SharedItemIntroduction';
import ShareStore from '../../stores/ShareStore';
import VoterStore from '../../stores/VoterStore';
import { formatDateToMonthDayYear } from '../../utils/textFormat';

class SharedItemModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    show: PropTypes.bool,
    closeSharedItemModal: PropTypes.func,
    sharedItemCode: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      organizationName: '',
      organizationPhotoUrlMedium: '',
      sharedByOrganizationWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log('SharedItemModal componentDidMount');
    this.onBallotStoreChange();
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
      } else {
        ShareActions.sharedItemRetrieveByCode(sharedItemCode);
      }
    }
    // console.log('sharedItemCode:', sharedItemCode);
    const electionDayText = BallotStore.currentBallotElectionDate;
    if (!electionDayText) {
      BallotActions.voterBallotItemsRetrieve(0, '', '');
    }
    this.setState({
      sharedItemCode,
    });
  }

  componentWillUnmount () {
    // console.log('SharedItemModal componentWillUnmount');
    this.ballotStoreListener.remove();
    this.organizationStoreListener.remove();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onBallotStoreChange () {
    const electionDayText = BallotStore.currentBallotElectionDate;
    // console.log('electionDayText:', electionDayText);
    if (electionDayText) {
      // const electionDayTextFormatted = electionDayText ? moment(electionDayText).format('MMM Do, YYYY') : '';
      const electionDayTextDateFormatted = electionDayText ? moment(electionDayText).format('MM/DD/YYYY') : '';
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
      // While typing 'Tom Smith' in the org field, without the following line, when you get to 'Tom ', autosaving trims and overwrites it to 'Tom' before you can type the 'S'
      // console.log('onOrganizationStoreChange: \'' + organization.organization_name + "' '" + this.state.organizationName + "'");
      if (!organization.organization_name.startsWith('Voter-wv') && organization.organization_name.trim() !== this.state.organizationName.trim()) {
        this.setState({
          organizationName: organization.organization_name,
          organizationPhotoUrlMedium: organization.organization_photo_url_medium,
        });
      }
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
      this.setState({
        sharedByOrganizationType,
        sharedByOrganizationWeVoteId,
        sharedByVoterWeVoteId,
      });
    }
  }

  onVoterStoreChange () {
  }

  closeSharedItemModalLocal = () => {
    // console.log('voterVerifySecretCode this.props.closeSharedItemModal:', this.props.closeSharedItemModal);
    if (this.props.closeSharedItemModal) {
      this.props.closeSharedItemModal();
    }
  };

  render () {
    renderLog('SharedItemModal');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('SharedItemModal render');
    const { classes } = this.props;
    const {
      days, electionDate,
      organizationName, organizationPhotoUrlMedium,
      sharedByOrganizationType, sharedByOrganizationWeVoteId, sharedByVoterWeVoteId,
      sharedItemCode,
    } = this.state;

    if (!sharedItemCode) {
      return null;
    }

    const sharingContextText = 'has shared this page with you.';
    // console.log('sharedByOrganizationType:', sharedByOrganizationType, ', sharedByVoterWeVoteId:', sharedByVoterWeVoteId);
    const developmentFeatureTurnedOn = false;
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
          <ModalTitleArea>
            {!!(days && electionDate) && (
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
            >
              <CloseIcon />
            </IconButton>
          </ModalTitleArea>
          <ModalContent style={{ padding: `${isWebApp() ? 'undefined' : '37px 0 2px 0'}` }}>
            {!!(sharedByOrganizationWeVoteId && organizationName) && (
              <SharedByOrganizationOuterWrapper>
                <SharedByOrganizationInnerWrapper>
                  <SharedByOrganizationTopRow>
                    <SharedByOrganization
                      id={`sharedByOrganizationWeVoteId-${sharedByOrganizationWeVoteId}`}
                    >
                      {/* SharedByOrganization Image */}
                      <OrganizationImageWrapper>
                        <ImageHandler
                          className="card-main__avatar-compressed"
                          sizeClassName="icon-candidate-small u-push--sm "
                          imageUrl={organizationPhotoUrlMedium}
                          alt={`${organizationName}`}
                          kind_of_ballot_item="CANDIDATE"
                        />
                      </OrganizationImageWrapper>
                      {/* SharedByOrganization Name */}
                      <OrganizationNameColumn>
                        <OrganizationNameText>
                          {!organizationName ? 'Loading name...' : organizationName}
                        </OrganizationNameText>
                        <SharedContextText>{sharingContextText}</SharedContextText>
                      </OrganizationNameColumn>
                    </SharedByOrganization>
                    {!!(organizationName && developmentFeatureTurnedOn) && (
                      <OpinionsAddedToPersonalizedScore>
                        <InfoIcon classes={{ root: classes.informationIcon }} />
                        <OpinionsAddedText>
                          {organizationName}
                          &apos;s opinions will be added to your personalized scores.
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
                      <FollowToggleWrapper>
                        <FollowToggle
                          lightModeOn
                          organizationWeVoteId={sharedByOrganizationWeVoteId}
                          platformType="allPlatforms"
                          showFollowingText
                        />
                      </FollowToggleWrapper>
                    </ActionButtonsRow>
                  </SharedByOrganizationBottomRow>
                </SharedByOrganizationInnerWrapper>
              </SharedByOrganizationOuterWrapper>
            )}
            <SharedItemIntroduction />
            <br />
            <br />
            <br />
          </ModalContent>
        </ContentWrapper>
        <FooterBarWrapper style={{ height: `${cordovaFooterHeight()}` }}>
          <OneButtonWrapper>
            <Button
              classes={{ root: classes.buttonRoot }}
              color="primary"
              id="sharedItemModalContinueButton"
              onClick={this.closeSharedItemModalLocal}
              style={{ top: `${cordovaNetworkNextButtonTop()}` }}
              variant="contained"
            >
              Continue
            </Button>
          </OneButtonWrapper>
        </FooterBarWrapper>
      </Dialog>
    );
  }
}

const styles = theme => ({
  buttonRoot: {
    fontSize: 12,
    // padding: '4px 8px',
    height: 32,
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {
      // padding: '4px 4px',
    },
  },
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
      zIndex: '9010 !important',
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
});

const ActionButtonsRow = styled.div`
  display: flex;
  justify-content: flex-start;
  // margin-top: 10px;
`;

const ContentWrapper = styled.div`
  overflow-y: auto;
`;

const ElectionCountdownDays = styled.span`
  font-size: 24px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 18px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 13px;
  }
`;

const ElectionCountdownText = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #2E3C5D !important;
  width: fit-content;
  padding-bottom: 8px;
  width: 100%;
  text-align: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 12px;
    margin-left: 2px;
    margin-top: 2px;
    text-align: center;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 10px;
    margin-left: 2px;
    margin-top: 2px;
    text-align: left;
  }
`;

const FooterBarWrapper = styled.div`
  background: #fff;
  border-top: 1px solid #eee;
  bottom: 0;
  height: 45px;
  position: absolute;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    box-shadow: 0 -4px 4px -1px rgba(0, 0, 0, .2), 0 -4px 5px 0 rgba(0, 0, 0, .14), 0 -1px 10px 0 rgba(0, 0, 0, .12);
  }
  @media print{
    display: none;
  }
`;

const FollowToggleWrapper = styled.div`
`;

const FriendToggleWrapper = styled.div`
  padding-right: 8px;
`;

const ModalTitleArea = styled.div`
  background: #fff;
  box-shadow: 0 20px 40px -25px #999;
  padding: 8px;
  z-index: 999;
  display: flex;
  height: 40px;
  justify-content: flex-start;
  position: absolute;
  top: 0;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 35px;
  }
`;

const ModalContent = styled.div`
  height: ${isWebApp() ? '100%' : 'unset'};
  width: 100%;
  margin: 50px 0 0 0 !important;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 40px 0 0 0 !important;
  }
`;

const OneButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 4px 8px 0 8px;
  width: 100%;
`;

const OpinionsAddedToPersonalizedScore = styled.div`
  color: ${({ theme }) => theme.colors.grayMid};
  display: flex;
  font-size: 12px;
  justify-content: flex-start;
  margin-bottom: 4px;
  margin-top: 4px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 10px;
  }
`;

const OpinionsAddedText = styled.div`
  margin-left: 4px;
`;

const OrganizationImageWrapper = styled.div`
  margin-top: 6px !important;
`;

const OrganizationNameColumn = styled.div`
`;

const OrganizationNameText = styled.div`
  font-size: 22px;
  font-weight: 600;
`;

const SharedByOrganizationOuterWrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayBorder};
  display: flex;
  justify-content: center;
  width: 100% !important;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    position: relative;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
  }
`;

const SharedByOrganizationInnerWrapper = styled.div`
  margin: 0 !important;
  max-width: 450px;
  padding: 0 12px 12px 12px !important;
  transition: all 200ms ease-in;
`;

const SharedByOrganization = styled.div`
  display: flex;
  flex-grow: 8;
`;

const SharedByOrganizationTopRow = styled.div`
`;

const SharedByOrganizationBottomRow = styled.div`
  // padding-bottom: 10px;
`;

const SharedContextText = styled.div`
  color: #555;
  font-size: 14px;
`;
export default withTheme(withStyles(styles)(SharedItemModal));

