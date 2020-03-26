import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import SelectVoterGuidesSideBar from '../../components/Navigation/SelectVoterGuidesSideBar';
import SettingsAccount from '../../components/Settings/SettingsAccount';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';


class VoterGuideListDashboard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      linkedOrganizationWeVoteId: '',
      voter: {},
    };
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId) {
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      this.setState({
        linkedOrganizationWeVoteId,
      });
      const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      if (organization && organization.organization_we_vote_id) {
        this.setState({
          // organization,
        });
      } else {
        OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      }
    }
  }

  componentWillReceiveProps () {
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard componentWillReceiveProps linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      this.setState({
        linkedOrganizationWeVoteId,
      });
      const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      if (organization && organization.organization_we_vote_id) {
        this.setState({
          // organization,
        });
      } else {
        OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      }
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
    // const { linkedOrganizationWeVoteId } = this.state;
    // console.log("VoterGuideSettingsDashboard onOrganizationStoreChange, linkedOrganizationWeVoteId: ", this.state.linkedOrganizationWeVoteId);
    this.setState({
      // organization: OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId),
    });
  }

  onVoterGuideStoreChange () {
    this.setState();
  }

  onVoterStoreChange () {
    const { linkedOrganizationWeVoteId: previousLinkedOrganizationWeVoteId } = this.state;
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard onVoterStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && (previousLinkedOrganizationWeVoteId !== linkedOrganizationWeVoteId)) {
      OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      VoterGuideActions.voterGuidesRetrieve(linkedOrganizationWeVoteId);
      this.setState({ linkedOrganizationWeVoteId });
    }
  }

  render () {
    renderLog('VoterGuideListDashboard');  // Set LOG_RENDER_EVENTS to log all renders

    return (
      <div className="settings-dashboard">
        <Helmet title="Your Endorsements - We Vote" />
        <div className="container-fluid">
          <div className="row">
            {/* Mobile and Desktop mode */}
            <div className="col-12 col-md-4 sidebar-menu">
              <SelectVoterGuidesSideBar />
            </div>
            <div className="d-none d-sm-block col-md-8">
              { !this.state.voter.is_signed_in ?
                <SettingsAccount /> :
                null }
              <div className="card">
                <div className="card-main">
                  <Faq>Frequently Asked Questions</Faq>
                  <br />
                  <Questions>Why enter endorsements?</Questions>
                  <Description>
                    Enter your own endorsements so your friends and community can learn from you.
                    {' '}
                    Help the people who share your values decide how to vote, so they aren&apos;t making hard choices alone.
                  </Description>
                  <Questions>How do I start entering my opinions?</Questions>
                  <Description>
                    Choose the election you have opinions about by clicking the &quot;Choose New Election&quot; button.
                    {' '}
                    If you have already chosen or opposed any candidates (or measures), you can click &quot;Edit&quot; under the election in the left column.
                  </Description>
                  <Questions>What does an endorsement look like as I am entering it?</Questions>
                  <img src={cordovaDot('../../../img/global/screens/endorsement-1422x354.png')} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Faq = styled.h3`
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin-top: 8px;
  margin-bottom: 4px;
  @media (max-width: 576px) {
    text-align: center;
  }
`;

const Questions = styled.p`
  font-size: 16px;
  font-weight: bold;
  font-style: italic;
  text-align: left;
  @media (max-width: 576px) {
    text-align: center;
  }
`;

const Description = styled.p`
  color: #A9A9A9;
  font-size: 16px;
  margin-top: 8px;
`;

export default VoterGuideListDashboard;
