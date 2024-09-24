import { Launch } from '@mui/icons-material';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import { vimeoRegX, youTubeRegX } from '../../common/utils/textFormat';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const ReactPlayer = React.lazy(() => import(/* webpackChunkName: 'ReactPlayer' */ 'react-player'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));

const noPositionIcon = '../../../img/global/svg-icons/no-position-icon.svg';


export default class PositionInformationOnlySnippet extends Component {
  render () {
    renderLog('PositionInformationOnlySnippet');  // Set LOG_RENDER_EVENTS to log all renders
    const { isLookingAtSelf, moreInfoUrl, statementText, isOnBallotItemPage, ballotItemDisplayName, speakerDisplayName } = this.props;
    let statementTextHtml = <ReadMore textToDisplay={statementText || ''} />;

    let videoUrl = '';
    let youTubeUrl;
    let vimeoUrl;
    let statementTextNoUrl;

    if (moreInfoUrl) {
      youTubeUrl = moreInfoUrl.match(youTubeRegX);
      vimeoUrl = moreInfoUrl.match(vimeoRegX);
    }

    if (statementText) {
      youTubeUrl = statementText.match(youTubeRegX);
      vimeoUrl = statementText.match(vimeoRegX);
    }

    if (youTubeUrl) {
      [videoUrl] = youTubeUrl;
      statementTextNoUrl = statementText.replace(videoUrl[0], '');
      statementTextHtml = <ReadMore textToDisplay={statementTextNoUrl} />;
    }

    if (vimeoUrl) {
      [videoUrl] = vimeoUrl;
      statementTextNoUrl = statementText.replace(videoUrl, '');
      statementTextHtml = <ReadMore textToDisplay={statementTextNoUrl} />;
    }

    const className = 'position-rating__icon position-rating__icon--no-position';
    const alt = 'Neutral Rating';
    const positionLabel = 'About';
    const hasThisToSay = isLookingAtSelf ? 'Your comment:' : null;
    let stanceDisplayOff = false;
    if (this.props.stanceDisplayOff !== undefined) {
      stanceDisplayOff = !!this.props.stanceDisplayOff;
    }
    let commentTextOff = false;
    if (this.props.commentTextOff !== undefined) {
      commentTextOff = !!this.props.commentTextOff;
    }
    let moreInfoUrlFull = moreInfoUrl;
    if (moreInfoUrlFull) {
      if (!moreInfoUrlFull.toLowerCase().startsWith('http')) {
        moreInfoUrlFull = `https://${moreInfoUrlFull}`;
      }
    }

    const labelText = 'This position is information-only, as opposed to “support” or “oppose”';
    const tooltip = isMobileScreenSize() ? (<span />) : (
      <Tooltip id="tooltip">{labelText}</Tooltip>
    );

    return (
      <div className="explicit-position">
        <div className="explicit-position__text">
          { stanceDisplayOff ?
            null : (
              <span>
                <OverlayTrigger placement="top" overlay={tooltip}>
                  <PublicFriendsIndicator>
                    <img src={normalizedImagePath(noPositionIcon)}
                         className={className}
                         width={24}
                         height={24}
                         color=""
                         alt={alt}
                    />
                  </PublicFriendsIndicator>
                </OverlayTrigger>
                {isOnBallotItemPage ? (
                  <span>
                    <span className="explicit-position__position-label">{positionLabel}</span>
                    <span>
                      {' '}
                      {ballotItemDisplayName}
                      {' '}
                    </span>
                  </span>
                ) : (
                  <span>
                    <span>
                      {' '}
                      {speakerDisplayName}
                      {' '}
                    </span>
                    <span className="explicit-position__position-label">{hasThisToSay}</span>
                  </span>
                )}
                <br />
              </span>
            )}
          { commentTextOff ? null : (
            <span>
              <Suspense fallback={<></>}>
                <span>
                  {statementTextHtml}
                </span>
              </Suspense>
              {/* if there's an external source for the explicit position/endorsement, show it */}
              {(videoUrl) && (
                <Suspense fallback={<></>}>
                  <ReactPlayer className="explicit-position__media-player" url={`${videoUrl}`} width="100%" height="100%" />
                </Suspense>
              )}
              {moreInfoUrlFull ? (
                <div className="d-none d-sm-block">
                  {/* default: open in new tab */}
                  <Suspense fallback={<></>}>
                    <OpenExternalWebSite
                      linkIdAttribute="moreInfo"
                      url={moreInfoUrlFull}
                      target="_blank"
                      className="u-gray-mid"
                      body={(
                        <span>
                          view source
                          {' '}
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
                </div>
              ) : null}
            </span>
          )}
        </div>
      </div>
    );
  }
}
PositionInformationOnlySnippet.propTypes = {
  ballotItemDisplayName: PropTypes.string,
  commentTextOff: PropTypes.bool,
  isLookingAtSelf: PropTypes.bool,
  isOnBallotItemPage: PropTypes.bool,
  moreInfoUrl: PropTypes.string,
  speakerDisplayName: PropTypes.string,
  stanceDisplayOff: PropTypes.bool,
  statementText: PropTypes.string,
};

const PublicFriendsIndicator = styled('div')`
  color: #999;
  display: inline-block;
  top: 16px;
  height: 18px;
`;
