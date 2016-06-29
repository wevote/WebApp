import { Button } from "react-bootstrap";
import React, { Component, PropTypes } from "react";
import Candidate from "../Ballot/Candidate";
import LoadingWheel from "../../components/LoadingWheel";
import GuidePositionList from "../Guide/PositionList";
import { Link } from "react-router";
import TwitterAccountCard from "../../components/Twitter/TwitterAccountCard";
import { $ajax } from "../../utils/service";

export default class VerifyThisIsMe extends Component {
  static propTypes = {
    params: PropTypes.object,
    twitter_handle: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount () {
    console.log("VerifyThisIsMe: " + this.props.params.twitter_handle);
    this.twitterIdentityRetrieve(this.props.params.twitter_handle);
  }

  twitterIdentityRetrieve (new_twitter_handle) {
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
      return <div>
          <Candidate we_vote_id {...this.props} />
        </div>;
    } else if (this.state.kind_of_owner === "ORGANIZATION"){
      this.props.params.we_vote_id = this.state.owner_we_vote_id;
      return <div>
          <GuidePositionList we_vote_id {...this.props} />
        </div>;
    } else if (this.state.kind_of_owner === "TWITTER_HANDLE_NOT_FOUND_IN_WE_VOTE"){
      return <div>
        <TwitterAccountCard {...this.state}/>
        <div>
          <br />
          <p>Please verify that this is you by signing into this Twitter account:</p>
          <p>@{this.props.params.twitter_handle}</p>
          <br />
        </div>
        <Link to="/twittersigninprocess/signinstart"><Button bsClass="bs-btn" bsStyle="primary">Sign Into Twitter</Button></Link>
      </div>;
    } else {
      return <div className="bs-container-fluid bs-well u-gutter-top--small fluff-full1">
              <h3>Could Not Confirm</h3>
                <div className="small">We were not able to find an account for this
                  Twitter Handle{ this.props.params.twitter_handle ?
                  <span> "{this.props.params.twitter_handle}"</span> :
                <span></span>}.
                </div>
                <br />
            </div>;
    }

  }
}
