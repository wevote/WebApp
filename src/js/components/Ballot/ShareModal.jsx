import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/esm/Dialog';
import DialogContent from '@material-ui/core/esm/DialogContent';
import IconButton from '@material-ui/core/esm/IconButton';
import { withStyles, withTheme } from '@material-ui/core/esm/styles';
import Mail from '@material-ui/icons/Mail';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import { Button } from '@material-ui/core';
import MessageCard from '../Widgets/MessageCard';
import { renderLog } from '../../utils/logging';
import ShareModalOption from './ShareModalOption';
import SettingsAccount from '../Settings/SettingsAccount';
import FriendStore from '../../stores/FriendStore';

class ShareModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    show: PropTypes.bool,
    pathname: PropTypes.string,
    // stripe: PropTypes.object,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      pathname: '',
      currentFriendsList: [],
    };

    this.closeShareModal = this.closeShareModal.bind(this);
  }

  // Steps: options, friends

  componentDidMount () {
    console.log(this.props.step);

    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    // FriendActions.currentFriends();

    this.setState({
      pathname: this.props.pathname,
      step: this.props.step || 'options',
      currentFriendsList: FriendStore.currentFriends(),
    });
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    const { currentFriendsList } = this.state;
    if (currentFriendsList.length !== FriendStore.currentFriends().length) {
      this.setState({ currentFriendsList: FriendStore.currentFriends() });
    }
  }

  closeShareModal () {
    this.props.toggleFunction(this.state.pathname);
  }

  render () {
    renderLog('ShareModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    // console.log('currentSelectedPlanCostForPayment:', currentSelectedPlanCostForPayment);
    // console.log(this.state);

    let shareModalHtml = (
      <>Loading...</>
    );

    if (this.state.step === 'options') {
      shareModalHtml = (
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={this.props.show}
          onClose={() => { this.props.toggleFunction(this.state.pathname); }}
        >
          <ModalTitleArea>
            <Title>
              Share:
              {' '}
              <strong>Ballot for Nov 2019 Elections</strong>
            </Title>
            <SubTitle>Share a link to this election so that your friends can get ready to vote. Your opinions are not included.</SubTitle>
            <IconButton
              aria-label="Close"
              className={classes.closeButton}
              onClick={this.closeShareModal}
              id="profileCloseShareModal"
            >
              <CloseIcon />
            </IconButton>
          </ModalTitleArea>
          <DialogContent classes={{ root: classes.dialogContent }}>
            <Flex>
              <ShareModalOption link="/friends/invite" background="#2E3C5D" icon={<img src="../../../img/global/svg-icons/we-vote-icon-square-color.svg" />} title="We Vote Friends" />
              <ShareModalOption link="https://www.facebook.com/sharer/sharer.php?u=wevote.us&t=WeVote" target="_blank" background="#3b5998" icon={<i className="fab fa-facebook-f" />} title="Facebook" />
              <ShareModalOption link={`https://twitter.com/share?text=Check out this cool ballot tool at https://wevote.us${window.location.pathname}!`} background="#38A1F3" icon={<i className="fab fa-twitter" />} title="Twitter" />
              <ShareModalOption link="mailto:" background="#2E3C5D" icon={<Mail />} title="Email" />
              <ShareModalOption copyLink link="https://google.com" background="#2E3C5D" icon={<FileCopyOutlinedIcon />} title="Copy Link" />
            </Flex>
          </DialogContent>
        </Dialog>
      );
    } else if (this.state.step === 'friends' && !this.props.isSignedIn) {
      shareModalHtml = (
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={this.props.show}
          onClose={() => { this.props.toggleFunction(this.state.pathname); }}
        >
          <ModalTitleArea>
            <Title center bold>Sign In</Title>
          </ModalTitleArea>
          <DialogContent classes={{ root: classes.dialogContent }}>
            <SettingsAccount inShareModal inModal pleaseSignInTitle="Sign in to share with your friends" />
          </DialogContent>
        </Dialog>
      );
    } else if (this.state.step === 'friends' && this.props.isSignedIn && this.state.currentFriendsList.length > 0) {
      shareModalHtml = (
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={this.props.show}
          onClose={() => { this.props.toggleFunction(this.state.pathname); }}
        >
          <ModalTitleArea>
            <Button className={classes.backButton} color="primary" onClick={this.toggleStep2}>
              <ArrowBackIos className={classes.backButtonIcon} />
              Back
            </Button>
            <Title center bold>Friends!</Title>
          </ModalTitleArea>
          <DialogContent classes={{ root: classes.dialogContent }}>
            <MessageCard
              mainText="You haven't added any friends yet."
              buttonText="Add Friends"
              buttonURL="/friends/invite"
              noCard
              secondaryText="By adding friends who you enjoy discussing politics with to We Vote, you can help eachother get ready for elections."
            />
          </DialogContent>
        </Dialog>
      );
    } else {
      shareModalHtml = (
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={this.props.show}
          onClose={() => { this.props.toggleFunction(this.state.pathname); }}
        >
          <ModalTitleArea>
            <Button className={classes.backButton} color="primary" onClick={this.toggleStep2}>
              <ArrowBackIos className={classes.backButtonIcon} />
              Back
            </Button>
          </ModalTitleArea>
          <DialogContent classes={{ root: classes.dialogContent }}>
            <MessageCard
              mainText="You haven't added any friends yet."
              buttonText="Add Friends"
              buttonURL="/friends/invite"
              noCard
              secondaryText="By adding friends who you enjoy discussing politics with to We Vote, you can help eachother get ready for elections."
              inModal
            />
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <>
        { shareModalHtml }
      </>
    );
  }
}

const styles = () => ({
  dialogPaper: {
    maxWidth: '600px',
    width: '85%',
    height: 'fit-content',
    margin: '0 auto',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  dialogContent: {
    '@media (max-width: 768px)': {
      background: '#fff',
      padding: '0 8px 8px',
    },
    background: 'white',
    padding: '0px 16px',
    height: 'fit-content',
  },
  backButton: {
    marginBottom: 6,
    marginLeft: -8,
  },
  backButtonIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    margin: 0,
    display: 'block',
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

const ModalTitleArea = styled.div`
  text-align: left;
  width: 100%;
  padding: 20px 16px 16px 16px;
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  ${({ noBoxShadowMode }) => ((noBoxShadowMode) ? '@media (max-width: 376px) {\n    padding: 8px 6px;\n  }' : '')}
`;

const Title = styled.h3`
  font-size: ${props => (props.bold ? '30px' : '24px')};
  color: black;
  margin-top: 0;
  margin-bottom: ${props => (props.bold ? '0' : '12px')};
  text-align: ${props => (props.center ? 'center' : 'initial')};
  font-weight: ${props => (props.bold ? 'bold' : 'initial')};
`;

const SubTitle = styled.div`
  margin-top: 0;
  font-size: 14px;
  width: 80%;
`;

const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 36px;
  padding-bottom: 36px;
`;

export default withTheme(withStyles(styles)(ShareModal));


