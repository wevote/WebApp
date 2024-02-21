import { Comment, Done, NotInterested, ThumbDown, ThumbUp } from '@mui/icons-material';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import SupportActions from '../../../actions/SupportActions';
import VoterActions from '../../../actions/VoterActions';
import isMobileScreenSize from '../../../common/utils/isMobileScreenSize';
import Cookies from '../../../common/utils/js-cookie/Cookies';
import { convertToInteger } from '../../../common/utils/textFormat';
import { renderLog } from '../../../common/utils/logging';
import normalizedImagePath from '../../../common/utils/normalizedImagePath';
import stringContains from '../../../common/utils/stringContains';
import webAppConfig from '../../../config';
import VoterConstants from '../../../constants/VoterConstants';
import AppObservableStore from '../../../common/stores/AppObservableStore';
import SupportStore from '../../../stores/SupportStore';
import VoterStore from '../../../stores/VoterStore';
import PositionPublicToggle from '../PositionPublicToggle';
import ShareButtonDropDown from '../ShareButtonDropdown';
import { openSnackbar } from '../../../common/components/Widgets/SnackNotifier';

const NUMBER_OF_BALLOT_CHOICES_ALLOWED_BEFORE_SHOW_MODAL = 3;
const shareIconSvg = '../../../../img/global/svg-icons/share-icon.svg';


class ItemActionBar extends PureComponent {
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
      numberOfSupportPositionsForScore: 0,
      transitioning: false,
      voterTextStatement: undefined,
      voterTextStatementOpened: false,
    };
    this.isOpposeCalculated = this.isOpposeCalculated.bind(this);
    this.isSupportCalculated = this.isSupportCalculated.bind(this);
    // this.onScroll = this.onScroll.bind(this);
    this.opposeItem = this.opposeItem.bind(this);
    this.supportItem = this.supportItem.bind(this);
    this.opposeButton = this.opposeButton.bind(this);
    this.supportButton = this.supportButton.bind(this);
    this.showChooseOrOpposeIntroModalDecision = this.showChooseOrOpposeIntroModalDecision.bind(this);
  }

  componentDidMount () {
    // console.log('itemActionBar, NEW componentDidMount');
    const { ballotItemWeVoteId } = this.props;
    if (ballotItemWeVoteId) {
      const isCandidate = stringContains('cand', ballotItemWeVoteId); // isCandidate = the default
      const isMeasure = stringContains('meas', ballotItemWeVoteId);
      const isPolitician = stringContains('pol', ballotItemWeVoteId);
      let ballotItemType;
      if (isCandidate) {
        ballotItemType = 'CANDIDATE';
      } else if (isMeasure) {
        ballotItemType = 'MEASURE';
      } else if (isPolitician) {
        ballotItemType = 'POLITICIAN';
      }
      let isOpposeAPIState = false;
      let voterPositionIsPublic = false;
      let isSupportAPIState = false;
      let numberOfSupportPositionsForScore = 0;
      let numberOfOpposePositionsForScore = 0;
      let voterTextStatement = '';
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
      // console.log('ballotItemStatSheet', ballotItemStatSheet);
      if (ballotItemStatSheet) {
        const {
          voterOpposesBallotItem,
          voterSupportsBallotItem,
        } = ballotItemStatSheet;
        ({
          numberOfOpposePositionsForScore,
          numberOfSupportPositionsForScore,
          voterPositionIsPublic,
          voterTextStatement,
        } = ballotItemStatSheet);
        isOpposeAPIState = voterOpposesBallotItem || false;
        isSupportAPIState = voterSupportsBallotItem || false;
      }

      this.setState({
        ballotItemType,
        ballotItemWeVoteId,
        isOpposeAPIState,
        voterPositionIsPublic,
        isSupportAPIState,
        numberOfOpposePositionsForScore,
        numberOfSupportPositionsForScore,
        voterTextStatement,
      }, this.onNewBallotItemWeVoteId);
      // window.addEventListener('scroll', this.onScroll);
    }
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('itemActionBar, RELOAD componentWillReceiveProps');
    const { ballotItemWeVoteId: previousBallotItemWeVoteId } = prevProps;
    const { ballotItemWeVoteId } = this.props;
    if (ballotItemWeVoteId !== undefined && ballotItemWeVoteId && ballotItemWeVoteId !== previousBallotItemWeVoteId) {
      console.log('itemActionBar, ballotItemWeVoteId setState');
      const isCandidate = stringContains('cand', ballotItemWeVoteId); // isCandidate = the default
      const isMeasure = stringContains('meas', ballotItemWeVoteId); // isCandidate = the default
      const isPolitician = stringContains('pol', ballotItemWeVoteId);
      let ballotItemType;
      if (isCandidate) {
        ballotItemType = 'CANDIDATE';
      } else if (isMeasure) {
        ballotItemType = 'MEASURE';
      } else if (isPolitician) {
        ballotItemType = 'POLITICIAN';
      }
      this.setState({
        ballotItemType,
        ballotItemWeVoteId,
      }, this.onNewBallotItemWeVoteId);
    }
  }

  componentWillUnmount () {
    // window.removeEventListener('scroll', this.onScroll);
    this.supportStoreListener.remove();
  }

  onNewBallotItemWeVoteId () {
    // After updating the ballotItemWeVoteId, refresh this data
    this.onSupportStoreChange();
  }

  // onScroll () {
  //   console.log('onScroll');
  //   if (this.opposeButtonPopover) {
  //     console.log('opposeButtonPopover.hide');
  //     this.opposeButtonPopover.hide();
  //   }
  //   if (this.supportButtonPopover) {
  //     console.log('supportButtonPopover.hide');
  //     this.supportButtonPopover.hide();
  //   }
  // }

  onSupportStoreChange () {
    const { ballotItemWeVoteId, isOpposeAPIState, isSupportAPIState, isOpposeLocalState, isSupportLocalState } = this.state;
    if (ballotItemWeVoteId) {
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(ballotItemWeVoteId);
      if (ballotItemStatSheet) {
        const {
          numberOfOpposePositionsForScore,
          numberOfSupportPositionsForScore,
          voterOpposesBallotItem,
          voterPositionIsPublic,
          voterSupportsBallotItem,
          voterTextStatement,
        } = ballotItemStatSheet;

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
  }

  togglePositionStatementFunction = () => {
    const { voterTextStatementOpened } = this.state;
    this.setState({
      voterTextStatementOpened: !voterTextStatementOpened,
    });
    if (this.props.togglePositionStatementFunction) {
      this.props.togglePositionStatementFunction();
    }
  };

  opposeButton = (localUniqueId) => {
    const { classes, externalUniqueId, inCard, opposeHideInMobile } = this.props;
    const buttonRootClass = inCard ? classes.buttonRootForCard : classes.buttonRoot;
    return (
      <Button
        classes={{ root: buttonRootClass, outlinedPrimary: classes.buttonOutlinedPrimary }}
        className={`${opposeHideInMobile ? 'd-none d-sm-block ' : ''}`}
        color={this.isOpposeCalculated() ? 'secondary' : 'primary'}
        id={`itemActionBarOpposeButton-${externalUniqueId}-${localUniqueId}`}
        onClick={() => this.opposeItem()}
        variant={this.isOpposeCalculated() ? 'contained' : 'outlined'}
      >
        <NotInterested classes={{ root: classes.buttonIconNotInterested }} />
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
        className={`${opposeHideInMobile ? 'd-none d-sm-block ' : ''}`}
        classes={{ root: classes.buttonNoTextRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
        color={this.isOpposeCalculated() ? 'secondary' : 'primary'}
        id={`itemActionBarOpposeButtonNoText-${externalUniqueId}-${localUniqueId}`}
        onClick={() => this.opposeItem()}
        variant={this.isOpposeCalculated() ? 'contained' : 'outlined'}
      >
        <NotInterested classes={{ root: classes.buttonIconNotInterested }} />
      </Button>
    );
  };

  supportButton = (localUniqueId) => {
    const { classes, externalUniqueId, inCard, shareButtonHide, useSupportWording } = this.props;
    const buttonRootClass = inCard ? classes.buttonRootForCard : classes.buttonRoot;
    return (
      <Button
        classes={{ root: buttonRootClass, outlinedPrimary: classes.buttonOutlinedPrimary }}
        color={this.isSupportCalculated() ? 'secondary' : 'primary'}
        id={`itemActionBarSupportButton-${externalUniqueId}-${localUniqueId}`}
        onClick={() => this.supportItem()}
        variant={this.isSupportCalculated() ? 'contained' : 'outlined'}
      >
        <Done classes={{ root: classes.buttonIconDone }} />
        {this.isSupportCalculated() ? (
          <span
             className={shareButtonHide ? 'item-actionbar--inline__position-choose-btn-label--at-state' :
               'item-actionbar__position-choose-btn-label--at-state'}
          >
            {useSupportWording ? (
              <>
                Supporting
              </>
            ) : (
              <>
                Chosen
              </>
            )}
          </span>
        ) : (
          <span
             className={shareButtonHide ? 'item-actionbar--inline__position-choose-btn-label' :
               'item-actionbar__position-choose-btn-label'}
          >
            {useSupportWording ? (
              <>
                Support
              </>
            ) : (
              <>
                Choose
              </>
            )}
          </span>
        )}
      </Button>
    );
  };

  supportButtonNoText = (localUniqueId) => {
    const { classes, externalUniqueId } = this.props;
    return (
      <Button
       classes={{ root: classes.buttonNoTextRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
       color={this.isSupportCalculated() ? 'secondary' : 'primary'}
       id={`itemActionBarSupportButtonNoText-${externalUniqueId}-${localUniqueId}`}
       onClick={() => this.supportItem()}
       variant={this.isSupportCalculated() ? 'contained' : 'outlined'}
      >
        <Done classes={{ root: classes.buttonIconDone }} />
      </Button>
    );
  };

  measureYesButton = (localUniqueId) => {
    const { classes, externalUniqueId, shareButtonHide } = this.props;
    return (
      <Button
        classes={{ root: classes.buttonMeasureRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
        color={this.isSupportCalculated() ? 'secondary' : 'primary'}
        id={`itemActionBarYesButton-${externalUniqueId}-${localUniqueId}`}
        onClick={() => this.supportItem()}
        variant={this.isSupportCalculated() ? 'contained' : 'outlined'}
      >
        <Done classes={{ root: classes.buttonIconDone }} />
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
        classes={{ root: classes.buttonNoTextRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
        color={this.isSupportCalculated() ? 'secondary' : 'primary'}
        id={`itemActionBarYesButtonNoText-${externalUniqueId}-${localUniqueId}`}
        onClick={() => this.supportItem()}
        variant={this.isSupportCalculated() ? 'contained' : 'outlined'}
      >
        <ThumbUp classes={{ root: classes.buttonIcon }} />
      </Button>
    );
  };

  measureNoButton = (localUniqueId) => {
    const { classes, externalUniqueId, shareButtonHide } = this.props;
    return (
      <Button
        id={`itemActionBarNoButton-${externalUniqueId}-${localUniqueId}`}
        variant={this.isOpposeCalculated() ? 'contained' : 'outlined'}
        color={this.isOpposeCalculated() ? 'secondary' : 'primary'}
        onClick={() => this.opposeItem()}
        classes={{ root: classes.buttonMeasureRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
      >
        <NotInterested classes={{ root: classes.buttonIconNotInterested }} />
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
        color={this.isOpposeCalculated() ? 'secondary' : 'primary'}
        onClick={() => this.opposeItem()}
        classes={{ root: classes.buttonNoTextRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
      >
        <ThumbDown classes={{ root: classes.buttonIcon }} />
      </Button>
    );
  };

  commentButton = (localUniqueId) => {
    const { classes, commentButtonHideInMobile, externalUniqueId, shareButtonHide } = this.props;
    return (
      <Button
        id={`itemActionBarCommentButton-${externalUniqueId}-${localUniqueId}`}
        variant="contained"
        className={`${commentButtonHideInMobile ? 'd-none d-sm-block ' : null}item-actionbar__btn item-actionbar__btn--comment btn-default`}
        onClick={this.togglePositionStatementFunction}
        classes={{ root: classes.buttonRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
      >
        <Comment classes={{ root: classes.buttonIcon }} />
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
          className={`${commentButtonHideInMobile ? 'd-none d-sm-block ' : null} item-actionbar__btn item-actionbar__btn--comment btn-default`}
          onClick={this.togglePositionStatementFunction}
          classes={{ root: classes.buttonNoTextRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
        >
          <Comment classes={{ root: classes.buttonIcon }} />
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

    // If the logic in this function decides to, show the "Sign in to save your choices" modal
    this.showChooseOrOpposeIntroModalDecision();

    SupportActions.voterSupportingSave(this.state.ballotItemWeVoteId, this.state.ballotItemType);
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

    SupportActions.voterStopSupportingSave(this.state.ballotItemWeVoteId, this.state.ballotItemType);
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

    // If the logic in this function decides to, show the "Sign in to save your choices" modal
    this.showChooseOrOpposeIntroModalDecision();

    SupportActions.voterOpposingSave(this.state.ballotItemWeVoteId, this.state.ballotItemType);
    this.setState({
      transitioning: true,
    });
    openSnackbar({ message: 'Opposition added!', severity: 'error' });
  }

  showChooseOrOpposeIntroModalDecision () {
    const { ballotItemType } = this.state;
    const supportOpposeModalHasBeenShown = VoterStore.getInterfaceFlagState(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    // const supportOpposeModalHasBeenShown = false; // For testing
    let numberOfBallotChoicesMade = convertToInteger(Cookies.get('number_of_ballot_choices_made')) || 0;
    numberOfBallotChoicesMade += 1;
    // console.log('showChooseOrOpposeIntroModalDecision numberOfBallotChoicesMade', numberOfBallotChoicesMade);
    Cookies.set('number_of_ballot_choices_made', numberOfBallotChoicesMade, { expires: 1, path: '/' });
    if (!supportOpposeModalHasBeenShown && numberOfBallotChoicesMade >= NUMBER_OF_BALLOT_CHOICES_ALLOWED_BEFORE_SHOW_MODAL) {
      AppObservableStore.setShowChooseOrOpposeIntroModal(true, ballotItemType);
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    }
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

    SupportActions.voterStopOpposingSave(this.state.ballotItemWeVoteId, this.state.ballotItemType);
    this.setState({
      transitioning: true,
    });
    openSnackbar({ message: 'Opposition removed!', severity: 'error' });
  }

  render () {
    renderLog('ItemActionBar ItemActionBar.jsx');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('ItemActionBar render');
    const { buttonsOnly, commentButtonHide, commentButtonHideInMobile, hideSupportYes, hideOpposeNo, useSupportWording } = this.props;
    const {
      ballotItemType, ballotItemWeVoteId, isOpposeAPIState, isSupportAPIState,
      numberOfOpposePositionsForScore, numberOfSupportPositionsForScore,
      voterPositionIsPublic,
    } = this.state;

    if (
      ballotItemWeVoteId === undefined ||
      ballotItemWeVoteId === '') {
      // Do not render if a ballotItemWeVoteId is not set
      return null;
    } else if (
      numberOfSupportPositionsForScore === undefined ||
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

    // console.log('inModal: ', this.props.inModal);

    const iconSize = 18;
    const iconColor = '#00749e'; // $link-color

    let urlBeingShared;
    if (ballotItemType === 'CANDIDATE') {
      urlBeingShared = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/candidate/${ballotItemWeVoteId}`;
    } else if (ballotItemType === 'POLITICIAN') {
      urlBeingShared = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/${ballotItemWeVoteId}/p/`;
    } else {
      urlBeingShared = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/measure/${ballotItemWeVoteId}`;
    }

    const shareIcon = (
      <span className="btn__icon">
        <img src={normalizedImagePath(shareIconSvg)}
             width={iconSize}
             height={iconSize}
             color={iconColor}
             alt="share"
        />
      </span>
    );

    const ballotItemDisplayName = this.props.ballotItemDisplayName || '';
    let supportButtonSelectedPopOverText = 'Click to choose';
    if (useSupportWording) {
      supportButtonSelectedPopOverText = 'Click to support';
    }
    if (ballotItemDisplayName.length > 0) {
      supportButtonSelectedPopOverText += ` ${ballotItemDisplayName}.`;
    } else {
      supportButtonSelectedPopOverText += '.';
    }

    if (voterPositionIsPublic) {
      if (useSupportWording) {
        supportButtonSelectedPopOverText += ' Your support will be visible to the public.';
      } else {
        supportButtonSelectedPopOverText += ' Your choice will be visible to the public.';
      }
    } else {
      supportButtonSelectedPopOverText += ' Only your WeVote friends will see your choice.';
    }

    let supportButtonUnselectedPopOverText = 'Click to remove your choice';
    if (useSupportWording) {
      supportButtonUnselectedPopOverText = 'Click to remove your support';
    }
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
      opposeButtonSelectedPopOverText += ' Only your WeVote friends will see your opposition.';
    }

    let opposeButtonUnselectedPopOverText = 'Click to remove your opposition';
    if (ballotItemDisplayName.length > 0) {
      opposeButtonUnselectedPopOverText += ` for ${ballotItemDisplayName}.`;
    } else {
      opposeButtonUnselectedPopOverText += '.';
    }

    const supportButtonPopoverTooltip = isMobileScreenSize() ? (<span />) : (
      <Tooltip className="u-z-index-9020" id="supportButtonTooltip">
        {this.isSupportCalculated() ? supportButtonUnselectedPopOverText : supportButtonSelectedPopOverText }
      </Tooltip>
    );

    const opposeButtonPopoverTooltip = isMobileScreenSize() ? (<span />) : (
      <Tooltip className="u-z-index-9020" id="opposeButtonTooltip">
        {this.isOpposeCalculated() ? opposeButtonUnselectedPopOverText : opposeButtonSelectedPopOverText}
      </Tooltip>
    );

    // console.log('ItemActionBar buttonsOnly:', buttonsOnly);
    const showPositionPublicToggle = !this.props.hidePositionPublicToggle && this.isAnyEndorsementCalculated();
    // console.log('showPositionPublicToggle:', showPositionPublicToggle);
    return (
      <>
        <ItemActionBarWrapper
          // inModal={this.props.inModal}
          displayInline={buttonsOnly || this.props.shareButtonHide}
          onMouseOver={handleEnterHoverLocalArea}
          onFocus={handleEnterHoverLocalArea}
          onMouseOut={handleLeaveHoverLocalArea}
          onBlur={handleLeaveHoverLocalArea}
          positionPublicToggleWrapAllowed={this.props.positionPublicToggleWrapAllowed}
        >
          <ButtonGroup
            className={`${!this.props.shareButtonHide ? ' u-push--sm' : ''}`}
            positionPublicToggleWrapAllowed={this.props.positionPublicToggleWrapAllowed}
          >
            {/* Start of Support Button */}
            {!hideSupportYes && (
              <>
                {/* Visible on desktop screens */}
                {buttonsOnly ? (
                  <StackedButton className="d-none d-lg-block" onlyTwoButtons={commentButtonHide}>
                    {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && this.supportButtonNoText(`desktopVersion-${ballotItemWeVoteId}`)}
                    {(ballotItemType === 'MEASURE') && this.measureYesButtonNoText(`desktopVersion-${ballotItemWeVoteId}`)}
                  </StackedButton>
                ) : (
                  <ButtonWrapper className="u-push--xs d-none d-lg-block">
                    <OverlayTrigger
                      overlay={supportButtonPopoverTooltip}
                      placement="top"
                      rootClose
                    >
                      <div>
                        {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && this.supportButton(`desktopVersion-${ballotItemWeVoteId}`)}
                        {(ballotItemType === 'MEASURE') && this.measureYesButton(`desktopVersion-${ballotItemWeVoteId}`)}
                      </div>
                    </OverlayTrigger>
                  </ButtonWrapper>
                )}
                {/* Visible on mobile devices and tablets */}
                {buttonsOnly ? (
                  <StackedButton className="d-lg-none d-xl-none" onlyTwoButtons={commentButtonHideInMobile}>
                    {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && this.supportButtonNoText(`mobileVersion-${ballotItemWeVoteId}`)}
                    {ballotItemType === 'MEASURE' && this.measureYesButtonNoText(`mobileVersion-${ballotItemWeVoteId}`)}
                  </StackedButton>
                ) : (
                  <ButtonWrapper className="u-push--xs u-push--xs d-lg-none">
                    {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && this.supportButton(`mobileVersion-${ballotItemWeVoteId}`)}
                    {ballotItemType === 'MEASURE' && this.measureYesButton(`mobileVersion-${ballotItemWeVoteId}`)}
                  </ButtonWrapper>
                )}
              </>
            )}

            {/* Start of Oppose Button */}
            {!hideOpposeNo && (
              <>
                {/* Visible on desktop screens */}
                {buttonsOnly ? (
                  <StackedButton className="d-none d-lg-block" onlyTwoButtons={commentButtonHide}>
                    {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && this.opposeButtonNoText(`desktopVersion-${ballotItemWeVoteId}`)}
                    {ballotItemType === 'MEASURE' && this.measureNoButtonNoText(`desktopVersion-${ballotItemWeVoteId}`)}
                  </StackedButton>
                ) : (
                  <ButtonWrapperRight className="d-none d-lg-block">
                    <OverlayTrigger
                      overlay={opposeButtonPopoverTooltip}
                      placement="top"
                      rootClose
                    >
                      <div>
                        {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && this.opposeButton(`desktopVersion-${ballotItemWeVoteId}`)}
                        {ballotItemType === 'MEASURE' && this.measureNoButton(`desktopVersion-${ballotItemWeVoteId}`)}
                      </div>
                    </OverlayTrigger>
                  </ButtonWrapperRight>
                )}
                {/* Visible on mobile devices and tablets */}
                {buttonsOnly ? (
                  <StackedButton className="d-lg-none d-xl-none" onlyTwoButtons={commentButtonHideInMobile}>
                    {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && this.opposeButtonNoText(`mobileVersion-${ballotItemWeVoteId}`)}
                    {ballotItemType === 'MEASURE' && this.measureNoButtonNoText(`mobileVersion-${ballotItemWeVoteId}`)}
                  </StackedButton>
                ) : (
                  <ButtonWrapperRight className="d-lg-none">
                    {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && this.opposeButton(`mobileVersion-${ballotItemWeVoteId}`)}
                    {ballotItemType === 'MEASURE' && this.measureNoButton(`mobileVersion-${ballotItemWeVoteId}`)}
                  </ButtonWrapperRight>
                )}
              </>
            )}
            { this.props.commentButtonHide || this.props.inModal ?
              null : (
                <span>
                  {buttonsOnly ? (
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

            { this.props.shareButtonHide || this.props.inModal ?
              null :
              <ShareButtonDropDown showMoreId="itemActionBarShowMoreFooter" urlBeingShared={urlBeingShared} shareIcon={shareIcon} shareText="Share" /> }
          </ButtonGroup>
          {showPositionPublicToggle && (
            <PositionPublicToggle
              ballotItemWeVoteId={ballotItemWeVoteId}
              className="null"
              externalUniqueId={`itemActionBar-${this.props.externalUniqueId}`}
              ballotItemType={ballotItemType}
            />
          )}
        </ItemActionBarWrapper>
      </>
    );
  }
}
ItemActionBar.propTypes = {
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
  hidePositionPublicToggle: PropTypes.bool,
  hideOpposeNo: PropTypes.bool,
  hideSupportYes: PropTypes.bool,
  inCard: PropTypes.bool,
  inModal: PropTypes.bool,
  opposeHideInMobile: PropTypes.bool,
  positionPublicToggleWrapAllowed: PropTypes.bool,
  shareButtonHide: PropTypes.bool,
  supportOrOpposeHasBeenClicked: PropTypes.func,
  togglePositionStatementFunction: PropTypes.func,
  useSupportWording: PropTypes.bool,
  // urlWithoutHash: PropTypes.string,
};

const styles = (theme) => ({
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
  buttonIconDone: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: '.3rem',
    marginTop: '-2px',
  },
  buttonIconNotInterested: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: '.3rem',
    marginTop: '-2px',
  },
  dialogPaper: {
    minHeight: 282,
    margin: '0 8px',
  },
  buttonMeasureRoot: {
    padding: 4,
    width: 130,
    height: 32,
    [theme.breakpoints.down('sm')]: {
      width: 'fit-content',
      minWidth: 80,
      height: 28,
      padding: '0 8px',
    },
  },
  buttonRoot: {
    padding: 4,
    width: 110,
    height: 32,
    [theme.breakpoints.down('md')]: {
      width: 100,
      height: 30,
    },
    [theme.breakpoints.down('sm')]: {
      width: 'fit-content',
      minWidth: 80,
      height: 28,
      padding: '0 8px',
    },
  },
  buttonRootForCard: {
    padding: 4,
    width: 138,
    height: 32,
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
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  dialogTitle: {
    paddingTop: 22,
    paddingBottom: 5,
  },
});

const ItemActionBarWrapper = styled('div', {
  shouldForwardProp: (prop) => !['positionPublicToggleWrapAllowed', 'displayInline'].includes(prop),
})(({ positionPublicToggleWrapAllowed, displayInline, theme }) => (`
  display: ${positionPublicToggleWrapAllowed ? '' :  'flex'};
  justify-content: ${positionPublicToggleWrapAllowed ? '' :  'flex-start'};
  width: ${positionPublicToggleWrapAllowed ? '' :  '100%'};
  align-items: center;
  border-top: ${displayInline ? '' : '1px solid #eee !default'};
  margin-top: ${displayInline ? '' : '16px'};
  margin-right: 0;
  margin-left: 0;
  margin-bottom: 0;
  padding-top: ${displayInline ? '0' : '8px'};
  ${theme.breakpoints.down('sm')} {
    flex-wrap: wrap;
`));

const ButtonGroup = styled('div', {
  shouldForwardProp: (prop) => !['positionPublicToggleWrapAllowed'].includes(prop),
})(({ positionPublicToggleWrapAllowed }) => (`
  display: flex;
  // border-color: red;
  // border-style: solid;
  // border-width: 1 px;
  flex-wrap: nowrap;
  height: fit-content;
  height: 40px;
  justify-content: center;
  margin-left: 0;
  margin-right: 8px;
  ${positionPublicToggleWrapAllowed ? 'width: 100%;' : ''};
`));

const StackedButton = styled('div', {
  shouldForwardProp: (prop) => prop !== 'onlyTwoButtons',
})(({ onlyTwoButtons }) => ({
  marginLeft: '3px',
  width: onlyTwoButtons ? '50% !important' : '33% !important',
}));

const ButtonWrapper = styled('div')`
  &:last-child {
    margin-right: 0;
  }
  margin-right: 8px;
  display: flex;
  align-items: center;
  // {({ onlyTwoButtons }) => (onlyTwoButtons ? 'width: 50% !important;' : '')}
`;

const ButtonWrapperRight = styled('div')`
  margin-right: 0;
  display: flex;
  align-items: center;
  // {({ onlyTwoButtons }) => (onlyTwoButtons ? 'width: 50% !important;' : '')}
`;

export default withStyles(styles)(ItemActionBar);
