import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { renderLog } from '../../../utils/logging';

const HeartFavoriteToggleLive = React.lazy(() => import(/* webpackChunkName: 'HeartFavoriteToggleLive' */ './HeartFavoriteToggleLive'));
const HeartFavoriteToggleBase = React.lazy(() => import(/* webpackChunkName: 'HeartFavoriteToggleBase' */ './HeartFavoriteToggleBase'));

class HeartFavoriteToggleLoader extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    renderLog('HeartFavoriteToggleLoader');  // Set LOG_RENDER_EVENTS to log all renders

    const { campaignXWeVoteId } = this.props;
    // console.log('HeartFavoriteToggleLoader render campaignXWeVoteId:', campaignXWeVoteId);
    return (
      <HeartFavoriteToggleLoaderContainer>
        <Suspense fallback={<></>}>
          <Suspense fallback={<HeartFavoriteToggleBase />}>
            <HeartFavoriteToggleLive campaignXWeVoteId={campaignXWeVoteId} />
          </Suspense>
        </Suspense>
      </HeartFavoriteToggleLoaderContainer>
    );
  }
}

HeartFavoriteToggleLoader.propTypes = {
  campaignXWeVoteId: PropTypes.string,
};

const HeartFavoriteToggleLoaderContainer  = styled('div')`
`;

export default HeartFavoriteToggleLoader;
