import React, { Component, PropTypes } from 'react';

import BallotActions from 'actions/BallotActions';
import BallotStore from 'stores/BallotStore';

import ItemActionbar from 'components/ItemActionbar';

export default class Measure extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    supportCount: PropTypes.number.isRequired,
    opposeCount: PropTypes.number.isRequired,
    voterSupports: PropTypes.string,
    voterOpposes: PropTypes.string
  }

  constructor (props) {
    super(props);

    this.state = {
      supportCount: this.props.supportCount,
      opposeCount: this.props.opposeCount,
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
        supportCount: ballot_item.supportCount,
        opposeCount: ballot_item.opposeCount,
      })
    );
  }

  render() {
    return (
      <div>
        <p className="typeXLarge">
          { this.state.supportCount } support
          <span className="small"> (more) </span>
        </p>
        <p className="bufferNone">
          { this.state.opposeCount } oppose
        </p>
        <ItemActionbar we_vote_id={this.props.we_vote_id} action={BallotActions}
                       voterSupports={this.props.voterSupports} voterOpposes={this.props.voterOpposes}/>
      </div>
    );
  }
}
