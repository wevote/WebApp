import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DesignTokenColors from '../../Style/DesignTokenColors';
import LikeDislikeIcon from './HeartFavoriteToggleIcon';

const ContainerLikeDislike = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  border-radius: 20px;
  padding-left: 8px;
  padding-right: 8px;
  border: 1px solid ${DesignTokenColors.neutralUI100};
  background: ${DesignTokenColors.whiteUI};
`;

const LikeContainer = styled.div`
  display: flex;
  padding-right: 8px;
  border-right: 1px solid ${DesignTokenColors.neutralUI100};  
  cursor: pointer;
`;

const DislikeContainer = styled.div`
  display: flex;
  padding-left: 8px;
  cursor: pointer;
`;

class Like extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      liked: true,
      disLiked: false,
      likeActive: 'like',
      disLikeActive: 'dislike',
      likeCounter: 12345,
      dislikeCounter: 902,
    };
  }

  incrementLike = (plus) => {
    if (plus === '+') {
      this.setState((prevState) => ({
        likeCounter: prevState.likeCounter + 1,
      }));
    } else {
      this.setState((prevState) => ({
        likeCounter: prevState.likeCounter - 1,
      }));
    }
  };

  dicrementLike = (minus) => {
    if (minus === '-') {
      this.setState((prevState) => ({
        dislikeCounter: prevState.dislikeCounter + 1,
      }));
    } else {
      this.setState((prevState) => ({ dislikeCounter: prevState.dislikeCounter - 1 }));
    }
  };

  handleClick = (a) => {
    if (a === 'like') {
      this.setState((prevState) => ({
        likeActive: prevState.likeActive === 'like' ? 'liked' : 'like',
        disLikeActive: 'dislike',
        liked: true,
        disLiked: false,
      }), () => {
        this.incrementLike(this.state.likeActive === 'like' ? '-' : '+');
      });
    }

    if (a === 'dislike') {
      this.setState((prevState) => ({
        disLikeActive: prevState.disLikeActive === 'dislike' ? 'dislikePressed' : 'dislike',
        likeActive: 'like',
        liked: false,
        disLiked: true,
      }), () => {
        this.dicrementLike(this.state.disLikeActive === 'dislike' ? '+' : '-');
      });
    }
  };

  render () {
    return (

      <ContainerLikeDislike>
        <LikeContainer onClick={() => { this.handleClick('like'); }}>
          <LikeDislikeIcon
            state={this.state.likeActive}
          />

          {this.state.liked && this.state.likeCounter}
        </LikeContainer>

        <DislikeContainer onClick={() => this.handleClick('dislike')} handleData={this.dicrementLike}>
          <LikeDislikeIcon
            state={this.state.disLikeActive}
          />

          {this.state.disLiked && this.state.dislikeCounter}
        </DislikeContainer>

      </ContainerLikeDislike>
    );
  }
}

export default Like;

Like.propTypes = {
  counter: PropTypes.number.isRequired,
};

