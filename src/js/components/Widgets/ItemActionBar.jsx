import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
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
    shareButtonHide: PropTypes.bool,
    supportProps: PropTypes.object,
    toggleFunction: PropTypes.func,
    type: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      showSupportOrOpposeHelpModal: false,
      transitioning: false,
    };
  }

  componentDidMount () {
    this.toggleSupportOrOpposeHelpModal = this.toggleSupportOrOpposeHelpModal.bind(this);
  }

  componentWillReceiveProps () {
    this.setState({transitioning: false});
  }

  supportItem (is_support) {
    if (is_support) {this.stopSupportingItem(); return;}
    if (this.state.transitioning){ return; }
    let support_help_modal_on = VoterStore.getInterfaceFlagState(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    if (!support_help_modal_on) {
      this.toggleSupportOrOpposeHelpModal();
      VoterActions.voterUpdateStatusFlags(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    }
    SupportActions.voterSupportingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  stopSupportingItem () {
    if (this.state.transitioning){ return; }
    SupportActions.voterStopSupportingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  opposeItem (is_oppose) {
    if (is_oppose) {this.stopOpposingItem(); return;}
    if (this.state.transitioning){ return; }
    let oppose_help_modal_on = VoterStore.getInterfaceFlagState(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    if (!oppose_help_modal_on) {
      this.toggleSupportOrOpposeHelpModal();
      VoterActions.voterUpdateStatusFlags(VoterConstants.SUPPORT_OPPOSE_MODAL_SHOWN);
    }
    SupportActions.voterOpposingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  stopOpposingItem () {
    if (this.state.transitioning){ return; }
    SupportActions.voterStopOpposingSave(this.props.ballot_item_we_vote_id, this.props.type);
    this.setState({transitioning: true});
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
      return null;
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
          Support or Oppose
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="card">
          <p className="card__no-additional">
            When you support or oppose a ballot item, your position is friends-only
            by default. Use the privacy button on the ballot item detail page to switch your views to public, or back to only being
            visible to your We Vote friends. Test the toggle here:
            <PositionPublicToggle ballot_item_we_vote_id="null"
                                  className="null"
                                  type="MEASURE"
                                  supportProps={modalSupportProps}
            />
          </p>
        </section>
      </Modal.Body>
    </Modal>;

    return <div className={ this.props.shareButtonHide ? "item-actionbar--inline" : "item-actionbar" }>
            <div className={"btn-group" + (!this.props.shareButtonHide ? " u-inline--sm" : "")}>
              {/* Start of Support Button */}
              <button className={"item-actionbar__btn item-actionbar__btn--support btn btn-default" + (is_support ? " support-at-state" : "")} onClick={this.supportItem.bind(this, is_support)}>
                <span className="btn__icon">
                  <Icon name="thumbs-up-icon" width={icon_size} height={icon_size} color={support_icon_color} />
                </span>
                { is_support ?
                  <span
                    className={ this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" : "item-actionbar__position-btn-label__position-at-state" }>Support</span> :
                  <span
                    className={ this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" : "item-actionbar__position-btn-label" }>Support</span>
                }
              </button>
              {/* Start of Oppose Button */}
              <button className={"item-actionbar__btn item-actionbar__btn--oppose btn btn-default" + (is_oppose ? " oppose-at-state" : "")} onClick={this.opposeItem.bind(this, is_oppose)}>
                <span className="btn__icon">
                  <Icon name="thumbs-down-icon" width={icon_size} height={icon_size} color={oppose_icon_color} />
                </span>
                { is_oppose ?
                  <span
                    className={ this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" : "item-actionbar__position-btn-label__position-at-state" }>Oppose</span> :
                  <span
                    className={ this.props.shareButtonHide ? "item-actionbar--inline__position-btn-label" : "item-actionbar__position-btn-label" }>Oppose</span>
                }
              </button>
            </div>
      { this.props.commentButtonHide ?
        null :
         <button className="item-actionbar__btn item-actionbar__btn--comment btn btn-default u-inline--sm" onClick={this.props.toggleFunction}>
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
