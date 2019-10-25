import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles, withTheme } from '@material-ui/core';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';
import { calculateBallotBaseUrl } from '../../utils/textFormat';
import EditAddressInPlace from '../Widgets/EditAddressInPlace';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import BallotElectionListWithFilters from './BallotElectionListWithFilters';

class SelectBallotModal extends Component {
  // This modal will show a users ballot guides from previous and current elections.

  static propTypes = {
    ballotBaseUrl: PropTypes.string,
    classes: PropTypes.object,
    organization_we_vote_id: PropTypes.string, // If looking at voter guide, we pass in the parent organization_we_vote_id
    pathname: PropTypes.string,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      pathname: undefined,
    };
  }

  componentDidMount () {
    this.setState({
      pathname: this.props.pathname,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      pathname: nextProps.pathname,
    });
  }

  shouldComponentUpdate (nextProps) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.props.pathname !== nextProps.pathname) {
      // console.log('this.props.pathname:', this.props.pathname, ', nextProps.pathname:', nextProps.pathname);
      return true;
    }
    if (this.props.ballotBaseUrl !== nextProps.ballotBaseUrl) {
      // console.log('this.props.ballotBaseUrl:', this.props.ballotBaseUrl, ', nextProps.ballotBaseUrl:', nextProps.ballotBaseUrl);
      return true;
    }
    if (this.props.organization_we_vote_id !== nextProps.organization_we_vote_id) {
      // console.log('this.props.organization_we_vote_id:', this.props.organization_we_vote_id, ', nextProps.organization_we_vote_id:', nextProps.organization_we_vote_id);
      return true;
    }
    // console.log('shouldComponentUpdate no change');
    return false;
  }

  render () {
    renderLog('SelectBallotModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const ballotBaseUrl = calculateBallotBaseUrl(this.props.ballotBaseUrl, this.props.pathname);

    const voterAddressObject = VoterStore.getAddressObject();
    // console.log('SelectBallotModal render, voter_address_object: ', voter_address_object);
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(this.state.pathname); }}
      >
        <DialogTitle>
          <Typography className="text-center">
            <span className="h6">
              Address & Elections
            </span>
          </Typography>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.props.toggleFunction(); }}
            id="profileCloseSelectBallotModal"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <EditAddressInPlace
            address={voterAddressObject}
            defaultIsEditingAddress
            pathname={this.state.pathname}
            toggleFunction={this.props.toggleFunction}
            cancelButtonAction={this.props.toggleFunction}
          />
          <BallotElectionListWithFilters
            ballotBaseUrl={ballotBaseUrl}
            organizationWeVoteId={this.props.organization_we_vote_id}
            showPriorElectionsList
            toggleFunction={this.props.toggleFunction}
          />
        </DialogContent>
      </Dialog>
    );
  }
}
const styles = theme => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    [theme.breakpoints.down('xs')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
  },
  dialogContent: {
    [theme.breakpoints.down('md')]: {
      padding: '0 8px 8px',
    },
  },
  closeButton: {
    position: 'absolute',
    right: `${theme.spacing(1)}px`,
    top: `${theme.spacing(1)}px`,
  },
});

export default withTheme(withStyles(styles)(SelectBallotModal));
