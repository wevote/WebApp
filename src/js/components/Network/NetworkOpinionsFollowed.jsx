import React, { Component } from 'react';
// import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { renderLog } from '../../utils/logging';
import OrganizationStore from '../../stores/OrganizationStore';
import OrganizationActions from '../../actions/OrganizationActions';
// import OpenExternalWebSite from '../../utils/OpenExternalWebSite';
import OpinionsFollowedListCompressed from '../Organization/OpinionsFollowedListCompressed';
import EndorsementCard from '../Widgets/EndorsementCard';

export default class NetworkOpinionsFollowed extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      organizationsFollowedList: [],
      editMode: false,
    };
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.onOrganizationStoreChange();
    OrganizationActions.organizationsFollowedRetrieve();
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const organizationsFollowedList = OrganizationStore.getOrganizationsVoterIsFollowing();
    if (organizationsFollowedList && organizationsFollowedList.length) {
      const OPINIONS_TO_SHOW = 3;
      const organizationsFollowedListLimited = organizationsFollowedList.slice(0, OPINIONS_TO_SHOW);
      this.setState({
        organizationsFollowedList: organizationsFollowedListLimited,
      });
    }
  }

  onKeyDownEditMode (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    const { editMode } = this.state;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.setState({ editMode: !editMode });
    }
  }

  getCurrentRoute () {
    const currentRoute = '/opinions_followed';
    return currentRoute;
  }

  getFollowingType () {
    switch (this.getCurrentRoute()) {
      case '/opinions':
        return 'WHO_YOU_CAN_FOLLOW';
      case '/opinions_followed':
      default:
        return 'WHO_YOU_FOLLOW';
    }
  }

  toggleEditMode () {
    const { editMode } = this.state;
    this.setState({ editMode: !editMode });
  }

  render () {
    renderLog(__filename);
    // console.log("NetworkOpinionsFollowed, this.state.organizationsFollowedList: ", this.state.organizationsFollowedList);
    return (
      <div className="opinions-followed__container">
        <section className="card">
          <div className="card-main">
            <h1 className="h4">Who You Are Following</h1>
            <div className="voter-guide-list card">
              <div className="card-child__list-group">
                {
                this.state.organizationsFollowedList && this.state.organizationsFollowedList.length ? (
                  <span>
                    <OpinionsFollowedListCompressed
                      organizationsFollowed={this.state.organizationsFollowedList}
                      editMode={this.state.editMode}
                      instantRefreshOn
                    />
                    <Link to="/opinions_followed">See All</Link>
                  </span>
                ) :
                  <span>You are not following any organizations yet.</span>
                }
              </div>
            </div>
            {/* <OpenExternalWebSite
              url="https://api.wevoteusa.org/vg/create/"
              className="opinions-followed__missing-org-link"
              target="_blank"
              title="Suggest Organization"
              body={<Button className="btn btn-success btn-sm" bsPrefix="u-stack--xs" variant="primary">Suggest Organization</Button>}
            /> */}
            <EndorsementCard
              bsPrefix="u-stack--xs"
              variant="primary"
              buttonText="Suggest Organization"
              text="Don’t see your favorite organization?"
              title="Suggest Organization"
            />
            {/* <div className="opinions-followed__missing-org-text u-no-break">
              Don’t see your favorite organization?
            </div> */}
            <br />
          </div>
        </section>
      </div>
    );
  }
}
