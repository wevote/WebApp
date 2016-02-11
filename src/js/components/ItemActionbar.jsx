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
    BallotStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount () {
    BallotStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange () {
     BallotStore.getBallotItemByWeVoteId(
       this.props.we_vote_id, ballot_item => this.setState({
         is_support: ballot_item.is_support,
         is_oppose: ballot_item.is_oppose
       })
     );
  }

  toggleSupport () {
    if (this.props.is_support)
      BallotActions.voterStopSupportingSave(this.props.we_vote_id);
    else
      BallotActions.voterSupportingSave(this.props.we_vote_id);
  }

  toggleOppose () {
    if (this.props.is_oppose)
      BallotActions.voterStopOpposingSave(this.props.we_vote_id);
    else
      BallotActions.voterOpposingSave(this.props.we_vote_id);
  }

  render () {
    return (
      <div className="item-actionbar row">
          <span className="col-xs-4" onClick={ this.toggleSupport.bind(this) }>
            {this.state.is_support ?
                <span>
                  <span className="glyphicon glyphicon-small glyphicon-arrow-up">
                  </span>
                  <strong> Supports</strong>
                </span>
              :
                <span>
                  <span className="glyphicon glyphicon-small glyphicon-arrow-up">
                  </span>
                  Support
                </span>
            }
          </span>
          <span className="col-xs-4" onClick={ this.toggleOppose.bind(this) }>
            {this.state.is_oppose ?
                <span>
                  <span className="glyphicon glyphicon-small glyphicon-arrow-down">
                  </span>
                  <strong> Opposes</strong>
                </span>
              :
                <span>
                  <span className="glyphicon glyphicon-small glyphicon-arrow-down">
                  </span>
                  Oppose
                </span>
            }
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
