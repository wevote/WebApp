import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../../stores/VoterStore';
import CompleteYourProfile from './CompleteYourProfile';


class CompleteYourProfileModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('CompleteYourProfileModal caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log('CompleteYourProfileModal componentWillUnmount');
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    console.error('Error caught in CompleteYourProfileModal: ', error);
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
  }

  closeModalFunction = () => {
    // console.log('CompleteYourProfileModal closeModalFunction');
    if (this.props.closeFunction) {
      this.props.closeFunction();
    }
  };

  onKeyDown = (event) => {
    event.preventDefault();
  };

  render () {
    renderLog('CompleteYourProfileModal');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      becomeMember, campaignXWeVoteId, classes, startCampaign, supportCampaign,
    } = this.props;

    const { voter } = this.state;
    if (!voter) {
      // console.log('CompleteYourProfileModal render voter NOT found');
      return <div className="undefined-props" />;
    }
    // console.log('CompleteYourProfileModal render voter found');
    let completeProfileTitle = <span>&nbsp;</span>;
    if (becomeMember) {
      completeProfileTitle = <span>becomeMember</span>;
    } else if (startCampaign) {
      completeProfileTitle = <span>Complete your profile</span>;
    } else if (supportCampaign) {
      completeProfileTitle = <span>Complete your support</span>;
    }
    return (
      <Dialog
        id="completeYourProfileModalDialog"
        classes={{
          paper: classes.dialogPaper,
          root: classes.dialogRoot,
        }}
        open={this.props.show}
        onClose={() => { this.closeModalFunction(); }}
      >
        <DialogTitle classes={{ root: classes.dialogTitle }}>
          <DialogTitleText>
            {completeProfileTitle}
          </DialogTitleText>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.closeModalFunction(); }}
            id="completeYourProfileModalClose"
            size="large"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <section>
            <CompleteYourProfile
              becomeMember={becomeMember}
              campaignXWeVoteId={campaignXWeVoteId}
              functionToUseWhenProfileComplete={this.props.functionToUseWhenProfileComplete}
              startCampaign={startCampaign}
              supportCampaign={supportCampaign}
            />
          </section>
        </DialogContent>
      </Dialog>
    );
  }
}
CompleteYourProfileModal.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  closeFunction: PropTypes.func.isRequired,
  becomeMember: PropTypes.bool,
  functionToUseWhenProfileComplete: PropTypes.func.isRequired,
  show: PropTypes.bool,
  startCampaign: PropTypes.bool,
  supportCampaign: PropTypes.bool,
};

const styles = () => ({
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  dialogRoot: {
    height: '100%',
    top: '-15%',
    left: '0% !important',
    right: 'unset !important',
    bottom: 'unset !important',
    padding: '0',
    width: '100%',
    zIndex: '9010 !important',
  },
  dialogPaper: {
    width: 480,
    maxHeight: '90%',
    height: 'unset',
    margin: '0 auto',
  },
  dialogContent: {
    padding: 0,
  },
  dialogTitle: {
    padding: '8px 15px 0 15px',
  },
});

const DialogTitleText = styled('span')`
  display: block;
`;

export default withTheme(withStyles(styles)(CompleteYourProfileModal));
