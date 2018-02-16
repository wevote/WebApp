import React, { Component, PropTypes } from "react";
import ImageHandler from "../../components/ImageHandler";

// IssueImageDisplay is used by IssuesDisplayListWithOrganizationPopovers for viewing the icons for issues
//  you can follow on the Ballot page
export default class IssueImageDisplay extends Component {
  static propTypes = {
    issue: PropTypes.object.isRequired,
    issueImageSize: PropTypes.string,
    showPlaceholderImage: PropTypes.bool,
    showInfoOnly: PropTypes.bool,
    showOppose: PropTypes.bool,
    showSupport: PropTypes.bool,
  };

  render () {
    if (!this.props.issue) {
      console.log("IssueImageDisplay no props.image");
      return null;
    }

    let issue_name;
    if (this.props.issue.issue_name) {
      issue_name = this.props.issue.issue_name;
    } else {
      issue_name = "";
    }

    let support_oppose_class = "";
    if (this.props.showSupport) {
      support_oppose_class = "network-positions__show-support-underline ";
    } else if (this.props.showOppose) {
      support_oppose_class = "network-positions__show-oppose-underline ";
    }

    let hide_placeholder = !this.props.showPlaceholderImage;

    const imageSizes = new Set(["SMALL", "MEDIUM", "LARGE"]);
    let issueImageSize = "SMALL"; // Set the default
    if (imageSizes.has(this.props.issueImageSize)) {
      issueImageSize = this.props.issueImageSize;
    }

    let issueImage;
    if (issueImageSize === "SMALL") {
      issueImage = <ImageHandler alt={issue_name}
                                 className={support_oppose_class}
                                 hidePlaceholder={hide_placeholder}
                                 imageUrl={this.props.issue.issue_photo_url_tiny}
                                 className="card-main__org-avatar"
                                 sizeClassName="issue__image--small "/>;
    } else if (issueImageSize === "MEDIUM") {
      issueImage = <ImageHandler alt={issue_name}
                                 className={support_oppose_class}
                                 hidePlaceholder={hide_placeholder}
                                 imageUrl={this.props.issue.issue_photo_url_medium}
                                 className="card-main__org-avatar"
                                 sizeClassName="issue__image--medium "/>;
    } else if (issueImageSize === "LARGE") {
      issueImage = <ImageHandler alt={issue_name}
                                 className={support_oppose_class}
                                 hidePlaceholder={hide_placeholder}
                                 imageUrl={this.props.issue.issue_photo_url_large}
                                 sizeClassName="issue__image--large "/>;
    }

    return <span className="issue__image-modal">{issueImage}</span>;
  }
}
