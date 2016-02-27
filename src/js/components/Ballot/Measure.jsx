import React, { Component, PropTypes } from "react";

import BallotActions from "../../actions/BallotActions";
import BallotStore from "../../stores/BallotStore";

import ItemActionbar from "../../components/ItemActionbar";

export default class Measure extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    supportCount: PropTypes.number.isRequired,
    opposeCount: PropTypes.number.isRequired,
    is_support: PropTypes.bool,
    is_oppose: PropTypes.bool
  };

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

  render () {
    return <div>
        <p className="typeXLarge">
          { this.state.supportCount } support
          <span className="small"> (more) </span>
        </p>
        <p className="bufferNone">
          { this.state.opposeCount } oppose
        </p>
        <ItemActionbar we_vote_id={this.props.we_vote_id} action={BallotActions}
                       is_support={this.props.is_support} is_oppose={this.props.is_oppose}/>
      </div>;
  }
}
