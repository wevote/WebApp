import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-bootstrap/esm/Tooltip';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import { withStyles } from '@material-ui/core/esm/styles';
import styled from 'styled-components';
import Button from '@material-ui/core/esm/Button';
import DoneIcon from '@material-ui/icons/Done';
import ThumbsUpIcon from '@material-ui/icons/ThumbUp';
import ThumbsDownIcon from '@material-ui/icons/ThumbDown';
import CommentIcon from '@material-ui/icons/Comment';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import Dialog from '@material-ui/core/esm/Dialog';
import { cordovaDot } from '../../../utils/cordovaUtils';
import { renderLog } from '../../../utils/logging';
import { stringContains } from '../../../utils/textFormat';
import ShareButtonDropDown from '../ShareButtonDropdown';
import SupportActions from '../../../actions/SupportActions';
import VoterActions from '../../../actions/VoterActions';
import VoterConstants from '../../../constants/VoterConstants';
import VoterStore from '../../../stores/VoterStore';
import PositionPublicToggle from '../PositionPublicToggle';
import SupportStore from '../../../stores/SupportStore';
import webAppConfig from '../../../config';
import shareIconSvg from '../../../../img/global/svg-icons/share-icon.svg';
import { openSnackbar } from '../SnackNotifier';
import ChooseOrOppose from './ChooseOrOppose';

class ItemActionBar extends PureComponent {
  static propTypes = {
    ballotItemDisplayName: PropTypes.string,
    ballotItemWeVoteId: PropTypes.string.isRequired,
    buttonsOnly: PropTypes.bool,
    classes: PropTypes.object,
    commentButtonHide: PropTypes.bool,
    commentButtonHideInMobile: PropTypes.bool,
    // currentBallotIdInUrl: PropTypes.string,
    externalUniqueId: PropTypes.string,
    handleDisableLink: PropTypes.func,
    handleEnableLink: PropTypes.func,
    opposeHideInMobile: PropTypes.bool,
    positionPublicToggleWrapAllowed: PropTypes.bool,
    shareButtonHide: PropTypes.bool,
    supportOrOpposeHasBeenClicked: PropTypes.func,
    togglePositionStatementFunction: PropTypes.func,
    type: PropTypes.string.isRequired,
    // urlWithoutHash: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemWeVoteId: '',
      isOpposeAPIState: undefined,
      isOpposeLocalState: undefined,
      voterPositionIsPublic: undefined,
      isSupportAPIState: undefined,
      isSupportLocalState: undefined,
      numberOfOpposePositionsForScore: 0,
      showSupportOrOpposeHelpModal: false,
      numberOfSupportPositionsForScore: 0,
      transitioning: false,
      voterTextStatement: undefined,
      voterTextStatementOpened: false,
    };
    this.isOpposeCalculated = this.isOpposeCalculated.bind(this);
    this.isSupportCalculated = this.isSupportCalculated.bind(this);
    this.opposeItem = this.opposeItem.bind(this);
    this.supportItem = this.supportItem.bind(this);
    this.toggleSupportOrOpposeHelpModal = this.toggleSupportOrOpposeHelpModal.bind(this);
    this.opposeButton = this.opposeButton.bind(this);
    this.supportButton = this.supportButton.bind(this);
  }

  componentDidMount () {
    // console.log('itemActionBar, NEW componentDidMount');
    const { ballotItemWeVoteId } = this.props;
    let isOpposeAPIState = false;
    let voterPositionIsPublic = false;
    let isSupportAPIState = false;
    let numberOfSupportPositionsForScore = 0;
    let numberOfOpposePositionsForScore = 0;
    let voterTextStatement = '';
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    if (ballotItemStatSheet) {
      const { voterOpposesBallotItem, voterSupportsBallotItem } = ballotItemStatSheet;
      ({ numberOfOpposePositionsForScore, numberOfSupportPositionsForScore, voterPositionIsPublic, voterTextStatement } = ballotItemStatSheet);
      isOpposeAPIState = voterOpposesBallotItem || false;
      isSupportAPIState = voterSupportsBallotItem || false;
    }

    this.setState({
      ballotItemWeVoteId,
      isOpposeAPIState,
      voterPositionIsPublic,
      isSupportAPIState,
      numberOfOpposePositionsForScore,
      numberOfSupportPositionsForScore,
      voterTextStatement,
    }, this.onNewBallotItemWeVoteId);
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    // console.log('itemActionBar, RELOAD componentWillReceiveProps');
    if (nextProps.ballotItemWeVoteId !== undefined && nextProps.ballotItemWeVoteId && nextProps.ballotItemWeVoteId !== this.state.ballotItemWeVoteId) {
      // console.log('itemActionBar, ballotItemWeVoteId setState');
      this.setState({
        ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
      }, this.onNewBallotItemWeVoteId);
    }
  }

  componentWillUnmount () {
    this.supportStoreListener.remove();
  }

  onNewBallotItemWeVoteId () {
    // After updating the ballotItemWeVoteId, refresh this data
    this.onSupportStoreChange();
  }

  onSupportStoreChange () {
    const { ballotItemWeVoteId, isOpposeAPIState, isSupportAPIState, isOpposeLocalState, isSupportLocalState } = this.state;
    const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
    if (ballotItemStatSheet) {
      const { numberOfOpposePositionsForScore, numberOfSupportPositionsForScore, voterOpposesBallotItem, voterPositionIsPublic, voterSupportsBallotItem, voterTextStatement } = ballotItemStatSheet;

      if (numberOfOpposePositionsForScore !== undefined && numberOfOpposePositionsForScore !== this.state.numberOfSupportPositionsForScore) {
        // console.log('itemActionBar, support_count setState');
        this.setState({
          numberOfSupportPositionsForScore,
        });
      }
      if (numberOfOpposePositionsForScore !== undefined && numberOfOpposePositionsForScore !== this.state.numberOfOpposePositionsForScore) {
        // console.log('itemActionBar, oppose_count setState');
        this.setState({
          numberOfOpposePositionsForScore,
        });
      }
      // We only want to update the state when the API is_support and is_oppose 'catches up' with the local state

      // Are we 'locking' the isSupport or isOppose state currently?
      let localOpposeStateLocked = false;
      let localSupportStateLocked = false;
      if (isOpposeLocalState !== undefined) {
        localOpposeStateLocked = true;
      }
      if (isSupportLocalState !== undefined) {
        localSupportStateLocked = true;
      }
      // console.log('localOpposeStateLocked: ', localOpposeStateLocked, ', localSupportStateLocked: ', localSupportStateLocked);
      if (localOpposeStateLocked) {
        // Don't make a change until the API state matches the local state
        if (voterOpposesBallotItem !== undefined && voterOpposesBallotItem === isOpposeLocalState) {
          // console.log('itemActionBar, isOpposeAPIState CATCHUP setState');
          this.setState({
            isOpposeAPIState: voterOpposesBallotItem,
            isOpposeLocalState: undefined,
            transitioning: false,
          });
        }
      } else if (voterOpposesBallotItem !== undefined && voterOpposesBallotItem !== isOpposeAPIState) {
        // Don't make a change if the value from the API server already matches isOpposeAPIState
        // console.log('itemActionBar, isOpposeAPIState FRESH setState');
        this.setState({
          isOpposeAPIState: voterOpposesBallotItem,
          isOpposeLocalState: undefined,
          transitioning: false,
        });
      }
      if (localSupportStateLocked) {
        // Don't make a change until the API state matches the local state
        if (voterSupportsBallotItem !== undefined && voterSupportsBallotItem === isSupportLocalState) {
          // console.log('itemActionBar, isSupportLocalState CATCHUP setState');
          this.setState({
            isSupportAPIState: voterSupportsBallotItem,
            isSupportLocalState: undefined,
            transitioning: false,
          });
        }
      } else if (voterSupportsBallotItem !== undefined && voterSupportsBallotItem !== isSupportAPIState) {
        // Don't make a change if the value from the API server already matches isSupportAPIState
        // console.log('itemActionBar, isSupportAPIState FRESH setState');
        this.setState({
          isSupportAPIState: voterSupportsBallotItem,
          isSupportLocalState: undefined,
          transitioning: false,
        });
      }
      if (voterTextStatement) {
        this.setState({
          voterTextStatement,
        });
      }
      this.setState({
        voterPositionIsPublic,
      });
    }
  }

  togglePositionStatementFunction = () => {
    const { voterTextStatementOpened } = this.state;
    this.setState({
      voterTextStatementOpened: !voterTextStatementOpened,
    });
    if (this.props.togglePositionStatementFunction) {
      this.props.togglePositionStatementFunction();
    }
  }

  opposeButton = (localUniqueId) => {
    const { classes, externalUniqueId } = this.props;
    return (
      <Button
        id={`itemActionBarOpposeButton-${externalUniqueId}-${localUniqueId}`}
        variant={this.isOpposeCalculated() ? 'contained' : 'outlined'}
        color="primary"
        className={`${this.props.opposeHideInMobile ? 'd-none d-sm-block ' : ''}`}
        onClick={() => this.opposeItem()}
        classes={{ root: classes.buttonRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
      >
        <NotInterestedIcon classes={{ root: classes.buttonIcon }} />
        {this.isOpposeCalculated() ? (
          <span
            className={this.props.shareButtonHide ? 'item-actionbar--inline__position-btn-label--at-state' :
              'item-actionbar__position-btn-label--at-state'}
          >
              Opposed
          </span>
        ) : (
          <span
            className={this.props.shareButtonHide ? 'item-actionbar--inline__position-btn-label' :
              'item-actionbar__position-btn-label'}
          >
              Oppose
          </span>
        )}
      </Button>
    );
  };

  opposeButtonNoText = (localUniqueId) => {
    const { classes, externalUniqueId, opposeHideInMobile } = this.props;
    return (
      <Button
        id={`itemActionBarOpposeButtonNoText-${externalUniqueId}-${localUniqueId}`}
        variant={this.isOpposeCalculated() ? 'contained' : 'outlined'}
        color="primary"
        className={`${opposeHideInMobile ? 'd-none d-sm-block ' : ''}`}
        onClick={() => this.opposeItem()}
        classes={{ root: classes.buttonNoTextRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
      >
        <NotInterestedIcon classes={{ root: classes.buttonIcon }} />
      </Button>
    );
  };

  supportButton = (localUniqueId) => {
    const { classes, externalUniqueId, shareButtonHide } = this.props;
    return (
      <Button
       id={`itemActionBarSupportButton-${externalUniqueId}-${localUniqueId}`}
       variant={this.isSupportCalculated() ? 'contained' : 'outlined'}
       color="primary"
       onClick={() => this.supportItem()}
       classes={{ root: classes.buttonRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
      >
        <DoneIcon
        classes={{ root: classes.buttonIcon }}
        />
        {this.isSupportCalculated() ? (
          <span
             className={shareButtonHide ? 'item-actionbar--inline__position-choose-btn-label--at-state' :
               'item-actionbar__position-choose-btn-label--at-state'}
          >
              Chosen
          </span>
        ) : (
          <span
             className={shareButtonHide ? 'item-actionbar--inline__position-choose-btn-label' :
               'item-actionbar__position-choose-btn-label'}
          >
              Choose
          </span>
        )}
      </Button>
    );
  };

  supportButtonNoText = (localUniqueId) => {
    const { classes, externalUniqueId } = this.props;
    return (
      <Button
       id={`itemActionBarSupportButtonNoText-${externalUniqueId}-${localUniqueId}`}
       variant={this.isSupportCalculated() ? 'contained' : 'outlined'}
       color="primary"
       onClick={() => this.supportItem()}
       classes={{ root: classes.buttonNoTextRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
      >
        <DoneIcon
          classes={{ root: classes.buttonIcon }}
        />
      </Button>
    );
  };

  measureYesButton = (localUniqueId) => {
    const { classes, externalUniqueId, shareButtonHide } = this.props;
    return (
      <Button
        id={`itemActionBarYesButton-${externalUniqueId}-${localUniqueId}`}
        variant={this.isSupportCalculated() ? 'contained' : 'outlined'}
        color="primary"
        onClick={() => this.supportItem()}
        classes={{ root: classes.buttonRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
      >
        <ThumbsUpIcon classes={{ root: classes.buttonIcon }} />
        { this.isSupportCalculated() ? (
          <span
            className={`u-no-break ${shareButtonHide ? 'item-actionbar--inline__position-btn-label--at-state' :
              'item-actionbar__position-btn-label--at-state'}`}
          >
            Voting Yes
          </span>
        ) : (
          <span
            className={`u-no-break ${shareButtonHide ? 'item-actionbar--inline__position-btn-label' :
              'item-actionbar__position-btn-label'}`}
          >
            Vote Yes
          </span>
        )}
      </Button>
    );
  };

  measureYesButtonNoText = (localUniqueId) => {
    const { classes, externalUniqueId } = this.props;
    return (
      <Button
        id={`itemActionBarYesButtonNoText-${externalUniqueId}-${localUniqueId}`}
        variant={this.isSupportCalculated() ? 'contained' : 'outlined'}
        color="primary"
        onClick={() => this.supportItem()}
        classes={{ root: classes.buttonNoTextRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
      >
        <ThumbsUpIcon classes={{ root: classes.buttonIcon }} />
      </Button>
    );
  };

  measureNoButton = (localUniqueId) => {
    const { classes, externalUniqueId, shareButtonHide } = this.props;
    return (
      <Button
        id={`itemActionBarNoButton-${externalUniqueId}-${localUniqueId}`}
        variant={this.isOpposeCalculated() ? 'contained' : 'outlined'}
        color="primary"
        onClick={() => this.opposeItem()}
        classes={{ root: classes.buttonRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
      >
        <ThumbsDownIcon classes={{ root: classes.buttonIcon }} />
        { this.isOpposeCalculated() ? (
          <span
            className={`u-no-break ${shareButtonHide ? 'item-actionbar--inline__position-btn-label--at-state' :
              'item-actionbar__position-btn-label--at-state'}`}
          >
            Voting No
          </span>
        ) : (
          <span
            className={`u-no-break ${shareButtonHide ? 'item-actionbar--inline__position-btn-label' :
              'item-actionbar__position-btn-label'}`}
          >
            Vote No
          </span>
        )}
      </Button>
    );
  };

  measureNoButtonNoText = (localUniqueId) => {
    const { classes, externalUniqueId } = this.props;
    return (
      <Button
        id={`itemActionBarNoButtonNoText-${externalUniqueId}-${localUniqueId}`}
        variant={this.isOpposeCalculated() ? 'contained' : 'outlined'}
        color="primary"
        onClick={() => this.opposeItem()}
        classes={{ root: classes.buttonNoTextRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
      >
        <ThumbsDownIcon classes={{ root: classes.buttonIcon }} />
      </Button>
    );
  };

  commentButton = (localUniqueId) => {
    const { classes, commentButtonHideInMobile, externalUniqueId, shareButtonHide } = this.props;
    return (
      <Button
        id={`itemActionBarCommentButton-${externalUniqueId}-${localUniqueId}`}
        variant="contained"
        className={`${commentButtonHideInMobile ? 'd-none d-sm-block ' : null}item-actionbar__btn item-actionbar__btn--comment btn btn-default`}
        onClick={this.togglePositionStatementFunction}
        classes={{ root: classes.buttonRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
      >
        <CommentIcon classes={{ root: classes.buttonIcon }} />
        <span className={shareButtonHide ? 'item-actionbar--inline__position-btn-label' :
          'item-actionbar__position-btn-label'}
        >
          Comment
        </span>
      </Button>
    );
  };

  commentButtonNoText = (localUniqueId) => {
    const { classes, commentButtonHideInMobile, externalUniqueId } = this.props;
    return (
      <StackedButton>
        <Button
          id={`itemActionBarCommentButtonNoText-${externalUniqueId}-${localUniqueId}`}
          variant="contained"
          className={`${commentButtonHideInMobile ? 'd-none d-sm-block ' : null}item-actionbar__btn item-actionbar__btn--comment btn btn-default`}
          onClick={this.togglePositionStatementFunction}
          classes={{ root: classes.buttonNoTextRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
        >
          <CommentIcon classes={{ root: classes.buttonIcon }} />
        </Button>
      </StackedButton>
    );
  };

  isOpposeCalculated () {
    // Whenever the value in isOpposeLocalState is NOT undefined, then we ALWAYS listen to that
    if (this.state.isOpposeLocalState !== undefined) {
      return this.state.isOpposeLocalState;
    } else {
      return this.state.isOpposeAPIState;
    }
  }

  isSupportCalculated () {
    // Whenever the value in isSupportLocalState is NOT undefined, then we ALWAYS listen to that
    if (this.state.isSupportLocalState !== undefined) {
      return this.state.isSupportLocalState;
    } else {
      return this.state.isSupportAPIState;
    }
  }

  isAnyEndorsementCalculated () {
    return this.isOpposeCalculated() || this.isSupportCalculated() || this.state.voterTextStatement || this.state.voterTextStatementOpened;
  }

  toggleSupportOrOpposeHelpModal () {
    const { showSupportOrOpposeHelpModal } = this.state;
    this.setState({
      showSupportOrOpposeHelpModal: !showSupportOrOpposeHelpModal,
    });
  }

  supportItem () {
    // Button to support this item was clicked
    // const { currentBallotIdInUrl, urlWithoutHash, we_vote_id: weVoteId } = this.props;
    // DALE 2019-02-26 Verify we still need this
    // if (currentBallotIdInUrl !== weVoteId) {
    //   historyPush(`${urlWithoutHash}#${this.props.we_vote_id}`);
    // }

    if (this.props.supportOrOpposeHasBeenClicked) {
      this.props.supportOrOpposeHasBeenClicked();
    }
    if (this.isSupportCalculated()) {
      // console.log('supportItem about to call stopSupportingItem after isSupportCalculated');
      this.stopSupportingItem();
      return;
    }

    // console.log('supportItem setState');
    this.setState({
      isOpposeLocalState: false,
      isSupportLocalState: true,
    });
    if (this.state.transitioning) {
      return;
    }

    const supportOpposeModalHasBeenShown = VoterStore.getInterfaceFlagState(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    // const supportOpposeModalHasBeenShown = false; // For testing
    if (!supportOpposeModalHasBeenShown) {
      this.toggleSupportOrOpposeHelpModal();
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    }

    SupportActions.voterSupportingSave(this.state.ballotItemWeVoteId, this.props.type);
    this.setState({
      transitioning: true,
    });
    openSnackbar({ message: 'Support added!' });
  }

  stopSupportingItem () {
    this.setState({
      isOpposeLocalState: false,
      isSupportLocalState: false,
    });
    if (this.state.transitioning) {
      return;
    }

    SupportActions.voterStopSupportingSave(this.state.ballotItemWeVoteId, this.props.type);
    this.setState({
      transitioning: true,
    });
    openSnackbar({ message: 'Support removed!' });
  }

  opposeItem () {
    // const { currentBallotIdInUrl, urlWithoutHash, we_vote_id: weVoteId } = this.props;
    // DALE 2019-02-26 Verify we still need this
    // if (currentBallotIdInUrl !== weVoteId) {
    //   historyPush(`${urlWithoutHash}#${this.props.we_vote_id}`);
    // }
    if (this.props.supportOrOpposeHasBeenClicked) {
      this.props.supportOrOpposeHasBeenClicked();
    }

    if (this.isOpposeCalculated()) {
      // console.log('opposeItem about to call stopOpposingItem after isOpposeCalculated');
      this.stopOpposingItem();
      return;
    }

    // console.log('opposeItem setState');
    this.setState({
      isOpposeLocalState: true,
      isSupportLocalState: false,
    });
    if (this.state.transitioning) {
      return;
    }

    const supportOpposeModalHasBeenShown = VoterStore.getInterfaceFlagState(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    if (!supportOpposeModalHasBeenShown) {
      this.toggleSupportOrOpposeHelpModal();
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    }

    SupportActions.voterOpposingSave(this.state.ballotItemWeVoteId, this.props.type);
    this.setState({
      transitioning: true,
    });
    openSnackbar({ message: 'Opposition added!' });
  }

  stopOpposingItem () {
    // console.log('ItemActionBar, stopOpposingItem, transitioning:', this.state.transitioning);
    this.setState({
      isOpposeLocalState: false,
      isSupportLocalState: false,
    });
    if (this.state.transitioning) {
      return;
    }

    SupportActions.voterStopOpposingSave(this.state.ballotItemWeVoteId, this.props.type);
    this.setState({
      transitioning: true,
    });
    openSnackbar({ message: 'Opposition removed!' });
  }

  isMeasure () {
    return stringContains('meas', this.state.ballotItemWeVoteId);
  }

  render () {
    renderLog('ItemActionBar index.jsx');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('ItemActionBar render');
    const { commentButtonHide, commentButtonHideInMobile, classes, type } = this.props;
    const { ballotItemWeVoteId, isOpposeAPIState, isSupportAPIState, numberOfOpposePositionsForScore, numberOfSupportPositionsForScore, showSupportOrOpposeHelpModal, voterPositionIsPublic } = this.state;

    if (numberOfSupportPositionsForScore === undefined ||
      numberOfOpposePositionsForScore === undefined ||
      isOpposeAPIState === undefined ||
      voterPositionIsPublic === undefined ||
      isSupportAPIState === undefined) {
      // Do not render until componentDidMount has set the initial states
      return null;
    }
    // console.log('ItemActionBar render with required variables');

    const handleEnterHoverLocalArea = () => {
      if (this.props.handleDisableLink) {
        this.props.handleDisableLink();
      }
    };

    const handleLeaveHoverLocalArea = () => {
      if (this.props.handleEnableLink) {
        this.props.handleEnableLink();
      }
    };

    const iconSize = 18;
    const iconColor = '#00749e'; // $link-color

    let urlBeingShared;
    if (this.props.type === 'CANDIDATE') {
      urlBeingShared = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/candidate/${ballotItemWeVoteId}`;
    } else {
      urlBeingShared = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/measure/${ballotItemWeVoteId}`;
    }

    const shareIcon = (
      <span className="btn__icon">
        <img src={cordovaDot(shareIconSvg)}
             width={iconSize}
             height={iconSize}
             color={iconColor}
             alt="share"
        />
      </span>
    );

    // This modal is shown when user clicks on support or oppose button for the first time only.
    const SupportOrOpposeHelpModal = (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open
        onClose={() => { this.toggleSupportOrOpposeHelpModal(); }}
      >
        <ChooseOrOppose
          type={type}
          externalUniqueId={this.props.externalUniqueId}
          onClose={this.toggleSupportOrOpposeHelpModal}
        />
      </Dialog>
    );

    const ballotItemDisplayName = this.props.ballotItemDisplayName || '';
    let supportButtonSelectedPopOverText = 'Click to choose';
    if (ballotItemDisplayName.length > 0) {
      supportButtonSelectedPopOverText += ` ${ballotItemDisplayName}.`;
    } else {
      supportButtonSelectedPopOverText += '.';
    }

    if (voterPositionIsPublic) {
      supportButtonSelectedPopOverText += ' Your choice will be visible to the public.';
    } else {
      supportButtonSelectedPopOverText += ' Only your We Vote friends will see your choice.';
    }

    let supportButtonUnselectedPopOverText = 'Click to remove your choice';
    if (ballotItemDisplayName.length > 0) {
      supportButtonUnselectedPopOverText += ` for ${ballotItemDisplayName}.`;
    } else {
      supportButtonUnselectedPopOverText += '.';
    }

    let opposeButtonSelectedPopOverText = 'Click to oppose';
    if (ballotItemDisplayName.length > 0) {
      opposeButtonSelectedPopOverText += ` ${ballotItemDisplayName}.`;
    } else {
      opposeButtonSelectedPopOverText += '.';
    }

    if (voterPositionIsPublic) {
      opposeButtonSelectedPopOverText += ' Your opposition will be visible to the public.';
    } else {
      opposeButtonSelectedPopOverText += ' Only your We Vote friends will see your opposition.';
    }

    let opposeButtonUnselectedPopOverText = 'Click to remove your opposition';
    if (ballotItemDisplayName.length > 0) {
      opposeButtonUnselectedPopOverText += ` for ${ballotItemDisplayName}.`;
    } else {
      opposeButtonUnselectedPopOverText += '.';
    }

    const supportButtonPopoverTooltip = <Tooltip id="supportButtonTooltip">{this.isSupportCalculated() ? supportButtonUnselectedPopOverText : supportButtonSelectedPopOverText }</Tooltip>;
    const opposeButtonPopoverTooltip = <Tooltip id="opposeButtonTooltip">{this.isOpposeCalculated() ? opposeButtonUnselectedPopOverText : opposeButtonSelectedPopOverText}</Tooltip>;

    // console.log('ItemActionBar this.props.buttonsOnly:', this.props.buttonsOnly);
    const showPositionPublicToggle = !this.props.buttonsOnly || this.isAnyEndorsementCalculated();
    return (
      <>
        <ItemActionBarWrapper
          displayInline={this.props.buttonsOnly || this.props.shareButtonHide}
          onMouseOver={handleEnterHoverLocalArea}
          onFocus={handleEnterHoverLocalArea}
          onMouseOut={handleLeaveHoverLocalArea}
          onBlur={handleLeaveHoverLocalArea}
          positionPublicToggleWrapAllowed={this.props.positionPublicToggleWrapAllowed}
        >
          {showPositionPublicToggle && (
            <PositionPublicToggle
              ballotItemWeVoteId={ballotItemWeVoteId}
              className="null"
              externalUniqueId={`itemActionBar-${this.props.externalUniqueId}`}
              type={type}
            />
          )}
          <ButtonGroup className={`${this.props.buttonsOnly ? 'btn-group' : 'btn-group'} ${!this.props.shareButtonHide ? ' u-push--sm' : ''}`}>
            {/* Start of Support Button */}
            {/* Visible on desktop screens */}
            {this.props.buttonsOnly ? (
              <StackedButton onlyTwoButtons={commentButtonHide} className="d-none d-lg-block">
                {/* <OverlayTrigger placement="top" overlay={supportButtonPopoverTooltip}>
                </OverlayTrigger> */}
                {this.props.type === 'CANDIDATE' ? this.supportButtonNoText(`desktopVersion-${ballotItemWeVoteId}`) : this.measureYesButtonNoText(`desktopVersion-${ballotItemWeVoteId}`)}
              </StackedButton>
            ) : (
              <div className="u-push--xs d-none d-lg-block item-actionbar__position-bar">
                <OverlayTrigger placement="top" overlay={supportButtonPopoverTooltip}>
                  {this.props.type === 'CANDIDATE' ? this.supportButton(`desktopVersion-${ballotItemWeVoteId}`) : this.measureYesButton(`desktopVersion-${ballotItemWeVoteId}`)}
                </OverlayTrigger>
              </div>
            )}
            {/* Visible on mobile devices and tablets */}
            {this.props.buttonsOnly ? (
              <StackedButton onlyTwoButtons={commentButtonHideInMobile} className="d-lg-none d-xl-none">
                {this.props.type === 'CANDIDATE' ? this.supportButtonNoText(`mobileVersion-${ballotItemWeVoteId}`) : this.measureYesButtonNoText(`mobileVersion-${ballotItemWeVoteId}`)}
              </StackedButton>
            ) : (
              <>
                <div className="u-push--xs u-push--xs d-lg-none">
                  {this.props.type === 'CANDIDATE' ? this.supportButton(`mobileVersion-${ballotItemWeVoteId}`) : this.measureYesButton(`mobileVersion-${ballotItemWeVoteId}`)}
                </div>
              </>
            )}

            {/* Start of Oppose Button */}
            {/* Visible on desktop screens */}
            {this.props.buttonsOnly ? (
              <StackedButton onlyTwoButtons={commentButtonHide} className="d-none d-lg-block">
                {/* <OverlayTrigger placement="top" overlay={opposeButtonPopoverTooltip}>
                </OverlayTrigger> */}
                {this.props.type === 'CANDIDATE' ? this.opposeButtonNoText(`desktopVersion-${ballotItemWeVoteId}`) : this.measureNoButtonNoText(`desktopVersion-${ballotItemWeVoteId}`)}
              </StackedButton>
            ) : (
              <div className="u-push--xs d-none d-lg-block item-actionbar__position-bar">
                <OverlayTrigger placement="top" overlay={opposeButtonPopoverTooltip}>
                  {this.props.type === 'CANDIDATE' ? this.opposeButton(`desktopVersion-${ballotItemWeVoteId}`) : this.measureNoButton(`desktopVersion-${ballotItemWeVoteId}`)}
                </OverlayTrigger>
              </div>
            )}
            {/* Visible on mobile devices and tablets */}
            {this.props.buttonsOnly ? (
              <StackedButton onlyTwoButtons={commentButtonHideInMobile} className="d-lg-none d-xl-none">
                {this.props.type === 'CANDIDATE' ? this.opposeButtonNoText(`mobileVersion-${ballotItemWeVoteId}`) : this.measureNoButtonNoText(`mobileVersion-${ballotItemWeVoteId}`)}
              </StackedButton>
            ) : (
              <>
                <div className="u-push--xs d-lg-none">
                  {this.props.type === 'CANDIDATE' ? this.opposeButton(`mobileVersion-${ballotItemWeVoteId}`) : this.measureNoButton(`mobileVersion-${ballotItemWeVoteId}`)}
                </div>
              </>
            )}
            { this.props.commentButtonHide ?
              null : (
                <span>
                  {this.props.buttonsOnly ? (
                    <div className="u-push--sm item-actionbar__position-bar">
                      {this.commentButtonNoText(`${ballotItemWeVoteId}`)}
                    </div>
                  ) : (
                    <div className="u-push--sm item-actionbar__position-bar">
                      {this.commentButton(`${ballotItemWeVoteId}`)}
                    </div>
                  )}
                </span>
              )}

            { this.props.shareButtonHide ?
              null :
              <ShareButtonDropDown showMoreId="itemActionBarShowMoreFooter" urlBeingShared={urlBeingShared} shareIcon={shareIcon} shareText="Share" /> }
            { showSupportOrOpposeHelpModal ? SupportOrOpposeHelpModal : null }
          </ButtonGroup>
        </ItemActionBarWrapper>
      </>
    );
  }
}

const styles = theme => ({
  buttonIcon: {
    fontSize: 18,
    marginRight: '.3rem',
    fontWeight: 'bold',
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      marginTop: -2,
    },
  },
  dialogPaper: {
    minHeight: 282,
    margin: '0 8px',
  },
  buttonRoot: {
    padding: 4,
    fontSize: 12,
    width: 110,
    height: 32,
    marginLeft: '.1rem',
    marginTop: '.3rem',
    marginBottom: 4,
    [theme.breakpoints.down('md')]: {
      width: 100,
      height: 30,
    },
    [theme.breakpoints.down('sm')]: {
      width: 'fit-content',
      minWidth: 80,
      height: 28,
      padding: '0 8px',
      fontSize: 10,
    },
  },
  buttonNoTextRoot: {
    padding: 4,
    fontSize: 12,
    width: 32,
    height: 32,
    marginLeft: '.1rem',
    marginTop: '.3rem',
    marginBottom: 4,
    [theme.breakpoints.down('md')]: {
      width: 30,
      height: 30,
    },
    [theme.breakpoints.down('sm')]: {
      width: 'fit-content',
      minWidth: 28,
      height: 28,
      padding: '0 8px',
      fontSize: 10,
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
  closeButton: {
    position: 'absolute',
    right: `${theme.spacing(1)}px`,
    top: `${theme.spacing(1)}px`,
  },
  dialogTitle: {
    paddingTop: 22,
    paddingBottom: 5,
  },
});

const ItemActionBarWrapper = styled.div`
  ${({ positionPublicToggleWrapAllowed }) => (positionPublicToggleWrapAllowed ? '' : 'display: flex;')}
  ${({ positionPublicToggleWrapAllowed }) => (positionPublicToggleWrapAllowed ? '' : 'justify-content: flex-end;')}
  ${({ positionPublicToggleWrapAllowed }) => (positionPublicToggleWrapAllowed ? '' : 'width: 100%;')}
  align-items: center;
  border-top: ${({ displayInline }) => (displayInline ? '' : '1px solid #eee !default')};
  margin-top: ${({ displayInline }) => (displayInline ? '' : '16px')};
  margin-right: 0;
  margin-left: 0;
  padding-top: ${({ displayInline }) => (displayInline ? '0' : '8px')};
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-bottom: 8px;
  }
`;

const ButtonGroup = styled.div`
  margin-left: 0;
  height: fit-content;
`;

const StackedButton = styled.div`
  margin-left: 3px;
  width:  ${({ onlyTwoButtons }) => (onlyTwoButtons ? '50% !important' : '33% !important')};
`;

export default withStyles(styles)(ItemActionBar);
