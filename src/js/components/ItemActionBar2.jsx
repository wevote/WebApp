import React, { Component, PropTypes } from "react";
import BallotActions from "../actions/BallotActions";
import BallotStore from "../stores/BallotStore";

export default class ItemActionBar2 extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    opposeCount: PropTypes.number,
    supportCount: PropTypes.number,
    is_support: PropTypes.bool,
    is_oppose: PropTypes.bool
  };

  constructor (props) {
    super(props);

    this.state = {
      opposeCount: this.props.opposeCount,
      supportCount: this.props.supportCount,
      is_support: this.props.is_support,
      is_oppose: this.props.is_oppose
    };
  }

  componentDidMount () {
    this.changeListener = this._onChange.bind(this);
    BallotStore.addChangeListener(this.changeListener);
  }

  componentWillUnmount () {
    BallotStore.removeChangeListener(this.changeListener);
  }

  _onChange () {
    this.setState({
      opposeCount: BallotStore.getOpposeCount(this.props.we_vote_id),
      supportCount: BallotStore.getSupportCount(this.props.we_vote_id),
      is_support: BallotStore.getIsSupportState(this.props.we_vote_id),
      is_oppose: BallotStore.getIsOpposeState(this.props.we_vote_id)
    });
  }

  supportItem () {
    BallotActions.voterSupportingSave(this.props.we_vote_id);
  }

  stopSupportingItem () {
    BallotActions.voterStopSupportingSave(this.props.we_vote_id);
  }

  opposeItem () {
    BallotActions.voterOpposingSave(this.props.we_vote_id);
  }

  stopOpposingItem () {
    BallotActions.voterStopOpposingSave(this.props.we_vote_id);
  }

  render () {
    return (
      <div className="item-actionbar2 row">
        {this.state.is_support ?
          <span className="col-xs-4" onClick={ this.stopSupportingItem.bind(this) }>
            <span>
              {this.state.supportCount} support
              <span className="glyphicon glyphicon-small glyphicon-arrow-up">
              </span>
            </span>
          </span>
         :
          <span className="col-xs-4" onClick={ this.supportItem.bind(this) }>
            <span>
              {this.state.supportCount} support
              <span className="glyphicon glyphicon-small glyphicon-arrow-up">
              </span>
            </span>
          </span>
        }
        {this.state.is_oppose ?
          <span className="col-xs-4" onClick={ this.stopOpposingItem.bind(this) }>
            <span>
              {this.state.opposeCount} oppose
              <span className="glyphicon glyphicon-small glyphicon-arrow-down">
              </span>
            </span>
          </span>
          :
          <span className="col-xs-4" onClick={ this.opposeItem.bind(this) }>
            <span>
              {this.state.opposeCount} oppose
              <span className="glyphicon glyphicon-small glyphicon-arrow-down">
              </span>
            </span>
          </span>
        }
        <span className="col-xs-4" >
          <span className="glyphicon glyphicon-small glyphicon-share-alt">
          </span>
          &nbsp;Share
        </span>
      </div>
    );
  }
}
