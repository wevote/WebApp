import { Comment, Done, NotInterested, ThumbDown, ThumbUp } from '@mui/icons-material';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { PureComponent, Suspense } from 'react';
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
import PositionPublicToggle from '../../PositionItem/PositionPublicToggle';
import ShareButtonDropDown from '../ShareButtonDropdown';
import { openSnackbar } from '../../../common/components/Widgets/SnackNotifier';
import DesignTokenColors from '../../../common/components/Style/DesignTokenColors';
import PositionStatementModal from '../PositionStatementModal'; // eslint-disable-line import/no-cycle

const HelpWinOrDefeatModal = React.lazy(() => import(/* webpackChunkName: 'HelpWinOrDefeatModal' */ '../../../common/components/CampaignSupport/HelpWinOrDefeatModal')); // eslint-disable-line import/no-cycle

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
      helpWinOrDefeatModalOpen: false,
    };
    this.helpDefeatThemButton = this.helpDefeatThemButton.bind(this);
    this.helpThemWinButton = this.helpThemWinButton.bind(this);
    this.isOpposeCalculated = this.isOpposeCalculated.bind(this);
    this.isSupportCalculated = this.isSupportCalculated.bind(this);
    // this.onScroll = this.onScroll.bind(this);
    this.opposeButton = this.opposeButton.bind(this);
    this.opposeItem = this.opposeItem.bind(this);
    this.supportButton = this.supportButton.bind(this);
    this.showChooseOrOpposeIntroModalDecision = this.showChooseOrOpposeIntroModalDecision.bind(this);
    this.supportItem = this.supportItem.bind(this);
  }

  componentDidMount () {
    // console.log('ItemActionBar, NEW componentDidMount');
    const { ballotItemWeVoteId } = this.props;
    // console.log('ItemActionBar, NEW componentDidMount ballotItemWeVoteId:', ballotItemWeVoteId);
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
      // console.log('ballotItemType:', ballotItemType, ', ballotItemStatSheet:', ballotItemStatSheet);
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
    // console.log('ItemActionBar, RELOAD componentWillReceiveProps');
    const { ballotItemWeVoteId: previousBallotItemWeVoteId } = prevProps;
    const { ballotItemWeVoteId } = this.props;
    if (ballotItemWeVoteId !== undefined && ballotItemWeVoteId && ballotItemWeVoteId !== previousBallotItemWeVoteId) {
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
      // console.log('ItemActionBar, ballotItemWeVoteId setState, ballotItemWeVoteId: ', ballotItemWeVoteId);
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
      // console.log('ItemActionBar, onSupportStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId, ', ballotItemStatSheet:', ballotItemStatSheet);
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
          // console.log('ItemActionBar, support_count setState');
          this.setState({
            numberOfSupportPositionsForScore,
          });
        }
        if (numberOfOpposePositionsForScore !== undefined && numberOfOpposePositionsForScore !== this.state.numberOfOpposePositionsForScore) {
          // console.log('ItemActionBar, oppose_count setState');
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
            // console.log('ItemActionBar, isOpposeAPIState CATCHUP setState');
            this.setState({
              isOpposeAPIState: voterOpposesBallotItem,
              isOpposeLocalState: undefined,
              transitioning: false,
            });
          }
        } else if (voterOpposesBallotItem !== undefined && voterOpposesBallotItem !== isOpposeAPIState) {
          // Don't make a change if the value from the API server already matches isOpposeAPIState
          // console.log('ItemActionBar, isOpposeAPIState FRESH setState');
          this.setState({
            isOpposeAPIState: voterOpposesBallotItem,
            isOpposeLocalState: undefined,
            transitioning: false,
          });
        }
        if (localSupportStateLocked) {
          // Don't make a change until the API state matches the local state
          if (voterSupportsBallotItem !== undefined && voterSupportsBallotItem === isSupportLocalState) {
            // console.log('ItemActionBar, isSupportLocalState CATCHUP setState');
            this.setState({
              isSupportAPIState: voterSupportsBallotItem,
              isSupportLocalState: undefined,
              transitioning: false,
            });
          }
        } else if (voterSupportsBallotItem !== undefined && voterSupportsBallotItem !== isSupportAPIState) {
          // Don't make a change if the value from the API server already matches isSupportAPIState
          // console.log('ItemActionBar, isSupportAPIState FRESH setState');
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

  openHelpWinOrDefeatModal = () => {
    // const { ballotItemWeVoteId } = this.props;
    // console.log('openHelpWinOrDefeatModal ballotItemWeVoteId: ', ballotItemWeVoteId);
    this.setState({
      helpWinOrDefeatModalOpen: true,
    });
  };

  openPositionStatement = () => {
    this.setState({
      voterTextStatementOpened: true,
    });
  };

  toggleHelpWinOrDefeatFunction = () => {
    const { helpWinOrDefeatModalOpen } = this.state;
    this.setState({
      helpWinOrDefeatModalOpen: !helpWinOrDefeatModalOpen,
    });
  };

  togglePositionStatementFunction = () => {
    const { voterTextStatementOpened } = this.state;
    this.setState({
      voterTextStatementOpened: !voterTextStatementOpened,
    });
    if (this.props.togglePositionStatementFunction) {
      this.props.togglePositionStatementFunction();
    }
  };

  helpThemWinButton = (localUniqueId) => {
    const { classes, externalUniqueId } = this.props;
    // const buttonRootClass = inCard ? classes.buttonRootForCard : classes.buttonRoot;
    const buttonRootClass = classes.buttonHelpRoot;
    return (
      <Button
        classes={{ root: buttonRootClass, outlinedPrimary: classes.buttonOutlinedPrimary }}
        color="primary"
        id={`itemActionBarHelpThemWinButton-${externalUniqueId}-${localUniqueId}`}
        onClick={() => this.openHelpWinOrDefeatModal()}
        variant="contained"
      >
        <HelpButtonLabel>
          &nbsp;Help Win with $1&nbsp;
        </HelpButtonLabel>
      </Button>
    );
  };

  helpDefeatThemButton = (localUniqueId) => {
    const { classes, externalUniqueId, opposeHideInMobile } = this.props;
    // const buttonRootClass = inCard ? classes.buttonRootForCard : classes.buttonRoot;
    const buttonRootClass = classes.buttonHelpRoot;
    return (
      <Button
        classes={{ root: buttonRootClass, outlinedPrimary: classes.buttonOutlinedPrimary }}
        className={`${opposeHideInMobile ? 'd-none d-sm-block ' : ''}`}
        color="primary"
        id={`itemActionBarHelpDefeatButton-${externalUniqueId}-${localUniqueId}`}
        onClick={() => this.openHelpWinOrDefeatModal()}
        variant="contained"
      >
        <HelpButtonLabel>
          $1 to Help Defeat
        </HelpButtonLabel>
      </Button>
    );
  };

  opposeButton = (localUniqueId) => {
    const { classes, externalUniqueId, inCard, opposeHideInMobile } = this.props;
    let buttonRootClass = null;
    if (inCard) {
      buttonRootClass = this.isOpposeCalculated() ? classes.buttonRootForCardAfterChoice : classes.buttonRootForCard;
    } else {
      buttonRootClass = classes.buttonRoot;
    }
    return (
      <Button
        classes={{ root: buttonRootClass, outlinedPrimary: classes.buttonOutlinedPrimary }}
        className={`${opposeHideInMobile ? 'd-none d-sm-block ' : ''}`}
        color={this.isOpposeCalculated() ? 'opposed' : 'primary'}
        id={`itemActionBarOpposeButton-${externalUniqueId}-${localUniqueId}`}
        onClick={() => this.opposeItem()}
        variant={this.isOpposeCalculated() ? 'contained' : 'outlined'}
        // variant="outlined"
      >
        <NotInterested classes={this.isOpposeCalculated() ? { root: classes.buttonIconNotInterestedSelected } : { root: classes.buttonIconNotInterested }} />
        {this.isOpposeCalculated() ? (
          <OpposeButtonLabelSelected>
            Opposed
          </OpposeButtonLabelSelected>
        ) : (
          <OpposeButtonLabel isAtState={!this.props.shareButtonHide}>
            Oppose
          </OpposeButtonLabel>
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
    let buttonRootClass = null;
    if (inCard) {
      buttonRootClass = this.isSupportCalculated() ? classes.buttonRootForCardAfterChoice : classes.buttonRootForCard;
    } else {
      buttonRootClass = classes.buttonRoot;
    }
    return (
      <Button
        classes={{ root: buttonRootClass, outlinedPrimary: classes.buttonOutlinedPrimary }}
        color={this.isSupportCalculated() ? 'chosen' : 'primary'}
        id={`itemActionBarSupportButton-${externalUniqueId}-${localUniqueId}`}
        onClick={() => this.supportItem()}
        variant={this.isSupportCalculated() ? 'contained' : 'outlined'}
        // variant="outlined"
      >
        <Done classes={this.isSupportCalculated() ? { root: classes.buttonIconDoneSelected } : { root: classes.buttonIconDone }} />
        {this.isSupportCalculated() ? (
          <ChooseButtonLabelSelected>
            {useSupportWording ? (
              <>
                Supporting
              </>
            ) : (
              <>
                Chosen
              </>
            )}
          </ChooseButtonLabelSelected>
        ) : (
          <ChooseButtonLabel isAtState={!shareButtonHide}>
            {useSupportWording ? (
              <>
                Support
              </>
            ) : (
              <>
                Choose
              </>
            )}
          </ChooseButtonLabel>
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
          <ChooseButtonLabelSelected className="u-no-break">
            Voting Yes
          </ChooseButtonLabelSelected>
        ) : (
          <ChooseButtonLabel isAtState={!shareButtonHide} className="u-no-break">
            Vote Yes
          </ChooseButtonLabel>
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
          <ChooseButtonLabelSelected className="u-no-break">
            Voting No
          </ChooseButtonLabelSelected>
        ) : (
          <ChooseButtonLabel isAtState={!shareButtonHide} className="u-no-break">
            Vote No
          </ChooseButtonLabel>
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
        className={`${commentButtonHideInMobile ? 'd-none d-sm-block ' : null} btn-default`}
        onClick={this.togglePositionStatementFunction}
        classes={{ root: classes.buttonRoot, outlinedPrimary: classes.buttonOutlinedPrimary }}
      >
        <Comment classes={{ root: classes.buttonIcon }} />
        <ChooseButtonLabel isAtState={!shareButtonHide}>
          Comment
        </ChooseButtonLabel>
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
          className={`${commentButtonHideInMobile ? 'd-none d-sm-block ' : null} btn-default`}
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
    const {
      buttonsOnly, commentButtonHide, commentButtonHideInMobile,
      hideSupportYes, hideOpposeNo, useHelpDefeatOrHelpWin, useSupportWording,
    } = this.props;
    const {
      ballotItemType, ballotItemWeVoteId, helpWinOrDefeatModalOpen,
      isOpposeAPIState, isSupportAPIState,
      numberOfOpposePositionsForScore, numberOfSupportPositionsForScore,
      voterPositionIsPublic, voterTextStatementOpened,
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

    let helpDefeatButtonPopOverText = 'Chip in $1 to help defeat';
    if (ballotItemDisplayName.length > 0) {
      helpDefeatButtonPopOverText += ` ${ballotItemDisplayName}`;
    }
    helpDefeatButtonPopOverText += '.';

    let helpWinButtonPopOverText = 'Help';
    if (ballotItemDisplayName.length > 0) {
      helpWinButtonPopOverText += ` ${ballotItemDisplayName}`;
    }
    helpWinButtonPopOverText += ' win by chipping in $1.';

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

    const helpDefeatButtonPopoverTooltip = isMobileScreenSize() ? (<span />) : (
      <Tooltip className="u-z-index-9020" id="helpDefeatButtonTooltip">
        {helpDefeatButtonPopOverText}
      </Tooltip>
    );

    const helpWinButtonPopoverTooltip = isMobileScreenSize() ? (<span />) : (
      <Tooltip className="u-z-index-9020" id="helpWinButtonTooltip">
        {helpWinButtonPopOverText}
      </Tooltip>
    );

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
                  <ButtonWrapper
                    className="u-push--xs d-none d-lg-block"
                    data-modal-trigger
                  >
                    <OverlayTrigger
                      overlay={(useHelpDefeatOrHelpWin && this.isOpposeCalculated()) ? helpDefeatButtonPopoverTooltip : supportButtonPopoverTooltip}
                      placement="top"
                      rootClose
                    >
                      <div>
                        {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && ((useHelpDefeatOrHelpWin && this.isOpposeCalculated()) ? <></> : this.supportButton(`desktopVersion-${ballotItemWeVoteId}`))}
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
                    {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && ((useHelpDefeatOrHelpWin && this.isOpposeCalculated()) ? <></> : this.supportButton(`mobileVersion-${ballotItemWeVoteId}`))}
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
                      overlay={(useHelpDefeatOrHelpWin && this.isSupportCalculated()) ? helpWinButtonPopoverTooltip : opposeButtonPopoverTooltip}
                      placement="top"
                      rootClose
                    >
                      <div>
                        {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && ((useHelpDefeatOrHelpWin && this.isSupportCalculated()) ? this.helpThemWinButton(`desktopVersion-${ballotItemWeVoteId}`) : this.opposeButton(`desktopVersion-${ballotItemWeVoteId}`))}
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
                    {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && ((useHelpDefeatOrHelpWin && this.isSupportCalculated()) ? this.helpThemWinButton(`mobileVersion-${ballotItemWeVoteId}`) : this.opposeButton(`mobileVersion-${ballotItemWeVoteId}`))}
                    {ballotItemType === 'MEASURE' && this.measureNoButton(`mobileVersion-${ballotItemWeVoteId}`)}
                  </ButtonWrapperRight>
                )}
              </>
            )}

            {/* Start of Help Defeat Them Button */}
            {((ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && (useHelpDefeatOrHelpWin && this.isOpposeCalculated())) && (
              <>
                {/* Visible on desktop screens */}
                {buttonsOnly ? (
                  <StackedButton className="d-none d-lg-block" onlyTwoButtons={commentButtonHide}>
                    {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && this.opposeButtonNoText(`desktopVersion-${ballotItemWeVoteId}`)}
                    {ballotItemType === 'MEASURE' && this.measureNoButtonNoText(`desktopVersion-${ballotItemWeVoteId}`)}
                  </StackedButton>
                ) : (
                  <ButtonWrapperFarRight className="d-none d-lg-block">
                    <OverlayTrigger
                      overlay={helpDefeatButtonPopoverTooltip}
                      placement="top"
                      rootClose
                    >
                      <div>
                        {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && (useHelpDefeatOrHelpWin && this.isOpposeCalculated()) && this.helpDefeatThemButton(`desktopVersion-${ballotItemWeVoteId}`)}
                      </div>
                    </OverlayTrigger>
                  </ButtonWrapperFarRight>
                )}
                {/* Visible on mobile devices and tablets */}
                {buttonsOnly ? (
                  <StackedButton className="d-lg-none d-xl-none" onlyTwoButtons={commentButtonHideInMobile}>
                    {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && this.opposeButtonNoText(`mobileVersion-${ballotItemWeVoteId}`)}
                    {ballotItemType === 'MEASURE' && this.measureNoButtonNoText(`mobileVersion-${ballotItemWeVoteId}`)}
                  </StackedButton>
                ) : (
                  <ButtonWrapperFarRight className="d-lg-none">
                    {(ballotItemType === 'CANDIDATE' || ballotItemType === 'POLITICIAN') && (useHelpDefeatOrHelpWin && this.isOpposeCalculated()) && this.helpDefeatThemButton(`mobileVersion-${ballotItemWeVoteId}`)}
                  </ButtonWrapperFarRight>
                )}
              </>
            )}
            { this.props.commentButtonHide || this.props.inModal ?
              null : (
                <span>
                  {buttonsOnly ? (
                    <CommentFlex>
                      {this.commentButtonNoText(`${ballotItemWeVoteId}`)}
                    </CommentFlex>
                  ) : (
                    <CommentFlex>
                      {this.commentButton(`${ballotItemWeVoteId}`)}
                    </CommentFlex>
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
          <Suspense fallback={<></>}>
            <HelpWinOrDefeatModal
              ballotItemWeVoteId={ballotItemWeVoteId}
              // externalUniqueId={externalUniqueId}
              show={helpWinOrDefeatModalOpen}
              toggleModal={this.toggleHelpWinOrDefeatFunction}
            />
          </Suspense>
          {voterTextStatementOpened && (
            <PositionStatementModal
              ballotItemWeVoteId={ballotItemWeVoteId}
              // externalUniqueId={externalUniqueId}
              show={voterTextStatementOpened}
              toggleModal={this.togglePositionStatementFunction}
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
  useHelpDefeatOrHelpWin: PropTypes.bool,
  useSupportWording: PropTypes.bool,
  // urlWithoutHash: PropTypes.string,
};

const styles = (theme) => ({
  buttonHelpRoot: {
    borderRadius: '15px',
    padding: 4,
    width: 'fit-content',
    height: 32,
    [theme.breakpoints.down('md')]: {
      width: 'fit-content',
      height: 30,
    },
    [theme.breakpoints.down('sm')]: {
      width: 'fit-content',
      minWidth: 80,
      height: 28,
      padding: '0 8px',
    },
  },
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
    /* color: `${DesignTokenColors.primary700}`, *//* change to green */
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: '.3rem',
    marginTop: '-2px',
  },
  buttonIconDoneSelected: {
    color: `${DesignTokenColors.confirmation300}`, /* change to green */
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: '.3rem',
    marginTop: '-2px',
  },
  buttonIconNotInterested: {
    /* color: `${DesignTokenColors.alert500}`, *//* change to red */
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: '.3rem',
    marginTop: '-2px',
  },
  buttonIconNotInterestedSelected: {
    color: `${DesignTokenColors.alert500}`, /* change to red */
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
    borderRadius: '15px',
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
    borderRadius: '15px',
    padding: 4,
    width: 138,
    height: 32,
  },
  buttonRootForCardAfterChoice: {
    borderRadius: '15px',
    padding: 4,
    width: 110,
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

const ButtonWrapper = styled('div')`
  &:last-child {
    margin-right: 0;
  }
  margin-right: 8px;
  display: flex;
  align-items: center;
  // {({ onlyTwoButtons }) => (onlyTwoButtons ? 'width: 50% !important;' : '')}
`;

const ButtonWrapperFarRight = styled('div')`
  margin-left: 4px;
  display: flex;
  align-items: center;
`;

const ButtonWrapperRight = styled('div')`
  margin-right: 0;
  display: flex;
  align-items: center;
  // {({ onlyTwoButtons }) => (onlyTwoButtons ? 'width: 50% !important;' : '')}
`;

const ChooseButtonLabel = styled('span', {
  shouldForwardProp: (prop) => !['isAtState'].includes(prop),
})(({ isAtState }) => (`
  color: #000;
  // ${isAtState ? 'font-weight: bold;' : ''};
`));

const ChooseButtonLabelSelected = styled('span', {
  shouldForwardProp: (prop) => !['isAtState'].includes(prop),
})(({ isAtState }) => (`
  ${isAtState ? '' : ''};
`));

const CommentFlex = styled('div')`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

const HelpButtonLabel = styled('span')`
  color: #fff;
`;

const OpposeButtonLabel = styled('span', {
  shouldForwardProp: (prop) => !['isAtState'].includes(prop),
})(({ isAtState }) => (`
  color: #000;
  ${isAtState ? 'font-weight: bold;' : ''};
`));

const OpposeButtonLabelSelected = styled('span', {
  shouldForwardProp: (prop) => !['isAtState'].includes(prop),
})(({ isAtState }) => (`
  ${isAtState ? '' : ''};
`));

const StackedButton = styled('div', {
  shouldForwardProp: (prop) => prop !== 'onlyTwoButtons',
})(({ onlyTwoButtons }) => ({
  marginLeft: '3px',
  width: onlyTwoButtons ? '50% !important' : '33% !important',
}));

export default withStyles(styles)(ItemActionBar);
