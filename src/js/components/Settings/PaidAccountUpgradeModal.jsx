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
import { withStyles, withTheme, OutlinedInput } from '@material-ui/core';
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
      paidAccountProcessStep: 'choosePlan',
      radioGroupValue: 'annualPlanRadio',
      couponCodeInputValue: '',
      couponCodesFromAPI: [],
      isCouponApplied: false,
      couponAppliedFromAPI: {},
      couponDiscountValue: 0,
      windowWidth: undefined,
    };

    this.closePaidAccountUpgradeModal = this.closePaidAccountUpgradeModal.bind(this);
    this.onCouponInputChange = this.onCouponInputChange.bind(this);
    this.checkCouponCodeValidity = this.checkCouponCodeValidity.bind(this);
    this.backToChoosePlan = this.backToChoosePlan.bind(this);
    this.resetCouponCode = this.resetCouponCode.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount () {
    this.setState({
      pathname: this.props.pathname,
      // Test coupon codes to simulate having multiple promotions running at the same time
      couponCodesFromAPI: [
        {
          code: '10ALL',
          discount: 10,
          validForProfessionalPlan: true,
          validForEnterprisePlan: true,
        },
        {
          code: '25PRO',
          discount: 25,
          validForProfessionalPlan: true,
          validForEnterprisePlan: false,
        },
        {
          code: '50ENTERPRISE',
          discount: 50,
          validForProfessionalPlan: false,
          validForEnterprisePlan: true,
        },
      ],
    });

    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      pathname: nextProps.pathname,
    });
  }

  shouldComponentUpdate (nextState) {
    if (this.state.windowWidth !== nextState.windowWidth) {
      return true;
    }
    if (this.state.isCouponApplied !== nextState.isCouponApplied) {
      return true;
    }
    if (this.state.couponAppliedFromAPI !== nextState.couponAppliedFromAPI) {
      return true;
    }
    if (this.state.couponCodeInputValue !== nextState.couponCodeInputValue) {
      return true;
    }
    if (this.state.couponDiscountValue !== nextState.couponDiscountValue) {
      return true;
    }
    if (this.state.radioGroupValue !== nextState.radioGroupValue) {
      return true;
    }
    if (this.state.paidAccountProcessStep !== nextState.couponCodeInputValue) {
      return true;
    }
    if (this.state.pricingPlanChosen !== nextState.pricingPlanChosen) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
  }

  // componentDidUpdate () {
  //   const { currentSelectedPlanCost, annualPlanPrice } = this.state;

  //   if (!currentSelectedPlanCost) {
  //     this.setState({  currentSelectedPlanCost: currentSelectedPlanCost || annualPlanPrice });
  //   }
  // }

  onCouponInputChange (e) {
    this.setState({ couponCodeInputValue: e.target.value });
  }

  backToApplyCoupon = () => {
    this.setState({ paidAccountProcessStep: 'selectPlanDetailsMobile' });
  }

  couponAppliedFunction = () => {
    this.setState({ paidAccountProcessStep: 'payForPlan' });

    if (window.innerWidth > 768) {
      this.setState({
        paidAccountProcessStep: 'payForPlan',
      });
    } else {
      this.setState({
        paidAccountProcessStep: 'payForPlanMobile',
      });
    }
  }

  paymentProcessedFunction = () => {
    this.setState({
      paidAccountProcessStep: 'paymentProcessed',
    });
  }

  pricingPlanChosenFunction = (pricingPlanChosen) => {
    const { couponDiscountValue, radioGroupValue, couponAppliedFromAPI } = this.state;
    if (window.innerWidth > 768 && pricingPlanChosen !== 'free') {
      this.setState({
        paidAccountProcessStep: 'payForPlan',
        pricingPlanChosen,
      });
    } else if (pricingPlanChosen !== 'free') {
      this.setState({
        paidAccountProcessStep: 'selectPlanDetailsMobile',
        pricingPlanChosen,
      });
    } else {
      this.props.toggleFunction(this.state.pathname);
    }

    let currentSelectedPlanCostForPro = 0;
    let currentSelectedPlanCostForEnterprise = 0;

    if (radioGroupValue === 'annualPlanRadio') {
      currentSelectedPlanCostForPro = couponAppliedFromAPI.validForProfessionalPlan ? 125 - couponDiscountValue : 125;
      currentSelectedPlanCostForEnterprise = couponAppliedFromAPI.validForEnterprisePlan ? 175 - couponDiscountValue : 175;
    } else {
      currentSelectedPlanCostForPro = couponAppliedFromAPI.validForProfessionalPlan ? 150 - couponDiscountValue : 150;
      currentSelectedPlanCostForEnterprise = couponAppliedFromAPI.validForEnterprisePlan ? 200 - couponDiscountValue : 200;
    }

    switch (pricingPlanChosen) {
      case 'professional':
        this.setState({ monthlyPlanPrice: 150, annualPlanPrice: 125, monthlyPlanPriceWithDiscount: couponAppliedFromAPI.validForProfessionalPlan ? 150 - couponDiscountValue : 150, annualPlanPriceWithDiscount: couponAppliedFromAPI.validForProfessionalPlan ? 125 - couponDiscountValue : 125, currentSelectedPlanCost: currentSelectedPlanCostForPro });

        if (!couponAppliedFromAPI.validForProfessionalPlan) {
          this.setState({ isCouponApplied: false, couponAppliedFromAPI: {}, couponDiscountValue: 0, couponCodeInputValue: '' });
        }
        break;
      case 'enterprise':
        this.setState({ monthlyPlanPrice: 200, annualPlanPrice: 175, monthlyPlanPriceWithDiscount: couponAppliedFromAPI.validForEnterprisePlan ? 200 - couponDiscountValue : 200, annualPlanPriceWithDiscount: couponAppliedFromAPI.validForEnterprisePlan ? 175 - couponDiscountValue : 175, currentSelectedPlanCost: currentSelectedPlanCostForEnterprise });

        if (!couponAppliedFromAPI.validForEnterprisePlan) {
          this.setState({ isCouponApplied: false, couponAppliedFromAPI: {}, couponDiscountValue: 0, couponCodeInputValue: '' });
        }
        break;
      default:
        this.setState({ monthlyPlanPrice: 150, annualPlanPrice: 125, monthlyPlanPriceWithDiscount: couponAppliedFromAPI.validForProfessionalPlan ? 150 - couponDiscountValue : 150, annualPlanPriceWithDiscount: couponAppliedFromAPI.validForProfessionalPlan ? 125 - couponDiscountValue : 125, currentSelectedPlanCost: currentSelectedPlanCostForPro });
    }
  }

  handleRadioGroupChange = (event) => {
    const { radioGroupValue, monthlyPlanPriceWithDiscount, annualPlanPriceWithDiscount } = this.state;
    if (radioGroupValue !== event.target.value) {
      this.setState({
        radioGroupValue: event.target.value || '',
      });
    }
    if (event.target.value === 'annualPlanRadio') {
      this.setState({ currentSelectedPlanCost: annualPlanPriceWithDiscount });
    } else {
      this.setState({ currentSelectedPlanCost: monthlyPlanPriceWithDiscount });
    }
  }

  handleResize () {
    this.setState({
      windowWidth: window.innerWidth,
    });

    if (window.innerWidth < 769) {
      switch (this.state.paidAccountProcessStep) {
        case 'payForPlan':
          this.setState({ paidAccountProcessStep: 'selectPlanDetailsMobile' });
          break;
        case 'selectPlanDetailsMobile':
          break;
        default:
          break;
      }
    } else if (window.innerWidth >= 769) {
      switch (this.state.paidAccountProcessStep) {
        default:
          break;
        case 'selectPlanDetailsMobile':
          this.setState({ paidAccountProcessStep: 'payForPlan' });
          break;
        case 'payForPlanMobile':
          this.setState({ paidAccountProcessStep: 'payForPlan' });
          break;
      }
    }
  }

  backToChoosePlan () {
    this.setState({ paidAccountProcessStep: 'choosePlan' });
  }

  resetCouponCode () {
    const { annualPlanPrice, monthlyPlanPrice, radioGroupValue } = this.state;

    this.setState({ isCouponApplied: false, couponCodeInputValue: '', monthlyPlanPriceWithDiscount: monthlyPlanPrice, annualPlanPriceWithDiscount: annualPlanPrice, couponAppliedFromAPI: {}, couponDiscountValue: 0 });

    if (radioGroupValue === 'annualPlanRadio') {
      this.setState({ currentSelectedPlanCost: annualPlanPrice });
    } else {
      this.setState({ currentSelectedPlanCost: monthlyPlanPrice });
    }
  }

  checkCouponCodeValidity () {
    const { couponCodeInputValue, couponCodesFromAPI, monthlyPlanPrice, annualPlanPrice, currentSelectedPlanCost: oldCurrentSelectedPlanCost, pricingPlanChosen } = this.state;

    let wasCouponMatchFound = false;

    for (let i = 0; i < couponCodesFromAPI.length; i++) {
      if (couponCodesFromAPI[i].code.toLowerCase() === couponCodeInputValue.toLowerCase() && (pricingPlanChosen === 'professional' ? couponCodesFromAPI[i].validForProfessionalPlan : couponCodesFromAPI[i].validForEnterprisePlan)) {
        this.setState({
          isCouponApplied: true,
          couponDiscountValue: couponCodesFromAPI[i].discount,
          monthlyPlanPriceWithDiscount: monthlyPlanPrice - couponCodesFromAPI[i].discount,
          annualPlanPriceWithDiscount: annualPlanPrice - couponCodesFromAPI[i].discount,
          currentSelectedPlanCost: oldCurrentSelectedPlanCost - couponCodesFromAPI[i].discount,
          couponAppliedFromAPI: couponCodesFromAPI[i],
        });

        wasCouponMatchFound = true;
      }
    }

    if (wasCouponMatchFound === false) {
      this.setState({ couponCodeError: true, couponCodeInputValue: '' });
      setTimeout(() => {
        this.setState({ couponCodeError: false });
      }, 3000);
    }
  }

  closePaidAccountUpgradeModal () {
    this.props.toggleFunction(this.state.pathname);
  }

  render () {
    renderLog(__filename);
    const { classes } = this.props;
    const { radioGroupValue, couponCodeInputValue, couponDiscountValue, isCouponApplied, paidAccountProcessStep, pricingPlanChosen, monthlyPlanPrice, annualPlanPrice, couponCodeError, monthlyPlanPriceWithDiscount, annualPlanPriceWithDiscount, currentSelectedPlanCost } = this.state;

    console.log(this.state);

    let modalTitle = '';
    let backToButton;
    let modalHtmlContents = <span />;
    const planNameTitle = `${pricingPlanChosen} Plan`;
    const couponDiscountValueString = ` $${couponDiscountValue}`;

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
      case 'selectPlanDetailsMobile':
        backToButton = (
          <Button className={classes.backToButton} onClick={this.backToChoosePlan}>
            {isIOS() ? <ArrowBackIos /> : <ArrowBack />}
            Choose Plan
          </Button>
        );
        modalTitle = 'Payment Plan';
        modalHtmlContents = (
          <MobileWrapper className="u-full-height">
            <FlexSectionOne>
              <SectionTitle>
                {planNameTitle}
              </SectionTitle>
              {isCouponApplied ? (
                <div
                  className={classes.couponAlert}
                >
                  Coupon Applied. Deducted
                  {couponDiscountValueString}
                </div>
              ) : null}
              {couponCodeError ? (
                <div
                  className={classes.couponAlertError}
                >
                  Invalid Coupon Code
                </div>
              ) : null}
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
                            <PriceLabel>{annualPlanPriceWithDiscount}</PriceLabel>
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
                            <PriceLabel>{annualPlanPriceWithDiscount}</PriceLabel>
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
                            <PriceLabel>{monthlyPlanPriceWithDiscount}</PriceLabel>
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
                            <PriceLabel>{monthlyPlanPriceWithDiscount}</PriceLabel>
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
              <br />
              <SectionTitle>Coupon Code</SectionTitle>
              <OutlinedInput
                classes={{ root: isCouponApplied ? classes.textFieldCouponApplied : classes.textField, input: couponCodeInputValue !== '' ? classes.textFieldInputUppercase : classes.textFieldInput }}
                inputProps={{ }}
                margin="normal"
                // variant="outlined"
                placeholder="Enter Here..."
                fullWidth
                onChange={this.onCouponInputChange}
                disabled={isCouponApplied}
                value={couponCodeInputValue}
              />
              {isCouponApplied ? (
                <>
                  <div
                    className={classes.couponAlert}
                  >
                    APPLIED
                  </div>
                  <Button size="small" className={classes.resetButton} onClick={this.resetCouponCode}>
                    Use new code
                  </Button>
                </>
              ) : (
                <Button
                  disabled={couponCodeInputValue === ''}
                  fullWidth
                  variant="contained"
                  margin="normal"
                  color="primary"
                  classes={{ root: classes.couponButton }}
                  onClick={this.checkCouponCodeValidity}
                >
                  APPLY
                </Button>
              )}
            </FlexSectionOne>
            <FlexSectionTwo>
              <Button
                color="primary"
                variant="contained"
                classes={{ root: classes.nextButton }}
                onClick={this.couponAppliedFunction}
              >
                NEXT
              </Button>
            </FlexSectionTwo>
          </MobileWrapper>
        );
        break;
      case 'payForPlanMobile':
        backToButton = (
          <Button className={classes.backToButton} onClick={this.backToApplyCoupon}>
            {isIOS() ? <ArrowBackIos /> : <ArrowBack />}
            Select Plan Details
          </Button>
        );
        modalTitle = 'Payment';
        modalHtmlContents = (
          <MobileWrapper>
            <SectionTitle>
              Payment for $
              {currentSelectedPlanCost}
            </SectionTitle>
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
          <Row className="row">
            <div className="col col-6 p-0">
              <WrapperLeft>
                <div className="u-tc">
                  <SectionTitle>
                    {planNameTitle}
                  </SectionTitle>
                </div>
                {isCouponApplied ? (
                  <div
                    className={classes.couponAlert}
                  >
                    Coupon Applied. Deducted
                    {couponDiscountValueString}
                  </div>
                ) : null}
                {couponCodeError ? (
                  <div
                    className={classes.couponAlertError}
                  >
                    Invalid Coupon Code
                  </div>
                ) : null}
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
                              <PriceLabel>{annualPlanPriceWithDiscount}</PriceLabel>
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
                              <PriceLabel>{annualPlanPriceWithDiscount}</PriceLabel>
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
                              <PriceLabel>{monthlyPlanPriceWithDiscount}</PriceLabel>
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
                              <PriceLabel>{monthlyPlanPriceWithDiscount}</PriceLabel>
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
                <br />
                <div className="u-tc">
                  <SectionTitle>Coupon Code</SectionTitle>
                </div>
                <OutlinedInput
                  classes={{ root: isCouponApplied ? classes.textFieldCouponApplied : classes.textField, input: couponCodeInputValue !== '' ? classes.textFieldInputUppercase : classes.textFieldInput }}
                  inputProps={{ }}
                  margin="normal"
                  // variant="outlined"
                  placeholder="Enter Here..."
                  fullWidth
                  onChange={this.onCouponInputChange}
                  disabled={isCouponApplied}
                  value={couponCodeInputValue}
                />
                {isCouponApplied ? (
                  <>
                    <div
                      className={classes.couponAlert}
                    >
                      APPLIED
                    </div>
                    <Button size="small" className={classes.resetButton} onClick={this.resetCouponCode}>
                      Use new code
                    </Button>
                  </>
                ) : (
                  <Button
                    disabled={couponCodeInputValue === ''}
                    fullWidth
                    variant="contained"
                    margin="normal"
                    color="primary"
                    classes={{ root: classes.couponButton }}
                    onClick={this.checkCouponCodeValidity}
                  >
                    APPLY
                  </Button>
                )}
              </WrapperLeft>
            </div>
            <div className="col col-6 p-0">
              <WrapperRight>
                <div className="u-tc">
                  <SectionTitle>Stripe Payment</SectionTitle>
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
            plan! Your payment has been processed, and features have been unlocked. You payed $
            {currentSelectedPlanCost}
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
        {paidAccountProcessStep === 'choosePlan' ? (
          <ModalTitleAreaNoBoxShadow>
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
          </ModalTitleAreaNoBoxShadow>
        ) : (
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
        )}
        {paidAccountProcessStep === 'choosePlan' ? (
          <DialogContent classes={{ root: classes.dialogContentWhite }}>
            {modalHtmlContents}
          </DialogContent>
        ) : (
          <DialogContent classes={{ root: classes.dialogContent }}>
            {modalHtmlContents}
          </DialogContent>
        )}
      </Dialog>
    );
  }
}
const styles = () => ({
  button: {
    marginRight: 8,
  },
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 769px)': {
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
    padding: '0px 16px',
    height: 'fit-content',
  },
  dialogContentWhite: {
    '@media (max-width: 768px)': {
      padding: '0 8px 8px',
    },
    background: 'white',
    padding: '0px 16px',
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
    '@media (min-width: 769px)': {
      position: 'absolute',
      top: 16,
      left: 12,
    },
  },
  closeButton: {
    margin: 0,
    display: 'none',
    '@media (min-width: 769px)': {
      display: 'block',
      position: 'absolute',
      top: 9,
      right: 8,
    },
  },
  formControlLabel: {
    padding: '0px 16px 0px 8px',
    height: '100%',
    width: '100%',
    margin: 0,
    '@media (min-width: 769px)': {
      marginTop: '-5px',
    },
    '@media (max-width: 569px)': {
      padding: '4px 8px 4px 4px',
      margin: 0,
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
  textField: {
    background: 'white',
    marginTop: 0,
    marginBottom: 8,
    height: 45,
    fontSize: '14px',
    '@media (max-width: 769px)': {
      height: 45,
      fontSize: 16,
    },
    '@media (max-width: 569px)': {
      height: 40,
      fontSize: 14,
    },
  },
  textFieldCouponApplied: {
    background: 'white',
    marginTop: 0,
    marginBottom: 8,
    height: 45,
    fontSize: '14px',
    color: '#386949',
    '@media (max-width: 769px)': {
      height: 45,
      fontSize: 16,
    },
    '@media (max-width: 569px)': {
      height: 40,
      fontSize: 14,
    },
  },
  textFieldInput: {
    fontWeight: 'bold',
  },
  textFieldInputUppercase: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  couponButton: {
    '@media (max-width: 569px)': {
      height: 35,
      fontSize: 14,
    },
    '@media (max-width: 769px)': {
      height: 45,
      fontSize: 16,
    },
  },
  couponAlert: {
    background: '#c1f4c9',
    color: '#386949',
    boxShadow: 'none',
    pointerEvents: 'none',
    fontWeight: 'bold',
    marginBottom: 8,
    width: '100%',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    '@media (max-width: 569px)': {
      height: 35,
      fontSize: 14,
    },
    '@media (max-width: 769px)': {
      height: 45,
      fontSize: 16,
    },
  },
  couponAlertError: {
    background: 'rgb(255, 177, 160)',
    color: 'rgb(163, 40, 38)',
    boxShadow: 'none',
    pointerEvents: 'none',
    fontWeight: 'bold',
    marginBottom: 8,
    height: 40,
    fontSize: 14,
    width: '100%',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    '@media (max-width: 569px)': {
      height: 35,
      fontSize: 14,
    },
    '@media (max-width: 769px)': {
      height: 45,
      fontSize: 16,
    },
  },
  resetButton: {
    float: 'right',
    textDecoration: 'underline',
  },
  nextButton: {
    '@media (max-width: 569px)': {
      height: 35,
      fontSize: 14,
    },
    '@media (max-width: 769px)': {
      height: 45,
      fontSize: 16,
    },
    width: '100%',
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
  @media (min-width: 769px) {
    text-align: center;
    box-shadow: none;
    border-bottom: 2px solid #f7f7f7;
  }
`;

const ModalTitleAreaNoBoxShadow = styled.div`
  width: 100%;
  padding: 16px 12px;
  z-index: 999;
  @media (min-width: 769px) {
    text-align: center;
    border-bottom: 2px solid #f7f7f7;
  }
  @media (max-width: 376px) {
    padding: 8px 6px;
  }
`;

// const BackToButton = styled.div`
//   margin: 0;
//   @media (min-width: 769px) {
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
  @media (min-width: 769px) {
    font-size: 28px;
    left: 0;
    margin: 0 auto;
    width: fit-content;
  }
`;

const SectionTitle = styled.h4`
  color: #666;
  font-size: 20px;
  font-weight: bold;
  text-transform: capitalize;
  margin-bottom: 16px;
  @media (min-width: 769px) {
    color: black;
    font-weight: bold;
    font-size: 18px;
  }
  @media (max-width: 376px) {
    font-size: 18px;
  }
`;

const Row = styled.div`
  max-width: 700px;
  margin: 0 auto !important;
`;

const MobileWrapper = styled.div`
  padding: 32px 18px 16px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-between;
  max-height: 
`;

const FlexSectionOne = styled.div`
  margin: 0;  
`;

const FlexSectionTwo = styled.div`
  margin: 0;
`;

const WrapperLeft = styled.div`
  padding: 0 32px 32px 16px;
  border-right: 1px solid #f7f7f7;
  height: calc(100% - 32px);
  margin-top: 32px;
`;

const WrapperRight = styled.div`
  padding: 0 16px 32px 32px;
  border-left: 1px solid #f7f7f7;
  height: calc(100% - 32px);
  margin-top: 32px;
`;

const Fieldset = styled.fieldset`
  border: 2px solid ${({ theme }) => theme.colors.main};
  border-radius: 3px;
  margin-bottom: 16px;
  padding-bottom: 0;
  background: white;
  @media (min-width: 769px) {
    height: 76px;
  }
`;

const FieldsetDisabled = styled.fieldset`
  border: 2px solid #ddd;
  border-radius: 3px;
  margin-bottom: 16px;
  padding-bottom: 0;
  background: white;
  @media (min-width: 769px) {
    height: 76px;
    margin-bottom: 12px;
  }
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
  margin-left: 4px;
  @media (max-width: 569px) {
    font-size: 32px;
  }
`;

const PriceLabelDollarSign = styled.span`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.main};
  position: relative;
  top: -12px;
  font-weight: bold;
  @media (max-width: 569px) {
    font-size: 16px;
  }
`;

const PriceLabelSubText = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.main};
  @media (max-width: 569px) {
    font-size: 14px;
  }
`;

const MobilePricingPlanName = styled.span`
  color: ${({ theme }) => theme.colors.main};
  font-size: 18px;
  font-weight: bold;
  v-align: middle;
  position: relative;
  top: 16.8px;
  float: right;
  @media (max-width: 569px) {
    font-size: 14px;
    top: 13.6px;
  }
`;

export default withTheme(withStyles(styles)(PaidAccountUpgradeModal));
