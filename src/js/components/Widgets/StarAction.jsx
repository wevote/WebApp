import React, { Component, PropTypes } from "react";
import StarStore from "../../stores/StarStore";
import StarActions from "../../actions/StarActions";
var Icon = require("react-svg-icons");

export default class StarAction extends Component {
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
    this.token = StarStore.addListener(this._onChange.bind(this));
    this._onChange();
  }

  _onChange (){
    this.setState({ is_starred: StarStore.get(this.props.we_vote_id) || false});
  }


  starClick () {
    var we_vote_id = this.props.we_vote_id;
    var starred = this.state.is_starred;

    if ( starred )
      StarActions.voterStarOffSave(we_vote_id, this.props.type);
    else
      StarActions.voterStarOnSave(we_vote_id, this.props.type);
  }

  starKeyDown (e) {
    let enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(e.keyCode)) {
      this.starClick().bind(this);
    }
  }

	render () {
    if (this.state.is_starred === undefined){
      return <span className="star-action"></span>;
    }
    return <span tabIndex="0"
                 className="star-action ml1"
                 onClick={this.starClick.bind(this)}
                 onKeyDown={this.starKeyDown.bind(this)}
                 title="Bookmark for later">
              {this.state.is_starred ?
                <Icon name="bookmark-icon" width={24} height={24} fill="#999" stroke="none" /> :
                <Icon name="bookmark-icon" width={24} height={24} fill="none" stroke="#ccc" strokeWidth={2} />
              }
            </span>;
	}
}
