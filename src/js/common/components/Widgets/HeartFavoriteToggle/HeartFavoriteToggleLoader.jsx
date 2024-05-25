import React, { Suspense } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import PropTypes from "prop-types";

const HeartFavoriteToggleLive = React.lazy(() => import(/* webpackChunkName: 'HeartFavoriteToggleLive' */ './HeartFavoriteToggleLive'));
const HeartFavoriteToggleBase = React.lazy(() => import(/* webpackChunkName: 'HeartFavoriteToggleBase' */ './HeartFavoriteToggleBase'));

class HeartFavoriteToggleLoader extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      likeActive: 'like',
      disLikeActive: 'dislike',
      likeCounter: 12345,
      dislikeCounter: 902,
    };
  }

  render () {
    const { campaignXWeVoteId } = this.props;
    return (
      <HeartFavoriteToggleLoaderContainer>
        <Suspense fallback={(
          <HeartFavoriteToggleBase
            campaignXOpposersCount={0}
            campaignXSupportersCount={0}
            voterOpposes={false}
            voterSupports={false}
          />
        )}
        >
          <HeartFavoriteToggleLive campaignXWeVoteId={campaignXWeVoteId} />
        </Suspense>
      </HeartFavoriteToggleLoaderContainer>
    );
  }
}

HeartFavoriteToggleLoader.propTypes = {
  campaignXWeVoteId: PropTypes.string,
};

const HeartFavoriteToggleLoaderContainer = styled.div`
`;

export default HeartFavoriteToggleLoader;
