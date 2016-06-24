import React, { Component, PropTypes } from "react";
import Candidate from "./Ballot/Candidate";
import LoadingWheel from "../components/LoadingWheel";
import GuidePositionList from "./Guide/PositionList";
import UnknownTwitterAccount from "./Guide/UnknownTwitterAccount";
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

  componentWillMount () {
    this.twitterIdentityRetrieve(this.props.params.twitter_handle);
  }

  componentWillReceiveProps (nextProps) {
    this.twitterIdentityRetrieve(nextProps.params.twitter_handle);
  }

  twitterIdentityRetrieve (new_twitter_handle) {
    // We could create a store for this for consistency,
    // but if the rest of the application doesn't need to access the data then this is simpler.
    $ajax({
      endpoint: "twitterIdentityRetrieve",
      data: { twitter_handle: new_twitter_handle },
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
    } else if (this.state.kind_of_owner === "TWITTER_HANDLE_NOT_FOUND_IN_WE_VOTE"){
      return <UnknownTwitterAccount {...this.state} />;
    } else {
      return <div className="bs-container-fluid bs-well u-gutter-top--small fluff-full1">
              <h3>Create Your Own Voter Guide</h3>
                <div className="small">We were not able to find an account for this
                  Twitter Handle{ this.props.params.twitter_handle ?
                  <span> "{this.props.params.twitter_handle}"</span> :
                <span></span>}.
                  Would you like to create a voter
                guide for another Twitter account?</div>
                <br />
                <img src="https://github.com/wevote/WebApp/raw/develop/unclesamewevote.jpg" width="210" height="450" />
            </div>;
    }
  }
}
