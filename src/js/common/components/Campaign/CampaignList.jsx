import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { renderLog } from '../../utils/logging';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';

const CampaignCardList = React.lazy(() => import(/* webpackChunkName: 'CampaignCardList' */ './CampaignCardList'));
const FirstCampaignListController = React.lazy(() => import(/* webpackChunkName: 'FirstCampaignListController' */ './FirstCampaignListController'));

class CampaignList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      timeStampOfChange: 0,
    };
  }

  componentDidMount () {
    // console.log('CampaignList componentDidMount');
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onCampaignStoreChange();
  }

  componentWillUnmount () {
    this.campaignSupporterStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onCampaignSupporterStoreChange () {
    // We need to instantiate CampaignSupporterStore before we call campaignListRetrieve so that store gets filled with data
  }

  onCampaignStoreChange () {
    const promotedCampaignList = CampaignStore.getPromotedCampaignXDicts();
    this.setState({
      promotedCampaignList,
      timeStampOfChange: Date.now(),
    });
  }

  render () {
    renderLog('CampaignList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('CampaignList render');
    const { hideTitle, titleTextIfCampaigns } = this.props;
    const { promotedCampaignList, timeStampOfChange } = this.state;

    if (!promotedCampaignList) {
      return null;
    }
    return (
      <CampaignListWrapper>
        {!!(!hideTitle &&
            titleTextIfCampaigns &&
            titleTextIfCampaigns.length &&
            promotedCampaignList &&
            promotedCampaignList.length > 1) &&
        (
          <WhatIsHappeningTitle>
            {titleTextIfCampaigns}
          </WhatIsHappeningTitle>
        )}
        <CampaignCardList
          incomingCampaignList={promotedCampaignList}
          timeStampOfChange={timeStampOfChange}
          verticalListOn
        />

        <Suspense fallback={<span>&nbsp;</span>}>
          <FirstCampaignListController />
        </Suspense>
      </CampaignListWrapper>
    );
  }
}
CampaignList.propTypes = {
  hideTitle: PropTypes.bool,
  titleTextIfCampaigns: PropTypes.string,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const CampaignListWrapper = styled('div')`
`;

const WhatIsHappeningTitle = styled('h2')`
  font-size: 22px;
  text-align: left;
`;

export default withStyles(styles)(CampaignList);
