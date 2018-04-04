import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import ReactBootstrapToggle from "react-bootstrap-toggle";
import Icon from "react-svg-icons";
import { renderLog } from "../../utils/logging";
import { showToastSuccess } from "../../utils/showToast";
import SupportActions from "../../actions/SupportActions";
import VoterActions from "../../actions/VoterActions";
import VoterConstants from "../../constants/VoterConstants";
import VoterStore from "../../stores/VoterStore";


export default class PositionPublicToggle extends Component {
  static propTypes = {
    ballot_item_we_vote_id: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    supportProps: PropTypes.object,
    inTestMode: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {
      showPositionPublicHelpModal: false,
      transitioning: false,
    };
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  showItemToFriendsOnly () {
    SupportActions.voterPositionVisibilitySave(this.props.ballot_item_we_vote_id, this.props.type, "FRIENDS_ONLY");
    showToastSuccess("Position now visible to friends only!");
  }

  showItemToPublic () {
    var voter = this.state.voter;
    if (voter && voter.is_signed_in) {
      SupportActions.voterPositionVisibilitySave(this.props.ballot_item_we_vote_id, this.props.type, "SHOW_PUBLIC");
      let position_public_toggle_modal_has_been_shown = VoterStore.getInterfaceFlagState(VoterConstants.POSITION_PUBLIC_MODAL_SHOWN);
      if (!position_public_toggle_modal_has_been_shown) {
        this.togglePositionPublicHelpModal();
        VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.POSITION_PUBLIC_MODAL_SHOWN);
      } else {
        showToastSuccess("This position now visible to anyone on We Vote!");
      }

    } else {
      this.togglePositionPublicHelpModal();
    }
  }

  togglePositionPublicHelpModal () {
    this.setState({
      showPositionPublicHelpModal: !this.state.showPositionPublicHelpModal,
    });
  }

  render () {
    renderLog(__filename);
    if (this.props.supportProps === undefined){
      return <div className="undefined-props" />;
    }
    let in_test_mode = false;
    if (this.props !== undefined && this.props.inTestMode !== undefined && this.props.inTestMode) {
      in_test_mode = true;
    }

    var { is_public_position } = this.props.supportProps;
    let visibilityPublic = "Currently visible to public";
    let visibilityFriendsOnly = "Currently only shared with We Vote friends";
    const publicIcon = <Icon alt="Visible to Public" name="public-icon" color="#fff" width={18} height={18} />;
    const friendsIcon = <Icon alt="Visible to Friends Only" name="group-icon" color="#555" width={18} height={18} />;
    let tooltip = <Tooltip id="visibility-tooltip">{is_public_position ? visibilityPublic : visibilityFriendsOnly}</Tooltip>;
    let no_tooltip = <span />;

    var onChange;
    var that = this;
    if (is_public_position) {
      onChange = function () {
        is_public_position = false;
        if (in_test_mode) {
          // TODO Somehow cause the tooltip to update
        } else {
          that.showItemToFriendsOnly();
        }
      };
    } else {
      onChange = function () {
        is_public_position = true;
        if (in_test_mode) {
          // TODO Somehow cause the tooltip to update
        } else {
          that.showItemToPublic();
        }
      };
    }
// this onKeyDown function is for accessibility: the parent div of the toggle
// has a tab index so that users can use tab key to select the toggle, and then
// press either space or enter (key codes 32 and 13, respectively) to toggle
    var onKeyDown = function (e) {
      let enterAndSpaceKeyCodes = [13, 32];
      if (enterAndSpaceKeyCodes.includes(e.keyCode)) {
        onChange();
      }
    };

    // This modal is shown when the user clicks on public position toggle either when not signed in
    // or for the first time after being signed in.
    var voter = this.state.voter;
    let modalSupportProps = { is_public_position: false };
    const PositionPublicToggleHelpModal = <Modal show={this.state.showPositionPublicHelpModal} onHide={()=>{this.togglePositionPublicHelpModal();}}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="text-center">Make Your Positions Public</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="card">
          <div className="text-center">
            {voter && voter.is_signed_in ?
              "By clicking this toggle, you have just made your position visible to anyone on We Vote. " +
              "If you do NOT want to share your position publicly, you may click the toggle again to restrict " +
              "visibility to We Vote friends only." :
              "Clicking this toggle will make your position visible to anyone on We Vote. " +
              "In order to change this toggle, you need to sign in first."}<br />
            <br />
            We Vote makes it easy to share your views either publicly, or privately with your We Vote friends.<br />
            <br />
            Test the privacy toggle here:<br />
            <PositionPublicToggle
              ballot_item_we_vote_id="null"
              className="null"
              type="MEASURE"
              supportProps={modalSupportProps}
              inTestMode
            />
            <br />
          </div>
        </section>
      </Modal.Body>
    </Modal>;

    return <div className={this.props.className}>
      <div style={{display: "inline-block"}}>
        <OverlayTrigger className="trigger" placement="top" overlay={in_test_mode ? no_tooltip : tooltip}>
          <div tabIndex="0" onKeyDown={onKeyDown}> {/*tabIndex and onKeyDown are for accessibility*/}
            <ReactBootstrapToggle
              on={publicIcon}
              off={friendsIcon}
              active={is_public_position}
              onstyle="success" size="mini"
              width="40px"
              onChange={onChange}
            />
          </div>
        </OverlayTrigger>
      </div>
      { this.state.showPositionPublicHelpModal ? PositionPublicToggleHelpModal : null}
    </div>;
  }
}
