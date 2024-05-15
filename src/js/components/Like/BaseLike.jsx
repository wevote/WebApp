import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import LikeDislikeIcon from './LikeDislikeIcon';

const ContainerLikeDislike = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // width: 135px;
  height: 32px;
  border-radius: 20px;
  padding-left: 8px;
  padding-right: 8px;

  border: 1px solid ${DesignTokenColors.neutralUI100};
  background: ${DesignTokenColors.whiteUI};


  // &:focus {
  //   outline: 2px solid ${DesignTokenColors.primary} !important;
  //   outline-offset: 2px;
  // }

  // /* Hover state */
  // &:hover {
  //   background-color: ${DesignTokenColors.primaryHover};
  // }
`;

const LikeContainer = styled.div`
  display: flex;
  padding-right: 8px;
  border-right: 1px solid ${DesignTokenColors.neutralUI100};  
`;

const DislikeContainer = styled.div`
  display: flex;
  padding-left: 8px;
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
    this.state.liked = true;
    this.state.disLiked = false;
    console.log(' this.state.likeActive  this.state.disLikeActive!!!', this.state.likeActive, this.state.disLikeActive);

    if (plus === '+') {
      this.setState((prevState) => ({
        likeCounter: prevState.likeCounter + 1,
        likeActive: 'likePressed',
        // disLikeActive: 'dislike',
      }));

      console.log('plus like', this.state.likeActive, this.state.disLikeActive);
    } else {
      this.setState((prevState) => ({
        likeCounter: prevState.likeCounter - 1,
        likeActive: 'like',
      }));
    }
  };

  dicrementLike = (minus) => {
    this.state.liked = false;
    this.state.disLiked = true;

    console.log('minus like!', this.state.likeActive);
    if (minus === '-') {
      this.setState((prevState) => ({
        dislikeCounter: prevState.dislikeCounter + 1,
        disLikeActive: 'dislikePressed',
        likeActive: 'like',
      }));
      console.log('minus like', this.state.likeActive, this.state.disLikeActive);
    } else {
      this.setState((prevState) => ({ dislikeCounter: prevState.dislikeCounter - 1 }));
    }
  };

  render () {
    return (

      <ContainerLikeDislike>

        <LikeContainer>
          <LikeDislikeIcon
            iconType={this.state.likeActive}
            handleData={this.incrementLike}
          />

          {this.state.liked && this.state.likeCounter}

        </LikeContainer>


        <DislikeContainer>

          <LikeDislikeIcon
            iconType={this.state.disLikeActive}
            handleData={this.dicrementLike}
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
  // likeCounter: PropTypes.number.isRequired,
  // secondary: PropTypes.bool,
  // size: PropTypes.oneOf(['small', 'medium', 'large']),
  // label: PropTypes.string.isRequired,
  // onClick: PropTypes.func,
};

// Button.defaultProps = {
//   primary: false,
//   size: 'medium',
//   onClick: undefined,
// };
