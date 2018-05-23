import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "react-svg-icons";
import { Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import { renderLog } from "../../utils/logging";
import { showToastError, showToastSuccess } from "../../utils/showToast";
import { stringContains } from "../../utils/textFormat";
import MeasureStore from "../../stores/MeasureStore";
import ShareButtonDropdown from "./ShareButtonDropdown";
import SupportActions from "../../actions/SupportActions";
import VoterActions from "../../actions/VoterActions";
import VoterConstants from "../../constants/VoterConstants";
import VoterStore from "../../stores/VoterStore";
import PositionPublicToggle from "../../components/Widgets/PositionPublicToggle";
import webAppConfig from "../../config";

export default class ItemActionBar extends Component {
  static propTypes = {
    ballot_item_we_vote_id: PropTypes.string.isRequired,
    commentButtonHide: PropTypes.bool,
    commentButtonHideInMobile: PropTypes.bool,
    opposeHideInMobile: PropTypes.bool,
    shareButtonHide: PropTypes.bool,
    supportProps: PropTypes.object,
    toggleFunction: PropTypes.func,
    type: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string,
    supportOrOpposeHasBeenClicked: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemWeVoteId: "",
      is_oppose_local_state: undefined,
      is_support_local_state: undefined,
      showSupportOrOpposeHelpModal: false,
      supportProps: this.props.supportProps,
      transitioning: false,
    };
    this.toggleSupportOrOpposeHelpModal = this.toggleSupportOrOpposeHelpModal.bind(this);
  }

  componentDidMount () {
    let isOpposeLocalState;
    let isSupportLocalState;
    if (this.props.supportProps) {
      isOpposeLocalState = this.props.supportProps.is_oppose;
      isSupportLocalState = this.props.supportProps.is_support;
    }

    this.setState({
      ballotItemWeVoteId: this.props.ballot_item_we_vote_id,
      is_oppose_local_state: isOpposeLocalState,
      is_support_local_state: isSupportLocalState,
    });
  }

  componentWillReceiveProps (nextProps) {
    let isOpposeLocalState;
    let isSupportLocalState;
    if (nextProps.supportProps) {
      isOpposeLocalState = nextProps.supportProps.is_oppose;
      isSupportLocalState = nextProps.supportProps.is_support;
    }

    this.setState({
      ballotItemWeVoteId: nextProps.ballot_item_we_vote_id,
      is_oppose_local_state: isOpposeLocalState,
      is_support_local_state: isSupportLocalState,
      supportProps: nextProps.supportProps,
      transitioning: false,
    });
  }

  isMeasure () {
    return stringContains("meas", this.state.ballotItemWeVoteId);
  }

  supportItem (isSupport) {
    if (this.props.supportOrOpposeHasBeenClicked) {
      this.props.supportOrOpposeHasBeenClicked();
    }
    if (isSupport) {
      this.stopSupportingItem();
      return;
    }

    this.setState({
      is_oppose_local_state: false,
      is_support_local_state: true,
    });
    if (this.state.transitioning) {
      return;
    }

    let supportOpposeModalHasBeenShown = VoterStore.getInterfaceFlagState(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
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
      is_oppose_local_state: false,
      is_support_local_state: false,
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

  opposeItem (isOppose) {
    if (this.props.supportOrOpposeHasBeenClicked) {
      this.props.supportOrOpposeHasBeenClicked();
    }
    if (isOppose) {
      this.stopOpposingItem();
      return;
    }

    this.setState({
      is_oppose_local_state: true,
      is_support_local_state: false,
    });
    if (this.state.transitioning) {
      return;
    }

    let supportOpposeModalHasBeenShown = VoterStore.getInterfaceFlagState(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
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
      is_oppose_local_state: false,
      is_support_local_state: false,
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
    this.setState({
      showSupportOrOpposeHelpModal: !this.state.showSupportOrOpposeHelpModal,
    });
  }

  render () {
    renderLog(__filename);

    if (this.props.supportProps === undefined) {
      // console.log("ItemActionBar, supportProps undefined");
      return null;
    }

    let { support_count: supportCount, oppose_count: opposeCount } = this.props.supportProps;
    if (supportCount === undefined ||
      opposeCount === undefined ||
      this.state.is_support_local_state === undefined ||
      this.state.is_oppose_local_state === undefined) {
      return null;
    }

    let isPublicPosition = false;
    if (this.props.supportProps !== undefined && this.props.supportProps.is_public_position !== undefined) {
      isPublicPosition = this.props.supportProps.is_public_position;
    }

    const iconSize = 18;
    let iconColor = "#999";

    // TODO Refactor the way we color the icons
    let supportIconColor = this.state.is_support_local_state ? "white" : "#999";
    let opposeIconColor = this.state.is_oppose_local_state ? "white" : "#999";
    let urlBeingShared;
    if (this.props.type === "CANDIDATE") {
      urlBeingShared = webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME + "/candidate/" + this.state.ballotItemWeVoteId;
    } else {
      urlBeingShared = webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME + "/measure/" + this.state.ballotItemWeVoteId;
    }

    const shareIcon = <span className="btn__icon"><Icon name="share-icon" width={iconSize} height={iconSize} color={iconColor} /></span>;

    // This modal is shown when user clicks on support or oppose button for the first time only.
    let modalSupportProps = { is_public_position: false };
    const SupportOrOpposeHelpModal = <Modal show={this.state.showSupportOrOpposeHelpModal} onHide={ ()=> { this.toggleSupportOrOpposeHelpModal(); } } >

      <Modal.Header closeButton>
        <Modal.Title>
          <div className="text-center">Support or Oppose</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="card">
          <div className="text-center">
            <div className="u-f2">Your position is only visible to your We Vote friends.</div>
            <div className="u-f4">
              Change the privacy toggle to make your views public.<br />
              Test the toggle here:<br />
            </div>
            <br />
            <PositionPublicToggle ballot_item_we_vote_id="null"
                                  className="null"
                                  type="MEASURE"
                                  supportProps={modalSupportProps}
                                  inTestMode
            />
            <br />
            We Vote helps you get ready to vote, <strong>but you cannot use We Vote to cast your vote</strong>.<br />
            Make sure to return your official ballot to your polling place!<br />
            <br />
          </div>
        </section>
      </Modal.Body>
    </Modal>;

    const ballotItemDisplayName = this.props.ballot_item_display_name || "";
    let supportButtonSelectedPopOverText = "Click to support";
    if (ballotItemDisplayName.length > 0) {
      supportButtonSelectedPopOverText += " " + ballotItemDisplayName + ".";
    } else {
      supportButtonSelectedPopOverText += ".";
    }

    if (isPublicPosition) {
      supportButtonSelectedPopOverText += " Your support will be visible to the public.";
    } else {
      supportButtonSelectedPopOverText += " Only your We Vote friends will see your support.";
    }

    let supportButtonUnselectedPopOverText = "Click to remove your support";
    if (ballotItemDisplayName.length > 0) {
      supportButtonUnselectedPopOverText += " for " + ballotItemDisplayName + ".";
    } else {
      supportButtonUnselectedPopOverText += ".";
    }

    let opposeButtonSelectedPopOverText = "Click to oppose";
    if (ballotItemDisplayName.length > 0) {
      opposeButtonSelectedPopOverText += " " + ballotItemDisplayName + ".";
    } else {
      opposeButtonSelectedPopOverText += ".";
    }

    if (isPublicPosition) {
      opposeButtonSelectedPopOverText += " Your opposition will be visible to the public.";
    } else {
      opposeButtonSelectedPopOverText += " Only your We Vote friends will see your opposition.";
    }

    let opposeButtonUnselectedPopOverText = "Click to remove your opposition";
    if (ballotItemDisplayName.length > 0) {
      opposeButtonUnselectedPopOverText += " for " + ballotItemDisplayName + ".";
    } else {
      opposeButtonUnselectedPopOverText += ".";
    }

    const supportButtonPopoverTooltip = <Tooltip id="supportButtonTooltip">{this.state.is_support_local_state ? supportButtonUnselectedPopOverText : supportButtonSelectedPopOverText }</Tooltip>;
    const opposeButtonPopoverTooltip = <Tooltip id="opposeButtonTooltip">{this.state.is_oppose_local_state ? opposeButtonUnselectedPopOverText : opposeButtonSelectedPopOverText}</Tooltip>;

    let yesVoteDescriptionExists = false;
    let yesVoteDescription = "";
    if (this.isMeasure()) {
      yesVoteDescription = MeasureStore.getYesVoteDescription(this.state.ballotItemWeVoteId);
      if (yesVoteDescription && yesVoteDescription.length) {
        yesVoteDescriptionExists = true;
      }
    }

    let noVoteDescriptionExists = false;
    let noVoteDescription = "";
    if (this.isMeasure()) {
      noVoteDescription = MeasureStore.getNoVoteDescription(this.state.ballotItemWeVoteId);
      if (noVoteDescription && noVoteDescription.length) {
        noVoteDescriptionExists = true;
      }
    }

    const supportButton = <button className={"item-actionbar__btn item-actionbar__btn--support btn btn-default" + (this.state.is_support_local_state ? " support-at-state" : "")} onClick={this.supportItem.bind(this, this.state.is_support_local_state)}>
      <span className="btn__icon">
        <Icon name="thumbs-up-icon" width={iconSize} height={iconSize} color={supportIconColor} />
      </span>
      { this.state.is_support_local_state ?
        <span
          className={ this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" : "item-actionbar__position-btn-label item-actionbar__position-at-state" }>Support</span> :
        <span
          className={ this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" : "item-actionbar__position-btn-label" }>Support</span>
      }
    </button>;

    const opposeButton = <button className={(this.props.opposeHideInMobile ? "hidden-xs " : "") + "item-actionbar__btn item-actionbar__btn--oppose btn btn-default" + (this.state.is_oppose_local_state ? " oppose-at-state" : "")} onClick={this.opposeItem.bind(this, this.state.is_oppose_local_state)}>
      <span className="btn__icon">
        <Icon name="thumbs-down-icon" width={iconSize} height={iconSize} color={opposeIconColor} />
      </span>
      { this.state.is_oppose_local_state ?
        <span
          className={ this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" : "item-actionbar__position-btn-label item-actionbar__position-at-state" }>Oppose</span> :
        <span
          className={ this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" : "item-actionbar__position-btn-label" }>Oppose</span>
      }
    </button>;

    return <div className={ this.props.shareButtonHide ? "item-actionbar--inline hidden-print" : "item-actionbar hidden-print" }>
      <div className={(yesVoteDescriptionExists || noVoteDescriptionExists ? "" : "btn-group") + (!this.props.shareButtonHide ? " u-push--sm" : "")}>

        {/* Start of Support Button */}
        <div className="hidden-xs">
          <OverlayTrigger placement="top" overlay={supportButtonPopoverTooltip}>{supportButton}</OverlayTrigger>
          {yesVoteDescriptionExists ? <span className="item-actionbar__following-text">{yesVoteDescription}</span> : null}
        </div>
        <div className="visible-xs">
          {supportButton}
          {yesVoteDescriptionExists ? <span className="item-actionbar__following-text">{yesVoteDescription}</span> : null}
        </div>

        {/* Start of Oppose Button */}
        <div className="hidden-xs">
          <OverlayTrigger placement="top" overlay={opposeButtonPopoverTooltip}>{opposeButton}</OverlayTrigger>
          {noVoteDescriptionExists ? <span className="item-actionbar__following-text">{noVoteDescription}</span> : null}
        </div>
        <div className="visible-xs">
          {opposeButton}
          {noVoteDescriptionExists ? <span className="item-actionbar__following-text">{noVoteDescription}</span> : null}
        </div>
      { this.props.commentButtonHide ?
        null :
        <div>
          <button className={"item-actionbar__btn item-actionbar__btn--comment btn btn-default u-push--sm" + (this.props.commentButtonHideInMobile ? " hidden-xs" : null)}
                  onClick={this.props.toggleFunction}>
            <span className="btn__icon">
              <Icon name="comment-icon" width={iconSize} height={iconSize} color={iconColor} />
            </span>
            <span className="item-actionbar__position-btn-label">Comment</span>
          </button>
        </div> }
      </div>

      { this.props.shareButtonHide ?
        null :
        <ShareButtonDropdown urlBeingShared={urlBeingShared} shareIcon={shareIcon} shareText={"Share"} /> }
      { this.state.showSupportOrOpposeHelpModal ? SupportOrOpposeHelpModal : null}
    </div>;
  }
}
