import React, { Component, PropTypes } from "react";
import Navigator from "./components/Navigator";
import MoreMenu from "./components/MoreMenu";
import Header from "./components/Header";
import SubHeader from "./components/SubHeader";
import VoterStore from "./stores/VoterStore";
import VoterActions from "./actions/VoterActions";

export default class Application extends Component {
  static propTypes = {
    children: PropTypes.element,
    route: PropTypes.object,
    location: PropTypes.object
  };

  constructor (props) {
    super(props);

    this.state = {
      voter: { }
    };
  }

  componentDidMount () {
    let voter_device_id = VoterStore.voterDeviceId();
    VoterActions.retrieveVoter(voter_device_id);
    this.token = VoterStore.addListener(this._onChange.bind(this));
  }

  componentWillUnmount () {
    this.token.remove();
  }

  _onChange () {
    this.setState({
      voter: VoterStore.voter(),
      location: VoterStore.getAddress()
    });
  }

  render () {
    var { location: { pathname }} = this.props;
    var { voter, location } = this.state;
    var ballotItemWeVoteId = ""; /* TODO Dale: Store the ballot item that is "on stage" in Ballot store? (wv02cand3) */

    return <div className="app-base">
      <div className="container-fluid">
        <div className="row">
          <Header location={location}/>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <SubHeader pathname={pathname} ballotItemWeVoteId={ballotItemWeVoteId} />
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-4 col-sm-4 col-md-4 no-show">
            { voter.signed_in_personal ? <MoreMenu {...voter} /> : <MoreMenu /> }
          </div>
          <div className="col-xs-8-container col-sm-8 col-md-8 container-main">
            { this.props.children }
          </div>
        </div>
      </div>
        <Navigator pathname={pathname} />
    </div>;
  }
}
