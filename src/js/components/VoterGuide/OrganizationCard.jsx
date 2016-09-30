import React, { Component, PropTypes } from "react";
import ImageHandler from "../../components/ImageHandler";
import LoadingWheel from "../../components/LoadingWheel";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/94226088 */

// This Component is used to display the Organization by TwitterHandle
// Please see VoterGuide/Organization for the Component used by GuideList for Candidate and Opinions (you can follow)
export default class OrganizationCard extends Component {
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
      organization_photo_url, organization_website,
      organization_name} = this.props.organization;

    // If the displayName is in the twitterDescription, remove it from twitterDescription
    let displayName = organization_name ? organization_name : "";
    let twitterDescription = twitter_description ? twitter_description : "";
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);

    return <div className="card-main__media-object">
      <div className="card-main__media-object-anchor">
        <ImageHandler imageUrl={organization_photo_url} className="card-main__avatar" sizeClassName="icon-lg "/>
      </div>
      <div className="card-main__media-object-content">
        <div className="card-main__display-name">{displayName}</div>
        { twitterDescriptionMinusName && !this.props.turn_off_description ?
          <p className="card-main__description">{twitterDescriptionMinusName}</p> :
          <p className="card-main__description" />
        }
        <div>
          { organization_twitter_handle ?
            <span>@{organization_twitter_handle}&nbsp;&nbsp;</span> :
            null
          }
          {twitter_followers_count ?
            <span className="twitter-followers__badge">
              <span className="fa fa-twitter twitter-followers__icon" />
              {numberWithCommas(twitter_followers_count)}
            </span> :
            null
          }
          &nbsp;&nbsp;
          { organization_website ?
            <span><a href={organization_website} target="_blank">Website <i className="fa fa-external-link"></i></a></span> :
            null }
          {/*5 of your friends follow Organization Name<br />*/}
        </div>
      </div>
    </div>;
  }
}
