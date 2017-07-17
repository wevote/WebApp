import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
import BookmarkStore from "../../stores/BookmarkStore";
import BookmarkActions from "../../actions/BookmarkActions";
import VoterActions from "../../actions/VoterActions";
import VoterConstants from "../../constants/VoterConstants";
import VoterStore from "../../stores/VoterStore";
var Icon = require("react-svg-icons");

export default class BookmarkAction extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      showBookmarkActionHelpModal: false,
    };
  }

  componentWillUnmount () {
    this.token.remove();
    this.voterStoreListener.remove();
  }

  componentDidMount () {
    this.token = BookmarkStore.addListener(this._onChange.bind(this));
    this._onChange();

    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  _onChange () {
    this.setState({ is_bookmarked: BookmarkStore.get(this.props.we_vote_id) || false});
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  BookmarkClick () {
    var we_vote_id = this.props.we_vote_id;
    var bookmarked = this.state.is_bookmarked;
    var voter = this.state.voter;
    if (voter && voter.is_signed_in) {
      if (bookmarked) {
        BookmarkActions.voterBookmarkOffSave(we_vote_id, this.props.type);
      } else {
        BookmarkActions.voterBookmarkOnSave(we_vote_id, this.props.type);
        let bookmark_action_modal_has_been_shown = VoterStore.getInterfaceFlagState(VoterConstants.BOOKMARK_ACTION_MODAL_SHOWN);
        if (!bookmark_action_modal_has_been_shown) {
          this.toggleBookmarkActionHelpModal();
          VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.BOOKMARK_ACTION_MODAL_SHOWN);
        }
      }
    } else {
      this.toggleBookmarkActionHelpModal();
    }
  }

  BookmarkKeyDown (e) {
    let enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(e.keyCode)) {
      this.BookmarkClick().bind(this);
    }
  }

  toggleBookmarkActionHelpModal () {
    this.setState({
      showBookmarkActionHelpModal: !this.state.showBookmarkActionHelpModal,
    });
  }

	render () {
    if (this.state.is_bookmarked === undefined){
      return <span className="bookmark-action" />;
    }

    // This modal is shown when the user bookmarks a candidate either when not signed in
    // or for the first time after being signed in.
    let voter = this.state.voter;
    let modalSupportProps = { is_public_position: false };
    const BookmarkActionHelpModal = <Modal show={this.state.showBookmarkActionHelpModal} onHide={()=>{this.toggleBookmarkActionHelpModal();}}>
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="text-center">Notice</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="card">
          <div className="text-center">
            { voter && voter.is_signed_in ? "You have just bookmarked this candidate to your We Vote account. If you want to undo this action, you may click the icon again." : "To bookmark this candidate, please sign in first." }<br />
            <br />
          </div>
        </section>
      </Modal.Body>
    </Modal>;

    return <div>
            <span tabIndex="0"
                 className="bookmark-action"
                 onClick={this.BookmarkClick.bind(this)}
                 onKeyDown={this.BookmarkKeyDown.bind(this)}
                 title="Bookmark for later">
              {this.state.is_bookmarked ?
                <Icon alt="Is Bookmarked" name="bookmark-icon" width={24} height={24} fill="#999" stroke="none" /> :
                <Icon alt="Bookmark for later" name="bookmark-icon" width={24} height={24} fill="none" stroke="#ccc" strokeWidth={2} />
              }
            </span>
            { this.state.showBookmarkActionHelpModal ? BookmarkActionHelpModal : null }
          </div>;
	}
}
