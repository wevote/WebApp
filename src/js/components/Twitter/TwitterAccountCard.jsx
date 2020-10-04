import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ParsedTwitterDescription from './ParsedTwitterDescription';
import ImageHandler from '../ImageHandler';
import { renderLog } from '../../utils/logging';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import { abbreviateNumber, numberWithCommas, removeTwitterNameFromDescription } from '../../utils/textFormat';

export default class TwitterAccountCard extends Component {
  render () {
    renderLog('TwitterAccountCard');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      twitterHandle, twitterDescription, twitterFollowersCount,
      twitterPhotoUrl, twitterUserWebsite,
      twitterName,
    } = this.props;

    // If the nameDisplay is in the twitterDescription, remove it from twitterDescription
    const nameDisplay = twitterName || '';
    const twitterDescriptionDisplay = twitterDescription || '';
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(nameDisplay, twitterDescriptionDisplay);

    return (
      <div className="card">
        <div className="card-main">
          <div className="card-main__media-object">
            <div className="card-main__media-object-anchor">
              <ImageHandler imageUrl={twitterPhotoUrl} className="card-main__avatar" sizeClassName="icon-lg " />
            </div>
            <div className="card-main__media-object-content">
              <div className="card-main__display-name">{nameDisplay}</div>
              { twitterDescriptionMinusName ? (
                <ParsedTwitterDescription
                  twitter_description={twitterDescriptionMinusName}
                />
              ) :
                null}
              { twitterHandle ? (
                <span>
                  @
                  {twitterHandle}
                  &nbsp;&nbsp;
                </span>
              ) :
                <span />}
              {twitterFollowersCount ? (
                <span className="twitter-followers__badge">
                  <span className="fab fa-twitter" />
                  <span title={numberWithCommas(twitterFollowersCount)}>{abbreviateNumber(twitterFollowersCount)}</span>
                </span>
              ) : null}
              {twitterUserWebsite ? (
                <span>
                  &nbsp;&nbsp;
                  <OpenExternalWebSite
                    linkIdAttribute="twitterUserWebsite"
                    url={twitterUserWebsite}
                    target="_blank"
                    body={(
                      <span>
                        Website
                        <i className="fas fa-external-link-alt" />
                      </span>
                    )}
                  />
                  <br />
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
TwitterAccountCard.propTypes = {
  twitterHandle: PropTypes.string,
  twitterDescription: PropTypes.string,
  twitterFollowersCount: PropTypes.number,
  twitterPhotoUrl: PropTypes.string,
  twitterUserWebsite: PropTypes.string,
  twitterName: PropTypes.string,
};
