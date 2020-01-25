import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import FriendInvitationOnboardingValuesList from '../Values/FriendInvitationOnboardingValuesList';

class FriendInvitationOnboardingValues extends Component {
  static propTypes = {
    nextSlide: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('FriendInvitationOnboardingValues');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <Wrapper>
        <FriendInvitationTopHeader className="FriendInvitationTopHeader">
          Follow values you care about.
        </FriendInvitationTopHeader>
        <FriendInvitationValuesHeader className="FriendInvitationValuesHeader">
          Choose from popular values:
        </FriendInvitationValuesHeader>
        <ValuesWrapper>
          <FriendInvitationOnboardingValuesList
            displayOnlyIssuesNotFollowedByVoter
          />
        </ValuesWrapper>
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
const FriendInvitationValuesHeader = styled.div`
`;

const ValuesWrapper = styled.div`
  margin: 0 !important;
`;

export default withTheme(withStyles(styles)(FriendInvitationOnboardingValues));
