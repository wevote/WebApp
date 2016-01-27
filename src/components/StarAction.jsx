import React, { Component, PropTypes } from 'react';
import BallotStore from 'stores/BallotStore';
import BallotActions from 'actions/BallotActions';

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

  starClick () {
    var { we_vote_id, is_starred: starred } = this.props;

    if ( starred )
      BallotActions
        .voterStarOffSave(we_vote_id);
    else
      BallotActions
        .voterStarOnSave(we_vote_id);
  }

  componentDidMount () {
    BallotStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    BallotStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange () {
    this.setState({
      is_starred: BallotStore.getStarState(this.props.we_vote_id)
    });
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
            onClick={this.starClick.bind(this)}
            style={floatRight}>
            &nbsp;
            {star_icon} {this.state.is_starred ? 'yes' : 'no' }
          </span>
        );
	}
}
