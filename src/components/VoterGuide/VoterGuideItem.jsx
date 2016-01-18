import React, { Component, PropTypes } from 'react';
import VoterGuideActions from 'actions/VoterGuideActions';
import VoterGuideStore from 'stores/VoterGuideStore';

export default class VoterGuideItem extends Component {
  static propTypes = {
    voter_guide_display_name: PropTypes.string,
    voter_guide_image_url: PropTypes.string,
    google_civic_election_id: PropTypes.string,
    we_vote_id: PropTypes.string,               // voter_guide we_vote_id
    voter_guide_owner_type: PropTypes.string,
    organization_we_vote_id: PropTypes.string,
    public_figure_we_vote_id: PropTypes.string,
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
    VoterGuideStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    VoterGuideStore.removeChangeListener(this._onChange.bind(this));
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

    return (
      <div className="ballot-item well well-skinny split-top-skinny">

        <div className="display-name">
          <img src={this.props.voter_guide_image_url} width="100px" />
          { this.props.voter_guide_display_name }
        </div>

      </div>
    )
  }
}
