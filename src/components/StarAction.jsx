import React, { Component, PropTypes } from 'react';
import BallotStore from 'stores/BallotStore';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router';

const floatRight = { float: 'right' };

export default class StarAction extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    action: PropTypes.object.isRequired,
    VoterStarred: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      VoterStarred: this.props.VoterStarred,
    };
  }

  toggleStar () {
    if (this.state.VoterStarred == "Yes")
      this.props.action.starOff(this.props.we_vote_id);
    else
      this.props.action.starOn(this.props.we_vote_id);
  }

  componentDidMount () {
    BallotStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    BallotStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange () {
    BallotStore.getBallotItemByWeVoteId(
      this.props.we_vote_id, ballot_item => this.setState({
        VoterStarred: ballot_item.VoterStarred,
      })
    );
  }

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
            {star_icon} {this.state.VoterStarred}
          </span>
        );
	}
}
