import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FacebookStore from '../../stores/FacebookStore';
import LoadingWheel from '../LoadingWheel';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

export default class SettingsSubscriptionPlan extends Component {
  static propTypes = {
    samplePropName: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  };

  constructor (props) {
    super(props);
    this.state = {
      organization: {},
      organizationWeVoteId: '',
      voter: {},
      windowWidth: 0,
      mobileMode: false,
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount () {
    // console.log("SettingsSubscriptionPlan componentDidMount");
    this.onVoterStoreChange();
    this.organizationStoreListener = FacebookStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    this.handleResize();
    window.addEventListener('resize', this.handleResize);
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
    if (this.state.windowWidth !== nextState.windowWidth) {
      // console.log('this.state.voterIsSignedIn', this.state.voterIsSignedIn, ', nextState.voterIsSignedIn', nextState.voterIsSignedIn);
      return true;
    }
    if (this.state.mobileMode !== nextState.mobileMode) {
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
  }

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
  }

  handleResize () {
    this.setState({
      windowWidth: window.innerWidth,
    });

    if (window.innerWidth < 569) {
      this.setState({ mobileMode: true });
    } else if (window.innerWidth >= 569) {
      this.setState({ mobileMode: false });
    }
  }

  render () {
    renderLog(__filename);
    const { organization, organizationWeVoteId, voter, voterIsSignedIn, mobileMode } = this.state;
    if (!voter || !organizationWeVoteId) {
      return LoadingWheel;
    }

    if (voterIsSignedIn) {
      // console.log('SettingsSubscriptionPlan, Signed In.');
    }
    if (organization && organization.we_vote_custom_domain) {
      // console.log('SettingsSubscriptionPlan, Custom Domain: ', organization.we_vote_custom_domain);
    }

    let subscriptionPageHtmlContents = (<span />);

    if (mobileMode) {
      subscriptionPageHtmlContents = (
        <MobileWrapper className="d-block d-sm-none">
          <SectionCard>
            <SectionTitle>
              Payment
            </SectionTitle>
              <SectionParagraph>
                Card ending in: <strong>0223</strong> | Expires: <strong>02/23</strong> | Next bill: <strong>June 21, 2019</strong>
              </SectionParagraph>
          </SectionCard>
        </MobileWrapper>
      );
    } else {
      subscriptionPageHtmlContents = (
        <Card className="card">
          <CardMain className="card-main">
            <h1 className="h3">Subscription Plan</h1>
            <Seperator />
            <SectionCard>
              <SectionTitle>
                Payment
              </SectionTitle>
              <SectionParagraph>
                Card ending in: <strong>0223</strong> | Expires: <strong>02/23</strong> | Next bill: <strong>June 21, 2019</strong>
              </SectionParagraph>
            </SectionCard>
          </CardMain>
        </Card>
      );
    }

    return (
      <Wrapper>
        <Helmet title="Domain Settings" />
        {subscriptionPageHtmlContents}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  padding-top: 32px;
`;

const Card = styled.div`
`;

const CardMain = styled.div`
`;

const MobileWrapper = styled.div`
`;

const Seperator = styled.div`
  height: 1px;
  background: #ddd;
  width: 100%;
  margin: 16px 0;
`;

const SectionCard = styled.div`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
  width: 100%;
  border-radius: 3px;
  padding: 16px;
  @media (min-width: 569px) {
    border: 1px solid #ddd;
    box-shadow: none;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const SectionParagraph = styled.p`
  font-size: 14px;
  @media (min-width: 569px) {
    font-size: 14px;
  } 
`;
