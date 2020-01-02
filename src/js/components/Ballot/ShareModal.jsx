import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/esm/Dialog';
import DialogContent from '@material-ui/core/esm/DialogContent';
import IconButton from '@material-ui/core/esm/IconButton';
import { withStyles, withTheme } from '@material-ui/core/esm/styles';
import Mail from '@material-ui/icons/Mail';
import Copy from '@material-ui/icons/CopyTex';
import { renderLog } from '../../utils/logging';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import ShareModalOption from './ShareModalOption';

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
    };

    this.closeShareModal = this.closeShareModal.bind(this);
  }

  componentDidMount () {
    this.setState({
      pathname: this.props.pathname,
    });
  }

  closeShareModal () {
    this.props.toggleFunction(this.state.pathname);
  }

  render () {
    renderLog('ShareModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    // console.log('currentSelectedPlanCostForPayment:', currentSelectedPlanCostForPayment);
    // console.log(this.state);

    return (
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
            <ShareModalOption link="https://wevote.us" background="#2E3C5D" icon="W" title="We Vote Friends" />
            <ShareModalOption link="https://facebook.com" background="#3b5998" icon={<i className="fab fa-facebook-square" />} title="Facebook" />
            <ShareModalOption link="https://twitter.com" background="#38A1F3" icon={<i className="fab fa-twitter" />} title="Twitter" />
            <ShareModalOption link="mailto:jwpeachey107@aol.com" background="#2E3C5D" icon={<Mail />} title="Email" />
            <ShareModalOption link="https://google.com" background="#2E3C5D" icon={<Copy />} title="Copy Link" />
          </Flex>
        </DialogContent>
      </Dialog>
    );
  }
}
const styles = () => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 769px)': {
      maxWidth: '600px',
      width: '85%',
      minHeight: '95%',
      maxHeight: '95%',
      height: '95%',
      margin: '0 auto',
    },
    '@media (max-width: 768px)': {
      minWidth: '100%',
      maxWidth: '100%',
      width: '100%',
      minHeight: '100%',
      maxHeight: '100%',
      height: '100%',
      margin: '0 auto',
    },
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
const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
`;

export default withTheme(withStyles(styles)(ShareModal));
