import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography, Radio, FormControlLabel, FormControl } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import { isCordova, isWebApp } from '../../utils/cordovaUtils'; // hasIPhoneNotch,
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import SettingsAccount from '../Settings/SettingsAccount';
import SupportActions from '../../actions/SupportActions';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import { openSnackbar } from './SnackNotifier';
// import VoterActions from '../../actions/VoterActions';
// import VoterConstants from '../../constants/VoterConstants';

class PositionPublicToggle extends Component {
  static propTypes = {
    ballotItemType: PropTypes.string.isRequired,
    ballotItemWeVoteId: PropTypes.string.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string.isRequired,
    externalUniqueId: PropTypes.string,
    inTestMode: PropTypes.bool,
    preventStackedButtons: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemWeVoteId: '',
      componentDidMount: false,
      voterPositionIsPublic: null,
      inTestMode: false,
      isSignedIn: null,
      showPositionPublicHelpModal: false,
      voterWeVoteId: '',
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { ballotItemWeVoteId, inTestMode } = this.props;

    let voterPositionIsPublic = false;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    if (ballotItemStatSheet) {
      ({ voterPositionIsPublic } = ballotItemStatSheet);
    }
    this.setState({
      ballotItemWeVoteId,
      componentDidMount: true,
      inTestMode,
      voterPositionIsPublic,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.onVoterStoreChange();
    const { ballotItemWeVoteId } = nextProps;
    let voterPositionIsPublic = false;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    if (ballotItemStatSheet) {
      ({ voterPositionIsPublic } = ballotItemStatSheet);
    }
    this.setState({
      ballotItemWeVoteId,
      voterPositionIsPublic,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.ballotItemWeVoteId !== nextState.ballotItemWeVoteId) {
      // console.log('this.state.ballotItemWeVoteId:', this.state.ballotItemWeVoteId, ', nextState.ballotItemWeVoteId: ', nextState.ballotItemWeVoteId);
      return true;
    }
    if (this.state.componentDidMount !== nextState.componentDidMount) {
      // console.log('this.state.componentDidMount:', this.state.componentDidMount, ', nextState.componentDidMount: ', nextState.componentDidMount);
      return true;
    }
    if (this.state.voterPositionIsPublic !== nextState.voterPositionIsPublic) {
      // console.log('this.state.voterPositionIsPublic:', this.state.voterPositionIsPublic, ', nextState.voterPositionIsPublic: ', nextState.voterPositionIsPublic);
      return true;
    }
    if (this.state.isSignedIn !== nextState.isSignedIn) {
      // console.log('this.state.isSignedIn:', this.state.isSignedIn, ', nextState.isSignedIn: ', nextState.isSignedIn);
      return true;
    }
    if (this.state.showPositionPublicHelpModal !== nextState.showPositionPublicHelpModal) {
      // console.log('this.state.showPositionPublicHelpModal:', this.state.showPositionPublicHelpModal, ', nextState.showPositionPublicHelpModal: ', nextState.showPositionPublicHelpModal);
      return true;
    }
    if (this.state.voterWeVoteId !== nextState.voterWeVoteId) {
      // console.log('this.state.voterWeVoteId:', this.state.voterWeVoteId, ', nextState.voterWeVoteId: ', nextState.voterWeVoteId);
      return true;
    }
    // console.log('shouldComponentUpdate false');
    return false;
  }

  componentWillUnmount () {
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onSupportStoreChange () {
    const { ballotItemWeVoteId } = this.state;
    let voterPositionIsPublic = false;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    if (ballotItemStatSheet) {
      ({ voterPositionIsPublic } = ballotItemStatSheet);
    }
    this.setState({
      voterPositionIsPublic,
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const { is_signed_in: isSignedIn, we_vote_id: voterWeVoteId } = voter;
    this.setState({
      isSignedIn,
      voterWeVoteId,
    });
  }

  handlePositionToggle = (evt) => {
    const { value } = evt.target;
    if (value === 'Public') {
      this.showItemToPublic();
    } else {
      this.showItemToFriendsOnly();
    }
  };

  showItemToFriendsOnly () {
    this.setState({
      voterPositionIsPublic: false,
    });

    // console.log("PositionPublicToggle-showItemToFriendsOnly, this.props.ballotItemType:", this.props.ballotItemType);
    SupportActions.voterPositionVisibilitySave(this.state.ballotItemWeVoteId, this.props.ballotItemType, 'FRIENDS_ONLY');
    openSnackbar({ message: 'Endorsement now visible to We Vote friends only!' });
  }

  showItemToPublic () {
    const { inTestMode, isSignedIn } = this.state;

    // console.log("PositionPublicToggle-showItemToPublic, this.props.ballotItemType:", this.props.ballotItemType);
    if (inTestMode) {
      this.setState({
        voterPositionIsPublic: true,
      });
      openSnackbar({ message: 'Endorsement now visible to anyone!' });
    } else if (isSignedIn) {
      this.setState({
        voterPositionIsPublic: true,
      });
      SupportActions.voterPositionVisibilitySave(this.state.ballotItemWeVoteId, this.props.ballotItemType, 'SHOW_PUBLIC');
      // TODO DALE: const positionPublicToggleModalHasBeenShown = VoterStore.getInterfaceFlagState(VoterConstants.POSITION_PUBLIC_MODAL_SHOWN);
      const positionPublicToggleModalHasBeenShown = false;
      if (!positionPublicToggleModalHasBeenShown) {
        this.togglePositionPublicHelpModal();
        // TODO DALE: VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.POSITION_PUBLIC_MODAL_SHOWN);
      } else {
        openSnackbar({ message: 'Endorsement now visible to anyone!' });
      }
    } else {
      this.togglePositionPublicHelpModal();
    }
  }

  togglePositionPublicHelpModal () {
    const { showPositionPublicHelpModal } = this.state;
    this.setState({
      showPositionPublicHelpModal: !showPositionPublicHelpModal,
    });
  }

  render () {
    renderLog('PositionPublicToggle');  // Set LOG_RENDER_EVENTS to log all renders
    const { preventStackedButtons, classes } = this.props;
    const { inTestMode, isSignedIn, voterWeVoteId } = this.state;
    let { voterPositionIsPublic } = this.state;
    if (!voterWeVoteId) {
      return <div className="undefined-props" />;
    }

    let onChange;
    const _this = this;
    if (voterPositionIsPublic) {
      onChange = () => {
        voterPositionIsPublic = false;

        // TODO Somehow cause the tooltip to update if inTestMode
        if (!inTestMode) {
          _this.showItemToFriendsOnly();
        }
      };
    } else {
      onChange = () => {
        voterPositionIsPublic = true;

        // TODO Somehow cause the tooltip to update if inTestMode
        if (!inTestMode) {
          _this.showItemToPublic();
        }
      };
    }

    // this onKeyDown function is for accessibility: the parent div of the toggle
    // has a tab index so that users can use tab key to select the toggle, and then
    // press either space or enter (key codes 32 and 13, respectively) to toggle
    const onKeyDown = (e) => {
      const enterAndSpaceKeyCodes = [13, 32];
      if (enterAndSpaceKeyCodes.includes(e.keyCode)) {
        onChange();
      }
    };

    // This modal is shown when the user clicks on public position toggle either when not signed in
    // or for the first time after being signed in.
    const PositionPublicToggleHelpModal = (
      <Dialog
        classes={{ paper: classes.dialogPaper, root: classes.dialogRoot }}
        open={this.state.showPositionPublicHelpModal}
        onClose={() => { this.togglePositionPublicHelpModal(); }}
      >
        <DialogTitle>
          <Typography component="span" variant="h6" className="text-center">
            {isSignedIn ? 'Public' : 'Show to Public'}
          </Typography>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.togglePositionPublicHelpModal(); }}
            id="profileClosePositionPublicToggle"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          {isSignedIn ? (
            <div className="text-center">
              <div className="u-f3">Your endorsement is now visible to anyone.</div>
              <br />
              <div className="u-f6">Click the &quot;Friends&quot; toggle to show to We Vote friends only.</div>
            </div>
          ) : (
            <div>
              <SettingsAccount
                pleaseSignInTitle="Sign in to Make Your Endorsements Public"
                pleaseSignInSubTitle=""
                inModal
              />
            </div>
          )}
          <br />
          <br />
        </DialogContent>
      </Dialog>
    );

    return (
      <Wrapper className={this.props.className}>
        { this.state.showPositionPublicHelpModal ? PositionPublicToggleHelpModal : null }
        <PublicToggle onKeyDown={onKeyDown}>
          <FormControl classes={{ root: classes.formControl }}>
            <RadioGroup
              onChange={this.handlePositionToggle}
            >
              <RadioItem preventStackedButtons={preventStackedButtons}>
                <FormControlLabel
                  classes={{ label: classes.radioLabel }}
                  id={`positionPublicToggleFriendsOnly-${this.props.externalUniqueId}`}
                  value="Friends Only"
                  label={isMobileScreenSize() ? 'Friends' : 'Friends Only'}
                  labelPlacement="end"
                  control={
                    (
                      <Radio
                        classes={{ colorPrimary: classes.radioPrimary }}
                        color="primary"
                        checked={voterPositionIsPublic === false}
                      />
                    )
                  }
                />
              </RadioItem>
              <RadioItem preventStackedButtons={preventStackedButtons}>
                <FormControlLabel
                  id={`positionPublicTogglePublic-${this.props.externalUniqueId}`}
                  classes={{ label: classes.radioLabel }}
                  value="Public"
                  label="Public"
                  labelPlacement="end"
                  control={
                    (
                      <Radio
                        classes={{ colorPrimary: classes.radioPrimary }}
                        color="primary"
                        checked={voterPositionIsPublic === true}
                      />
                    )
                  }
                />
              </RadioItem>
            </RadioGroup>
          </FormControl>
        </PublicToggle>
      </Wrapper>
    );
  }
}

const styles = theme => ({
  dialogRoot: isCordova() ? {
    height: '100%',
    position: 'absolute !important',
    top: '-15%',
    left: '0% !important',
    right: 'unset !important',
    bottom: 'unset !important',
    width: '100%',
  } : {},
  dialogPaper: isWebApp() ? {
    [theme.breakpoints.down('sm')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      maxHeight: '90%',
      margin: '0 auto',
    },
  } : {
    margin: '0 !important',
    width: '95%',
    height: 'unset',
    maxHeight: '90%',
    offsetHeight: 'unset !important',
    top: '50%',
    left: '50%',
    right: 'unset !important',
    bottom: 'unset !important',
    position: 'absolute',
    transform: 'translate(-50%, -25%)',
  },
  dialogContent: {
    [theme.breakpoints.down('md')]: {
      padding: '0 8px 8px',
    },
  },
  radioPrimary: {
    padding: '.1rem',
    margin: '.1rem .1rem .6rem .6rem',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
  },
  radioLabel: {
    fontSize: '14px',
    bottom: '4px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      fontSize: '11px',
    },
  },
  formControl: {
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: `${theme.spacing(1)}px`,
    top: `${theme.spacing(1)}px`,
  },
});

const Wrapper = styled.div`
  margin-left: auto;
  width: fit-content;
`;

const PublicToggle = styled.div`
  padding-left: 15px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 4px;
    margin-bottom: 10px;
  }
`;

const RadioItemStackedStyles = `
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    width: 100% !important;
    min-width: 100% !important;
    margin-bottom: -6px;
  }
`;

const RadioItem = styled.div`
  ${({ preventStackedButtons }) => ((preventStackedButtons) ? '' : RadioItemStackedStyles)}
`;

const RadioGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: -10px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    ${({ preventStackedButtons }) => ((preventStackedButtons) ? '' : 'flex-flow: row wrap;')}
    margin-bottom: 0;
  }
`;


export default withStyles(styles)(PositionPublicToggle);
