import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import FollowToggle from "../Widgets/FollowToggle";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import OrganizationActions from "../../actions/OrganizationActions";
import VoterGuideDisplayForList from "./VoterGuideDisplayForList";
import { showToastSuccess } from "../../utils/showToast";
import { renderLog } from "../../utils/logging";

export default class GuideList extends Component {

  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    organizationsToFollow: PropTypes.array,
    instantRefreshOn: PropTypes.bool,
    hide_stop_following_button: PropTypes.bool,
    hide_ignore_button: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      organizations_to_follow: [],
      ballot_item_we_vote_id: "",
    };
  }

  componentDidMount () {
    this.setState({
      organizations_to_follow: this.props.organizationsToFollow,
      ballot_item_we_vote_id: this.props.ballotItemWeVoteId,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("GuideList componentWillReceiveProps");
    //if (nextProps.instantRefreshOn ) {
    // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
    this.setState({
      organizationsToFollow: nextProps.organizationsToFollow,
      ballot_item_we_vote_id: nextProps.ballotItemWeVoteId,
    });
  }

  handleIgnore (id) {
    OrganizationActions.organizationFollowIgnore(id);
    this.setState({
      organizations_to_follow: this.state.organizations_to_follow.filter(
        (org) => org.organization_we_vote_id !== id),
    });
    showToastSuccess("Added to ignore list.");
  }

  render () {
    renderLog(__filename);
    if (this.state.organizations_to_follow === undefined) {
      // console.log("GuideList this.state.organizations_to_follow === undefined");
      return null;
    }

    // console.log("GuideList organizationsToFollow: ", this.state.organizationsToFollow);
    let counter = 0;

    if (this.state.organizationsToFollow === undefined) {
      return <div className="guidelist card-child__list-group">
        <div className="u-flex u-flex-column u-items-center">
          <div className="u-margin-top--sm u-stack--sm u-no-break">
            No results found.
          </div>
          <OpenExternalWebSite url="https://api.wevoteusa.org/vg/create/"
                               className="opinions-followed__missing-org-link"
                               target="_blank"
                               title="Organization Missing?"
                               body={<Button bsPrefix="u-stack--xs" variant="primary">Organization Missing?</Button>}
          />
          <div className="opinions-followed__missing-org-text u-stack--sm u-no-break">
            Don’t see an organization you want to Listen to?
          </div>
        </div>
      </div>;
    }

    return <div className="guidelist card-child__list-group">
      <TransitionGroup className="org-ignore">
        {this.state.organizationsToFollow.map((organization) =>
          <CSSTransition key={++counter} timeout={500} classNames="fade">
            <span>
              <VoterGuideDisplayForList organization_we_vote_id={organization.organization_we_vote_id} voter_guide_image_url_large={organization.voter_guide_image_url_large}
                                        voter_guide_display_name={organization.voter_guide_display_name} twitter_handle={organization.twitter_handle}>
                <FollowToggle we_vote_id={organization.organization_we_vote_id} hide_stop_following_button={this.props.hide_stop_following_button}/>
                { this.props.hide_ignore_button ?
                  null :
                  <Button variant="outline-secondary" size="sm" onClick={this.handleIgnore.bind(this, organization.organization_we_vote_id)}>
                    Ignore
                  </Button>
                }
              </VoterGuideDisplayForList>
            </span>
          </CSSTransition>)
        }
      </TransitionGroup>
    </div>;
  }
}
