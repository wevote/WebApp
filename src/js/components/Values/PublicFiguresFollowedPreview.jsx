import React, { Component } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';
import OrganizationStore from '../../stores/OrganizationStore';
import OrganizationActions from '../../actions/OrganizationActions';
// import OpenExternalWebSite from '../../utils/OpenExternalWebSite';
import OpinionsFollowedListCompressed from '../Organization/OpinionsFollowedListCompressed';
import EndorsementCard from '../Widgets/EndorsementCard';

export default class PublicFiguresFollowedPreview extends Component {
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
    renderLog('PublicFiguresFollowedPreview');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log("NetworkOpinionsFollowed, this.state.organizationsFollowedList: ", this.state.organizationsFollowedList);
    return (
      <div className="opinions-followed__container">
        <section className="card">
          <div className="card-main">
            <SectionTitle>Who You Are Following</SectionTitle>
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
              linkIdAttribute="suggestOrganization"
              url="https://api.wevoteusa.org/vg/create/"
              className="opinions-followed__missing-org-link"
              target="_blank"
              title="Suggest Organization"
              body={<EndorsementCard className="btn btn-sm" bsPrefix="u-stack--xs" variant="primary" buttonText="Suggest Organization" />}
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

const SectionTitle = styled.h2`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;
