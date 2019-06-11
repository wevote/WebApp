import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import AppActions from '../../actions/AppActions';
import FacebookActions from '../../actions/FacebookActions';

class FacebookSignIn extends Component {
  static propTypes = {
    toggleSignInModal: PropTypes.func,
    buttonText: PropTypes.string,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentWillUnmount () {
    // Close the Sign In Modal
    this.toggleSignInModalLocal();
  }

  onKeyDown = (event) => {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.didClickFacebookSignInButton();
    }
  }

  didClickFacebookSignInButton = () => {
    AppActions.unsetStoreSignInStartPath();
    FacebookActions.login();
  }

  toggleSignInModalLocal = () => {
    if (this.props.toggleSignInModal) {
      this.props.toggleSignInModal();
    }
  }

  render () {
    renderLog(__filename);
    const { classes, buttonText } = this.props;
    return (
      <Button
        variant="contained"
        classes={{ root: classes.fabRoot }}
        onClick={this.didClickFacebookSignInButton}
        onKeyDown={this.onKeyDown}
      >
        <span className="fab fa-facebook-square" />
        <ButtonText>{buttonText}</ButtonText>
      </Button>
    );
  }
}

const styles = theme => ({
  fabRoot: {
    fontSize: 20,
    width: 300,
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    background: '#3b5998',
    color: 'white',
    margin: '8px',
    '&:hover': {
      background: '#2d4373',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
    },
  },
});

const ButtonText = styled.span`
  margin-left: 8px;
  font-size: 18px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
  }
`;

export default withStyles(styles)(FacebookSignIn);
