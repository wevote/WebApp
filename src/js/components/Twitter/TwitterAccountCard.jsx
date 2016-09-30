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

    return <div className="card">
        <div className="card-main">
          <div className="card-main__media-object">
            <div className="card-main__media-object-anchor">
              <ImageHandler imageUrl={twitter_photo_url} className="card-main__avatar" sizeClassName="icon-lg "/>
            </div>
            <div className="card-main__media-object-content">
              <div className="card-main__display-name">{displayName}</div>
              { twitterDescriptionMinusName ?
                <p className="card-main__description">{twitterDescriptionMinusName}</p> :
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
                  <a href={twitter_user_website} target="_blank">Website <i className="fa fa-external-link"></i></a><br />
                </span> :
                null
              }
            </div>
          </div>
        </div>
      </div>;
  }
}
