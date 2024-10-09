import { FormControl, FormControlLabel, Radio } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import SupportActions from '../../actions/SupportActions';
import { isAndroidSizeMD } from '../../common/utils/cordovaUtils'; // hasIPhoneNotch,
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import { openSnackbar } from '../../common/components/Widgets/SnackNotifier';

const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../../common/components/SignIn/SignInModal'));

class PositionPublicToggle extends Component {
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
    this.showItemToPublic = this.showItemToPublic.bind(this);
    this.togglePositionPublicHelpModal = this.togglePositionPublicHelpModal.bind(this);
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

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
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
    openSnackbar({ message: 'Endorsement now visible to WeVote friends only!' });
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
    const { inTestMode, showPositionPublicHelpModal, voterWeVoteId } = this.state;
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

    return (
      <PositionPublicToggleOuterWrapper className={this.props.className}>
        { showPositionPublicHelpModal && (
          <Suspense fallback={<></>}>
            <SignInModal
              signedInContentHeader={(
                <>
                  Your endorsement is now visible to the public. Click the &quot;Friends&quot; toggle to show to WeVote friends only.
                </>
              )}
              signInTitle="Sign in to make your endorsements public."
              signInSubTitle=""
              signedInTitle={<>Public</>}
              signedOutTitle={<>Show to Public</>}
              toggleOnClose={this.togglePositionPublicHelpModal}
              // uponSuccessfulSignIn <= Not in this case
            />
          </Suspense>
        )}
        <PositionPublicToggleInnerWrapper onKeyDown={onKeyDown}>
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
                  style={{ marginRight: `${isAndroidSizeMD() ? '10px' : ''}` }}
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
        </PositionPublicToggleInnerWrapper>
      </PositionPublicToggleOuterWrapper>
    );
  }
}
PositionPublicToggle.propTypes = {
  ballotItemType: PropTypes.string.isRequired,
  ballotItemWeVoteId: PropTypes.string.isRequired,
  classes: PropTypes.object,
  className: PropTypes.string.isRequired,
  externalUniqueId: PropTypes.string,
  inTestMode: PropTypes.bool,
  preventStackedButtons: PropTypes.bool,
};

const styles = (theme) => ({
  radioPrimary: {
    padding: '.1rem',
    marginRight: '4px',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
  },
  radioLabel: {
    fontSize: '14px',
    // bottom: '4px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      fontSize: '13px',
    },
    marginRight: isAndroidSizeMD() ? '2px' : '',
  },
  formControl: {
    width: '100%',
  },
});

const PositionPublicToggleOuterWrapper = styled('div')`
  // margin-left: auto;
  width: fit-content;
  //padding-top: 12px;
`;

const PositionPublicToggleInnerWrapper = styled('div')(({ theme }) => (`
  padding-left: 15px;
  ${theme.breakpoints.down('md')} {
    padding-top: 4px;
    margin-bottom: 10px;
  }
`));

const RadioItem = styled('div', {
  shouldForwardProp: (prop) => !['preventStackedButtons'].includes(prop),
})(({ preventStackedButtons, theme }) => (`
  ${!preventStackedButtons && theme.breakpoints.down('xs') ? (`
      // width: 100% !important;
      // min-width: 100% !important;
      // margin-bottom: -6px;
      padding-right: 6px;
  `) : ''}
`));

const RadioGroup = styled('div', {
  shouldForwardProp: (prop) => !['preventStackedButtons'].includes(prop),
})(({ preventStackedButtons, theme }) => (`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  height: 40px;
  ${theme.breakpoints.down('md')} {
    margin-bottom: -10px;
  }
  ${theme.breakpoints.down('xs')} {
    ${preventStackedButtons ? '' : 'flex-flow: row wrap;'}
    margin-bottom: 0;
  }
`));


export default withStyles(styles)(PositionPublicToggle);
