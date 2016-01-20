import HeaderBackNavigation from "components/Navigation/HeaderBackNavigation";
import OrganizationsToFollowList from "components/OrganizationsToFollowList";
import React, {Component, PropTypes } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router";

import VoterGuideStore from 'stores/VoterGuideStore';
import VoterGuideItem from 'components/VoterGuide/VoterGuideItem';

{/* VISUAL DESIGN HERE: https://invis.io/8F53FDX9G */}

export default class OpinionsFollowed extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    //VoterGuideStore.initialize( voter_guide_list => this.setState({ voter_guide_list }));
    VoterGuideStore.initializeGuidesToFollow( voter_guide_followed_list => this.setState({ voter_guide_followed_list }));
  }
    
  render() {
    return (
<div>
  <HeaderBackNavigation back_to_text={"< Back to More Menu"} />
  <div className="container-fluid well well-90">
    <h2 className="text-center">Opinions I Follow</h2>
      <input type="text" name="search_opinions" className="form-control"
           placeholder="Search by name or twitter handle." /><br />

    <div className="voter-guide-list">
      {
        this.state.voter_guide_followed_list ?
        this.state.voter_guide_followed_list.map( item =>
          <VoterGuideItem key={item.we_vote_id} {...item} />
        ) : (<i className="fa fa-spinner fa-pulse"></i>)
      }
    </div>
  </div>
</div>
    );
  }
}
