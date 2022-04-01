import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { renderLog } from '../../common/utils/logging';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const SettingsAccount = React.lazy(() => import(/* webpackChunkName: 'SettingsAccount' */ './SettingsAccount'));


class SeeTheseSettingsInAction extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organizationWeVoteId: '',
      voter: {},
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    // console.log('SeeTheseSettingsInAction componentDidMount');
    this.onVoterStoreChange();
    this.onOrganizationStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange = () => {
    const { organizationWeVoteId } = this.state;
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const organizationChosenSubdomain = organization.chosen_subdomain_string || '';
      const organizationChosenDomainName = organization.chosen_domain_string || '';
      this.setState({
        organizationChosenSubdomain,
        organizationChosenDomainName,
      });
    }
  };

  onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      voter,
      voterIsSignedIn,
    });
    const organizationWeVoteId = voter.linked_organization_we_vote_id;
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const organizationChosenSubdomain = organization.chosen_subdomain_string || '';
      const organizationChosenDomainName = organization.chosen_domain_string || '';
      this.setState({
        organizationChosenSubdomain,
        organizationChosenDomainName,
        organizationWeVoteId,
      });
    }
  };

  render () {
    renderLog('SeeTheseSettingsInAction');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      organizationWeVoteId, voter, voterIsSignedIn,
      organizationChosenDomainName, organizationChosenSubdomain,
    } = this.state;
    if (!voterIsSignedIn) {
      // console.log('voterIsSignedIn is false');
      return (
        <Suspense fallback={<></>}>
          <SettingsAccount />
        </Suspense>
      );
    } else if (!voter || !organizationWeVoteId) {
      return null;
    }

    return (
      <div>
        {organizationChosenSubdomain || organizationChosenDomainName ? (
          <LinkToDomainRow>
            To see the changes you make on this page, please visit:
            {' '}
            {organizationChosenSubdomain && (
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="organizationChosenSubdomainSeeTheseSettingsInAction"
                  url={`https://${organizationChosenSubdomain}.WeVote.US`}
                  target="_blank"
                  body={(<span>{`https://${organizationChosenSubdomain}.WeVote.US`}</span>)}
                />
              </Suspense>
            )}
            {' '}
            {organizationChosenDomainName && (
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute="organizationChosenDomainNameSeeTheseSettingsInAction"
                  url={`https://${organizationChosenDomainName}`}
                  target="_blank"
                  body={(<span>{`https://${organizationChosenDomainName}`}</span>)}
                />
              </Suspense>
            )}
          </LinkToDomainRow>
        ) : (
          <LinkToDomainRow>
            To see these settings in action, enter a subdomain or domain name on the
            {' '}
            <Link to="/settings/domain">
              <strong>
                Your Settings &gt; Domain
              </strong>
            </Link>
            {' '}
            page.
          </LinkToDomainRow>
        )}
      </div>
    );
  }
}

const styles = () => ({
  formControl: {
    width: '100%',
  },
  textField: {
    height: 45,
  },
  button: {
    marginRight: 8,
  },
  goldButton: {
    background: 'linear-gradient(70deg, rgba(219,179,86,1) 14%, rgba(162,124,33,1) 94%)',
    color: 'white',
  },
});

const LinkToDomainRow = styled('div')`
  padding: 0;
`;

export default withStyles(styles)(SeeTheseSettingsInAction);
