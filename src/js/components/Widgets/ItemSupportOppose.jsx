import { Component, PropTypes } from "react";
import SupportActions from "../../actions/SupportActions";
import SupportStore from "../../stores/SupportStore";

export default class ItemSupportOppose extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {transitioning: false};
  }

  componentDidMount () {
    this.listener = SupportStore.addListener(this._onChange.bind(this));
    this.setState({ supportProps: SupportStore.get(this.props.we_vote_id) });
  }

  componentWillUnmount () {
    this.listener.remove();
  }

  _onChange () {
    this.setState({ supportProps: SupportStore.get(this.props.we_vote_id), transitioning: false });
  }

  share (){
    const url = "www.wevote.me/candidate/" + this.props.we_vote_id;
    window.FB.ui({
      display: "popup",
      method: "share",
      href: url,
      redirect_uri: url
    }, function (response){});
  }

  supportItem () {
    if (this.state.transitioning){ return; }
    SupportActions.voterSupportingSave(this.props.we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  stopSupportingItem () {
    if (this.state.transitioning){ return; }
    SupportActions.voterStopSupportingSave(this.props.we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  opposeItem () {
    if (this.state.transitioning){ return; }
    SupportActions.voterOpposingSave(this.props.we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }

  stopOpposingItem () {
    if (this.state.transitioning){ return; }
    SupportActions.voterStopOpposingSave(this.props.we_vote_id, this.props.type);
    this.setState({transitioning: true});
  }
}
