import React, { Component, PropTypes } from 'react';
import FollowOrIgnore from "../../components/FollowOrIgnore";
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuideStore from '../../stores/VoterGuideStore';

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export default class VoterGuideItem extends Component {
  static propTypes = {
    voter_guide_display_name: PropTypes.string,
    voter_guide_image_url: PropTypes.string,
    google_civic_election_id: PropTypes.string,
    we_vote_id: PropTypes.string,               // voter_guide we_vote_id
    voter_guide_owner_type: PropTypes.string,
    organization_we_vote_id: PropTypes.string,
    public_figure_we_vote_id: PropTypes.string,
    twitter_followers_count: PropTypes.number,
    last_updated: PropTypes.string,
    OrganizationFollowed: PropTypes.string,
    OrganizationIgnored: PropTypes.string
  };

  constructor (props) {
    super(props);

    this.state = {}
  }

  componentDidMount () {
    this.state = {
      OrganizationFollowed: null,
      OrganizationIgnored: null
    };
    this.changeListener = this._onChange.bind(this);
    VoterGuideStore.addChangeListener(this.changeListener);
  }

  componentWillUnmount() {
    VoterGuideStore.removeChangeListener(this.changeListener);
  }

  _onChange () {
    VoterGuideStore.getVoterGuideByWeVoteId(
      this.props.we_vote_id, voter_guide_item => this.setState({
        OrganizationFollowed: voter_guide_item.OrganizationFollowed,
        OrganizationIgnored: voter_guide_item.OrganizationIgnored
      })
    );
  }

  render() {
    var twitterFollowers;
    var twitterFollowersCount = numberWithCommas(this.props.twitter_followers_count);
    if (this.props.twitter_followers_count) {
      twitterFollowers = <span><br /><span>{twitterFollowersCount} followers on Twitter</span></span>;
    }

    /* This was refactored into /src/js/components/VoterGuide/GuideList.jsx for "More Opinions" page.
     * Since the migration of the existing styles was not done with total fidelity, we need to leave this
     * file in place until the migration (or reintegration back into this file) can be completed.
     * TODO: Complete migration of this functionality */
    return (
      <div className="ballot-item well well-skinny well-bg--light split-top-skinny clearfix">

        <div className="display-name pull-left">
          <img className="img-square"
                src={this.props.voter_guide_image_url}
                width="75px"
          />
          &nbsp;
          { this.props.voter_guide_display_name }
          {twitterFollowers}
        </div>
        <FollowOrIgnore action={VoterGuideActions} organization_we_vote_id={this.props.organization_we_vote_id}
                        OrganizationFollowed={this.state.OrganizationFollowed} />

      </div>
    )
  }
}
