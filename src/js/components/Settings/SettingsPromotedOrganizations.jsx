import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import { renderLog } from '../../common/utils/logging';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ '../../common/components/SignIn/SignInOptionsPanel'));

export default class SettingsPromotedOrganizations extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organization: {},
      organizationWeVoteId: '',
      voter: {},
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    // console.log("SettingsPromotedOrganizations componentDidMount");
    this.onVoterStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('this.state.organizationWeVoteId', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId', nextState.organizationWeVoteId);
      return true;
    }
    if (this.state.voterIsSignedIn !== nextState.voterIsSignedIn) {
      // console.log('this.state.voterIsSignedIn', this.state.voterIsSignedIn, ', nextState.voterIsSignedIn', nextState.voterIsSignedIn);
      return true;
    }

    const priorOrganization = this.state.organization;
    const nextOrganization = nextState.organization;

    const priorWeVoteCustomDomain = priorOrganization.we_vote_custom_domain || '';
    const nextWeVoteCustomDomain = nextOrganization.we_vote_custom_domain || '';

    if (priorWeVoteCustomDomain !== nextWeVoteCustomDomain) {
      // console.log('priorWeVoteCustomDomain', priorWeVoteCustomDomain, ', nextWeVoteCustomDomain', nextWeVoteCustomDomain);
      return true;
    }
    // console.log('shouldComponentUpdate false');
    return false;
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange = () => {
    const { organizationWeVoteId } = this.state;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
    });
  };

  onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    const organizationWeVoteId = voter.linked_organization_we_vote_id;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
      organizationWeVoteId,
      voter,
      voterIsSignedIn,
    });
  };

  render () {
    renderLog('SettingsPromotedOrganizations');  // Set LOG_RENDER_EVENTS to log all renders
    const { organization, organizationWeVoteId, voter, voterIsSignedIn } = this.state;
    if (!voter || !organizationWeVoteId) {
      return LoadingWheel;
    } else if (!voterIsSignedIn) {
      // console.log('voterIsSignedIn is false');
      return (
        <Suspense fallback={<></>}>
          <DelayedLoad waitBeforeShow={1000}>
            <SignInOptionsPanel />
          </DelayedLoad>
        </Suspense>
      );
    }

    if (organization && organization.we_vote_custom_domain) {
      // console.log('SettingsPromotedOrganizations, Custom Domain: ', organization.we_vote_custom_domain);
    }
    return (
      <Wrapper>
        <Helmet title="Domain Settings" />
        <Card className="card">
          <CardMain className="card-main">
            <h1 className="h3">Promoted Organizations & Public Figures</h1>
            Add src/js/components/Settings/SettingsPromotedOrganizations code here.
          </CardMain>
        </Card>
      </Wrapper>
    );
  }
}
SettingsPromotedOrganizations.propTypes = {
  samplePropName: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
};

const Wrapper = styled('div')`
`;

const Card = styled('div')`
`;

const CardMain = styled('div')`
`;
