import React, { Component, PropTypes } from "react";
import { Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import { toast } from "react-toastify";
import isMobile from '../../utils/isMobile';
import SupportActions from "../../actions/SupportActions";
import ShareButtonDropdown from "./ShareButtonDropdown";
import VoterActions from "../../actions/VoterActions";
import VoterConstants from "../../constants/VoterConstants";
import VoterStore from "../../stores/VoterStore";
import PositionPublicToggle from "../../components/Widgets/PositionPublicToggle";

var Icon = require("react-svg-icons");

const web_app_config = require("../../config");

export default class ItemActionBar extends Component {
  static propTypes = {
    ballot_item_we_vote_id: PropTypes.string.isRequired,
    commentButtonHide: PropTypes.bool,
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
      showSupportOrOpposeHelpModal: false,
      supportProps: this.props.supportProps,
      transitioning: false,
    };
  }

  componentDidMount () {
    this.toggleSupportOrOpposeHelpModal = this.toggleSupportOrOpposeHelpModal.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      transitioning: false,
      supportProps: nextProps.supportProps,
    });
  }

  showToast = (msg) => {
    // only show toasts on mobile
    if (isMobile()) {
      toast.info(msg, {
        className: 'visible-xs-block',
        bodyClassName: {
          fontFamily: 'Source Sans Pro, sans-serif',
          fontWeight: '700',
          textAlign: 'center',
        }
      });
    }
  }

  supportItem (is_support) {
    if (is_support) {this.stopSupportingItem(); return;}
    if (this.state.transitioning){ return; }
    let support_oppose_modal_has_been_shown = VoterStore.getInterfaceFlagState(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    if (!support_oppose_modal_has_been_shown) {
      this.toggleSupportOrOpposeHelpModal();
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    }
    SupportActions.voterSupportingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({transitioning: true});
    this.showToast('Support added!');
  }

  stopSupportingItem () {
    if (this.state.transitioning){ return; }
    SupportActions.voterStopSupportingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({transitioning: true});
    this.showToast('Support removed!');
  }

  opposeItem (is_oppose) {
    if (is_oppose) {this.stopOpposingItem(); return;}
    if (this.state.transitioning){ return; }
    let support_oppose_modal_has_been_shown = VoterStore.getInterfaceFlagState(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    if (!support_oppose_modal_has_been_shown) {
      this.toggleSupportOrOpposeHelpModal();
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    }
    SupportActions.voterOpposingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({transitioning: true});
    this.showToast('Opposition added!');
  }

  stopOpposingItem () {
    if (this.state.transitioning){ return; }
    SupportActions.voterStopOpposingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({transitioning: true});
    this.showToast('Opposition removed!');
  }

  toggleSupportOrOpposeHelpModal () {
    this.setState({
      showSupportOrOpposeHelpModal: !this.state.showSupportOrOpposeHelpModal,
    });
  }

  render () {
    if (this.props.supportProps === undefined){
      // console.log("ItemActionBar, supportProps undefined");
      return null;
    }

    var {support_count, oppose_count, is_support, is_oppose } = this.props.supportProps;
    if (support_count === undefined || oppose_count === undefined || is_support === undefined || is_oppose === undefined){
      // console.log("ItemActionBar, support_count: ", support_count, ", oppose_count: ", oppose_count, ", is_support: ", is_support, ", or is_oppose: ", is_oppose, "");
      return null;
    }
    let is_public_position = false;
    if (this.props.supportProps !== undefined && this.props.supportProps.is_public_position !== undefined) {
      is_public_position = this.props.supportProps.is_public_position;
    }
    const icon_size = 18;
    var icon_color = "#999";
    // TODO Refactor the way we color the icons
    var support_icon_color = is_support ? "white" : "#999";
    var oppose_icon_color = is_oppose ? "white" : "#999";
    var url_being_shared;
    if (this.props.type === "CANDIDATE") {
      url_being_shared = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/candidate/" + this.props.ballot_item_we_vote_id;
    } else {
      url_being_shared = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/measure/" + this.props.ballot_item_we_vote_id;
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
            Your position is only visible to your We Vote friends. Change the privacy toggle to make your views public.
            Test the toggle here:<br />
            <br />
            <PositionPublicToggle ballot_item_we_vote_id="null"
                                  className="null"
                                  type="MEASURE"
                                  supportProps={modalSupportProps}
                                  inTestMode
            />
            <br />
            We Vote helps you get ready to vote, <strong>but you cannot use We Vote to cast your vote</strong>. Make sure to return your official ballot to your polling place!<br />
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

    const supportButtonPopoverTooltip = <Tooltip id="supportButtonTooltip" className="hidden-xs">{is_support ? supportButtonUnselectedPopOverText : supportButtonSelectedPopOverText }</Tooltip>;
    const opposeButtonPopoverTooltip = <Tooltip id="opposeButtonTooltip" className="hidden-xs">{is_oppose ? opposeButtonUnselectedPopOverText : opposeButtonSelectedPopOverText}</Tooltip>;

    const supportButton = <button className={"item-actionbar__btn item-actionbar__btn--support btn btn-default" + (is_support ? " support-at-state" : "")} onClick={this.supportItem.bind(this, is_support)}>
      <span className="btn__icon">
        <Icon name="thumbs-up-icon" width={icon_size} height={icon_size} color={support_icon_color} />
      </span>
      { is_support ?
        <span
          className={ this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" : "item-actionbar__position-btn-label item-actionbar__position-at-state" }>Support</span> :
        <span
          className={ this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" : "item-actionbar__position-btn-label" }>Support</span>
      }
    </button>;

    const opposeButton = <button className={(this.props.opposeHideInMobile ? "hidden-xs " : "") + "item-actionbar__btn item-actionbar__btn--oppose btn btn-default" + (is_oppose ? " oppose-at-state" : "")} onClick={this.opposeItem.bind(this, is_oppose)}>
      <span className="btn__icon">
        <Icon name="thumbs-down-icon" width={icon_size} height={icon_size} color={oppose_icon_color} />
      </span>
      { is_oppose ?
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
        <button className="item-actionbar__btn item-actionbar__btn--comment btn btn-default u-push--sm" onClick={this.props.toggleFunction}>
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
