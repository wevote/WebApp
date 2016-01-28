import HeaderBackNavigation from "components/Navigation/HeaderBackNavigation";
import React, {Component, PropTypes } from "react";

import VoterGuideStore from 'stores/VoterGuideStore';
import VoterGuideItem from 'components/VoterGuide/VoterGuideItem';

{/* VISUAL DESIGN HERE: https://invis.io/TR4A1NYAQ */}

export default class Opinions extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    VoterGuideStore.initialize( voter_guide_list => this.setState({ voter_guide_list }));
  }

  render() {
    return (
<div>
  <HeaderBackNavigation back_to_text={"< Back to My Ballot"} />
  <div className="container-fluid well well-90">
    <h2 className="text-center">More Opinions I Can Follow</h2>
      <input type="text" name="search_opinions" className="form-control"
           placeholder="Search by name or twitter handle." /><br />

    These organizations and public figures have opinions about items on your
              ballot. Click the 'Follow' button to pay attention to them.

    <div className="voter-guide-list">
      {
        this.state.voter_guide_list ?
        this.state.voter_guide_list.map( item =>
          <VoterGuideItem key={item.we_vote_id} {...item} />
        ) : (<div className="box-loader">
              <i className="fa fa-spinner fa-pulse"></i>
              <p>Loading ... One Moment</p>
              </div>)
      }
    </div>
  </div>
</div>
    );
  }
}
