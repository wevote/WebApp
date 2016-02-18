import React, { Component, PropTypes } from "react";
import BallotActions from "../actions/BallotActions";
import BallotStore from "../stores/BallotStore";

export default class ItemActionbar extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    is_support: PropTypes.bool,
    is_oppose: PropTypes.bool
  };

  constructor (props) {
    super(props);

    this.state = {
      is_support: this.props.is_support,
      is_oppose: this.props.is_oppose
    };
  }

  componentDidMount () {
    this.changeListener = this._onChange.bind(this);
    BallotStore.addChangeListener(this.changeListener);
  }

  componentWillUnmount() {
    BallotStore.removeChangeListener(this.changeListener);
  }

  _onChange () {
    this.setState({
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
      <div className="item-actionbar row">
        {this.state.is_support ?
          <span className="col-xs-4" onClick={ this.stopSupportingItem.bind(this) }>
            <span className="inline-phone">
              <span className="glyphicon glyphicon-small glyphicon-arrow-up">
              </span>
              <strong> Support</strong>
            </span>
          </span>
         :
          <span className="col-xs-4" onClick={ this.supportItem.bind(this) }>
            <span className="inline-phone">
              <span className="glyphicon glyphicon-small glyphicon-arrow-up">
              </span>
              Support
            </span>
          </span>
        }
        {this.state.is_oppose ?
          <span className="col-xs-4" onClick={ this.stopOpposingItem.bind(this) }>
            <span className="inline-phone">
              <span className="glyphicon glyphicon-small glyphicon-arrow-down">
              </span>
              <strong> Oppose</strong>
            </span>
          </span>
          :
          <span className="col-xs-4" onClick={ this.opposeItem.bind(this) }>
            <span className="inline-phone">
              <span className="glyphicon glyphicon-small glyphicon-arrow-down">
              </span>
              Oppose
            </span>
          </span>
        }
        <span className="col-xs-4" >
          <span className="inline-phone">
            <span className="glyphicon glyphicon-small glyphicon-share-alt">
            </span>
            &nbsp;Share
          </span>
        </span>
      </div>
    );
  }
}
