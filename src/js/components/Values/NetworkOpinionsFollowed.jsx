import styled from '@mui/material/styles/styled';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import OrganizationActions from '../../actions/OrganizationActions';
import { renderLog } from '../../common/utils/logging';
import OrganizationStore from '../../stores/OrganizationStore';
import OpinionsFollowedListCompressed from '../Organization/OpinionsFollowedListCompressed';
import EndorsementCard from '../Widgets/EndorsementCard';

export default class NetworkOpinionsFollowed extends Component {
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

  getCurrentRoute () {
    return '/opinions_followed';
  }

  render () {
    renderLog('NetworkOpinionsFollowed');  // Set LOG_RENDER_EVENTS to log all renders
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
            <EndorsementCard
              bsPrefix="u-stack--xs"
              variant="primary"
              buttonText="Suggest Organization"
              text="Don’t see your favorite organization?"
              title="Suggest Organization"
            />
            <br />
          </div>
        </section>
      </div>
    );
  }
}

const SectionTitle = styled('h2')`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;
