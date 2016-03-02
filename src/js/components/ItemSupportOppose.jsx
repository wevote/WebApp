import React, { Component, PropTypes } from "react";
import SupportActions from "../actions/SupportActions";
import SupportStore from "../stores/SupportStore";

export default class ItemSupportOppose extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this.listener = SupportStore.addListener(this._onChange.bind(this));
    if (!SupportStore.isRetrieved(this.props.we_vote_id)){
      SupportActions.retrieve(this.props.we_vote_id, this.props.type);
    } else {
      this.setState({ supportProps: SupportStore.get(this.props.we_vote_id) });
    }
  }

  componentWillUnmount () {
    this.listener.remove();
  }

  _onChange () {
    this.setState({ supportProps: SupportStore.get(this.props.we_vote_id) });
  }

  supportItem () {
    SupportActions.voterSupportingSave(this.props.we_vote_id, this.props.type);
  }

  stopSupportingItem () {
    SupportActions.voterStopSupportingSave(this.props.we_vote_id, this.props.type);
  }

  opposeItem () {
    SupportActions.voterOpposingSave(this.props.we_vote_id, this.props.type);
  }

  stopOpposingItem () {
    SupportActions.voterStopOpposingSave(this.props.we_vote_id, this.props.type);
  }
}
