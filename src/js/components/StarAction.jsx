import React, { Component, PropTypes } from "react";
import StarStore from "../stores/StarStore";
import StarActions from "../actions/StarActions";

const floatRight = { float: "right" };

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
              style={floatRight}
              title="Bookmark for later">
            &nbsp;
            {this.state.is_starred ?
              <span className="star-action glyphicon glyphicon-small glyphicon-star"></span> :
              <span className="star-action glyphicon glyphicon-small glyphicon-star-empty"></span> }
            </span>;
	}
}
