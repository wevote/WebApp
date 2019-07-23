import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles, withTheme } from '@material-ui/core';
import { renderLog } from '../../utils/logging';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import Pricing from '../../routes/More/Pricing';

class PaidAccountUpgradeModal extends Component {
  // This modal will show a users ballot guides from previous and current elections.

  static propTypes = {
    classes: PropTypes.object,
    initialPricingPlan: PropTypes.string,
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

  paymentProcessedFunction = () => {
    // console.log('paymentProcessedFunction');
    this.setState({
      paidAccountProcessStep: 'paymentProcessed',
    });
  }

  pricingPlanChosenFunction = (pricingPlanChosen) => {
    this.setState({
      paidAccountProcessStep: 'payForPlan',
      pricingPlanChosen,
    });
  }

  render () {
    renderLog(__filename);
    const { classes } = this.props;
    // console.log('PaidAccountUpgradeModal render');

    const { paidAccountProcessStep, pricingPlanChosen } = this.state;
    let modalTitle = '';
    let modalHtmlContents = <span />;
    switch (paidAccountProcessStep) {
      case 'choosePlan':
      default:
        modalTitle = 'Choose Your Plan';
        modalHtmlContents = (
          <Pricing
            initialPricingPlan={this.props.initialPricingPlan}
            modalDisplayMode
            pricingPlanChosenFunction={this.pricingPlanChosenFunction}
          />
        );
        break;
      case 'payForPlan':
        modalTitle = 'Payment';
        modalHtmlContents = (
          <span>
            <ButtonsContainer>
              <Button
                classes={{ root: classes.button }}
                color="primary"
                onClick={() => { this.props.toggleFunction(this.state.pathname); }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={this.paymentProcessedFunction}
              >
                Process Payment (Simulated)
              </Button>
            </ButtonsContainer>
          </span>
        );
        break;
      case 'paymentProcessed':
        modalTitle = 'Payment Processed';
        modalHtmlContents = (
          <span>
            Thank you for choosing the
            {' '}
            {pricingPlanChosen}
            {' '}
            plan! Your payment has been processed, and features have been unlocked.
            <ButtonsContainer>
              <Button
                color="primary"
                onClick={() => { this.props.toggleFunction(this.state.pathname); }}
                variant="contained"
              >
                Continue
              </Button>
            </ButtonsContainer>
          </span>
        );
        break;
    }
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
        onClose={() => { this.props.toggleFunction(this.state.pathname); }}
      >
        <DialogTitle>
          <Typography variant="h6" className="text-center">{modalTitle}</Typography>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.props.toggleFunction(); }}
            id="profileClosePaidAccountUpgradeModal"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          {modalHtmlContents}
        </DialogContent>
      </Dialog>
    );
  }
}
const styles = theme => ({
  button: {
    marginRight: 8,
  },
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    [theme.breakpoints.up('xs')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      minHeight: '95%',
      maxHeight: '95%',
      height: '95%',
      margin: '0 auto',
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: '99%',
      maxWidth: '99%',
      width: '99%',
      minHeight: '99%',
      maxHeight: '99%',
      height: '99%',
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
    right: `${theme.spacing.unit}px`,
    top: `${theme.spacing.unit}px`,
  },
});

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: fit-content;
  width: 100%;
  margin-top: 12px;
`;

export default withTheme(withStyles(styles)(PaidAccountUpgradeModal));
