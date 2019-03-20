import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import OpenExternalWebSite from '../../utils/OpenExternalWebSite';
import ReadMore from './ReadMore';
import { vimeoRegX, youTubeRegX } from '../../utils/textFormat';
import thumbsUpColorIcon from '../../../img/global/svg-icons/thumbs-up-color-icon.svg';
import thumbsDownColorIcon from '../../../img/global/svg-icons/thumbs-down-color-icon.svg';

export default class PositionSupportOpposeSnippet extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    is_on_ballot_item_page: PropTypes.bool,
    is_looking_at_self: PropTypes.bool,
    is_support: PropTypes.bool.isRequired,
    is_oppose: PropTypes.bool.isRequired,
    more_info_url: PropTypes.string,
    speaker_display_name: PropTypes.string,
    statement_text: PropTypes.string,
    stance_display_off: PropTypes.bool,
    comment_text_off: PropTypes.bool,
  };

  render () {
    renderLog(__filename);
    let stanceIconSrc;
    let className;
    let alt;
    let actorSupportsBallotItemLabel;
    let ballotItemIsSupportedByActorLabel;
    const { is_looking_at_self: isLookingAtSelf } = this.props;
    let { more_info_url: moreInfoUrl } = this.props;
    const statementText = this.props.statement_text || '';
    let statementTextHtml = (
      <ReadMore
        num_of_lines={5}
        text_to_display={statementText}
      />
    );

    let videoUrl = '';
    let youTubeUrl;
    let vimeoUrl;
    let statementTextNoUrl;

    if (statementText) {
      youTubeUrl = statementText.match(youTubeRegX);
      vimeoUrl = statementText.match(vimeoRegX);
    }

    if (youTubeUrl) {
      [videoUrl] = youTubeUrl;
      statementTextNoUrl = statementText.replace(videoUrl, '');
      statementTextHtml = <ReadMore text_to_display={statementTextNoUrl} />;
    }

    if (vimeoUrl) {
      [videoUrl] = vimeoUrl;
      statementTextNoUrl = statementText.replace(videoUrl, '');
      statementTextHtml = <ReadMore text_to_display={statementTextNoUrl} />;
    }

    if (this.props.is_support) {
      stanceIconSrc = cordovaDot(thumbsUpColorIcon);
      className = 'explicit-position__icon';
      alt = 'Supports';
      actorSupportsBallotItemLabel = isLookingAtSelf ? 'You Support' : 'Supports'; // Actor supports Ballot item (Active voice)
      ballotItemIsSupportedByActorLabel = isLookingAtSelf ? 'is Supported by You' : 'is Supported by'; // Ballot item is supported by Actor (Passive voice)
    } else if (this.props.is_oppose) {
      stanceIconSrc = cordovaDot(thumbsDownColorIcon);
      className = 'explicit-position__icon';
      alt = 'Opposes';
      actorSupportsBallotItemLabel = isLookingAtSelf ? 'You Oppose' : 'Opposes';
      ballotItemIsSupportedByActorLabel = isLookingAtSelf ? 'is Opposed by You' : 'is Opposed by';
    } else {
      // We shouldn't be here. Do not display position information. See instead PositionInformationOnlySnippet.jsx
      return <span />;
    }

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

    return (
      <div className="explicit-position">
        { stanceDisplayOff ?
          null : (
            <div className="explicit-position__text">
              <span className="explicit-position__voter-guide-increase">
                <img src={stanceIconSrc} width="24" height="24" className={className} alt={alt} />
                {this.props.is_on_ballot_item_page ? (
                  <span>
                    <span className="explicit-position__position-label">{actorSupportsBallotItemLabel}</span>
                    <span>
                      {' '}
                      {this.props.ballot_item_display_name}
                      {' '}
                    </span>
                  </span>
                ) : (
                  <span>
                    <span className="explicit-position__position-label">{ballotItemIsSupportedByActorLabel}</span>
                    <span>
                      {' '}
                      {this.props.speaker_display_name}
                      {' '}
                    </span>
                  </span>
                )}
                <br />
              </span>
              { commentTextOff ? null : (
                <span>
                  <span className="u-wrap-links d-print-none">{statementTextHtml}</span>
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
          )}
      </div>
    );
  }
}
