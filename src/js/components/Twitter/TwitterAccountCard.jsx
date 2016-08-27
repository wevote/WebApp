import React, { Component, PropTypes } from "react";
import ImageHandler from "../../components/ImageHandler";
import { abbreviateNumber, numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

export default class TwitterAccountCard extends Component {
  static propTypes = {
    twitter_handle: PropTypes.string,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    twitter_photo_url: PropTypes.string,
    twitter_user_website: PropTypes.string,
    twitter_name: PropTypes.string
  };

  constructor (props) {
    super(props);
  }

  render () {
    let {twitter_handle, twitter_description, twitter_followers_count,
      twitter_photo_url, twitter_user_website,
      twitter_name} = this.props;

    // If the displayName is in the twitterDescription, remove it from twitterDescription
    let displayName = twitter_name || "";
    let twitterDescription = twitter_description || "";
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);

    return <div className="card__container">
        <div className="card__main">
          <div className="card__media-object">
            { twitter_photo_url ?
              <ImageHandler imageUrl={twitter_photo_url} className="card__media-object-anchor" /> :
              <i className="icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color card__media-object-anchor"></i>
            }
            <div className="card__media-object-content">
              <div className="card__display-name">{displayName}</div>
              { twitterDescriptionMinusName ?
                <p className="card__description">{twitterDescriptionMinusName}</p> :
                null
              }
              { twitter_handle ?
                <span>@{twitter_handle}&nbsp;&nbsp;</span> :
                <span></span>
              }
              {twitter_followers_count ?
                <span className="twitter-followers__badge">
                  <span className="fa fa-twitter twitter-followers__icon"></span>
                  <span title={numberWithCommas(twitter_followers_count)}>{abbreviateNumber(twitter_followers_count)}</span>
                </span> :
                null
              }
              {twitter_user_website ?
                <span>
                  &nbsp;&nbsp;
                  <a href={twitter_user_website} target="_blank">Website</a><br />
                </span> :
                null
              }
            </div>
          </div>
        </div>
      </div>;
  }
}
