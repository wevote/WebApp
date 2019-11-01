import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import SettingsAccount from '../Settings/SettingsAccount';
import SupportActions from '../../actions/SupportActions';
import SupportStore from '../../stores/SupportStore';
import VoterActions from '../../actions/VoterActions';
import VoterConstants from '../../constants/VoterConstants';
import VoterStore from '../../stores/VoterStore';
import { openSnackbar } from './SnackNotifier';

class PositionPublicToggle extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string.isRequired,
    externalUniqueId: PropTypes.string,
    inTestMode: PropTypes.bool,
    supportProps: PropTypes.object,
    type: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemWeVoteId: '',
      componentDidMount: false,
      isPublicPosition: null,
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
    let { supportProps } = this.props;
    if (this.props.ballotItemWeVoteId) {
      supportProps = SupportStore.get(this.props.ballotItemWeVoteId);
    }
    let isPublicPosition = false;
    if (supportProps && supportProps.is_public_position !== undefined) {
      isPublicPosition = supportProps.is_public_position;
    }

    this.setState({
      ballotItemWeVoteId,
      componentDidMount: true,
      inTestMode,
      isPublicPosition,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.onVoterStoreChange();
    const { ballotItemWeVoteId } = nextProps;
    let { supportProps } = nextProps;
    if (nextProps.ballotItemWeVoteId) {
      supportProps = SupportStore.get(nextProps.ballotItemWeVoteId);
    }
    let isPublicPosition = false;
    if (supportProps && supportProps.is_public_position !== undefined) {
      isPublicPosition = supportProps.is_public_position;
    }

    this.setState({
      ballotItemWeVoteId,
      isPublicPosition,
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
    if (this.state.isPublicPosition !== nextState.isPublicPosition) {
      // console.log('this.state.isPublicPosition:', this.state.isPublicPosition, ', nextState.isPublicPosition: ', nextState.isPublicPosition);
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
    const supportProps = SupportStore.get(this.state.ballotItemWeVoteId);
    let isPublicPosition = false;
    if (supportProps && supportProps.is_public_position !== undefined) {
      isPublicPosition = supportProps.is_public_position;
    }
    this.setState({
      isPublicPosition,
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
      isPublicPosition: false,
    });

    // console.log("PositionPublicToggle-showItemToFriendsOnly, this.props.type:", this.props.type);
    SupportActions.voterPositionVisibilitySave(this.state.ballotItemWeVoteId, this.props.type, 'FRIENDS_ONLY');
    openSnackbar({ message: 'Position now visible to friends only!' });
  }

  showItemToPublic () {
    const { inTestMode, isSignedIn } = this.state;

    // console.log("PositionPublicToggle-showItemToPublic, this.props.type:", this.props.type);
    if (inTestMode) {
      this.setState({
        isPublicPosition: true,
      });
      openSnackbar({ message: 'This position now visible to anyone on We Vote!' });
    } else if (isSignedIn) {
      this.setState({
        isPublicPosition: true,
      });
      SupportActions.voterPositionVisibilitySave(this.state.ballotItemWeVoteId, this.props.type, 'SHOW_PUBLIC');
      const positionPublicToggleModalHasBeenShown = VoterStore.getInterfaceFlagState(VoterConstants.POSITION_PUBLIC_MODAL_SHOWN);
      if (!positionPublicToggleModalHasBeenShown) {
        this.togglePositionPublicHelpModal();
        VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.POSITION_PUBLIC_MODAL_SHOWN);
      } else {
        openSnackbar({ message: 'This position now visible to anyone on We Vote!' });
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
    const { classes } = this.props;
    const { inTestMode, isSignedIn, voterWeVoteId } = this.state;
    let { isPublicPosition } = this.state;
    if (!voterWeVoteId) {
      return <div className="undefined-props" />;
    }

    let onChange;
    const _this = this;
    if (isPublicPosition) {
      onChange = () => {
        isPublicPosition = false;

        // TODO Somehow cause the tooltip to update if inTestMode
        if (!inTestMode) {
          _this.showItemToFriendsOnly();
        }
      };
    } else {
      onChange = () => {
        isPublicPosition = true;

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
        classes={{ paper: classes.dialogPaper }}
        open={this.state.showPositionPublicHelpModal}
        onClose={() => { this.togglePositionPublicHelpModal(); }}
      >
        <DialogTitle>
          <Typography variant="h6" className="text-center">Make Your Positions Public</Typography>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.togglePositionPublicHelpModal(); }}
            id="profileClosePositionPublicToggle"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <section className="card">
            <div className="text-center">
              {isSignedIn ? (
                <div>
                  <div className="u-f2">You have just made your position visible to anyone on We Vote.</div>
                  <div className="u-f4">If you do NOT want to share your position publicly, click the toggle again to restrict visibility to We Vote friends only.</div>
                </div>
              ) : (
                <div>
                  <SettingsAccount />
                </div>
              )}
              <br />
              We Vote makes it easy to share your views either publicly, or privately with your We Vote friends.
              <br />
              <br />
            </div>
          </section>
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
              <RadioItem>
                <FormControlLabel
                  classes={{ label: classes.radioLabel }}
                  id={`positionPublicToggleFriendsOnly-${this.props.externalUniqueId}`}
                  value="Friends Only"
                  label="Friends Only"
                  labelPlacement="end"
                  control={
                    (
                      <Radio
                        classes={{ colorPrimary: classes.radioPrimary }}
                        color="primary"
                        checked={isPublicPosition === false}
                      />
                    )
                  }
                />
              </RadioItem>
              <RadioItem>
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
                        checked={isPublicPosition === true}
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
  radioPrimary: {
    padding: '.1rem',
    margin: '.1rem .1rem .6rem .6rem',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
  },
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
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

const RadioItem = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100% !important;
    min-width: 100% !important;
    margin-bottom: -6px;
  }
`;

const RadioGroup = styled.div`
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: -10px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: flex;
    flex-flow: row nowrap;;
  }
`;


export default withStyles(styles)(PositionPublicToggle);
