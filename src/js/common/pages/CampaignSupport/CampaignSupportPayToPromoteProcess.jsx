import loadable from '@loadable/component';
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import CampaignActions from '../../actions/CampaignActions';
import { PageWrapper } from '../../components/Style/stepDisplayStyles';
import LoadingWheelComp from '../../components/Widgets/LoadingWheelComp';
import DonateStore from '../../stores/DonateStore';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import VoterStore from '../../../stores/VoterStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import initializejQuery from '../../utils/initializejQuery';
import {
  payToPromoteProcessStyles,
  SkipForNowButtonPanel,
  SkipForNowButtonWrapper,
} from '../../components/Style/CampaignSupportStyles';

const PayToPromoteProcess = React.lazy(() => import(/* webpackChunkName: 'PayToPromoteProcess' */ '../../components/CampaignSupport/PayToPromoteProcess'));
const VoterFirstRetrieveController = loadable(() => import(/* webpackChunkName: 'VoterFirstRetrieveController' */ '../../components/Settings/VoterFirstRetrieveController'));

class CampaignSupportPayToPromoteProcess extends Component {
  constructor (props) {
    super(props);

    this.state = {
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      loaded: false,
      preDonation: true,
      voterFirstName: '',
    };
  }

  componentDidMount () {
    initializejQuery(() => {
      // console.log('CampaignSupportPayToPromoteProcess, componentDidMount after init jQuery');
      const { setShowHeaderFooter } = this.props;
      setShowHeaderFooter(false);
      this.setState({ loaded: true });
      this.onAppObservableStoreChange();
      this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
      this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
      this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
      // dumpCookies();
      this.onVoterStoreChange();
      this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
      const { match: { params } } = this.props;
      const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
      // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
      const {
        campaignSEOFriendlyPath,
        campaignTitle,
        campaignXWeVoteId,
      } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
      if (!campaignXWeVoteId) {
        // console.log('CampaignSupportPayToPromoteProcess mount could not find campaignXWeVoteId from incoming variables');
        if (campaignSEOFriendlyPathFromParams) {
          CampaignActions.campaignRetrieveBySEOFriendlyPath(campaignSEOFriendlyPathFromParams);
        } else if (campaignXWeVoteIdFromParams) {
          CampaignActions.campaignRetrieve(campaignXWeVoteIdFromParams);
        } else {
          console.log('Cannot retrieve campaign: missing campaignSEOFriendlyPathFromParams and campaignXWeVoteIdFromParams');
        }
      } else {
        this.setState({
          campaignTitle,
        });
        if (campaignSEOFriendlyPath) {
          this.setState({
            campaignSEOFriendlyPath,
          });
        } else if (campaignSEOFriendlyPathFromParams) {
          this.setState({
            campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
          });
        }
        if (campaignXWeVoteId) {
          this.setState({
            campaignXWeVoteId,
          });
        } else if (campaignXWeVoteIdFromParams) {
          this.setState({
            campaignXWeVoteId: campaignXWeVoteIdFromParams,
          });
        }
        // Take the "calculated" identifiers and retrieve if missing
        retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
      }
    });
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  onCampaignStoreChange () {
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignTitle,
    });
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
    } else if (campaignSEOFriendlyPathFromParams) {
      this.setState({
        campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
      });
    }
    if (campaignXWeVoteId) {
      this.setState({
        campaignXWeVoteId,
      });
    } else if (campaignXWeVoteIdFromParams) {
      this.setState({
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
      });
    }
  }

  onDonateStoreChange () {
    // console.log('onDonateStore DonateStore:', DonateStore.getAll());
    if (DonateStore.donationSuccess()  && DonateStore.donationResponseReceived()) {
      console.log('onDonateStoreChange successful donation detected');
      this.setState({
        preDonation: false,
      });
    }
  }

  static getProps () {
    return {};
  }

  onVoterStoreChange () {
    const voterFirstName = VoterStore.getVoterFirstName();
    this.setState({
      voterFirstName,
    });
  }

  goToIWillShare = () => {
    const pathForNextStep = `${this.getCampaignXBasePath()}share-campaign`;
    historyPush(pathForNextStep);
  }

  getCampaignXBasePath = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}/`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}/`;
    }
    return campaignBasePath;
  }

  render () {
    renderLog('CampaignSupportPayToPromoteProcess');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      campaignTitle, chosenWebsiteName,
      campaignXWeVoteId, loaded, preDonation, voterFirstName,
    } = this.state;
    const htmlTitle = `Contribution to support ${campaignTitle} - ${chosenWebsiteName}`;
    if (campaignXWeVoteId === undefined || campaignXWeVoteId === '') {
      // console.error('Must have a campaignXWeVoteId defined in CampaignSupportPayToPromoteProcess to make a "chip in"');
      return (
        <LoadingWheelComp />
      );
    }
    if (!loaded) {
      return (
        <LoadingWheelComp message="Waiting..." />
      );
    }
    let thankYouText = preDonation ?
      'Thank you for helping this campaign reach more voters' :
      `Your Chip In donation to "${campaignTitle}" is on its way!  Thank you`;
    thankYouText += voterFirstName ? `, ${voterFirstName}.` : '.';

    return (
      <div>
        <Helmet>
          <title>{htmlTitle}</title>
          <meta name="robots" content="noindex" data-react-helmet="true" />
        </Helmet>
        <PageWrapper>
          <IntroductionMessageSection>
            <ContentTitle>
              {thankYouText}
            </ContentTitle>
          </IntroductionMessageSection>
          <Suspense fallback={<span>&nbsp;</span>}>
            <PayToPromoteProcess
              campaignXWeVoteId={campaignXWeVoteId}
            />
          </Suspense>
          <SkipForNowButtonWrapper>
            <SkipForNowButtonPanel show={preDonation}>
              <Button
                classes={{ root: classes.buttonSimpleLink }}
                color="primary"
                id="skipPayToPromote"
                onClick={this.goToIWillShare}
              >
                Sorry, I can&apos;t chip in right now
              </Button>
            </SkipForNowButtonPanel>
          </SkipForNowButtonWrapper>
        </PageWrapper>
        <Suspense fallback={<span>&nbsp;</span>}>
          <VoterFirstRetrieveController />
        </Suspense>
      </div>
    );
  }
}
CampaignSupportPayToPromoteProcess.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};

const ContentTitle = styled('h1')(({ theme }) => (`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  ${theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`));

const IntroductionMessageSection = styled('div')(({ theme }) => (`
  padding: 1em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
  ${theme.breakpoints.down('md')} {
    padding: 0 1em;
  }
`));

export default withStyles(payToPromoteProcessStyles)(CampaignSupportPayToPromoteProcess);
