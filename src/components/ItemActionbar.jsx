import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import BallotStore from 'stores/BallotStore';

export default class ItemActionbar extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    action: PropTypes.object.isRequired,
    voterSupports: PropTypes.string, // Is "support" selected?
    voterOpposes: PropTypes.string // Is "oppose" selected?
  };

  constructor (props) {
    super(props);

    this.state = {
      voterSupports: this.props.voterSupports,
      voterOpposes: this.props.voterOpposes,
    };
  }

  componentDidMount () {
    BallotStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount () {
    BallotStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange () {
    BallotStore.getBallotItemByWeVoteId(
      this.props.we_vote_id, ballot_item => this.setState({
        voterSupports: ballot_item.voterSupports,
        voterOpposes: ballot_item.voterOpposes,
      })
    );
  }

  toggleSupport () {
    if (this.state.voterSupports == "Yes")
      this.props.action.supportOff(this.props.we_vote_id);
    else
      this.props.action.supportOn(this.props.we_vote_id);
  }

  toggleOppose () {
    if (this.state.voterOpposes == "Yes")
      this.props.action.opposeOff(this.props.we_vote_id);
    else
      this.props.action.opposeOn(this.props.we_vote_id);
  }

  render () {
    return (
      <div className="item-actionbar row">
          <span className="col-xs-4" onClick={ this.toggleSupport.bind(this) }>
            <span className="glyphicon glyphicon-small glyphicon-arrow-up">
            </span>
            &nbsp;Support {this.state.voterSupports}
          </span>
          <span className="col-xs-4" onClick={ this.toggleOppose.bind(this) }>
            <span className="glyphicon glyphicon-small glyphicon-arrow-down">
            </span>
            &nbsp;Oppose {this.state.voterOpposes}
          </span>
          <span className="col-xs-4" >
            <span className="glyphicon glyphicon-small glyphicon-share-alt">
            </span>
            &nbsp;Share
          </span>
      </div>
    );
  }
}
