import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Close} from '@material-ui/icons';import { Dialog, DialogContent, IconButton } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

class AdviserIntroModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    pathname: PropTypes.string,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      pathname: '',
    };
  }

  componentDidMount () {
    // this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    // FriendActions.currentFriends();

    this.setState({
      pathname: this.props.pathname,
    });
  }

  componentWillUnmount () {
    // this.friendStoreListener.remove();
  }

  // onFriendStoreChange () {
  //   const { currentFriendsList } = this.state;
  //   if (currentFriendsList.length !== FriendStore.currentFriends().length) {
  //     this.setState({ currentFriendsList: FriendStore.currentFriends() });
  //   }
  // }

  closeThisModal = () => {
    this.props.toggleFunction(this.state.pathname);
  }

  render () {
    renderLog('AdviserIntroModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(this.state.pathname); }}
      >
        <ModalTitleArea>
          <div>
            <Title>
              Choose Your First Adviser
            </Title>
          </div>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={this.closeThisModal}
            id="closeAdviserIntroModal"
          >
            <Close />
          </IconButton>
        </ModalTitleArea>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <div className="full-width">
            <ExplanationText>
              We take what the people you trust think, and calculate your personalized score for each candidate.
            </ExplanationText>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
const styles = () => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 576px)': {
      maxWidth: '600px',
      width: '90%',
      height: 'fit-content',
      margin: '0 auto',
      minWidth: 0,
      minHeight: 0,
      transitionDuration: '.25s',
    },
    minWidth: '100%',
    maxWidth: '100%',
    width: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    height: '100%',
    margin: '0 auto',
  },
  dialogContent: {
    padding: '0 12px 24px 24px',
    background: 'white',
    display: 'flex',
    justifyContent: 'center',
  },
  closeButton: {
    marginLeft: 'auto',
  },
});

/* eslint no-nested-ternary: ["off"] */
const ModalTitleArea = styled.div`
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 10px 12px 0 24px;
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  display: flex;
`;

const Title = styled.h3`
  font-size: 24px;
  color: black;
  margin-top: 0;
  margin-bottom: 0;
  font-weight: bold;
  @media (max-width: 769px) {
    font-size: 18px;
  }
`;

const ExplanationText = styled.div`
  color: #2e3c5d;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  padding: 6px 0 0 0;
  @include breakpoints (max mid-small) {
    font-size: 16px;
  }
`;

export default withTheme(withStyles(styles)(AdviserIntroModal));
