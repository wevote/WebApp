import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImageHandler from '../ImageHandler';
import { renderLog } from '../../utils/logging';
import { cordovaDot } from '../../utils/cordovaUtils';
import IssueStore from '../../stores/IssueStore';


export default class IssueImageDisplay extends Component {
  static propTypes = {
    issueWeVoteId: PropTypes.string.isRequired,
    issueImageSize: PropTypes.string,
    showPlaceholderImage: PropTypes.bool,
    showOppose: PropTypes.bool,
    showSupport: PropTypes.bool,
    isVoterFollowingThisIssue: PropTypes.bool,
    turnOffIssueFade: PropTypes.bool,
  };

  render () {
    renderLog(__filename);

    if (!this.props.issueWeVoteId) {
      // console.log('IssueImageDisplay no props.image');
      return null;
    }

    const oneIssue = IssueStore.getIssueByWeVoteId(this.props.issueWeVoteId);
    let issueName;
    if (oneIssue.issue_name) {
      issueName = oneIssue.issue_name;
    } else {
      issueName = '';
    }

    let issueIconLocalPath = '';
    if (oneIssue.issue_icon_local_path) {
      issueIconLocalPath = oneIssue.issue_icon_local_path;
    }

    const issueIconImageUrl = cordovaDot(`/img/global/svg-icons/issues/${issueIconLocalPath}.svg`);

    let supportOrOpposeClass = '';
    if (this.props.showSupport) {
      supportOrOpposeClass = 'network-positions__show-support-underline ';
    } else if (this.props.showOppose) {
      supportOrOpposeClass = 'network-positions__show-oppose-underline ';
    }

    let voterIsNotFollowingThisIssueClass = '';
    if (!this.props.isVoterFollowingThisIssue && !this.props.turnOffIssueFade) {
      voterIsNotFollowingThisIssueClass = 'network-positions__to-follow-fade ';
    }

    const hidePlaceholder = !this.props.showPlaceholderImage;

    const imageSizes = new Set(['SMALL', 'MEDIUM', 'LARGE']);
    let issueImageSize = 'SMALL'; // Set the default
    if (imageSizes.has(this.props.issueImageSize)) {
      ({ issueImageSize } = this.props);
    }

    let issueImage;
    if (issueImageSize === 'SMALL') {
      issueImage = (
        <ImageHandler
        alt={issueName}
        className={`card-main__org-avatar ${supportOrOpposeClass}${voterIsNotFollowingThisIssueClass}`}
        hidePlaceholder={hidePlaceholder}
        imageUrl={issueIconImageUrl}
        sizeClassName="issue__image--small "
        />
      );
    } else if (issueImageSize === 'MEDIUM') {
      issueImage = (
        <ImageHandler
        alt={issueName}
        className={`card-main__org-avatar ${supportOrOpposeClass}${voterIsNotFollowingThisIssueClass}`}
        hidePlaceholder={hidePlaceholder}
        imageUrl={issueIconImageUrl}
        sizeClassName="issue__image--medium "
        />
      );
    } else if (issueImageSize === 'LARGE') {
      issueImage = (
        <ImageHandler
        alt={issueName}
        className={`card-main__org-avatar ${supportOrOpposeClass}${voterIsNotFollowingThisIssueClass}`}
        hidePlaceholder={hidePlaceholder}
        imageUrl={issueIconImageUrl}
        sizeClassName="issue__image--large "
        />
      );
    }

    return <span className="issue__image-modal">{issueImage}</span>;
  }
}
