import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { OuterWrapper } from '../../components/Style/stepDisplayStyles';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import CompleteYourProfile from '../../components/Settings/CompleteYourProfile';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';


class CompleteYourProfileMobile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignSEOFriendlyPath: '',
      campaignXWeVoteId: '',
      pathToUseWhenProfileComplete: '',
    };
  }

  componentDidMount () {
    // console.log('CampaignDetailsPage componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    const { match: { params }, setShowHeaderFooter } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = params;
    const { becomeMember, createNewsItem, startCampaign, supportCampaign } = this.props;
    let pathToUseWhenProfileComplete = '';
    if (becomeMember) {
      pathToUseWhenProfileComplete = '/membership';
    } else if (startCampaign) {
      pathToUseWhenProfileComplete = '/profile/started';
    } else if (createNewsItem && campaignSEOFriendlyPath) {
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/add-update`;
    } else if (createNewsItem && campaignXWeVoteId) {
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/add-update`;
    } else if (supportCampaign && campaignSEOFriendlyPath) {
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
    } else if (supportCampaign && campaignXWeVoteId) {
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    // console.log('componentDidMount campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    this.setState({
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
      pathToUseWhenProfileComplete,
    });
    setShowHeaderFooter(false);
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    const { setShowHeaderFooter } = this.props;
    setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  cancelFunction = () => {
    // console.log('CompleteYourProfileMobile cancelFunction');
    const { becomeMember, createNewsItem, startCampaign, supportCampaign } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    if (becomeMember) {
      historyPush('/start-a-campaign-preview');
    } else if (startCampaign) {
      historyPush('/start-a-campaign-preview');
    } else if (createNewsItem && campaignSEOFriendlyPath) {
      historyPush(`/c/${campaignSEOFriendlyPath}/updates`);
    } else if (createNewsItem && campaignXWeVoteId) {
      historyPush(`/id/${campaignXWeVoteId}/updates`);
    } else if (supportCampaign && campaignSEOFriendlyPath) {
      historyPush(`/c/${campaignSEOFriendlyPath}`);
    } else if (supportCampaign && campaignXWeVoteId) {
      historyPush(`/id/${campaignXWeVoteId}`);
    }
  };

  functionToUseWhenProfileComplete = () => {
    const { pathToUseWhenProfileComplete } = this.state;
    historyPush(pathToUseWhenProfileComplete);
  }

  render () {
    renderLog('CompleteYourProfileMobile');  // Set LOG_RENDER_EVENTS to log all renders
    const { becomeMember, classes, createNewsItem, startCampaign, supportCampaign } = this.props;
    const { campaignXWeVoteId, chosenWebsiteName } = this.state;
    let completeProfileTitle = <span>&nbsp;</span>;
    let htmlPageTitle = `Complete Your Profile - ${chosenWebsiteName}`;
    if (becomeMember) {
      completeProfileTitle = <span>becomeMember</span>;
    } else if (createNewsItem) {
      completeProfileTitle = <span>Complete your profile</span>;
    } else if (startCampaign) {
      completeProfileTitle = <span>Complete your profile</span>;
    } else if (supportCampaign) {
      completeProfileTitle = <span>Complete your support</span>;
      htmlPageTitle = `Complete Your Support - ${chosenWebsiteName}`;
    }
    return (
      <div>
        <Helmet title={htmlPageTitle} />
        <PageWrapperComplete>
          <OuterWrapper>
            <InnerWrapper>
              <ContentTitle>
                {completeProfileTitle}
                <IconButton
                  aria-label="Close"
                  classes={{ root: classes.closeButton }}
                  onClick={() => { this.cancelFunction(); }}
                  id="completeYourProfileMobileClose"
                  size="large"
                >
                  <Close />
                </IconButton>
              </ContentTitle>
              <CompleteYourProfile
                becomeMember={becomeMember}
                campaignXWeVoteId={campaignXWeVoteId}
                functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
                createNewsItem={createNewsItem}
                startCampaign={startCampaign}
                supportCampaign={supportCampaign}
              />
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapperComplete>
      </div>
    );
  }
}
CompleteYourProfileMobile.propTypes = {
  classes: PropTypes.object,
  becomeMember: PropTypes.bool,
  createNewsItem: PropTypes.bool,
  match: PropTypes.object,
  startCampaign: PropTypes.bool,
  supportCampaign: PropTypes.bool,
  setShowHeaderFooter: PropTypes.func,
};

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

const ContentTitle = styled('h1')(({ theme }) => (`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 15px;
  ${theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`));

const InnerWrapper = styled('div')`
`;

const PageWrapperComplete = styled('div')`
  margin: 0 auto;
  max-width: 480px;
`;

export default withStyles(styles)(CompleteYourProfileMobile);
