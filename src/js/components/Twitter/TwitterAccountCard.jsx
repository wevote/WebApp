import { Launch, Twitter } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import abbreviateNumber from '../../common/utils/abbreviateNumber';
import { renderLog } from '../../common/utils/logging';
import numberWithCommas from '../../common/utils/numberWithCommas';
import { removeTwitterNameFromDescription } from '../../utils/textFormat';
import ParsedTwitterDescription from './ParsedTwitterDescription';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

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
              <Suspense fallback={<></>}>
                <ImageHandler imageUrl={twitterPhotoUrl} className="card-main__avatar" sizeClassName="icon-lg " />
              </Suspense>
            </div>
            <div className="card-main__media-object-content">
              <div className="card-main__display-name">{nameDisplay}</div>
              { twitterDescriptionMinusName ? (
                <ParsedTwitterDescription
                  twitterDescription={twitterDescriptionMinusName}
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
                  <Twitter />
                  <span title={numberWithCommas(twitterFollowersCount)}>{abbreviateNumber(twitterFollowersCount)}</span>
                </span>
              ) : null}
              {twitterUserWebsite ? (
                <span>
                  &nbsp;&nbsp;
                  <Suspense fallback={<></>}>
                    <OpenExternalWebSite
                      linkIdAttribute="twitterUserWebsite"
                      url={twitterUserWebsite}
                      target="_blank"
                      body={(
                        <span>
                          Website
                          <Launch
                            style={{
                              height: 14,
                              marginLeft: 2,
                              marginTop: '-3px',
                              width: 14,
                            }}
                          />
                        </span>
                      )}
                    />
                  </Suspense>
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
  twitterDescription: PropTypes.string,
  twitterFollowersCount: PropTypes.number,
  twitterHandle: PropTypes.string,
  twitterName: PropTypes.string,
  twitterPhotoUrl: PropTypes.string,
  twitterUserWebsite: PropTypes.string,
};
