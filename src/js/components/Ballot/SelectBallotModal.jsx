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

  render () {
    renderLog(__filename);
    const { classes } = this.props;
    const ballotBaseUrl = calculateBallotBaseUrl(this.props.ballotBaseUrl, this.props.pathname);
    // console.log('SelectBallotModal render, ballotBaseUrl: ', ballotBaseUrl);

    const voterAddressObject = VoterStore.getAddressObject();
    // console.log('SelectBallotModal render, voter_address_object: ', voter_address_object);
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(this.state.pathname); }}
      >
        <DialogTitle>
          <Typography variant="h6" className="text-center">Address & Elections</Typography>
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
            organization_we_vote_id={this.props.organization_we_vote_id}
            showRelevantElections
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
