import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import ReactBootstrapToggle from "react-bootstrap-toggle";
import Icon from "react-svg-icons";
import { renderLog } from "../../utils/logging";
import { showToastSuccess } from "../../utils/showToast";
import SettingsAccount from "../../components/Settings/SettingsAccount";
import SupportActions from "../../actions/SupportActions";
import VoterActions from "../../actions/VoterActions";
import VoterConstants from "../../constants/VoterConstants";
import VoterStore from "../../stores/VoterStore";


export default class PositionPublicToggle extends Component {
  static propTypes = {
    ballot_item_we_vote_id: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    inTestMode: PropTypes.bool,
    // onToggleChangeFunction: PropTypes.func, // This was written for react-bootstrap-toggle version 2.3.1, but we are having some troubles upgrading
    supportProps: PropTypes.object,
    type: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      showPositionPublicHelpModal: false,
      positionPublicToggleCurrentState: "",
      showToThePublicOn: false,
      transitioning: false,
    };

    this.onToggleChangeFunction = this.onToggleChangeFunction.bind(this);
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    var { is_public_position } = this.props.supportProps;
    this.setState({
      showToThePublicOn: is_public_position || false,
    });
  }

  componentWillUnmount (){
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  showItemToFriendsOnly () {
    this.setState({
      showToThePublicOn: false,
    });
    SupportActions.voterPositionVisibilitySave(this.props.ballot_item_we_vote_id, this.props.type, "FRIENDS_ONLY");
    showToastSuccess("Position now visible to friends only!");
  }

  showItemToPublic () {
    var voter = this.state.voter;
    if (voter && voter.is_signed_in) {
      this.setState({
        showToThePublicOn: true,
      });
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

  onToggleChangeFunction (state, node, evt){
    // This was written for react-bootstrap-toggle version 2.3.1, but we are having some troubles upgrading
    console.log("PositionPublicToggle onToggleChangeFunction, state:", state);
    if (state === "SHOW_PUBLIC") {
      this.setState({
        positionPublicToggleCurrentState: "Show publicly"
      });
    } else {
      this.setState({
        positionPublicToggleCurrentState: "Show to friends only"
      });
    }
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return <div className="undefined-props" />;
    }
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
    const PositionPublicToggleHelpModal = <Modal show={this.state.showPositionPublicHelpModal}
                                                 enforceFocus={false}
                                                 onHide={()=>{this.togglePositionPublicHelpModal();}}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="text-center">Make Your Positions Public</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="card">
          <div className="text-center">
            {voter && voter.is_signed_in ?
              <div>
                <div className="u-f2">You have just made your position visible to anyone on We Vote.</div>
                <div className="u-f4">If you do NOT want to share your position publicly, click the toggle again to restrict visibility to We Vote friends only.</div>
              </div> :
              <div>
                { !this.state.voter.is_signed_in ?
                  <SettingsAccount /> :
                  null }
              </div>}
            <br />
            We Vote makes it easy to share your views either publicly, or privately with your We Vote friends.<br />
            <br />
            Test the privacy toggle here:<br />
            <br />
            <PositionPublicToggle ballot_item_we_vote_id="null"
                                  className="null"
                                  type="MEASURE"
                                  supportProps={modalSupportProps}
                                  inTestMode
            />
            {this.state.positionPublicToggleCurrentState}
            <br />
          </div>
        </section>
      </Modal.Body>
    </Modal>;

    return <div className={this.props.className}>
      <div style={{display: "inline-block"}}>
        {/* Mobile Mode */}
        <span className="visible-xs">
          <div tabIndex="0" onKeyDown={onKeyDown}>{/* tabIndex and onKeyDown are for accessibility */}
            <ReactBootstrapToggle on={publicIcon}
                                  off={friendsIcon}
                                  onChange={onChange}
                                  active={this.state.showToThePublicOn}
                                  onstyle="success"
                                  size="mini"
                                  width="40px"
                                  />
          </div>
        </span>

        {/* Desktop Mode */}
        <span className="hidden-xs">
          <OverlayTrigger className="trigger"
                          enforceFocus={false}
                          placement="top"
                          overlay={in_test_mode ? no_tooltip : tooltip}>
            <div tabIndex="0" onKeyDown={onKeyDown}>{/* tabIndex and onKeyDown are for accessibility */}
              <ReactBootstrapToggle on={publicIcon}
                                    off={friendsIcon}
                                    onChange={onChange}
                                    active={this.state.showToThePublicOn}
                                    onstyle="success"
                                    size="mini"
                                    width="40px"
                                    />
            </div>
          </OverlayTrigger>
        </span>
      </div>
    { this.state.showPositionPublicHelpModal ? PositionPublicToggleHelpModal : null }
    </div>;
  }
}
