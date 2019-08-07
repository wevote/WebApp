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
    const planNameTitle = `${pricingPlanChosen} Plan`;

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
        modalTitle = 'Payment Plan';
        modalHtmlContents = (
          <MobileWrapper className="u-full-height">
            <PlanChosenTitle>
              {planNameTitle}
            </PlanChosenTitle>
            {radioGroupValue === 'annualPlanRadio' ? (
              <Fieldset>
                <FormControl classes={{ root: classes.formControl }}>
                  <RadioGroup
                    name="planRadioGroup"
                    value={radioGroupValue}
                    onChange={this.handleRadioGroupChange}
                  >
                    <FormControlLabel
                      classes={{ root: classes.formControlLabel, label: classes.formControlLabelSpan }}
                      value="annualPlanRadio"
                      control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                      label={(
                        <>
                          <PriceLabelDollarSign>$</PriceLabelDollarSign>
                          <PriceLabel>125</PriceLabel>
                          <PriceLabelSubText> /mo</PriceLabelSubText>
                          <MobilePricingPlanName>Billed Annually</MobilePricingPlanName>
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
                <FormControl classes={{ root: classes.formControl }}>
                  <RadioGroup
                    name="planRadioGroup"
                    value={radioGroupValue}
                    onChange={this.handleRadioGroupChange}
                  >
                    <FormControlLabel
                      classes={{ root: classes.formControlLabel, label: classes.formControlLabelSpan }}
                      value="annualPlanRadio"
                      control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                      label={(
                        <>
                          <PriceLabelDollarSign>$</PriceLabelDollarSign>
                          <PriceLabel>125</PriceLabel>
                          <PriceLabelSubText> /mo</PriceLabelSubText>
                          <MobilePricingPlanName>Billed Annually</MobilePricingPlanName>
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
                <FormControl classes={{ root: classes.formControl }}>
                  <RadioGroup
                    name="planRadioGroup"
                    value={radioGroupValue}
                    onChange={this.handleRadioGroupChange}
                  >
                    <FormControlLabel
                      classes={{ root: classes.formControlLabel, label: classes.formControlLabelSpan }}
                      value="monthlyPlanRadio"
                      control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                      label={(
                        <>
                          <PriceLabelDollarSign>$</PriceLabelDollarSign>
                          <PriceLabel>150</PriceLabel>
                          <PriceLabelSubText> /mo</PriceLabelSubText>
                          <MobilePricingPlanName>Billed Monthly</MobilePricingPlanName>
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
                <FormControl classes={{ root: classes.formControl }}>
                  <RadioGroup
                    name="planRadioGroup"
                    value={radioGroupValue}
                    onChange={this.handleRadioGroupChange}
                  >
                    <FormControlLabel
                      classes={{ root: classes.formControlLabel, label: classes.formControlLabelSpan }}
                      value="monthlyPlanRadio"
                      control={<Radio color="primary" classes={{ root: classes.radioButton }} />}
                      label={(
                        <>
                          <PriceLabelDollarSign>$</PriceLabelDollarSign>
                          <PriceLabel>150</PriceLabel>
                          <PriceLabelSubText> /mo</PriceLabelSubText>
                          <MobilePricingPlanName>Billed Monthly</MobilePricingPlanName>
                        </>
                      )}
                      onClick={this.handleRadioGroupChoiceSubDomain}
                      checked={radioGroupValue === 'monthlyPlanRadio'}
                    />
                  </RadioGroup>
                </FormControl>
              </FieldsetDisabled>
            )}
          </MobileWrapper>
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
                  <PlanChosenTitle>
                    {planNameTitle}
                  </PlanChosenTitle>
                </div>
                {radioGroupValue === 'annualPlanRadio' ? (
                  <Fieldset>
                    <Legend>
                      Billed Annually
                    </Legend>
                    <FormControl classes={{ root: classes.formControl }}>
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
                    <FormControl classes={{ root: classes.formControl }}>
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
                    <FormControl classes={{ root: classes.formControl }}>
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
                    <FormControl classes={{ root: classes.formControl }}>
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
        <ModalTitleArea>
          {backToButton}
          <Title>
            {modalTitle}
          </Title>
          <IconButton
            aria-label="Close"
            className={classes.closeButton}
            onClick={this.closePaidAccountUpgradeModal}
            id="profileClosePaidAccountUpgradeModal"
          >
            <CloseIcon />
          </IconButton>
        </ModalTitleArea>
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
    '@media (min-width: 768px)': {
      minWidth: '65%',
      maxWidth: '720px',
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
      background: '#f7f7f7',
      padding: '0 8px 8px',
    },
    background: 'white',
    overflow: 'hidden',
  },
  formControl: {
    width: '100%',
    padding: '0 0 3px',
    '@media (max-width: 768px)': {
      padding: 0,
    },
  },
  backToButton: {
    color: '#666',
    fontWeight: 'bold',
    margin: 0,
    textTransform: 'none',
    '@media (min-width: 768px)': {
      position: 'absolute',
      top: 16,
      left: 12,
    },
  },
  closeButton: {
    margin: 0,
    display: 'none',
    '@media (min-width: 768px)': {
      display: 'block',
      position: 'absolute',
      top: 9,
      right: 8,
    },
  },
  formControlLabel: {
    margin: 0,
    padding: 0,
    height: '100%',
    width: '100%',
    '@media (max-width: 768px)': {
      padding: '8px 16px 8px 8px',
    },
  },
  formControlLabelSpan: {
    width: '100%',
  },
  radioButton: {
    width: 45.4,
    height: 45.4,
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

const ModalTitleArea = styled.div`
  width: 100%;
  padding: 16px 12px;
  box-shadow: 0 20px 40px -25px #999;
  z-index: 999;
  @media (min-width: 768px) {
    text-align: center;
    box-shadow: none;
    border-bottom: 2px solid #f7f7f7;
  }
`;

// const BackToButton = styled.div`
//   margin: 0;
//   @media (min-width: 768px) {
//     position: absolute;
//     top: 8;
//     left: 4;
//   }
// `;

const Title = styled.h3`
  font-weight: bold;
  font-size: 24px;
  margin-top: 8px;
  position: relative;
  left: 8px;
  color: black;
  @media (min-width: 768px) {
    font-size: 28px;
    left: 0;
    margin: 0 auto;
    width: fit-content;
  }
`;

const PlanChosenTitle = styled.h4`
  color: #666;
  font-size: 22px;
  font-weight: bold;
  text-transform: capitalize;
  margin-bottom: 16px;
  @media (min-width: 768px) {
    color: black;
    font-weight: bold;
  }
`;

const Row = styled.div`
  max-width: 700px;
  margin: 0 auto !important;
`;

const MobileWrapper = styled.div`
  padding: 0 18px;
  margin-top: 32px;
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
  background: white;
`;

const FieldsetDisabled = styled.fieldset`
  border: 2px solid #ddd;
  border-radius: 3px;
  margin-bottom: 16px;
  padding-bottom: 0;
  background: white;
`;

const Legend = styled.legend`
  color: ${({ theme }) => theme.colors.main};
  font-size: 12px;
  text-align: left;
  margin: 0;
  margin-left: 16px;
  padding: 0px 8px;
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

const MobilePricingPlanName = styled.span`
  color: ${({ theme }) => theme.colors.main};
  font-size: 18px;
  font-weight: bold;
  v-align: middle;
  position: relative;
  top: 16.8px;
  float: right;
`;

export default withTheme(withStyles(styles)(PaidAccountUpgradeModal));
