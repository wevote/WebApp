import { Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, Radio, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import ActivityStore from '../../stores/ActivityStore';
import VoterStore from '../../stores/VoterStore';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import { openSnackbar } from '../Widgets/SnackNotifier';

const SettingsAccount = React.lazy(() => import(/* webpackChunkName: 'SettingsAccount' */ '../Settings/SettingsAccount'));


class ActivityPostPublicToggle extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visibilityIsPublic: false,
      inTestMode: false,
      isSignedIn: null,
      showActivityPostIsPublicHelpModal: false,
      voterWeVoteId: '',
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { initialVisibilityIsPublic: visibilityIsPublic, inTestMode } = this.props;
    const visibilityIsPublicBoolean = !!(visibilityIsPublic);
    this.setState({
      visibilityIsPublic: visibilityIsPublicBoolean,
      inTestMode,
    });
  }

  componentWillUnmount () {
    this.activityStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onActivityStoreChange () {
    const { activityTidbitWeVoteId } = this.props;
    if (activityTidbitWeVoteId) {
      const activityTidbit = ActivityStore.getActivityTidbitByWeVoteId(activityTidbitWeVoteId);
      if (activityTidbit) {
        const {
          visibility_is_public: visibilityIsPublic,
        } = activityTidbit;

        this.setState({
          visibilityIsPublic,
        });
      }
    }
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const { is_signed_in: isSignedIn, we_vote_id: voterWeVoteId } = voter;
    this.setState({
      isSignedIn,
      voterWeVoteId,
    });
  }

  handleRadioButtonChange = (evt) => {
    const { value } = evt.target;
    if (value === 'Public') {
      this.showItemToPublic();
    } else {
      this.showItemToFriendsOnly();
    }
  };

  showItemToFriendsOnly () {
    this.setState({
      visibilityIsPublic: false,
    });
    this.props.onToggleChange(false);
    openSnackbar({ message: 'Post now visible to We Vote friends only!' });
  }

  showItemToPublic () {
    const { inTestMode, isSignedIn } = this.state;

    // console.log('ActivityPostPublicToggle-showItemToPublic');
    if (inTestMode) {
      this.setState({
        visibilityIsPublic: true,
      });
      openSnackbar({ message: 'Post now visible to anyone!' });
    } else if (isSignedIn) {
      this.setState({
        visibilityIsPublic: true,
      });
      this.props.onToggleChange(true);
      const ActivityPostPublicToggleModalHasBeenShown = false; // Always show
      if (!ActivityPostPublicToggleModalHasBeenShown) {
        this.toggleActivityPostIsPublicHelpModal();
        // TODO DALE: VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.POSITION_PUBLIC_MODAL_SHOWN);
      } else {
        openSnackbar({ message: 'Post now visible to anyone!' });
      }
    } else {
      this.toggleActivityPostIsPublicHelpModal();
    }
  }

  toggleActivityPostIsPublicHelpModal () {
    const { showActivityPostIsPublicHelpModal } = this.state;
    this.setState({
      showActivityPostIsPublicHelpModal: !showActivityPostIsPublicHelpModal,
    });
  }

  render () {
    renderLog('ActivityPostPublicToggle');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, externalUniqueId, preventStackedButtons } = this.props;
    const { inTestMode, isSignedIn, showActivityPostIsPublicHelpModal, voterWeVoteId } = this.state;
    let { visibilityIsPublic } = this.state;
    if (!voterWeVoteId) {
      return <div className="undefined-props" />;
    }

    let onChangeByKeypress;
    const _this = this;
    if (visibilityIsPublic) {
      onChangeByKeypress = () => {
        visibilityIsPublic = false;

        // TODO Somehow cause the tooltip to update if inTestMode
        if (!inTestMode) {
          _this.showItemToFriendsOnly();
        }
      };
    } else {
      onChangeByKeypress = () => {
        visibilityIsPublic = true;

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
        onChangeByKeypress();
      }
    };

    // This modal is shown when the user clicks on public toggle either when not signed in
    // or for the first time after being signed in.
    const ActivityPostIsPublicHelpModal = (
      <Dialog
        classes={{ paper: classes.dialogPaper, root: classes.dialogRoot }}
        open={showActivityPostIsPublicHelpModal}
        onClose={() => { this.toggleActivityPostIsPublicHelpModal(); }}
      >
        <DialogTitle>
          <Typography component="span" variant="h6" className="text-center">
            {isSignedIn ? 'Public' : 'Show to Public'}
          </Typography>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.toggleActivityPostIsPublicHelpModal(); }}
            id="profileCloseActivityPostPublicToggle"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          {isSignedIn ? (
            <div className="text-center">
              <div className="u-f3">Your post will be visible to anyone who is following you.</div>
              <br />
              <div className="u-f6">Click the &quot;Friends Only&quot; toggle to show to We Vote friends only.</div>
            </div>
          ) : (
            <div>
              <Suspense fallback={<></>}>
                <SettingsAccount
                  pleaseSignInTitle="Sign in to Make Your Posts Public"
                  pleaseSignInSubTitle=""
                  inModal
                />
              </Suspense>
            </div>
          )}
          <br />
          <br />
        </DialogContent>
      </Dialog>
    );

    return (
      <Wrapper className={this.props.className}>
        {showActivityPostIsPublicHelpModal ? ActivityPostIsPublicHelpModal : null}
        <PublicToggle onKeyDown={onKeyDown}>
          <FormControl classes={{ root: classes.formControl }}>
            <RadioGroup
              onChange={this.handleRadioButtonChange}
            >
              <RadioItem preventStackedButtons={preventStackedButtons}>
                <FormControlLabel
                  classes={{ label: classes.radioLabel }}
                  id={`ActivityPostPublicToggle-FriendsOnly-${externalUniqueId}`}
                  value="Friends Only"
                  label="Friends Only"
                  labelPlacement="end"
                  control={
                    (
                      <Radio
                        classes={{ colorPrimary: classes.radioPrimary }}
                        color="primary"
                        checked={visibilityIsPublic === false}
                      />
                    )
                  }
                />
              </RadioItem>
              <RadioItem preventStackedButtons={preventStackedButtons}>
                <FormControlLabel
                  id={`ActivityPostPublicToggle-Public-${externalUniqueId}`}
                  classes={{ label: classes.radioLabel }}
                  value="Public"
                  label="Public"
                  labelPlacement="end"
                  control={
                    (
                      <Radio
                        classes={{ colorPrimary: classes.radioPrimary }}
                        color="primary"
                        checked={visibilityIsPublic === true}
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
ActivityPostPublicToggle.propTypes = {
  activityTidbitWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
  externalUniqueId: PropTypes.string,
  initialVisibilityIsPublic: PropTypes.bool,
  inTestMode: PropTypes.bool,
  preventStackedButtons: PropTypes.bool,
  onToggleChange: PropTypes.func.isRequired,
};

const styles = (theme) => ({
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


export default withStyles(styles)(ActivityPostPublicToggle);
