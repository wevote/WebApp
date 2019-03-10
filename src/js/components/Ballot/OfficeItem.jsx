import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { capitalizeString } from '../../utils/textFormat';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

export default class OfficeItem extends Component {
  static propTypes = {
    weVoteId: PropTypes.string.isRequired,
    ballotItemDisplayName: PropTypes.string.isRequired,
    linkToBallotItemPage: PropTypes.bool,
  };

  render () {
    renderLog(__filename);
    let { ballotItemDisplayName } = this.props;
    const { weVoteId } = this.props;
    const officeLink = `/office/${weVoteId}`;
    const goToOfficeLink = () => { historyPush(officeLink); };

    ballotItemDisplayName = capitalizeString(ballotItemDisplayName);
    const candidatesHtml = <span />; // For a preview of the candidates

    return (
      <div className="card-main__office-item">
        <div className="card-main__content">
          <h2 className="card-main__display-name">
            { this.props.linkToBallotItemPage ?
              <Link to={officeLink}>{ballotItemDisplayName}</Link> :
              ballotItemDisplayName
          }
          </h2>

          <div
            className={this.props.linkToBallotItemPage ? 'u-cursor--pointer' : null}
            onClick={this.props.linkToBallotItemPage ? goToOfficeLink : null}
          >
            {candidatesHtml}
          </div>
        </div>
      </div>
    );
  }
}
