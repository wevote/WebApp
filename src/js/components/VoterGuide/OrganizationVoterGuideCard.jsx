import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { Link, browserHistory } from "react-router";
import ParsedTwitterDescription from "../Twitter/ParsedTwitterDescription";
import LoadingWheel from "../../components/LoadingWheel";
import FollowToggle from "../../components/Widgets/FollowToggle";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/94226088 */

// This Component is used to display the Organization by TwitterHandle
// Please see VoterGuide/Organization for the Component used by GuideList for Candidate and Opinions (you can follow)
export default class OrganizationVoterGuideCard extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
    is_voter_owner: PropTypes.bool,
    turn_off_description: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {};
    this.onEdit = this.onEdit.bind(this);
  }

  onEdit () {
    browserHistory.push("/voterguideedit/" + this.props.organization.organization_we_vote_id);
    return <div>{LoadingWheel}</div>;
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
          <img src={organization_photo_url_large} height="180"/>
        </Link>
        <br />
        <Link to={voterGuideLink}>
          <h3 className="card-main__display-name">{displayName}</h3>
        </Link>
        { organization_twitter_handle ?
          <span>@{organization_twitter_handle}&nbsp;&nbsp;</span> :
          null
        }
      <br/>
      { this.props.is_voter_owner ?
        <Button bsStyle="warning" bsSize="small" className="pull-right" onClick={this.onEdit}>
          <span>Edit</span>
        </Button> :
        <FollowToggle we_vote_id={organization_we_vote_id} />
      }
      { twitterDescriptionMinusName && !this.props.turn_off_description ?
        <p className="card-main__description">
          <ParsedTwitterDescription
            twitter_description={twitterDescriptionMinusName}
          />
        </p> :
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
