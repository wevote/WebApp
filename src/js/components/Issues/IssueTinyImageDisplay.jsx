import React, { Component, PropTypes } from "react";
import ImageHandler from "../../components/ImageHandler";

// IssueTinyImageDisplay is used by IssuesFollowedAsTinyImages for viewing the icons for issues
//  you can follow on the Ballot page
export default class IssueTinyImageDisplay extends Component {
  static propTypes = {
    issue: PropTypes.object.isRequired,
    showPlaceholderImage: PropTypes.bool,
    showInfoOnly: PropTypes.bool,
    showOppose: PropTypes.bool,
    showSupport: PropTypes.bool,
  };

  render () {
    if (!this.props.issue) {
      console.log("IssueTinyImageDisplay no props.image");
      return null;
    }

    let issue_name;
    if (this.props.issue.issue_name) {
      issue_name = this.props.issue.issue_name;
    } else {
      issue_name = "";
    }

    let issue_photo_url_medium;
    if (this.props.issue.issue_photo_url_medium) {
      issue_photo_url_medium = this.props.issue.issue_photo_url_medium;
    } else {
      issue_photo_url_medium = "";
    }

    let support_oppose_class = "";
    if (this.props.showSupport) {
      support_oppose_class = "network-positions__show-support-underline ";
    } else if (this.props.showOppose) {
      support_oppose_class = "network-positions__show-oppose-underline ";
    }

    let hide_placeholder = !this.props.showPlaceholderImage;
    return <span className="issue__image-modal"><ImageHandler alt={issue_name}
                         className={support_oppose_class}
                         hidePlaceholder={hide_placeholder}
                         imageUrl={issue_photo_url_medium}
                         kind_of_image="ISSUE"
                         sizeClassName="issue__image--medium"

           /></span>;
  }
}
