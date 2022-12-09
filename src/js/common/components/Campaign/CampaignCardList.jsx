import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import CampaignCardForList from './CampaignCardForList';
import LoadMoreItemsManually from '../Widgets/LoadMoreItemsManually';

const STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY = 3;
const STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY_MOBILE = 2;
const NUMBER_OF_CAMPAIGNS_TO_ADD_WHEN_MORE_CLICKED = 6;

class CampaignCardList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      numberOfCampaignsToDisplay: STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY,
    };
  }

  componentDidMount () {
    // console.log('CampaignCardList componentDidMount');
    const { startingNumberOfCampaignsToDisplay } = this.props;
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    if (startingNumberOfCampaignsToDisplay && startingNumberOfCampaignsToDisplay > 0) {
      this.setState({
        numberOfCampaignsToDisplay: startingNumberOfCampaignsToDisplay,
      });
    } else if (isMobileScreenSize()) {
      // We deviate from pure Responsive because reducing the campaigns down to 2 for mobile eliminate retrieving an extra image
      this.setState({
        numberOfCampaignsToDisplay: STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY_MOBILE,
      });
    }
    this.onCampaignListChange();
  }

  componentDidUpdate (prevProps) { // prevProps, prevState, snapshot
    const { timeStampOfChange } = this.props;
    if (timeStampOfChange !== prevProps.timeStampOfChange) {
      this.onCampaignListChange();
    }
  }

  componentWillUnmount () {
    this.campaignSupporterStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onCampaignSupporterStoreChange () {
    // We need to instantiate CampaignSupporterStore before we call campaignListRetrieve so that store gets filled with data
  }

  onCampaignStoreChange () {
    // We need to instantiate CampaignStore before we call campaignListRetrieve so that store gets filled with data
  }

  onCampaignListChange () {
    const { incomingCampaignList } = this.props;
    const promotedCampaignListBySupporters = incomingCampaignList.sort(this.orderBySupportersCount);
    const campaignListFiltered = promotedCampaignListBySupporters.sort(this.orderByOrderInList);
    this.setState({
      campaignListFiltered,
    });
  }

  // Order by 1, 2, 3. Push 0's to the bottom in the same order.
  orderByOrderInList = (firstCampaign, secondCampaign) => (firstCampaign.order_in_list || Number.MAX_VALUE) - (secondCampaign.order_in_list || Number.MAX_VALUE);

  orderBySupportersCount = (firstCampaign, secondCampaign) => secondCampaign.supporters_count - firstCampaign.supporters_count;

  increaseNumberOfCampaignsToDisplay = () => {
    let { numberOfCampaignsToDisplay } = this.state;
    numberOfCampaignsToDisplay += NUMBER_OF_CAMPAIGNS_TO_ADD_WHEN_MORE_CLICKED;
    this.setState({
      numberOfCampaignsToDisplay,
    });
  }

  render () {
    renderLog('CampaignCardList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('CampaignCardList render');
    const { verticalListOn } = this.props;
    const { campaignListFiltered, numberOfCampaignsToDisplay } = this.state;

    if (!campaignListFiltered) {
      return null;
    }
    let numberOfCampaignsDisplayed = 0;
    return (
      <Wrapper>
        <ListWrapper verticalListOn={verticalListOn}>
          {campaignListFiltered.map((oneCampaign) => {
            // console.log('oneCampaign:', oneCampaign);
            // console.log('numberOfCampaignsDisplayed:', numberOfCampaignsDisplayed);
            if (numberOfCampaignsDisplayed >= numberOfCampaignsToDisplay) {
              return null;
            }
            numberOfCampaignsDisplayed += 1;
            // console.log('numberOfCampaignsDisplayed: ', numberOfCampaignsDisplayed);
            // console.log('numberOfCampaignsToDisplay: ', numberOfCampaignsToDisplay);
            return (
              <div key={`oneCampaignItem-${oneCampaign.campaignx_we_vote_id}`}>
                <CampaignCardForList
                  campaignXWeVoteId={oneCampaign.campaignx_we_vote_id}
                  limitCardWidth={verticalListOn}
                />
              </div>
            );
          })}
          <LoadMoreItemsManuallyWrapper>
            {!!(campaignListFiltered &&
                campaignListFiltered.length > 1 &&
                numberOfCampaignsToDisplay < campaignListFiltered.length) &&
            (
              <LoadMoreItemsManually
                loadMoreFunction={this.increaseNumberOfCampaignsToDisplay}
                uniqueExternalId="CampaignCardList"
              />
            )}
          </LoadMoreItemsManuallyWrapper>
        </ListWrapper>
        {/* {!numberOfCampaignsDisplayed && ( */}
        {/*  <DelayedLoad waitBeforeShow={2000}> */}
        {/*    <CampaignsNotAvailableToShow> */}
        {/*      We don&apos;t have any upcoming campaigns to show. Please try again later! */}
        {/*    </CampaignsNotAvailableToShow> */}
        {/*  </DelayedLoad> */}
        {/* )} */}
      </Wrapper>
    );
  }
}
CampaignCardList.propTypes = {
  incomingCampaignList: PropTypes.array,
  startingNumberOfCampaignsToDisplay: PropTypes.number,
  timeStampOfChange: PropTypes.number,
  verticalListOn: PropTypes.bool,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const ListWrapper = styled('div', {
  shouldForwardProp: (prop) => !['verticalListOn'].includes(prop),
})(({ verticalListOn }) => (`
  display: flex;
  ${verticalListOn ? 'flex-direction: row;' : 'flex-direction: column;'}
`));

const LoadMoreItemsManuallyWrapper = styled('div')`
  margin-bottom: 0;
  @media print{
    display: none;
  }
`;

const Wrapper = styled('div')`
`;

export default withStyles(styles)(CampaignCardList);
