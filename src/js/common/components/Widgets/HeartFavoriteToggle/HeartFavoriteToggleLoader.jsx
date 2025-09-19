import React, { Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CampaignActions from '../../../actions/CampaignActions';
import VoterGuideActions from '../../../../actions/VoterGuideActions';
import CampaignStore from '../../../stores/CampaignStore';
import { renderLog } from '../../../utils/logging';
import apiCalming from '../../../utils/apiCalming';

const HeartFavoriteToggleLive = React.lazy(() => import(/* webpackChunkName: 'HeartFavoriteToggleLive' */ './HeartFavoriteToggleLive'));
const HeartFavoriteToggleBase = React.lazy(() => import(/* webpackChunkName: 'HeartFavoriteToggleBase' */ './HeartFavoriteToggleBase'));

const HeartFavoriteToggleLoader = ({ campaignXWeVoteId, organizationWeVoteId }) => {
  renderLog('HeartFavoriteToggleLoader');  // Set LOG_RENDER_EVENTS to log all renders

  // console.log('HeartFavoriteToggleLoader render campaignXWeVoteId:', campaignXWeVoteId);

  useEffect(() => {
    if (campaignXWeVoteId) {
      // Check to see if the campaign is in CampaignStore. If not, then fetch it.
      // We need to do this because the HeartFavoriteToggle component needs the campaign data to determine if the voter has already supported or opposed the campaign.
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      if (!campaignX || !campaignX.we_vote_id) {
        if (apiCalming(`campaignRetrieve-${campaignXWeVoteId}`, 2000)) {
          CampaignActions.campaignRetrieve(campaignXWeVoteId);
        }
      }
    }
  }, [campaignXWeVoteId]);

  useEffect(() => {
    // Not the most efficient, but allows us to put this component anywhere
    if (organizationWeVoteId && apiCalming(`voterGuideFollowersRetrieve-${organizationWeVoteId}`, 60000)) {
      // We need the updated count of followers and dislikers for the HeartFavoriteToggle
      VoterGuideActions.voterGuideFollowersRetrieve(organizationWeVoteId, 10);
    }
  }, [organizationWeVoteId]);

  return (
    <HeartFavoriteToggleLoaderContainer>
      <Suspense fallback={<></>}>
        <Suspense fallback={<HeartFavoriteToggleBase />}>
          <HeartFavoriteToggleLive campaignXWeVoteId={campaignXWeVoteId} organizationWeVoteId={organizationWeVoteId} />
        </Suspense>
      </Suspense>
    </HeartFavoriteToggleLoaderContainer>
  );
};
HeartFavoriteToggleLoader.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  organizationWeVoteId: PropTypes.string,
};

const HeartFavoriteToggleLoaderContainer  = styled('div')`
`;

export default HeartFavoriteToggleLoader;
