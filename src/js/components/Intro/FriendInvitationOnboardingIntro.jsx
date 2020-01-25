import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
// import { cordovaDot } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

class FriendInvitationOnboardingIntro extends Component {
  static propTypes = {
    nextSlide: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('FriendInvitationOnboardingIntro');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <Wrapper>
        <FriendInvitationTopHeader className="FriendInvitationTopHeader">
          Invitation accepted!
        </FriendInvitationTopHeader>
        <FriendInvitationIntroHeader className="FriendInvitationIntroHeader">
          Get ready to vote faster.
        </FriendInvitationIntroHeader>
        <FriendInvitationListWrapper>
          <FriendInvitationListUl>
            <FriendInvitationListLi>See what&apos;s on your ballot</FriendInvitationListLi>
            <FriendInvitationListLi>See what your friends think</FriendInvitationListLi>
            <FriendInvitationListLi>Help your other friends get ready to vote</FriendInvitationListLi>
          </FriendInvitationListUl>
        </FriendInvitationListWrapper>
      </Wrapper>
    );
  }
}

const styles = theme => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 4px',
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
});

const Wrapper = styled.div`
`;

// Styled divs are not working in react-slick environment, so I put these styles in _intro-story.scss
const FriendInvitationTopHeader = styled.div`
  // font-size: 24px;
  // font-weight: 600;
  // padding-top: 32px;
  // padding-bottom: 16px;
  // @include breakpoints (mid-small) {
  //   font-size: 24px;
  // }
`;

// Styled divs are not working in react-slick environment, so I put these styles in _intro-story.scss
const FriendInvitationIntroHeader = styled.div`
  // color: ${({ theme }) => theme.colors.brandBlue};
  // font-size: 24px;
  // font-weight: 600;
  // padding-top: 32px;
  // padding-bottom: 16px;
  // @include breakpoints (mid-small) {
  //   font-size: 24px;
  // }
`;

const FriendInvitationListWrapper = styled.div`
  display: table;
`;

const FriendInvitationListUl = styled.ul`
  // border-color: red;
  // border-style: solid;
  // border-width: 1 px;
  margin: auto;
  max-width: 300px;
`;

const FriendInvitationListLi = styled.li`
  margin: 10px 0;
  text-align: left;
`;

export default withTheme(withStyles(styles)(FriendInvitationOnboardingIntro));
