import React, { Component, PropTypes } from "react";
import StarStore from "../../stores/StarStore";
import StarActions from "../../actions/StarActions";

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

	render () {
    if (this.state.is_starred === undefined){
      return <span className="star-action"></span>;
    }
    return <span className="star-action"
              onClick={this.starClick.bind(this)}
              title="Bookmark for later">
              <img src={this.state.is_starred ? "/img/global/icons/bookmark-icon-filled.svg" : "/img/global/icons/bookmark-icon-empty.svg" }className="star-action-btn" width="24" height="24" />
            </span>;
	}
}
