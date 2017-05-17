import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import ImageHandler from "../../components/ImageHandler";
import LoadingWheel from "../../components/LoadingWheel";
import FollowToggle from "../../components/Widgets/FollowToggle";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/94226088 */

// This Component is used to display the Organization by TwitterHandle
// Please see VoterGuide/Organization for the Component used by GuideList for Candidate and Opinions (you can follow)
export default class OrganizationVoterGuideCard extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
    turn_off_description: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    if (!this.props.organization){
      return <div>{LoadingWheel}</div>;
    }

    const {organization_twitter_handle, twitter_description, twitter_followers_count,
      organization_photo_url_large, organization_website,
      organization_name, organization_we_vote_id} = this.props.organization;

    // If the displayName is in the twitterDescription, remove it from twitterDescription
    let displayName = organization_name ? organization_name : "";
    let twitterDescription = twitter_description ? twitter_description : "";
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);
    var voterGuideLink = organization_twitter_handle ? "/" + organization_twitter_handle : "/voterguide/" + organization_we_vote_id;

    return <div className="card-main">
        <Link to={voterGuideLink} className="u-no-underline">
          <img src={organization_photo_url_large} width="180" height="180"/>
        </Link>

        <Link to={voterGuideLink}>
          <h3 className="card-main__display-name">{displayName}</h3>
        </Link>
        { organization_twitter_handle ?
          <span>@{organization_twitter_handle}&nbsp;&nbsp;</span> :
          null
        }
        <FollowToggle we_vote_id={organization_we_vote_id} />
        <br />
        &nbsp;&nbsp;
        { twitterDescriptionMinusName && !this.props.turn_off_description ?
          <p className="card-main__description">{twitterDescriptionMinusName}</p> :
          <p className="card-main__description" />
        }

        { organization_website ?
          <span><a href={organization_website} target="_blank"> {organization_website} <i className="fa fa-external-link" /></a></span> :
          null }
        {/*5 of your friends follow Organization Name<br />*/}

        {twitter_followers_count ?
          <span className="twitter-followers__badge">
            <span className="fa fa-twitter twitter-followers__icon" />
            {numberWithCommas(twitter_followers_count)}
          </span> :
          null
        }

    </div>;
  }
}
