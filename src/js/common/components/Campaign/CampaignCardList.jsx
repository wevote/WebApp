import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { CampaignsNotAvailableToShow, ListWrapper, LoadMoreItemsManuallyWrapper } from '../Style/CampaignCardStyles';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import CampaignCardForList from './CampaignCardForList';
import LoadMoreItemsManually from '../Widgets/LoadMoreItemsManually';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../Widgets/DelayedLoad'));

const STARTING_NUMBER_TO_DISPLAY = 7;
const STARTING_NUMBER_TO_DISPLAY_MOBILE = 5;
const NUMBER_TO_ADD_WHEN_MORE_CLICKED = 10;

class CampaignCardList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignList: [],
      numberToDisplay: STARTING_NUMBER_TO_DISPLAY,
    };
  }

  componentDidMount () {
    // console.log('CampaignCardList componentDidMount');
    const { startingNumberToDisplay } = this.props;
    if (startingNumberToDisplay && startingNumberToDisplay > 0) {
      this.setState({
        numberToDisplay: startingNumberToDisplay,
      });
    } else if (isMobileScreenSize()) {
      // We deviate from pure responsive in order to request fewer images on initial load
      this.setState({
        numberToDisplay: STARTING_NUMBER_TO_DISPLAY_MOBILE,
      });
    }
    this.onCampaignListChange();
  }

  componentDidUpdate (prevProps) { // prevProps, prevState, snapshot
    const { timeStampOfChange } = this.props;
    if (timeStampOfChange && timeStampOfChange !== prevProps.timeStampOfChange) {
      this.onCampaignListChange();
    }
  }

  onCampaignListChange () {
    const { incomingCampaignList } = this.props;
    if (incomingCampaignList) {
      this.setState({
        campaignList: incomingCampaignList,
      });
    } else {
      this.setState({
        campaignList: [],
      });
    }
  }

  increaseNumberToDisplay = () => {
    let { numberToDisplay } = this.state;
    numberToDisplay += NUMBER_TO_ADD_WHEN_MORE_CLICKED;
    this.setState({
      numberToDisplay,
    });
  }

  render () {
    renderLog('CampaignCardList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('CampaignCardList render');
    const { verticalListOn } = this.props;
    const { campaignList, numberToDisplay } = this.state;

    if (!campaignList) {
      return null;
    }
    let numberDisplayed = 0;
    return (
      <Wrapper>
        <ListWrapper verticalListOn={verticalListOn}>
          {campaignList.map((oneCampaign) => {
            if (numberDisplayed >= numberToDisplay) {
              return null;
            }
            numberDisplayed += 1;
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
            {!!(campaignList &&
                campaignList.length > 1 &&
                numberToDisplay < campaignList.length) &&
            (
              <LoadMoreItemsManually
                loadMoreFunction={this.increaseNumberToDisplay}
                uniqueExternalId="CampaignCardList"
              />
            )}
          </LoadMoreItemsManuallyWrapper>
        </ListWrapper>
        {!numberDisplayed && (
          <Suspense fallback={<></>}>
            <DelayedLoad showLoadingText waitBeforeShow={3000}>
              <CampaignsNotAvailableToShow>
                No campaigns match.
              </CampaignsNotAvailableToShow>
            </DelayedLoad>
          </Suspense>
        )}
      </Wrapper>
    );
  }
}
CampaignCardList.propTypes = {
  incomingCampaignList: PropTypes.array,
  startingNumberToDisplay: PropTypes.number,
  timeStampOfChange: PropTypes.number,
  verticalListOn: PropTypes.bool,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const Wrapper = styled('div')`
  min-height: 30px;
`;

export default withStyles(styles)(CampaignCardList);
