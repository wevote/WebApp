import React, { Component } from "react";
import PropTypes from "prop-types";
import FollowToggle from "../Widgets/FollowToggle";
import VoterGuideDisplayForList from "../VoterGuide/VoterGuideDisplayForList";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { renderLog } from "../../utils/logging";

// NOTE FROM DALE: When OpinionsIgnoredList is refactored, this should be refactored to display Organizations instead of Voter Guides
export default class OpinionsIgnoredList extends Component {

  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    organizationsIgnored: PropTypes.array,
    instantRefreshOn: PropTypes.bool,
    editMode: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      organizations_ignored: this.props.organizationsIgnored,
      ballot_item_we_vote_id: "",
    };
  }

  componentDidMount () {
    this.setState({
      organizations_ignored: this.props.organizationsIgnored,
      ballot_item_we_vote_id: this.props.ballotItemWeVoteId,
    });
  }

  componentWillReceiveProps (nextProps) {

    //if (nextProps.instantRefreshOn ) {
    // NOTE: This is off because we don't want the organization to disappear from the "More opinions" list when clicked
    this.setState({
      organizations_ignored: nextProps.organizationsIgnored,
      ballot_item_we_vote_id: nextProps.ballotItemWeVoteId,
    });
  }

  render () {
    renderLog(__filename);
    if (this.state.organizations_ignored === undefined) {
      return null;
    }

    // zachmonteith: extra span tags inside of OrganizationDisplayForList are to ensure that {org} gets passed in
    // as an array rather than an object, so that our propTypes validations in OrganizationDisplayForList work.
    // there is probably a more elegant way to do this, but left it this way for now as it works.
    return <div className="guidelist card-child__list-group">
      <TransitionGroup className="org-ignore">
        {this.state.organizations_ignored.map((org) => {
          if (this.props.editMode) {
            return <CSSTransition key={org.organization_we_vote_id} timeout={500} classNames="fade">
              <VoterGuideDisplayForList key={org.organization_we_vote_id} {...org}>
                <FollowToggle we_vote_id={org.organization_we_vote_id}/><span/>
              </VoterGuideDisplayForList>;
            </CSSTransition>;
          } else {
            return <CSSTransition key={org.organization_we_vote_id} timeout={500} classNames="fade">
              <VoterGuideDisplayForList key={org.organization_we_vote_id} {...org}>
                <span />
                <span />
              </VoterGuideDisplayForList>
            </CSSTransition>;
          }
        })
        }
      </TransitionGroup>
    </div>;
  }

}
