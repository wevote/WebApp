import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import OpenExternalWebSite from './OpenExternalWebSite';
import ReadMore from './ReadMore';
import { vimeoRegX, youTubeRegX } from '../../utils/textFormat';


export default class PositionInformationOnlySnippet extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    is_on_ballot_item_page: PropTypes.bool,
    is_looking_at_self: PropTypes.bool,
    more_info_url: PropTypes.string,
    speaker_display_name: PropTypes.string,
    statement_text: PropTypes.string,
    stance_display_off: PropTypes.bool,
    comment_text_off: PropTypes.bool,
  };

  render () {
    renderLog(__filename);
    const { is_looking_at_self: isLookingAtSelf } = this.props;
    let { more_info_url: moreInfoUrl } = this.props;
    const statementText = this.props.statement_text || '';
    let statementTextHtml = <ReadMore text_to_display={statementText} />;

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
      statementTextHtml = <ReadMore text_to_display={statementTextNoUrl} />;
    }

    if (vimeoUrl) {
      [videoUrl] = vimeoUrl;
      statementTextNoUrl = statementText.replace(videoUrl, '');
      statementTextHtml = <ReadMore text_to_display={statementTextNoUrl} />;
    }

    const className = 'position-rating__icon position-rating__icon--no-position';
    const alt = 'Neutral Rating';
    const positionLabel = 'About';
    const hasThisToSay = isLookingAtSelf ? 'Your comment:' : null;
    let stanceDisplayOff = false;
    if (this.props.stance_display_off !== undefined) {
      stanceDisplayOff = !!this.props.stance_display_off;
    }
    let commentTextOff = false;
    if (this.props.comment_text_off !== undefined) {
      commentTextOff = !!this.props.comment_text_off;
    }
    if (moreInfoUrl) {
      if (!moreInfoUrl.toLowerCase().startsWith('http')) {
        moreInfoUrl = `http://${moreInfoUrl}`;
      }
    }

    const labelText = 'This position is information-only, as opposed to “support” or “oppose”';
    const tooltip = <Tooltip id="tooltip">{labelText}</Tooltip>;
    return (
      <div className="explicit-position">
        <div className="explicit-position__text">
          { stanceDisplayOff ?
            null : (
              <span>
                <OverlayTrigger placement="top" overlay={tooltip}>
                  <div className="public-friends-indicator">
                    <img src={cordovaDot('/img/global/svg-icons/no-position-icon.svg')}
                         className={className}
                         width={24}
                         height={24}
                         color=""
                         alt={alt}
                    />
                  </div>
                </OverlayTrigger>
                {this.props.is_on_ballot_item_page ? (
                  <span>
                    <span className="explicit-position__position-label">{positionLabel}</span>
                    <span>
                      {' '}
                      {this.props.ballot_item_display_name}
                      {' '}
                    </span>
                  </span>
                ) : (
                  <span>
                    <span>
                      {' '}
                      {this.props.speaker_display_name}
                      {' '}
                    </span>
                    <span className="explicit-position__position-label">{hasThisToSay}</span>
                  </span>
                )}
                <br />
              </span>
            )
          }
          { commentTextOff ? null : (
            <span>
              <span>{statementTextHtml}</span>
              {/* if there's an external source for the explicit position/endorsement, show it */}
              { videoUrl ?
                <ReactPlayer className="explicit-position__media-player" url={`${videoUrl}`} width="100%" height="100%" /> :
                null }
              {moreInfoUrl ? (
                <div className="d-none d-sm-block">
                  {/* default: open in new tab */}
                  <OpenExternalWebSite
                    url={moreInfoUrl}
                    target="_blank"
                    className="u-gray-mid"
                    body={(
                      <span>
                        view source
                        {' '}
                        <i className="fa fa-external-link" aria-hidden="true" />
                      </span>
                    )}
                  />
                </div>
              ) : null
              }
            </span>
          )}
        </div>
      </div>
    );
  }
}
