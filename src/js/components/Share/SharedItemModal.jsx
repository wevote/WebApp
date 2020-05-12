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
import BallotStore from '../../stores/BallotStore';
import BallotActions from '../../actions/BallotActions';
import { cordovaFooterHeight, cordovaNetworkNextButtonTop } from '../../utils/cordovaOffsets';
import { hasIPhoneNotch, isCordova, isWebApp } from '../../utils/cordovaUtils';
import FollowToggle from '../Widgets/FollowToggle';
import ImageHandler from '../ImageHandler';
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
      organizationPhotoUrlLarge: '',
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
    // console.log('sharedItemCode:', sharedItemCode);
    const electionDayText = BallotStore.currentBallotElectionDate;
    if (!electionDayText) {
      BallotActions.voterBallotItemsRetrieve(0, '', '');
    }
    this.setState({
      sharedItemCode,
    });
    ShareActions.sharedItemRetrieveByCode(sharedItemCode);
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
    if (organization && organization.organization_name) {
      // While typing 'Tom Smith' in the org field, without the following line, when you get to 'Tom ', autosaving trims and overwrites it to 'Tom' before you can type the 'S'
      // console.log('onOrganizationStoreChange: \'' + organization.organization_name + "' '" + this.state.organizationName + "'");
      if (organization.organization_name.trim() !== this.state.organizationName.trim()) {
        this.setState({
          organizationName: organization.organization_name,
          organizationPhotoUrlLarge: organization.organization_photo_url_large,
        });
      }
    }
  }

  onShareStoreChange () {
    // console.log('SharedItemLanding onShareStoreChange');
    const { sharedItemCode } = this.state;
    if (sharedItemCode) {
      const sharedItem = ShareStore.getSharedItemByCode(sharedItemCode);
      const { shared_by_organization_we_vote_id: sharedByOrganizationWeVoteId } = sharedItem;
      const organization = OrganizationStore.getOrganizationByWeVoteId(sharedByOrganizationWeVoteId);
      if (organization && organization.organization_name) {
        // console.log('onOrganizationStoreChange: \'' + organization.organization_name + "' '" + this.state.organizationName + "'");
        if (organization.organization_name.trim() !== this.state.organizationName.trim()) {
          this.setState({
            organizationName: organization.organization_name,
            organizationPhotoUrlLarge: organization.organization_photo_url_large,
          });
        }
      } else {
        OrganizationActions.organizationRetrieve(sharedByOrganizationWeVoteId);
      }
      this.setState({
        sharedByOrganizationWeVoteId,
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
      organizationName, organizationPhotoUrlLarge,
      sharedByOrganizationWeVoteId,
      sharedItemCode,
    } = this.state;

    if (!sharedItemCode) {
      return null;
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
            <SharedByOrganizationWrapper>
              {organizationPhotoUrlLarge && (
                <OrganizationImageWrapper>
                  <ImageHandler
                    imageUrl={organizationPhotoUrlLarge}
                    hidePlaceholder
                    sizeClassName="icon-lg "
                  />
                </OrganizationImageWrapper>
              )}
              <OrganizationNameWrapper>
                {organizationName}
              </OrganizationNameWrapper>
            </SharedByOrganizationWrapper>
            <FollowToggleWrapper className="u-show-desktop-tablet">
              <FollowToggle
                platformType="mobile"
                organizationWeVoteId={sharedByOrganizationWeVoteId}
                showFollowingText
              />
            </FollowToggleWrapper>
            <SharedItemIntroduction />
          </ModalContent>
        </ContentWrapper>
        <FooterBarWrapper style={{ height: `${cordovaFooterHeight()}` }}>
          <OneButtonWrapper>
            <Button
              classes={{ root: classes.buttonRoot }}
              color="primary"
              id="sharedItemModalContinueButton"
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
  tabStyle: {
    fontWeight: 600,
  },
  Box: {
    padding: 2,
  },
  backButtonRoot: {
    width: '95%',
  },
  nextButtonRoot: {
    width: '100%',
  },
});

const ContentWrapper = styled.div`
  overflow-y: auto;
`;

const ElectionCountdownDays = styled.span`
  font-size: 32px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
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
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 10px;
    margin-left: 2px;
    margin-top: 2px;
    text-align: left;
  }
`;

const FollowToggleWrapper = styled.div`
`;

const FooterBarWrapper = styled.div`
  background: #fff;
  border-top: 1px solid #eee;
  bottom: 0;
  // box-shadow: 0 -4px 4px -1px rgba(0, 0, 0, .2), 0 -4px 5px 0 rgba(0, 0, 0, .14), 0 -1px 10px 0 rgba(0, 0, 0, .12);
  height: 45px;
  position: absolute;
  width: 100%;
  @media print{
    display: none;
  }
`;

const OneButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 4px 8px 0 8px;
  width: 100%;
`;

const OrganizationImageWrapper = styled.div`
`;

const OrganizationNameWrapper = styled.div`
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
  margin: 0 auto;
  padding: 35px 0 77px 0;
`;

const SharedByOrganizationWrapper = styled.div`
  margin-right: 12px;
`;

export default withTheme(withStyles(styles)(SharedItemModal));

