import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import FollowToggle from "../../components/Widgets/FollowToggle";
import ImageHandler from "../../components/ImageHandler";
import LoadingWheel from "../../components/LoadingWheel";
import ParsedTwitterDescription from "../Twitter/ParsedTwitterDescription";
import PositionRatingSnippet from "../../components/Widgets/PositionRatingSnippet";
import PositionInformationOnlySnippet from "../../components/Widgets/PositionInformationOnlySnippet";
import PositionSupportOpposeSnippet from "../../components/Widgets/PositionSupportOpposeSnippet";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import { removeTwitterNameFromDescription } from "../../utils/textFormat";

// This Component is used to display the Organization by TwitterHandle
// Please see VoterGuide/Organization for the Component used by GuideList for Candidate and Opinions (you can follow)
export default class OrganizationCard extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    followToggleOn: PropTypes.bool,
    issue: PropTypes.object.isRequired,
    turnOffDescription: PropTypes.bool,
    turnOffLogo: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballot_item_we_vote_id: "",
      organization_position: {},
      organization_positions_requested: false,
      organization_we_vote_id: "",
    };
  }

  componentDidMount () {
    // console.log("OrganizationCard, componentDidMount, this.props:", this.props);
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    if (this.props.organization && this.props.organization.organization_we_vote_id) {
      this.setState({
        organization_we_vote_id: this.props.organization.organization_we_vote_id,
      });
    }
    this.setState({
      ballot_item_we_vote_id: this.props.ballotItemWeVoteId,
    });
    // console.log("this.props.organization (componentDidMount): ", this.props.organization);
    if (this.props.organization && this.props.organization.organization_we_vote_id && this.props.ballotItemWeVoteId) {
      let organization_position = OrganizationStore.getOrganizationPositionByWeVoteId(this.props.organization.organization_we_vote_id, this.props.ballotItemWeVoteId);
      // console.log("organization_position (componentDidMount): ", organization_position);
      if (organization_position && organization_position.ballot_item_we_vote_id) {
        this.setState({
          organization_position: organization_position,
        });
      } else {
        OrganizationActions.positionListForOpinionMaker(this.props.organization.organization_we_vote_id, true);
        this.setState({
          organization_positions_requested: true,
        });
      }
    }
    // If no position, we need to call positionListForOpinionMaker here
  }

  componentWillReceiveProps (nextProps) {
    // console.log("OrganizationCard, componentWillReceiveProps, nextProps:", nextProps);
    if (nextProps.organization && nextProps.organization.organization_we_vote_id) {
      this.setState({
        organization_we_vote_id: nextProps.organization.organization_we_vote_id,
      });
    }
    this.setState({
      ballot_item_we_vote_id: nextProps.ballotItemWeVoteId,
    });
    if (nextProps.organization && nextProps.organization.organization_we_vote_id && nextProps.ballotItemWeVoteId) {
      let organization_position = OrganizationStore.getOrganizationPositionByWeVoteId(nextProps.organization.organization_we_vote_id, nextProps.ballotItemWeVoteId);
      // console.log("organization_position (componentWillReceiveProps): ", organization_position);
      if (organization_position && organization_position.ballot_item_we_vote_id) {
        this.setState({
          organization_position: organization_position,
        });
      } else if (!this.state.organization_positions_requested) {
        OrganizationActions.positionListForOpinionMaker(nextProps.organization.organization_we_vote_id, true);
        this.setState({
          organization_positions_requested: true,
        });
      }
    }
  }

  onOrganizationStoreChange (){
    this.setState({ organization_position: OrganizationStore.getOrganizationPositionByWeVoteId(this.state.organization_we_vote_id, this.state.ballot_item_we_vote_id)});
  }

  componentWillUnmount (){
    this.organizationStoreListener.remove();
  }

  render () {
    return null;

    // if (!this.state.organization_we_vote_id.length){
    //   return <div className="card-popover__width--minimum">{LoadingWheel}</div>;
    // }
    //
    // const {organization_twitter_handle, twitter_description,
    //   organization_photo_url_large, organization_website,
    //   organization_name} = this.props.organization; // twitter_followers_count,
    //
    // // If the displayName is in the twitterDescription, remove it from twitterDescription
    // let displayName = organization_name ? organization_name : "";
    // let twitterDescription = twitter_description ? twitter_description : "";
    // let twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);
    // var voterGuideLink = organization_twitter_handle ? "/" + organization_twitter_handle : "/voterguide/" + this.state.organization_we_vote_id;
    //
    // let position_description = "";
    // if (this.state.organization_position) {
    //   const is_on_ballot_item_page = true; // From "actor's" perspective: actorSupportsBallotItemLabel
    //   // console.log("this.state.organization_position: ", this.state.organization_position);
    //   if (this.state.organization_position.vote_smart_rating) {
    //     position_description =
    //       <PositionRatingSnippet {...this.state.organization_position} />;
    //   } else if (this.state.organization_position.is_support || this.state.organization_position.is_oppose) {
    //     position_description =
    //       <PositionSupportOpposeSnippet {...this.state.organization_position} is_on_ballot_item_page={is_on_ballot_item_page}/>;
    //   } else if (this.state.organization_position.is_information_only) {
    //     position_description =
    //       <PositionInformationOnlySnippet {...this.state.organization_position} is_on_ballot_item_page={is_on_ballot_item_page}/>;
    //   }
    // }
    //
    // return <div className="card-main__media-object">
    //   <div className="card-main__media-object-anchor">
    //     {this.props.turnOffLogo ?
    //       null :
    //       <Link to={voterGuideLink} className="u-no-underline">
    //         <ImageHandler imageUrl={organization_photo_url_large} className="card-main__org-avatar" sizeClassName="icon-lg "/>
    //       </Link> }
    //     {this.props.followToggleOn ?
    //       <div className="u-margin-top--md">
    //         <FollowToggle we_vote_id={this.state.organization_we_vote_id}
    //                       classNameOverride="pull-left" />
    //       </div> :
    //       null }
    //   </div>
    //   <div className="card-main__media-object-content">
    //     <Link to={voterGuideLink}>
    //       <h3 className="card-main__display-name">{displayName}</h3>
    //     </Link>
    //     {/* Organization supports ballot item */}
    //     {position_description}
    //
    //     { twitterDescriptionMinusName && !this.props.turnOffDescription ?
    //       <ParsedTwitterDescription
    //         twitter_description={twitterDescriptionMinusName}
    //       /> :
    //       <p className="card-main__description" />
    //     }
    //     { !this.props.turnOffDescription ?
    //       <div>
    //         { organization_twitter_handle ?
    //           <span>@{organization_twitter_handle}&nbsp;&nbsp;</span> :
    //           null
    //         }
    //         {/* twitter_followers_count ?
    //           <span className="twitter-followers__badge">
    //             <span className="fa fa-twitter twitter-followers__icon" />
    //             {numberWithCommas(twitter_followers_count)}
    //           </span> :
    //           null
    //         */}
    //         &nbsp;&nbsp;
    //         { organization_website ?
    //           <span><a href={organization_website} target="_blank">Website <i className="fa fa-external-link" /></a></span> :
    //           null }
    //         {/*5 of your friends follow Organization Name<br />*/}
    //       </div> :
    //       null }
    //   </div>
    // </div>;
  }
}
