import React, { Component, PropTypes } from "react";
import Candidate from "./Ballot/Candidate";
import LoadingWheel from "../components/LoadingWheel";
import GuidePositionList from "./Guide/PositionList";
import { $ajax } from "../utils/service";

export default class NotFound extends Component {
  static propTypes = {
    params: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount (){
    // We could create a store for this for consistency,
    // but if the rest of the application doesn't need to access the data then this is simpler.
    $ajax({
      endpoint: "twitterIdentityRetrieve",
      data: { twitter_handle: this.props.params.twitter_handle },
      success: res => {
        this.setState(res);
      },
      error: res => {
        console.log( res);
        this.setState(res);
      }
    });
  }

  render () {
  if (this.state.status === undefined){
    return LoadingWheel;
  } else if (this.state.kind_of_owner === "CANDIDATE"){
    this.props.params.we_vote_id = this.state.owner_we_vote_id;
    return <Candidate we_vote_id {...this.props} />;
  } else if (this.state.kind_of_owner === "ORGANIZATION"){
    this.props.params.we_vote_id = this.state.owner_we_vote_id;
    return <GuidePositionList we_vote_id {...this.props} />;
  } else {
    return <div className="container-fluid well gutter-top--small fluff-full1">
            <h3>Page Not Found</h3>
              <div className="small">No candidate or organization with that twitter handle exists.</div>
          </div>;
  }
}
}
