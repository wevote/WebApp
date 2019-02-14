import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import ReactSVG from 'react-svg';
import Toggle from 'react-toggle';
import { renderLog } from '../../utils/logging';
import { cordovaDot, hasIPhoneNotch } from '../../utils/cordovaUtils';
import { showToastSuccess } from '../../utils/showToast';
import SettingsAccount from '../Settings/SettingsAccount';
import SupportActions from '../../actions/SupportActions';
import VoterActions from '../../actions/VoterActions';
import VoterConstants from '../../constants/VoterConstants';
import VoterStore from '../../stores/VoterStore';

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
      positionPublicToggleCurrentState: '',
      showToThePublicOn: false,
    };

    this.onToggleChangeFunction = this.onToggleChangeFunction.bind(this);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const isPublicOpinion = this.props.supportProps && this.props.supportProps.is_public_position;
    this.setState({
      showToThePublicOn: isPublicOpinion || false,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  onToggleChangeFunction (state) {
    // This was written for react-bootstrap-toggle version 2.3.1, but we are having some troubles upgrading
    console.log('PositionPublicToggle onToggleChangeFunction, state:', state);
    if (state === 'SHOW_PUBLIC') {
      this.setState({
        positionPublicToggleCurrentState: 'Show publicly',
      });
    } else {
      this.setState({
        positionPublicToggleCurrentState: 'Show to friends only',
      });
    }
  }

  showItemToFriendsOnly () {
    this.setState({
      showToThePublicOn: false,
    });

    // console.log("PositionPublicToggle-showItemToFriendsOnly, this.props.type:", this.props.type);
    SupportActions.voterPositionVisibilitySave(this.props.ballot_item_we_vote_id, this.props.type, 'FRIENDS_ONLY');
    showToastSuccess('Position now visible to friends only!');
  }

  showItemToPublic () {
    const { voter } = this.state;

    // console.log("PositionPublicToggle-showItemToPublic, this.props.type:", this.props.type);
    if (voter && voter.is_signed_in) {
      this.setState({
        showToThePublicOn: true,
      });
      SupportActions.voterPositionVisibilitySave(this.props.ballot_item_we_vote_id, this.props.type, 'SHOW_PUBLIC');
      const positionPublicToggleModalHasBeenShown = VoterStore.getInterfaceFlagState(VoterConstants.POSITION_PUBLIC_MODAL_SHOWN);
      if (!positionPublicToggleModalHasBeenShown) {
        this.togglePositionPublicHelpModal();
        VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.POSITION_PUBLIC_MODAL_SHOWN);
      } else {
        showToastSuccess('This position now visible to anyone on We Vote!');
      }
    } else {
      this.togglePositionPublicHelpModal();
    }
  }

  togglePositionPublicHelpModal () {
    const { showPositionPublicHelpModal } = this.state;
    this.setState({
      showPositionPublicHelpModal: !showPositionPublicHelpModal,
    });
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return <div className="undefined-props" />;
    }

    if (this.props.supportProps === undefined) {
      return <div className="undefined-props" />;
    }

    let inTestMode = false;
    if (this.props !== undefined && this.props.inTestMode !== undefined && this.props.inTestMode) {
      inTestMode = true;
    }

    let { is_public_position: isPublicPosition } = this.props.supportProps;
    const visibilityPublic = 'Currently visible to public';
    const visibilityFriendsOnly = 'Currently only shared with We Vote friends';
    const publicIcon = <ReactSVG src={cordovaDot('/img/global/svg-icons/public-icon.svg')} svgStyle={{ fill: '#000', width: 18, height: 18 }} alt="Visible to Public" />;
    const friendsIcon = <ReactSVG src={cordovaDot('/img/global/svg-icons/group-icon.svg')} svgStyle={{ fill: '#fff', width: 18, height: 18 }} alt="Visible to Friends Only" />;
    const tooltip = <Tooltip id="visibility-tooltip">{isPublicPosition ? visibilityPublic : visibilityFriendsOnly}</Tooltip>;
    const noTooltip = <span />;

    let onChange;
    const _this = this;
    if (isPublicPosition) {
      onChange = () => {
        isPublicPosition = false;

        // TODO Somehow cause the tooltip to update if inTestMode
        if (!inTestMode) {
          _this.showItemToFriendsOnly();
        }
      };
    } else {
      onChange = () => {
        isPublicPosition = true;

        // TODO Somehow cause the tooltip to update if inTestMode
        if (!inTestMode) {
          _this.showItemToPublic();
        }
      };
    }

    // this onKeyDown function is for accessibility: the parent div of the toggle
    // has a tab index so that users can use tab key to select the toggle, and then
    // press either space or enter (key codes 32 and 13, respectively) to toggle
    const onKeyDown = (e) => {
      const enterAndSpaceKeyCodes = [13, 32];
      if (enterAndSpaceKeyCodes.includes(e.keyCode)) {
        onChange();
      }
    };

    // This modal is shown when the user clicks on public position toggle either when not signed in
    // or for the first time after being signed in.
    const { voter } = this.state;
    const localModalStyle = hasIPhoneNotch() ? { marginTop: 20 } : {};
    const modalSupportProps = { isPublicPosition: false };
    const PositionPublicToggleHelpModal = (
      <Modal
        show={this.state.showPositionPublicHelpModal}
        enforceFocus={false}
        onHide={() => { this.togglePositionPublicHelpModal(); }}
      >
        <Modal.Header closeButton style={localModalStyle}>
          <Modal.Title>
            <div className="text-center">Make Your Positions Public</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section className="card">
            <div className="text-center">
              {voter && voter.is_signed_in ? (
                <div>
                  <div className="u-f2">You have just made your position visible to anyone on We Vote.</div>
                  <div className="u-f4">If you do NOT want to share your position publicly, click the toggle again to restrict visibility to We Vote friends only.</div>
                </div>
              ) : (
                <div>
                  { !this.state.voter.is_signed_in ?
                    <SettingsAccount /> :
                    null }
                </div>
              )}
              <br />
              We Vote makes it easy to share your views either publicly, or privately with your We Vote friends.
              <br />
              <br />
              Test the privacy toggle here:
              <br />
              <br />
              <PositionPublicToggle
                ballot_item_we_vote_id="null"
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
      </Modal>
    );

    return (
      <div className={this.props.className}>
        <div style={{ display: 'inline-block' }}>
          {/* Mobile Mode */}
          <span className="d-block d-sm-none">
            <div onKeyDown={onKeyDown}>
              {/* tabIndex and onKeyDown are for accessibility */}
              <Toggle
                defaultChecked={this.state.showToThePublicOn}
                className="toggle-override"
                icons={{
                  checked: publicIcon,
                  unchecked: friendsIcon,
                }}
                onChange={onChange}
              />
            </div>
          </span>

          {/* Desktop Mode */}
          <span className="d-none d-sm-block">
            <OverlayTrigger
              className="trigger"
              enforceFocus={false}
              placement="top"
              overlay={inTestMode ? noTooltip : tooltip}
            >
              <div onKeyDown={onKeyDown}>
                {/* tabIndex and onKeyDown are for accessibility */}
                <Toggle
                  defaultChecked={this.state.showToThePublicOn}
                  className="toggle-override"
                  icons={{
                    checked: publicIcon,
                    unchecked: friendsIcon,
                  }}
                  onChange={onChange}
                />
              </div>
            </OverlayTrigger>
          </span>
        </div>
        { this.state.showPositionPublicHelpModal ? PositionPublicToggleHelpModal : null }
      </div>
    );
  }
}
