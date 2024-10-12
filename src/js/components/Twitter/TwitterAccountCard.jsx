import { Launch, Twitter } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import numberAbbreviate from '../../common/utils/numberAbbreviate';
import { renderLog } from '../../common/utils/logging';
import numberWithCommas from '../../common/utils/numberWithCommas';
import removeTwitterNameFromDescription from '../../common/utils/removeTwitterNameFromDescription';
import ParsedTwitterDescription from './ParsedTwitterDescription';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

export default class TwitterAccountCard extends Component {
  render () {
    renderLog('TwitterAccountCard');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      twitterDescription,
      twitterHandle,
      twitterFollowersCount,
      twitterPhotoUrl,
      twitterName,
      twitterUserWebsite,
    } = this.props;

    // If the nameDisplay is in the twitterDescription, remove it from twitterDescription
    const nameDisplay = twitterName || '';
    const twitterDescriptionDisplay = twitterDescription || '';
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(nameDisplay, twitterDescriptionDisplay);

    return (
      <div className="card">
        <div className="card-main">
          <div className="card-main__media-object">
            <MediaObjectAnchor>
              <Suspense fallback={<></>}>
                <ImageHandler imageUrl={twitterPhotoUrl} className="card-main__avatar" sizeClassName="icon-lg " />
              </Suspense>
            </MediaObjectAnchor>
            <DescriptionColumnWrapper>
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
                  <span title={numberWithCommas(twitterFollowersCount)}>{numberAbbreviate(twitterFollowersCount)}</span>
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
            </DescriptionColumnWrapper>
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

const DescriptionColumnWrapper = styled('div')`
`;
// flex: 1;
// @media all and (min-width: 480px) {
//   .card-main__media-object-content {
//     padding: 4px 32px;
//     margin-bottom: 32px;
//     font-size: 16px;
//   }
// }

// Replacing className="card-main__media-object-anchor"
const MediaObjectAnchor = styled('div')`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;
