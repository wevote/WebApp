import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import ReactSVG from "react-svg";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
import { showToastError, showToastSuccess } from "../../utils/showToast";
import { stringContains } from "../../utils/textFormat";
import MeasureStore from "../../stores/MeasureStore";
import ReadMore from "./ReadMore";
import ShareButtonDropDown from "./ShareButtonDropDown";
import SupportActions from "../../actions/SupportActions";
import VoterActions from "../../actions/VoterActions";
import VoterConstants from "../../constants/VoterConstants";
import VoterStore from "../../stores/VoterStore";
import PositionPublicToggle from "./PositionPublicToggle";
import webAppConfig from "../../config";

export default class ItemActionBar extends Component {
  static propTypes = {
    ballot_item_we_vote_id: PropTypes.string.isRequired,
    commentButtonHide: PropTypes.bool,
    commentButtonHideInMobile: PropTypes.bool,
    currentBallotIdInUrl: PropTypes.string,
    opposeHideInMobile: PropTypes.bool,
    shareButtonHide: PropTypes.bool,
    supportProps: PropTypes.object,
    toggleFunction: PropTypes.func,
    type: PropTypes.string.isRequired,
    ballotItemDisplayName: PropTypes.string,
    supportOrOpposeHasBeenClicked: PropTypes.func,
    urlWithoutHash: PropTypes.string,
    we_vote_id: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemWeVoteId: "",
      componentDidMountFinished: false,
      isOpposeAPIState: undefined,
      isOpposeLocalState: undefined,
      isPublicPosition: undefined,
      isSupportAPIState: undefined,
      isSupportLocalState: undefined,
      showSupportOrOpposeHelpModal: false,
      supportCount: 0,
      opposeCount: 0,
      yesVoteDescription: "",
      yesVoteDescriptionExists: false,
      noVoteDescription: "",
      noVoteDescriptionExists: false,
      // supportProps: this.props.supportProps,
      transitioning: false,
    };
    this.isOpposeCalculated = this.isOpposeCalculated.bind(this);
    this.isSupportCalculated = this.isSupportCalculated.bind(this);
    this.opposeItem = this.opposeItem.bind(this);
    this.supportItem = this.supportItem.bind(this);
    this.toggleSupportOrOpposeHelpModal = this.toggleSupportOrOpposeHelpModal.bind(this);
  }

  componentDidMount () {
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    // console.log("itemActionBar, NEW componentDidMount");
    let isOpposeAPIState = false;
    let isPublicPosition = false;
    let isSupportAPIState = false;
    let supportCount = 0;
    let opposeCount = 0;
    if (this.props.supportProps) {
      isPublicPosition = this.props.supportProps.is_public_position || false;
      isOpposeAPIState = this.props.supportProps.is_oppose || false;
      isSupportAPIState = this.props.supportProps.is_support || false;
      supportCount = this.props.supportProps.support_count || 0;
      opposeCount = this.props.supportProps.oppose_count || 0;
    }

    this.setState({
      ballotItemWeVoteId: this.props.ballot_item_we_vote_id,
      componentDidMountFinished: true,
      isOpposeAPIState,
      isPublicPosition,
      isSupportAPIState,
      supportCount,
      opposeCount,
    }, this.onMeasureStoreChange);
  }

  componentWillReceiveProps (nextProps) {
    // console.log("itemActionBar, RELOAD componentWillReceiveProps");
    if (nextProps.ballot_item_we_vote_id !== undefined && nextProps.ballot_item_we_vote_id && nextProps.ballot_item_we_vote_id !== this.state.ballotItemWeVoteId) {
      // console.log("itemActionBar, ballotItemWeVoteId setState");
      this.setState({
        ballotItemWeVoteId: nextProps.ballot_item_we_vote_id,
      }, this.onMeasureStoreChange);
    }
    // Only proceed if we have valid supportProps
    if (nextProps.supportProps !== undefined && nextProps.supportProps) {
      if (nextProps.supportProps.support_count !== undefined && nextProps.supportProps.support_count !== this.state.supportCount) {
        // console.log("itemActionBar, support_count setState");
        this.setState({
          supportCount: nextProps.supportProps.support_count,
        });
      }
      if (nextProps.supportProps.oppose_count !== undefined && nextProps.supportProps.oppose_count !== this.state.opposeCount) {
        // console.log("itemActionBar, oppose_count setState");
        this.setState({
          opposeCount: nextProps.supportProps.oppose_count,
        });
      }
      // We only want to update the state when the API is_support and is_oppose "catches up" withe local state

      // Are we "locking" the isSupport or isOppose state currently?
      let localOpposeStateLocked = false;
      let localSupportStateLocked = false;
      if (this.state.isOpposeLocalState !== undefined) {
        localOpposeStateLocked = true;
      }
      if (this.state.isSupportLocalState !== undefined) {
        localSupportStateLocked = true;
      }
      if (localOpposeStateLocked) {
        // Don't make a change until the API state matches the local state
        if (nextProps.supportProps.is_oppose !== undefined && nextProps.supportProps.is_oppose === this.state.isOpposeLocalState) {
          // console.log("itemActionBar, isOpposeAPIState CATCHUP setState");
          this.setState({
            isOpposeAPIState: nextProps.supportProps.is_oppose,
            isOpposeLocalState: undefined,
            transitioning: false,
          });
        }
      } else if (nextProps.supportProps.is_oppose !== undefined && nextProps.supportProps.is_oppose !== this.state.isOpposeAPIState) {
        // Don't make a change if the value from the API server already matches isOpposeAPIState
        // console.log("itemActionBar, isOpposeAPIState FRESH setState");
        this.setState({
          isOpposeAPIState: nextProps.supportProps.is_oppose,
          isOpposeLocalState: undefined,
          transitioning: false,
        });
      }
      if (localSupportStateLocked) {
        // Don't make a change until the API state matches the local state
        if (nextProps.supportProps.is_support !== undefined && nextProps.supportProps.is_support === this.state.isSupportLocalState) {
          // console.log("itemActionBar, isSupportLocalState CATCHUP setState");
          this.setState({
            isSupportAPIState: nextProps.supportProps.is_support,
            isSupportLocalState: undefined,
            transitioning: false,
          });
        }
      } else if (nextProps.supportProps.is_support !== undefined && nextProps.supportProps.is_support !== this.state.isSupportAPIState) {
        // Don't make a change if the value from the API server already matches isSupportAPIState
        // console.log("itemActionBar, isSupportAPIState FRESH setState");
        this.setState({
          isSupportAPIState: nextProps.supportProps.is_support,
          isSupportLocalState: undefined,
          transitioning: false,
        });
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    // We added this because ItemActionBar was rendering with practically every API response received
    // console.log("itemActionBar, shouldComponentUpdate");
    if (this.state.transitioning || nextState.transitioning) {
      // console.log("shouldComponentUpdate: transitioning YES");
      return true;
    }
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }

    if (nextProps.ballot_item_we_vote_id !== undefined && nextProps.ballot_item_we_vote_id && nextProps.ballot_item_we_vote_id !== this.state.ballotItemWeVoteId) {
      // console.log("shouldComponentUpdate: itemActionBar, ballotItemWeVoteId");
      return true;
    }
    // Only proceed if we have valid supportProps
    if (nextProps.supportProps !== undefined && nextProps.supportProps) {
      if (nextProps.supportProps.support_count !== undefined && nextProps.supportProps.support_count !== this.state.supportCount) {
        // console.log("shouldComponentUpdate: itemActionBar, support_count");
        return true;
      }
      if (nextProps.supportProps.oppose_count !== undefined && nextProps.supportProps.oppose_count !== this.state.opposeCount) {
        // console.log("shouldComponentUpdate: itemActionBar, oppose_count");
        return true;
      }
      // We only want to update the state when the API is_support and is_oppose "catches up" withe local state

      // Are we "locking" the isSupport or isOppose state currently?
      let localOpposeStateLocked = false;
      let localSupportStateLocked = false;
      if (this.state.isOpposeLocalState !== undefined) {
        localOpposeStateLocked = true;
      }
      if (this.state.isSupportLocalState !== undefined) {
        localSupportStateLocked = true;
      }
      if (localOpposeStateLocked) {
        // Don't make a change until the API state matches the local state
        if (nextProps.supportProps.is_oppose !== undefined && nextProps.supportProps.is_oppose === this.state.isOpposeLocalState) {
          // console.log("shouldComponentUpdate: itemActionBar, isOpposeAPIState CATCHUP");
          return true;
        }
      } else if (nextProps.supportProps.is_oppose !== undefined && nextProps.supportProps.is_oppose !== this.state.isOpposeAPIState) {
        // Don't make a change if the value from the API server already matches isOpposeAPIState
        // console.log("shouldComponentUpdate: itemActionBar, isOpposeAPIState FRESH");
        return true;
      }
      if (localSupportStateLocked) {
        // Don't make a change until the API state matches the local state
        if (nextProps.supportProps.is_support !== undefined && nextProps.supportProps.is_support === this.state.isSupportLocalState) {
          // console.log("shouldComponentUpdate: itemActionBar, isSupportLocalState CATCHUP");
          return true;
        }
      } else if (nextProps.supportProps.is_support !== undefined && nextProps.supportProps.is_support !== this.state.isSupportAPIState) {
        // Don't make a change if the value from the API server already matches isSupportAPIState
        // console.log("shouldComponentUpdate: itemActionBar, isSupportAPIState FRESH");
        return true;
      }
    }
    if (this.state.showSupportOrOpposeHelpModal !== nextState.showSupportOrOpposeHelpModal) {
      // console.log("shouldComponentUpdate: itemActionBar, showSupportOrOpposeHelpModal different");
      return true;
    }
    if (this.state.yesVoteDescriptionExists !== nextState.yesVoteDescriptionExists) {
      // console.log("shouldComponentUpdate: itemActionBar, yesVoteDescriptionExists different");
      return true;
    }
    if (this.state.noVoteDescriptionExists !== nextState.noVoteDescriptionExists) {
      // console.log("shouldComponentUpdate: itemActionBar, noVoteDescriptionExists different");
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
  }

  onMeasureStoreChange () {
    if (this.isMeasure()) {
      const { ballotItemWeVoteId } = this.state;
      this.setState({
        yesVoteDescription: MeasureStore.getYesVoteDescription(ballotItemWeVoteId),
        noVoteDescription: MeasureStore.getNoVoteDescription(ballotItemWeVoteId),
      }, () => {
        const { noVoteDescription, yesVoteDescription } = this.state;
        this.setState({
          yesVoteDescriptionExists: yesVoteDescription && yesVoteDescription.length,
          noVoteDescriptionExists: noVoteDescription && noVoteDescription.length,
        });
      });
    }
  }

  isMeasure () {
    return stringContains("meas", this.state.ballotItemWeVoteId);
  }

  supportItem () {
    // Button to support this item was clicked
    const { currentBallotIdInUrl, urlWithoutHash, we_vote_id: weVoteId } = this.props;
    if (currentBallotIdInUrl !== weVoteId) {
      historyPush(`${urlWithoutHash}#${this.props.we_vote_id}`);
    }

    if (this.props.supportOrOpposeHasBeenClicked) {
      this.props.supportOrOpposeHasBeenClicked();
    }
    if (this.isSupportCalculated()) {
      // console.log("supportItem about to call stopSupportingItem after isSupportCalculated");
      this.stopSupportingItem();
      return;
    }

    // console.log("supportItem setState");
    this.setState({
      isOpposeLocalState: false,
      isSupportLocalState: true,
    });
    if (this.state.transitioning) {
      return;
    }

    const supportOpposeModalHasBeenShown = VoterStore.getInterfaceFlagState(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    if (!supportOpposeModalHasBeenShown) {
      this.toggleSupportOrOpposeHelpModal();
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    }

    SupportActions.voterSupportingSave(this.state.ballotItemWeVoteId, this.props.type);
    this.setState({
      transitioning: true,
    });
    showToastSuccess("Support added!");
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
    showToastSuccess("Support removed!");
  }

  opposeItem () {
    const { currentBallotIdInUrl, urlWithoutHash, we_vote_id: weVoteId } = this.props;
    if (currentBallotIdInUrl !== weVoteId) {
      historyPush(`${urlWithoutHash}#${this.props.we_vote_id}`);
    }
    if (this.props.supportOrOpposeHasBeenClicked) {
      this.props.supportOrOpposeHasBeenClicked();
    }

    if (this.isOpposeCalculated()) {
      // console.log("opposeItem about to call stopOpposingItem after isOpposeCalculated");
      this.stopOpposingItem();
      return;
    }

    // console.log("opposeItem setState");
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
    showToastError("Opposition added!");
  }

  stopOpposingItem () {
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
    showToastError("Opposition removed!");
  }

  toggleSupportOrOpposeHelpModal () {
    const { showSupportOrOpposeHelpModal } = this.state;
    this.setState({
      showSupportOrOpposeHelpModal: !showSupportOrOpposeHelpModal,
    });
  }

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

  render () {
    renderLog(__filename);

    // // let { support_count: supportCount, oppose_count: opposeCount } = this.props.supportProps;
    if (this.state.supportCount === undefined ||
      this.state.opposeCount === undefined ||
      this.state.isOpposeAPIState === undefined ||
      this.state.isPublicPosition === undefined ||
      this.state.isSupportAPIState === undefined) {
      // Do not render until componentDidMount has set the initial states
      return null;
    }
    // console.log("ItemActionBar render");

    // let isPublicPosition = false;
    // if (this.props.supportProps !== undefined && this.props.supportProps.is_public_position !== undefined) {
    //   isPublicPosition = this.props.supportProps.is_public_position;
    // }

    const iconSize = 18;
    const iconColor = "#00749e"; // $link-color
    const chooseIconSize = 24;
    const chooseIconColor = this.isSupportCalculated() ? "white" : "#00749e"; // $link-color
    const opposeIconSize = 24;
    const opposeIconColor = this.isOpposeCalculated() ? "white" : "#00749e"; // $link-color

    let urlBeingShared;
    if (this.props.type === "CANDIDATE") {
      urlBeingShared = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/candidate/${this.state.ballotItemWeVoteId}`;
    } else {
      urlBeingShared = `${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/measure/${this.state.ballotItemWeVoteId}`;
    }

    const shareIcon = (
      <span className="btn__icon">
        <img src={cordovaDot("/img/global/svg-icons/share-icon.svg")}
             width={iconSize}
             height={iconSize}
             color={iconColor}
             alt="share"
        />
      </span>
    );

    // This modal is shown when user clicks on support or oppose button for the first time only.
    const modalSupportProps = { is_public_position: false };
    const SupportOrOpposeHelpModal = (
      <Modal show={this.state.showSupportOrOpposeHelpModal} onHide={() => { this.toggleSupportOrOpposeHelpModal(); }}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="text-center">Choose or Oppose</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section className="card">
            <div className="text-center">
              <div className="u-f2">Your position is only visible to your We Vote friends.</div>
              <div className="u-f4">
                Change the privacy toggle to make your views public.
                <br />
                Test the toggle here:
                <br />
              </div>
              <br />
              <PositionPublicToggle
                ballot_item_we_vote_id="null"
                className="null"
                type="MEASURE"
                supportProps={modalSupportProps}
                inTestMode
              />
              <br />
              We Vote helps you get ready to vote,
              {" "}
              <strong>but you cannot use We Vote to cast your vote</strong>
.
              <br />
              Make sure to return your official ballot to your polling place!
              <br />
              <br />
            </div>
          </section>
        </Modal.Body>
      </Modal>
    );

    const ballotItemDisplayName = this.props.ballotItemDisplayName || "";
    let supportButtonSelectedPopOverText = "Click to choose";
    if (ballotItemDisplayName.length > 0) {
      supportButtonSelectedPopOverText += ` ${ballotItemDisplayName}.`;
    } else {
      supportButtonSelectedPopOverText += ".";
    }

    if (this.state.isPublicPosition) {
      supportButtonSelectedPopOverText += " Your choice will be visible to the public.";
    } else {
      supportButtonSelectedPopOverText += " Only your We Vote friends will see your choice.";
    }

    let supportButtonUnselectedPopOverText = "Click to remove your choice";
    if (ballotItemDisplayName.length > 0) {
      supportButtonUnselectedPopOverText += ` for ${ballotItemDisplayName}.`;
    } else {
      supportButtonUnselectedPopOverText += ".";
    }

    let opposeButtonSelectedPopOverText = "Click to oppose";
    if (ballotItemDisplayName.length > 0) {
      opposeButtonSelectedPopOverText += ` ${ballotItemDisplayName}.`;
    } else {
      opposeButtonSelectedPopOverText += ".";
    }

    if (this.state.isPublicPosition) {
      opposeButtonSelectedPopOverText += " Your opposition will be visible to the public.";
    } else {
      opposeButtonSelectedPopOverText += " Only your We Vote friends will see your opposition.";
    }

    let opposeButtonUnselectedPopOverText = "Click to remove your opposition";
    if (ballotItemDisplayName.length > 0) {
      opposeButtonUnselectedPopOverText += ` for ${ballotItemDisplayName}.`;
    } else {
      opposeButtonUnselectedPopOverText += ".";
    }

    const supportButtonPopoverTooltip = <Tooltip id="supportButtonTooltip">{this.isSupportCalculated() ? supportButtonUnselectedPopOverText : supportButtonSelectedPopOverText }</Tooltip>;
    const opposeButtonPopoverTooltip = <Tooltip id="opposeButtonTooltip">{this.isOpposeCalculated() ? opposeButtonUnselectedPopOverText : opposeButtonSelectedPopOverText}</Tooltip>;

    const supportButton = (
      <button
        className={`item-actionbar__btn item-actionbar__btn--support btn btn-outline-primary${this.isSupportCalculated() ? " support-at-state" : ""}`}
        onClick={() => this.supportItem()}
        type="button"
      >
        <span className="btn__icon">
          <img src={cordovaDot("/img/global/svg-icons/glyphicons-pro-halflings/glyphicons-halflings-262-tick.svg")}
               width={chooseIconSize}
               height={chooseIconSize}
               color={chooseIconColor}
               alt="choose"
          />
        </span>
        { this.isSupportCalculated() ? (
          <span
            className={this.props.shareButtonHide ? "item-actionbar--inline__position-choose-btn-label--at-state" :
              "item-actionbar__position-choose-btn-label--at-state"}
          >
            Chosen
          </span>
        ) : (
          <span
            className={this.props.shareButtonHide ? "item-actionbar--inline__position-choose-btn-label" :
              "item-actionbar__position-choose-btn-label"}
          >
            Choose
          </span>
        )}
      </button>
    );

    const measureYesButton = (
      <button
        className={`item-actionbar__btn item-actionbar__btn--support btn btn-default${this.isSupportCalculated() ? " support-at-state" : ""}`}
        onClick={() => this.supportItem()}
        type="button"
      >
        <span className="btn__icon">
          <img src={cordovaDot("/img/global/svg-icons/thumbs-up-icon.svg")}
               width={18}
               height={18}
               color={chooseIconColor}
               alt="thumbs up"
          />
        </span>
        { this.isSupportCalculated() ? (
          <span
            className={this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label--at-state" :
              "item-actionbar__position-btn-label--at-state"}
          >
            Voting Yes
          </span>
        ) : (
          <span
            className={this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" :
              "item-actionbar__position-btn-label"}
          >
            Vote Yes
          </span>
        )}
      </button>
    );

    const opposeButton = (
      <button
        className={`${this.props.opposeHideInMobile ? "d-none d-sm-block " : ""}item-actionbar__btn item-actionbar__btn--oppose btn btn-default${this.isOpposeCalculated() ? " oppose-at-state" : ""}`}
        onClick={() => this.opposeItem()}
        type="button"
      >
        <span className="btn__icon">
          <ReactSVG src={cordovaDot("/img/global/svg-icons/glyphicons-pro-halflings/glyphicons-halflings-90-ban-circle.svg")}
                    svgStyle={{ fill: opposeIconColor, height: opposeIconSize, width: opposeIconSize }}
          />
        </span>
        { this.isOpposeCalculated() ? (
          <span
            className={this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label--at-state" :
              "item-actionbar__position-btn-label--at-state"}
          >
            Oppose
          </span>
        ) : (
          <span
            className={this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" :
              "item-actionbar__position-btn-label"}
          >
            Oppose
          </span>
        )}
      </button>
    );

    const measureNoButton = (
      <button
        className={`${this.props.opposeHideInMobile ? "d-none d-sm-block " : ""}item-actionbar__btn item-actionbar__btn--oppose btn btn-default${this.isOpposeCalculated() ? " oppose-at-state" : ""}`}
        onClick={() => this.opposeItem()}
        type="button"
      >
        <span className="btn__icon">
          <img src={cordovaDot("/img/global/svg-icons/thumbs-down-icon.svg")}
               width={18}
               height={18}
               color={opposeIconColor}
               alt="thumbs down"
          />
        </span>
        { this.isOpposeCalculated() ? (
          <span
            className={this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label--at-state" :
              "item-actionbar__position-btn-label--at-state"}
          >
            Voting No
          </span>
        ) : (
          <span
            className={this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" :
              "item-actionbar__position-btn-label"}
          >
            Vote No
          </span>
        )}
      </button>
    );

    const commentButton = (
      <button
        className={`${this.props.commentButtonHideInMobile ? "d-none d-sm-block " : null}item-actionbar__btn item-actionbar__btn--comment btn btn-default`}
        onClick={this.props.toggleFunction}
        type="button"
      >
        <span className="btn__icon">
          <img src={cordovaDot("/img/global/svg-icons/comment-icon.svg")}
               width={18}
               height={18}
               color={iconColor}
               alt="comment"
          />
        </span>
        <span className={this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" :
          "item-actionbar__position-btn-label"}
        >
          Comment
        </span>
      </button>
    );

    return (
      <div className={this.props.shareButtonHide ? "item-actionbar--inline" : "item-actionbar"}>
        <div className={(this.state.yesVoteDescriptionExists || this.state.noVoteDescriptionExists ? "" : "btn-group") + (!this.props.shareButtonHide ? " u-push--sm" : "")}>

          {/* Start of Support Button */}
          {/* Visible on desktop screens */}
          <div className="u-push--xs d-none d-lg-block item-actionbar__position-bar">
            <OverlayTrigger placement="top" overlay={supportButtonPopoverTooltip}>
              {this.props.type === "CANDIDATE" ? supportButton :
                measureYesButton
            }
            </OverlayTrigger>
            {this.state.yesVoteDescriptionExists ? (
              <span className="item-actionbar__following-text">
                {this.state.yesVoteDescription}
              </span>
            ) : null
            }
          </div>
          {/* Visible on mobile devices and tablets */}
          <div className="u-push--xs d-lg-none d-xl-none item-actionbar__position-bar item-actionbar__position-bar--mobile">
            {this.props.type === "CANDIDATE" ? supportButton :
              measureYesButton
            }
            {this.state.yesVoteDescriptionExists ? (
              <span className="item-actionbar__following-text">
                <ReadMore
                  num_of_lines={2}
                  text_to_display={this.state.yesVoteDescription}
                />
              </span>
            ) : null
            }
          </div>

          {/* Start of Oppose Button */}
          {/* Visible on desktop screens */}
          <div className="u-push--xs d-none d-lg-block item-actionbar__position-bar">
            <OverlayTrigger placement="top" overlay={opposeButtonPopoverTooltip}>
              {this.props.type === "CANDIDATE" ? opposeButton :
                measureNoButton
            }
            </OverlayTrigger>
            {this.state.noVoteDescriptionExists ? (
              <span className="item-actionbar__following-text">
                {this.state.noVoteDescription}
              </span>
            ) : null
            }
          </div>
          {/* Visible on mobile devices and tablets */}
          <div className="u-push--xs d-lg-none d-xl-none item-actionbar__position-bar item-actionbar__position-bar--mobile">
            {this.props.type === "CANDIDATE" ? opposeButton :
              measureNoButton
          }
            {this.state.noVoteDescriptionExists ? (
              <span className="item-actionbar__following-text">
                <ReadMore
                  num_of_lines={2}
                  text_to_display={this.state.noVoteDescription}
                />
              </span>
            ) : null
            }
          </div>
          { this.props.commentButtonHide ?
            null : (
              <div className="u-push--sm item-actionbar__position-bar">
                {commentButton}
              </div>
            )}

          { this.props.shareButtonHide ?
            null :
            <ShareButtonDropDown urlBeingShared={urlBeingShared} shareIcon={shareIcon} shareText="Share" /> }
          { this.state.showSupportOrOpposeHelpModal ? SupportOrOpposeHelpModal : null}
        </div>
      </div>
    );
  }
}
