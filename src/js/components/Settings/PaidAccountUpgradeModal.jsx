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

  backToChoosePlan = () => {
    this.setState({ paidAccountProcessStep: '' });
  }

  backToApplyCoupon = () => {
    this.setState({ paidAccountProcessStep: 'payForPlanMobile' });
  }

  couponAppliedFunction = () => {
    this.setState({ paidAccountProcessStep: 'payForPlan' });
  }

  paymentProcessedFunction = () => {
    // console.log('paymentProcessedFunction');
    this.setState({
      paidAccountProcessStep: 'paymentProcessed',
    });
  }

  pricingPlanChosenFunction = (pricingPlanChosen) => {
    if (window.innerWidth > 769 && pricingPlanChosen !== 'free') {
      this.setState({
        paidAccountProcessStep: 'payForPlan',
        pricingPlanChosen,
      });
    } else if (pricingPlanChosen !== 'free') {
      this.setState({
        paidAccountProcessStep: 'payForPlanMobile',
        pricingPlanChosen,
      });
    } else {
      this.props.toggleFunction(this.state.pathname);
    }
  }

  render () {
    renderLog(__filename);
    const { classes } = this.props;
    // console.log('PaidAccountUpgradeModal render');

    const { paidAccountProcessStep, pricingPlanChosen } = this.state;
    let modalTitle = '';
    let backToButton;
    let modalHtmlContents = <span />;
    switch (paidAccountProcessStep) {
      case 'choosePlan':
      default:
        modalTitle = 'Choose Your Plan';
        modalHtmlContents = (
          <Pricing
            initialPricingPlan={this.state.pricingPlanChosen ? this.state.pricingPlanChosen : this.props.initialPricingPlan}
            modalDisplayMode
            pricingPlanChosenFunction={this.pricingPlanChosenFunction}
          />
        );
        break;
      case 'payForPlanMobile':
        backToButton = (
          <Button className={classes.backToButton} onClick={this.backToChoosePlan}>
            Choose Plan
          </Button>
        );
        modalTitle = 'Apply Coupon';
        modalHtmlContents = (
          <span>
            Coupon Processing Center
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
                onClick={this.couponAppliedFunction}
              >
                Checkout
              </Button>
            </ButtonsContainer>
          </span>
        );
        break;
      case 'payForPlan':
        backToButton = (
          <Button className={classes.backToButton} onClick={this.backToApplyCoupon}>
            Apply Coupon
          </Button>
        );
        modalTitle = 'Payment';
        modalHtmlContents = (
          <span>
            Coupon Processing Center + Payment Proccesing Center
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
        <Title>
          {backToButton}
          <h1 className="h1 u-margin-none">{modalTitle}</h1>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={() => { this.props.toggleFunction(); }}
            id="profileClosePaidAccountUpgradeModal"
          >
            <CloseIcon />
          </IconButton>
        </Title>
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
  backToButton: {
    margin: 0,
    position: 'absolute',
    left: 8,
    top: 12,
  },
  closeButton: {
    margin: 0,
    position: 'absolute',
    right: 8,
    top: 6,
  },
});

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center !important;
  width: fit-content;
  width: 100%;
  margin-top: 12px;
`;

const Title = styled.div`
  width: 100%;
  text-align: center;
  border-bottom: 2px solid #f7f7f7;
  padding: 16px 12px;
`;

export default withTheme(withStyles(styles)(PaidAccountUpgradeModal));
