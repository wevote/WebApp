import React, { Component, PropTypes } from "react";
import SupportActions from "../actions/SupportActions";
import SupportStore from "../stores/SupportStore";

export default class ItemActionBar2 extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    // opposeCount: PropTypes.number,
    // supportCount: PropTypes.number,
    // is_support: PropTypes.bool,
    // is_oppose: PropTypes.bool
  };

  constructor (props) {
    super(props);

    // this.state = {
    //   opposeCount: this.props.opposeCount,
    //   supportCount: this.props.supportCount,
    //   is_support: this.props.is_support,
    //   is_oppose: this.props.is_oppose
    // };
  }

  componentDidMount () {
    this.listener = SupportStore.addListener(this.onChange.bind(this));
  }

  componentWillUnmount () {
    this.listener.remove();
  }

  _onChange () {
    this.setState({ supportItem: SupportStore.get(this.props.we_vote_id) });
  }

  supportItem () {
    SupportActions.voterSupportingSave(this.props.we_vote_id);
  }

  stopSupportingItem () {
    SupportActions.voterStopSupportingSave(this.props.we_vote_id);
  }

  opposeItem () {
    SupportActions.voterOpposingSave(this.props.we_vote_id);
  }

  stopOpposingItem () {
    SupportActions.voterStopOpposingSave(this.props.we_vote_id);
  }

  render () {
    var supportItem = this.state;

    return (
      <div className="item-actionbar2 row">
        {this.state.is_support ?
          <span className="col-xs-4" onClick={ this.stopSupportingItem.bind(this) }>
            <span className="support-emphasis">
              {supportItem.supportCount} positive
              <span className="glyphicon glyphicon-small glyphicon-arrow-up">
              </span>
            </span>
          </span>
         :
          <span className="col-xs-4" onClick={ this.supportItem.bind(this) }>
            <span>
              {supportItem.supportCount} positive
              <span className="glyphicon glyphicon-small glyphicon-arrow-up">
              </span>
            </span>
          </span>
        }
        {this.state.is_oppose ?
          <span className="col-xs-4" onClick={ this.stopOpposingItem.bind(this) }>
            <span className="oppose-emphasis">
              {supportItem.opposeCount} negative
              <span className="glyphicon glyphicon-small glyphicon-arrow-down">
              </span>
            </span>
          </span>
          :
          <span className="col-xs-4" onClick={ this.opposeItem.bind(this) }>
            <span>
              {tsupportItem.opposeCount} negative
              <span className="glyphicon glyphicon-small glyphicon-arrow-down">
              </span>
            </span>
          </span>
        }
        {/* Share coming in a later version
        <span className="col-xs-4" >
          <span className="glyphicon glyphicon-small glyphicon-share-alt">
          </span>
          &nbsp;Share
        </span>
        */}
      </div>
    );
  }
}
