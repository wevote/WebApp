import React, { Component, PropTypes } from "react";
import ImageHandler from "../../components/ImageHandler";
import IssueStore from "../../stores/IssueStore";
import LoadingWheel from "../../components/LoadingWheel";
import OrganizationStore from "../../stores/OrganizationStore";

export default class IssueCard extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    followToggleOn: PropTypes.bool,
    issue: PropTypes.object.isRequired,
    turnOffDescription: PropTypes.bool,
    turnOffIssueImage: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballot_item_we_vote_id: "",
      organization_position: {},
      organization_positions_requested: false,
      issue_we_vote_id: "",
    };
  }

  componentDidMount () {
    // console.log("IssueCard, componentDidMount, this.props:", this.props);
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    if (this.props.issue && this.props.issue.issue_we_vote_id) {
      this.setState({
        issue_we_vote_id: this.props.issue.issue_we_vote_id,
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log("IssueCard, componentWillReceiveProps, nextProps:", nextProps);
    if (nextProps.issue && nextProps.issue.issue_we_vote_id) {
      this.setState({
        issue_we_vote_id: nextProps.issue.issue_we_vote_id,
      });
    }
  }

  onIssueStoreChange (){
  }

  onOrganizationStoreChange (){
  }

  componentWillUnmount (){
    this.issueStoreListener.remove();
    this.organizationStoreListener.remove();
  }

  render () {
    if (!this.state.issue_we_vote_id.length){
      return <div className="card-popover__width--minimum">{LoadingWheel}</div>;
    }

    const {issue_description, issue_name,
      issue_photo_url_medium} = this.props.issue;

    let issueDisplayName = issue_name ? issue_name : "";
    let issueDescription = issue_description ? issue_description : "";

    return <div className="card-main__media-object">
      <div className="card-main__media-object-anchor">
        {this.props.turnOffIssueImage ?
          null :
          <ImageHandler imageUrl={issue_photo_url_medium} className="card-main__org-avatar" sizeClassName="icon-lg "/>
        }
        {/*this.props.followToggleOn ?
          <div className="u-margin-top--md">
            <FollowToggle we_vote_id={this.state.issue_we_vote_id}
                          classNameOverride="pull-left" />
          </div> :
          null */}
      </div>
      <div className="card-main__media-object-content">
        <h3 className="card-main__display-name">{issueDisplayName}</h3>

        { !this.props.turnOffDescription ?
          <p className="card-main__description">{issueDescription}</p> :
          <p className="card-main__description" />
        }
      </div>
    </div>;
  }
}
