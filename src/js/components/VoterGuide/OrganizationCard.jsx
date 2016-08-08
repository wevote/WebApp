import React, { Component, PropTypes } from "react";
import Image from "../../components/Image";
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

    return <div className="card__media-object">
          { organization_photo_url ?
            <Image imageUrl={organization_photo_url} class="card__media-object-anchor" /> :
            <i className="icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color card__media-object-anchor" />
          }
          <div className="card__media-object-content">
            <div className="card__display-name">{displayName}</div>
            { twitterDescriptionMinusName && !this.props.turn_off_description ?
              <p className="card__description">{twitterDescriptionMinusName}</p> :
              <p className="card__description" />
            }
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
            <a href={organization_website} target="_blank">Website</a><br />
            {/*5 of your friends follow Organization Name<br />*/}
            {/*
            <strong>2016 General Election, November 2nd</strong>
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur posuere vulputate massa ut efficitur.
            Phasellus rhoncus hendrerit ultricies. Fusce hendrerit vel elit et euismod. Etiam bibendum ultricies
            viverra. Integer ut bibendum ex. Suspendisse eleifend mi accumsan, euismod enim at, malesuada nibh.
            Duis a eros fringilla, dictum leo vitae, vulputate mi. Nunc vitae neque nec erat fermentum... (more)<br />
              <AskOrShareAction link_text={"Share Organization"} />*/}
          </div>
        </div>;
  }
}
