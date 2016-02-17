import React, {Component, PropTypes } from "react";
import HeaderBackNavigation from "../../components/Navigation/HeaderBackNavigation";

import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterGuideItem from '../../components/VoterGuide/VoterGuideItem';

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
    VoterGuideStore.initializeGuidesFollowed( voter_guide_followed_list => this.setState({ voter_guide_followed_list }));
  }

  render() {
    return (
<div>
  <div className="container-fluid well container-fluid--paddingxl gutter-top--small">
    <h2 className="text-center">Opinions I Follow</h2>
    <div className="input-group-lg">
      <input type="text"
              name="search_opinions" 
              className="form-control"
              placeholder="Search by name or twitter handle." 
      />
    </div>

    <div className="voter-guide-list">
      {
        this.state.voter_guide_followed_list ?
        this.state.voter_guide_followed_list.map( item =>
          <VoterGuideItem key={item.we_vote_id} {...item} />
        ) : (<div className="box-loader">
              <i className="fa fa-spinner fa-pulse"></i>
              <p>Loading ... One Moment</p>
              </div>
            )
      }
    </div>
  </div>
</div>
    );
  }
}
