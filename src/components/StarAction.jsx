import React, { Component, PropTypes } from 'react';
import BallotStore from 'stores/BallotStore';

const floatRight = { float: 'right' };

export default class StarAction extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    is_starred: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      is_starred: this.props.is_starred,
    };
  }

  toggleStar () {
    // evt.stopPropagation();
    // if (this.state.VoterStarred == "Yes")
    //   this.props.action.starOff(this.props.we_vote_id);
    // else
    //   this.props.action.starOn(this.props.we_vote_id);
  }

  componentDidMount () {
    BallotStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    BallotStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange () {}

	render() {
        var star_icon;
        if (this.state.VoterStarred == "Yes") {
            star_icon = <span className="glyphicon glyphicon-small glyphicon-star"></span>;
        } else {
            star_icon = <span className="glyphicon glyphicon-small glyphicon-star-empty"></span>;
        }
        return (
          <span
            className="star-action"
            onClick={this.toggleStar.bind(this)}
            style={floatRight}>
            &nbsp;
            {star_icon} {this.state.is_starred ? 'yes' : 'no' }
          </span>
        );
	}
}
