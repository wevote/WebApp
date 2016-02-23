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

  componentWillUnmount () {
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
    const bold = { fontWeight: "bold" };
    const { is_support, is_oppose } = this.state;

    // support toggle functions
    const supportOn = this.supportItem.bind(this);
    const supportOff = this.stopSupportingItem.bind(this);

    // oppose toggle functions
    const opposeOn = this.opposeItem.bind(this);
    const opposeOff = this.stopOpposingItem.bind(this);

    const itemActionBar =

      <div className="item-actionbar row">
        <span className="col-xs-4" onClick={ is_support ? supportOff : supportOn }>
          <span className="inline-phone">
            <span className="glyphicon glyphicon-small glyphicon-arrow-up">
            </span>
            <span style={ is_support ? bold : {} }> Support</span>
          </span>
        </span>
        <span className="col-xs-4" onClick={ is_oppose ? opposeOff : opposeOn }>
          <span className="inline-phone">
            <span className="glyphicon glyphicon-small glyphicon-arrow-down">
            </span>
            <span style={ is_oppose ? bold : {} }> Oppose</span>
          </span>
        </span>
        {/* Share coming in a later version
        <span className="col-xs-4" >
          <span className="inline-phone">
            <span className="glyphicon glyphicon-small glyphicon-share-alt">
            </span>
            &nbsp;Share
          </span>
        </span>
        */}
      </div>;

    return itemActionBar;
  }
}
