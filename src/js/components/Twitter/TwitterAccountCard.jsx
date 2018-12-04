import React, { Component } from "react";
import PropTypes from "prop-types";
import ParsedTwitterDescription from "./ParsedTwitterDescription";
import ImageHandler from "../ImageHandler";
import { renderLog } from "../../utils/logging";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import { abbreviateNumber, numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

export default class TwitterAccountCard extends Component {
  static propTypes = {
    twitter_handle: PropTypes.string,
    twitter_description: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    twitter_photo_url: PropTypes.string,
    twitter_user_website: PropTypes.string,
    twitter_name: PropTypes.string,
  };

  render () {
    renderLog(__filename);
    const {
      twitter_handle, twitter_description, twitter_followers_count,
      twitter_photo_url, twitter_user_website,
      twitter_name,
    } = this.props;
    const twitterUserWebsite = twitter_user_website;

    // If the displayName is in the twitterDescription, remove it from twitterDescription
    const displayName = twitter_name || "";
    const twitterDescription = twitter_description || "";
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);

    return (
      <div className="card">
        <div className="card-main">
          <div className="card-main__media-object">
            <div className="card-main__media-object-anchor">
              <ImageHandler imageUrl={twitter_photo_url} className="card-main__avatar" sizeClassName="icon-lg " />
            </div>
            <div className="card-main__media-object-content">
              <div className="card-main__display-name">{displayName}</div>
              { twitterDescriptionMinusName ? (
                <ParsedTwitterDescription
                  twitter_description={twitterDescriptionMinusName}
                />
              ) :
                null
              }
              { twitter_handle ? (
                <span>
                  @
                  {twitter_handle}
                  &nbsp;&nbsp;
                </span>
              ) :
                <span />
              }
              {twitter_followers_count ? (
                <span className="twitter-followers__badge">
                  <span className="fa fa-twitter twitter-followers__icon" />
                  <span title={numberWithCommas(twitter_followers_count)}>{abbreviateNumber(twitter_followers_count)}</span>
                </span>
              ) : null
              }
              {twitterUserWebsite ? (
                <span>
                  &nbsp;&nbsp;
                  <OpenExternalWebSite
                    url={twitterUserWebsite}
                    target="_blank"
                    body={(
                      <span>
                        Website
                        <i className="fa fa-external-link" />
                      </span>
                    )}
                  />
                  <br />
                </span>
              ) : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
