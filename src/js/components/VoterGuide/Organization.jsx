import React, { Component, PropTypes } from "react";
import Follow from "../Follow";
import Ignore from "../Ignore";

function numberWithCommas (num) {
  var parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

const img = { float: "left", marginRight: ".1in" };
const stretch = { width: "100%" };

export default class Organization extends Component {
  static propTypes = {
    id: PropTypes.string,
    key: PropTypes.string,
    imageUrl: PropTypes.string,
    displayName: PropTypes.string,
    followers: PropTypes.number,
  };

  constructor (props) {
    super(props);
  }

  render () {

    const {
      id,
      displayName,
      imageUrl,
      followers
    } = this.props;

    const followCount =
      <span>
        {numberWithCommas(followers)} followers on Twitter
      </span>;

    // <FollowOrIgnore action={VoterGuideActions} organization_we_vote_id={this.props.organization_we_vote_id}
    //                 OrganizationFollowed={this.state.OrganizationFollowed} />

    const org =
      <div className="organization well well-skinny well-bg--light split-top-skinny clearfix">
        <div className="display-name pull-left" style={stretch}>
          <img style={img} className="img-square" src={imageUrl} width="75px"/>
          <div style={stretch}>
            <div style={{ fontSize: "14pt" }} className="org-display-name"> {displayName} </div>
            <div className="twitter-follow-count"> {followCount} </div>
            <Follow id={id} />
            <Ignore id={id} />
          </div>
        </div>
      </div>;

    return org;
  }

}
