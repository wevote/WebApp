import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import VoterConstants from '../../constants/VoterConstants';

const HowItWorks = React.lazy(() => import(/* webpackChunkName: 'HowItWorks' */ '../../pages/HowItWorks'));

class HowItWorksModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };

    this.closeHowItWorksModal = this.closeHowItWorksModal.bind(this);
  }

  closeHowItWorksModal () {
    // const { howItWorksWatched } = this.state;
    // const minimumStepIndexForCompletion = 1; // Was 2, but even opening it should get rid of the tickler
    const alwaysMarkedWatched = true;
    if (alwaysMarkedWatched) {
      // Mark this, so we know to show 'How it Works' as completed
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.HOW_IT_WORKS_WATCHED);
      // this.setState({ howItWorksWatched: true });
    }
    const { location: { pathname } } = window;
    this.props.toggleFunction(pathname);
  }

  render () {
    renderLog('HowItWorksModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { location: { pathname } } = window;

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(pathname); }}
        sx={isMobileScreenSize() ? { bottom: 'unset' } : {}}
      >
        <ModalTitleArea>
          <div>
            <Title id = "howWeVoteWorksTitleText">
              How WeVote Works
            </Title>
          </div>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={this.closeHowItWorksModal}
            id="profileCloseHowItWorksModal"
            size="large"
          >
            <Close />
          </IconButton>
        </ModalTitleArea>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <div className="full-width">
            <Suspense fallback={<></>}>
              <HowItWorks inModal />
            </Suspense>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
HowItWorksModal.propTypes = {
  classes: PropTypes.object,
  show: PropTypes.bool,
  toggleFunction: PropTypes.func.isRequired,
};

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
    padding: '0 24px 12px 24px',
    background: 'white',
    display: 'flex',
    justifyContent: 'center',
  },
  backButton: {
    // marginBottom: 6,
    // marginLeft: -8,
    paddingTop: 0,
    paddingBottom: 0,
  },
  backButtonIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    marginLeft: 'auto',
  },
  closeButtonAbsolute: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
});

/* eslint no-nested-ternary: ["off"] */
const ModalTitleArea = styled('div', {
  shouldForwardProp: (prop) => !['firstslide'].includes(prop),
})(({ firstslide }) => (`
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: ${firstslide ? '24px 24px 12px 24px' : '10px 14px'};
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  display: flex;
`));

const Title = styled('h3')`
  font-size: 28px;;
  color: black;
  margin-top: 0;
  margin-bottom: 0;
  font-weight: bold;
`;

export default withTheme(withStyles(styles)(HowItWorksModal));
