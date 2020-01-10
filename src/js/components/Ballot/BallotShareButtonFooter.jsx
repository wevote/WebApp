import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/esm/Button';
import Comment from '@material-ui/icons/Comment';
import { Drawer, Tooltip, MenuItem } from '@material-ui/core/esm';
import { withStyles } from '@material-ui/core/esm/styles';
import Reply from '@material-ui/icons/Reply';
import styled from 'styled-components';
import AppActions from '../../actions/AppActions';

class BallotShareButtonFooter extends Component {
  static propTypes = {
    classes: PropTypes.object,
    pathname: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  shouldComponentUpdate (nextState) {
    if (this.state.open !== nextState.open) return true;
    if (this.state.anchorEl !== nextState.anchorEl) return true;
    return false;
  }

  handleClick (event) {
    this.setState({ anchorEl: event.currentTarget, open: true });
  }

  handleClose () {
    this.setState({ anchorEl: null, open: false });
  }

  openShareModal () {
    // console.log('SettingsDomain openPaidAccountUpgradeModal');
    AppActions.setShowShareModal(true);
  }

  render () {
    const { classes } = this.props;

    return (
      <Wrapper pinToBottom={this.props.pathname.toLowerCase().startsWith('/candidate') || this.props.pathname.toLowerCase().startsWith('/measure')}>
        <Button aria-controls="share-menu" onClick={this.handleClick} aria-haspopup="true" className={classes.button} variant="contained" color="primary">
          <Icon>
            <Reply
              classes={{ root: classes.shareIcon }}
            />
            {/* <i className="fas fa-share" /> */}
          </Icon>
          Share
        </Button>
        <Drawer id="share-menu" anchor="bottom" open={this.state.open} direction="up" onClose={this.handleClose}>
          <Container>
            <ModalTitleArea>
              <Title>
                Share:
                {' '}
                <strong>Ballot for Nov 2019 Elections</strong>
              </Title>
              <SubTitle>Share a link to this election so that your friends can get ready to vote. Your opinions are not included.</SubTitle>
            </ModalTitleArea>
            <MenuItem className={classes.menuItem} onClick={this.openShareModal}>
              <MenuFlex>
                <MenuIcon>
                  <i className="fas fa-list" />
                </MenuIcon>
                <MenuText>
                  Ballot
                </MenuText>
                <MenuInfo>
                  <Tooltip title="Share a link to this election so that your friends can get ready to vote. Your opinions are not included." arrow enterDelay={300}>
                    <i className="fas fa-info-circle" />
                  </Tooltip>
                </MenuInfo>
              </MenuFlex>
            </MenuItem>
            <MenuSeparator />
            <MenuItem className={classes.menuItem} onClick={this.openShareModal}>
              <MenuFlex>
                <MenuIcon>
                  <Comment />
                </MenuIcon>
                <MenuText>
                  Your Ballot Opinions
                </MenuText>
                <MenuInfo>
                  <Tooltip title="Share a link to the choices you've made for this election so that your friends can get ready to vote. This includes your public and friend's-only opinions." arrow enterDelay={300}>
                    <i className="fas fa-info-circle" />
                  </Tooltip>
                </MenuInfo>
              </MenuFlex>
            </MenuItem>
            <Button className={classes.cancelButton} fullWidth onClick={this.handleClose} variant="outlined" color="primary">
              Cancel
            </Button>
          </Container>
        </Drawer>
      </Wrapper>
    );
  }
}

const styles = () => ({
  button: {
    padding: '0 12px',
    width: '100%',
    boxShadow: 'none !important',
    borderRadius: '0 !important',
    height: '45px !important',
  },
  cancelButton: {
    marginTop: 24,
  },
  menuItem: {
    zIndex: '9 !important',
    padding: '0 !important',
    marginBottom: '-2px !important',
    paddingBottom: '1px !important',
    '&:last-child': {
      paddingBottom: '0 !important',
      paddingTop: '1px !important',
    },
    '&:hover': {
      background: '#efefef',
    },
  },
  shareIcon: {
    // -webkit-transform: 'scaleX(-1)',
    transform: 'scaleX(-1)',
  },
});

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  bottom: ${props => (props.pinToBottom ? '0' : '57px')};
  display: block;
  @media (min-width: 576px) {
    display: none;
  }
`;

const Container = styled.div`
  margin: 0 auto;
  max-width: 576px;
  padding: 24px 16px 32px !important;
`;

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
  font-weight: normal;
  font-size: 24px;
  color: black;
  margin-top: 0;
  margin-bottom: 12px;
`;

const SubTitle = styled.div`
  margin-top: 0;
  font-size: 14px;
  width: 80%;
`;

const Icon = styled.span`
  margin-right: 4px;
`;

const MenuFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 10px 8px 10px 18px;
`;

const MenuIcon = styled.div`
  width: 20px !important;
  height: 20px !important;
  top: -2px;
  position: relative;
  & * {
    width: 20px !important;
    height: 20px !important;
    min-width: 20px !important;
    min-height: 20px !important;
  }
  & svg {
    position: relative;
    left: -2px;
  }
`;

const MenuText = styled.div`
  margin-left: 12px;
`;

const MenuInfo = styled.div`
  margin-left: auto;
  margin-top: 1px;
  padding-left: 10px;
`;

const MenuSeparator = styled.div`
  height: 2px;
  background: #efefef;
  width: 80%;
  margin: 0 auto;
  position: absolute;
  left: 10%;
  z-index: 0 !important;
  @media (min-width: 568px) {
    width: 448px !important;
    margin: 0 auto;
  }
`;

export default withStyles(styles)(BallotShareButtonFooter);
