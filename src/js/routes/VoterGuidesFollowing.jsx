import React, {Component, PropTypes } from "react";
import Helmet from "react-helmet";
import GuideStore from "../stores/GuideStore";
import GuideActions from "../actions/GuideActions";
import GuideList from "../components/VoterGuide/GuideList";

/* VISUAL DESIGN HERE: https://invis.io/8F53FDX9G */

export default class VoterGuidesFollowing extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {voter_guide_followed_list: GuideStore.followedByOrganizationList(),
                  editMode: false,
                  organization_we_vote_id: this.props.organization.organization_we_vote_id,
                  organization_name: this.props.organization.organization_name,
    };
  }

  componentDidMount () {
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    GuideActions.voterGuidesFollowedByOrganizationRetrieve(this.state.organization_we_vote_id);
  }

  componentWillUnmount (){
    this.guideStoreListener.remove();
  }

  _onGuideStoreChange (){
    var list = GuideStore.followedByOrganizationList();

    if (list !== undefined && list.length > 0){
      this.setState({ voter_guide_followed_list: GuideStore.followedByOrganizationList() });
    }
  }

  toggleEditMode (){
    this.setState({editMode: !this.state.editMode});
  }

  onKeyDownEditMode (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    let scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.setState({editMode: !this.state.editMode});
    }
  }

  render () {
    return <div className="opinions-followed__container">
      <Helmet title="Organizations You Follow - We Vote" />
      <section className="card">
        { this.state.voter_guide_followed_list && this.state.voter_guide_followed_list.length ?
          <div className="card-main">
            <h3 className="card-main__display-name">
              {this.state.organization_name} is Following
            </h3>
            <div className="voter-guide-list card">
              <div className="card-child__list-group">
                <GuideList organizationsToFollow={this.state.voter_guide_followed_list} instantRefreshOn />
              </div>
            </div>
          </div> :
          <div className="card-main">
            <p> {this.state.organization_name} is not following anyone. </p>
          </div>
        }
      </section>
    </div>;
  }
}
