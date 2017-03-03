import React, { Component, PropTypes } from "react";
import BookmarkStore from "../../stores/BookmarkStore";
import BookmarkActions from "../../actions/BookmarkActions";
var Icon = require("react-svg-icons");

export default class BookmarkAction extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount () {
    this.token.remove();
  }

  componentDidMount (){
    this.token = BookmarkStore.addListener(this._onChange.bind(this));
    this._onChange();
  }

  _onChange (){
    this.setState({ is_bookmarked: BookmarkStore.get(this.props.we_vote_id) || false});
  }


  BookmarkClick () {
    var we_vote_id = this.props.we_vote_id;
    var bookmarked = this.state.is_bookmarked;

    if ( bookmarked )
      BookmarkActions.voterBookmarkOffSave(we_vote_id, this.props.type);
    else
      BookmarkActions.voterBookmarkOnSave(we_vote_id, this.props.type);
  }

  BookmarkKeyDown (e) {
    let enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(e.keyCode)) {
      this.BookmarkClick().bind(this);
    }
  }

	render () {
    if (this.state.is_bookmarked === undefined){
      return <span className="bookmark-action" />;
    }
    return <span tabIndex="0"
                 className="bookmark-action ml1"
                 onClick={this.BookmarkClick.bind(this)}
                 onKeyDown={this.BookmarkKeyDown.bind(this)}
                 title="Bookmark for later">
              {this.state.is_bookmarked ?
                <Icon alt="Is Bookmarked" name="bookmark-icon" width={24} height={24} fill="#999" stroke="none" /> :
                <Icon alt="Bookmark for later" name="bookmark-icon" width={24} height={24} fill="none" stroke="#ccc" strokeWidth={2} />
              }
            </span>;
	}
}
