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
            <ShareModalOption link="/friends/invite" background="#2E3C5D" icon={<img src="../../../img/global/svg-icons/we-vote-icon-square-color.svg" />} title="We Vote Friends" />
            <ShareModalOption link="https://www.facebook.com/sharer/sharer.php?u=wevote.us&t=WeVote" target="_blank" background="#3b5998" icon={<i className="fab fa-facebook-f" />} title="Facebook" />
            <ShareModalOption link={`https://twitter.com/share?text=Check out this cool ballot tool at https://wevote.us${window.location.pathname}!`} background="#38A1F3" icon={<i className="fab fa-twitter" />} title="Twitter" />
            <ShareModalOption link="mailto:" background="#2E3C5D" icon={<Mail />} title="Email" />
            <ShareModalOption copyLink link="https://google.com" background="#2E3C5D" icon={<FileCopyOutlinedIcon />} title="Copy Link" />
          </Flex>
        </DialogContent>
      </Dialog>
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
  flex-wrap: wrap;
  margin-top: 36px;
  padding-bottom: 36px;
`;

export default withTheme(withStyles(styles)(ShareModal));


