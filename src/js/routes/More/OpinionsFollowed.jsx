import React, {Component, PropTypes } from "react";
import HeaderBackNavigation from "../../components/Navigation/HeaderBackNavigation";

import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterGuideItem from "../../components/VoterGuide/VoterGuideItem";

export default class OpinionsFollowed extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    VoterGuideStore.initializeGuidesFollowed( function(voter_guide_followed_list) {
      if (voter_guide_followed_list !== undefined && voter_guide_followed_list.length > 0){
        this.setState({ voter_guide_followed_list });
      } else {
        this.props.history.push('/opinions');
      }
    }.bind(this));
  }

  render() {
    return (
<div>
  <div className="container-fluid well gutter-top--small fluff-full1">
    <h3 className="text-center">Opinions I"m Following</h3>
    {/*
      <input type="text" name="search_opinions" className="form-control"
           placeholder="Search by name or twitter handle." /><br />
    */}
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
