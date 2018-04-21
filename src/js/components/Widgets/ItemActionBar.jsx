import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "react-svg-icons";
import { Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import { renderLog } from "../../utils/logging";
import { showToastError, showToastSuccess } from "../../utils/showToast";
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
  };

  constructor (props) {
    super(props);
    this.state = {
      is_oppose_local_state: undefined,
      is_support_local_state: undefined,
      showSupportOrOpposeHelpModal: false,
      supportProps: this.props.supportProps,
      transitioning: false,
    };
    this.toggleSupportOrOpposeHelpModal = this.toggleSupportOrOpposeHelpModal.bind(this);
  }

  componentDidMount () {
    let is_oppose_local_state;
    let is_support_local_state;
    if (this.props.supportProps) {
      is_oppose_local_state = this.props.supportProps.is_oppose;
      is_support_local_state = this.props.supportProps.is_support;
    }
    this.setState({
      is_oppose_local_state: is_oppose_local_state,
      is_support_local_state: is_support_local_state,
    });
  }

  componentWillReceiveProps (nextProps) {
    let is_oppose_local_state;
    let is_support_local_state;
    if (nextProps.supportProps) {
      is_oppose_local_state = nextProps.supportProps.is_oppose;
      is_support_local_state = nextProps.supportProps.is_support;
    }
    this.setState({
      is_oppose_local_state: is_oppose_local_state,
      is_support_local_state: is_support_local_state,
      supportProps: nextProps.supportProps,
      transitioning: false,
    });
  }

  supportItem (is_support) {
    if (is_support) {this.stopSupportingItem(); return;}
    this.setState({
      is_oppose_local_state: false,
      is_support_local_state: true,
    });
    if (this.state.transitioning){ return; }
    let support_oppose_modal_has_been_shown = VoterStore.getInterfaceFlagState(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    if (!support_oppose_modal_has_been_shown) {
      this.toggleSupportOrOpposeHelpModal();
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    }
    SupportActions.voterSupportingSave(this.props.ballot_item_we_vote_id, this.props.type);
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
    if (this.state.transitioning){ return; }
    SupportActions.voterStopSupportingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({
      transitioning: true,
    });
    showToastSuccess("Support removed!");
  }

  opposeItem (is_oppose) {
    if (is_oppose) {this.stopOpposingItem(); return;}
    this.setState({
      is_oppose_local_state: true,
      is_support_local_state: false,
    });
    if (this.state.transitioning){ return; }
    let support_oppose_modal_has_been_shown = VoterStore.getInterfaceFlagState(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    if (!support_oppose_modal_has_been_shown) {
      this.toggleSupportOrOpposeHelpModal();
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    }
    SupportActions.voterOpposingSave(this.props.ballot_item_we_vote_id, this.props.type);
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

    SupportActions.voterStopOpposingSave(this.props.ballot_item_we_vote_id, this.props.type);
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

    if (this.props.supportProps === undefined){
      // console.log("ItemActionBar, supportProps undefined");
      return null;
    }

    let {support_count, oppose_count } = this.props.supportProps;
    if (support_count === undefined ||
      oppose_count === undefined ||
      this.state.is_support_local_state === undefined ||
      this.state.is_oppose_local_state === undefined) {
      return null;
    }
    let is_public_position = false;
    if (this.props.supportProps !== undefined && this.props.supportProps.is_public_position !== undefined) {
      is_public_position = this.props.supportProps.is_public_position;
    }
    const icon_size = 18;
    let icon_color = "#999";
    // TODO Refactor the way we color the icons
    let support_icon_color = this.state.is_support_local_state ? "white" : "#999";
    let oppose_icon_color = this.state.is_oppose_local_state ? "white" : "#999";
    let url_being_shared;
    if (this.props.type === "CANDIDATE") {
      url_being_shared = webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME + "/candidate/" + this.props.ballot_item_we_vote_id;
    } else {
      url_being_shared = webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME + "/measure/" + this.props.ballot_item_we_vote_id;
    }
    const share_icon = <span className="btn__icon"><Icon name="share-icon" width={icon_size} height={icon_size} color={icon_color} /></span>;

    // This modal is shown when user clicks on support or oppose button for the first time only.
    let modalSupportProps = { is_public_position: false };
    const SupportOrOpposeHelpModal = <Modal show={this.state.showSupportOrOpposeHelpModal} onHide={()=>{this.toggleSupportOrOpposeHelpModal();}}>
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

    const ballot_item_display_name = this.props.ballot_item_display_name || "";
    let supportButtonSelectedPopOverText = "Click to support";
    if (ballot_item_display_name.length > 0) {
      supportButtonSelectedPopOverText += " " + ballot_item_display_name + ".";
    } else {
      supportButtonSelectedPopOverText += ".";
    }

    if (is_public_position) {
      supportButtonSelectedPopOverText += " Your support will be visible to the public.";
    } else {
      supportButtonSelectedPopOverText += " Only your We Vote friends will see your support.";
    }
    let supportButtonUnselectedPopOverText = "Click to remove your support";
    if (ballot_item_display_name.length > 0) {
      supportButtonUnselectedPopOverText += " for " + ballot_item_display_name + ".";
    } else {
      supportButtonUnselectedPopOverText += ".";
    }

    let opposeButtonSelectedPopOverText = "Click to oppose";
    if (ballot_item_display_name.length > 0) {
      opposeButtonSelectedPopOverText += " " + ballot_item_display_name + ".";
    } else {
      opposeButtonSelectedPopOverText += ".";
    }

    if (is_public_position) {
      opposeButtonSelectedPopOverText += " Your opposition will be visible to the public.";
    } else {
      opposeButtonSelectedPopOverText += " Only your We Vote friends will see your opposition.";
    }
    let opposeButtonUnselectedPopOverText = "Click to remove your opposition";
    if (ballot_item_display_name.length > 0) {
      opposeButtonUnselectedPopOverText += " for " + ballot_item_display_name + ".";
    } else {
      opposeButtonUnselectedPopOverText += ".";
    }

    const supportButtonPopoverTooltip = <Tooltip id="supportButtonTooltip">{this.state.is_support_local_state ? supportButtonUnselectedPopOverText : supportButtonSelectedPopOverText }</Tooltip>;
    const opposeButtonPopoverTooltip = <Tooltip id="opposeButtonTooltip">{this.state.is_oppose_local_state ? opposeButtonUnselectedPopOverText : opposeButtonSelectedPopOverText}</Tooltip>;

    const supportButton = <button className={"item-actionbar__btn item-actionbar__btn--support btn btn-default" + (this.state.is_support_local_state ? " support-at-state" : "")} onClick={this.supportItem.bind(this, this.state.is_support_local_state)}>
      <span className="btn__icon">
        <Icon name="thumbs-up-icon" width={icon_size} height={icon_size} color={support_icon_color} />
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
        <Icon name="thumbs-down-icon" width={icon_size} height={icon_size} color={oppose_icon_color} />
      </span>
      { this.state.is_oppose_local_state ?
        <span
          className={ this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" : "item-actionbar__position-btn-label item-actionbar__position-at-state" }>Oppose</span> :
        <span
          className={ this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" : "item-actionbar__position-btn-label" }>Oppose</span>
      }
    </button>;

    return <div className={ this.props.shareButtonHide ? "item-actionbar--inline hidden-print" : "item-actionbar hidden-print" }>
      <div className={"btn-group" + (!this.props.shareButtonHide ? " u-push--sm" : "")}>

        {/* Start of Support Button */}
        <div className="hidden-xs">
          <OverlayTrigger placement="top" overlay={supportButtonPopoverTooltip}>{supportButton}</OverlayTrigger>
        </div>
        <div className="visible-xs">{supportButton}</div>
        {/* Start of Oppose Button */}
        <div className="hidden-xs">
          <OverlayTrigger placement="top" overlay={opposeButtonPopoverTooltip}>{opposeButton}</OverlayTrigger>
        </div>
        <div className="visible-xs">{opposeButton}</div>
      </div>
      { this.props.commentButtonHide ?
        null :
        <button className={"item-actionbar__btn item-actionbar__btn--comment btn btn-default u-push--sm" + this.props.commentButtonHideInMobile ? " hidden-xs" : null}
                onClick={this.props.toggleFunction}>
            <span className="btn__icon">
              <Icon name="comment-icon" width={icon_size} height={icon_size} color={icon_color} />
            </span>
          <span className="item-actionbar__position-btn-label">Comment</span>
        </button> }

      { this.props.shareButtonHide ?
        null :
        <ShareButtonDropdown urlBeingShared={url_being_shared} shareIcon={share_icon} shareText={"Share"} /> }
      { this.state.showSupportOrOpposeHelpModal ? SupportOrOpposeHelpModal : null}
    </div>;
  }
}
