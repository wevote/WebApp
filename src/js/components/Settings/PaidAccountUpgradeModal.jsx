import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { withStyles, withTheme } from '@material-ui/core';
import { renderLog } from '../../utils/logging';
import { hasIPhoneNotch, isIOS } from '../../utils/cordovaUtils';
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
      radioGroupValue: 'annualPlanRadio',
    };

    this.closePaidAccountUpgradeModal = this.closePaidAccountUpgradeModal.bind(this);
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

  handleRadioGroupChange = (event) => {
    // console.log('handleRadioGroupChange');
    const { radioGroupValue } = this.state;
    if (radioGroupValue !== event.target.value) {
      this.setState({
        radioGroupValue: event.target.value || '',
      });
    }
  }

  closePaidAccountUpgradeModal () {
    this.props.toggleFunction(this.state.pathname);
  }

  render () {
    renderLog(__filename);
    const { classes } = this.props;
    const { radioGroupValue } = this.state;
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
            {isIOS() ? <ArrowBackIos /> : <ArrowBack />}
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
          <Button className={classes.backToButton} onClick={this.backToChoosePlan}>
            {isIOS() ? <ArrowBackIos /> : <ArrowBack />}
            Choose Plan
          </Button>
        );
        modalTitle = 'Payment';
        modalHtmlContents = (
          <Row className="row u-full-height">
            <div className="col col-6 pr-0 u-full-height">
              <WrapperLeft className="u-full-height">
                <div className="u-tc">
                  <h3 className="h3 u-capitalize">
                    {pricingPlanChosen}
                     Plan
                  </h3>
                </div>
                {radioGroupValue === 'annualPlanRadio' ? (
                  <Fieldset>
                    <Legend>
                      Billed Annually
                    </Legend>
                    <FormControl>
                      <RadioGroup
                        name="planRadioGroup"
                        value={radioGroupValue}
                        onChange={this.handleRadioGroupChange}
                      >
                        <FormControlLabel
                          classes={{ root: classes.formControlLabel }}
                          value="annualPlanRadio"
                          control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                          label={(
                            <>
                              <PriceLabelDollarSign>$</PriceLabelDollarSign>
                              <PriceLabel>125</PriceLabel>
                              <PriceLabelSubText> /mo</PriceLabelSubText>
                            </>
                          )}
                          onClick={this.handleRadioGroupChoiceSubDomain}
                          checked={radioGroupValue === 'annualPlanRadio'}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Fieldset>
                ) : (
                  <FieldsetDisabled>
                    <Legend>
                      Billed Annually
                    </Legend>
                    <FormControl>
                      <RadioGroup
                        name="planRadioGroup"
                        value={radioGroupValue}
                        onChange={this.handleRadioGroupChange}
                      >
                        <FormControlLabel
                          classes={{ root: classes.formControlLabel }}
                          value="annualPlanRadio"
                          control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                          label={(
                            <>
                              <PriceLabelDollarSign>$</PriceLabelDollarSign>
                              <PriceLabel>125</PriceLabel>
                              <PriceLabelSubText> /mo</PriceLabelSubText>
                            </>
                          )}
                          onClick={this.handleRadioGroupChoiceSubDomain}
                          checked={radioGroupValue === 'annualPlanRadio'}
                        />
                      </RadioGroup>
                    </FormControl>
                  </FieldsetDisabled>
                )}
                {radioGroupValue === 'monthlyPlanRadio' ? (
                  <Fieldset>
                    <Legend>
                      Billed Monthly
                    </Legend>
                    <FormControl>
                      <RadioGroup
                        name="planRadioGroup"
                        value={radioGroupValue}
                        onChange={this.handleRadioGroupChange}
                      >
                        <FormControlLabel
                          classes={{ root: classes.formControlLabel }}
                          value="monthlyPlanRadio"
                          control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                          label={(
                            <>
                              <PriceLabelDollarSign>$</PriceLabelDollarSign>
                              <PriceLabel>150</PriceLabel>
                              <PriceLabelSubText> /mo</PriceLabelSubText>
                            </>
                          )}
                          onClick={this.handleRadioGroupChoiceSubDomain}
                          checked={radioGroupValue === 'monthlyPlanRadio'}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Fieldset>
                ) : (
                  <FieldsetDisabled>
                    <Legend>
                      Billed Monthly
                    </Legend>
                    <FormControl>
                      <RadioGroup
                        name="planRadioGroup"
                        value={radioGroupValue}
                        onChange={this.handleRadioGroupChange}
                      >
                        <FormControlLabel
                          classes={{ root: classes.formControlLabel }}
                          value="monthlyPlanRadio"
                          control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                          label={(
                            <>
                              <PriceLabelDollarSign>$</PriceLabelDollarSign>
                              <PriceLabel>150</PriceLabel>
                              <PriceLabelSubText> /mo</PriceLabelSubText>
                            </>
                          )}
                          onClick={this.handleRadioGroupChoiceSubDomain}
                          checked={radioGroupValue === 'monthlyPlanRadio'}
                        />
                      </RadioGroup>
                    </FormControl>
                  </FieldsetDisabled>
                )}
              </WrapperLeft>
            </div>
            <div className="col col-6 pl-0 u-full-height">
              <WrapperRight className="u-full-height">
                <div className="u-tc">
                  <h3 className="h3">Stripe Payment</h3>
                </div>
              </WrapperRight>
            </div>
          </Row>
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
            onClick={this.closePaidAccountUpgradeModal}
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
    [theme.breakpoints.up('md')]: {
      minWidth: '65%',
      maxWidth: '769px',
      width: '65%',
      minHeight: '95%',
      maxHeight: '95%',
      height: '95%',
      margin: '0 auto',
    },
    [theme.breakpoints.down('md')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      minHeight: '95%',
      maxHeight: '95%',
      height: '95%',
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
  formControlLabel: {
    margin: 0,
    padding: 0,
    height: '100%',
  },
  radioButton: {
    width: 55.4,
    height: 55.4,
    padding: 12,
    pointerEvents: 'auto',
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

const Row = styled.div`
  max-width: 700px;
  margin: 0 auto !important;
`;

const WrapperLeft = styled.div`
  padding: 0 32px 32px;
  border-right: 1px solid #f7f7f7;
  margin-top: 32px;
`;

const WrapperRight = styled.div`
  padding: 0 32px 32px;
  border-left: 1px solid #f7f7f7;
  margin-top: 32px;
`;

const Fieldset = styled.fieldset`
  border: 2px solid ${({ theme }) => theme.colors.main};
  border-radius: 3px;
  margin-bottom: 16px;
  padding-bottom: 0;
`;

const FieldsetDisabled = styled.fieldset`
  border: 2px solid #ddd;
  border-radius: 3px;
  margin-bottom: 16px;
  padding-bottom: 0;
`;

const Legend = styled.legend`
  color: ${({ theme }) => theme.colors.main};
  font-size: 12px;
  text-align: left;
  margin: 0;
  margin-left: 8px;
  width: fit-content;
`;

const PriceLabel = styled.span`
  font-size: 40px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.main};
  margin-left: 8px;
`;

const PriceLabelDollarSign = styled.span`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.main};
  position: relative;
  top: -12px;
  font-weight: bold;
`;

const PriceLabelSubText = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.main};
`;

export default withTheme(withStyles(styles)(PaidAccountUpgradeModal));
