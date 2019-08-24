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
import extractNumber from '../../utils/extractNumber';
import { numberWithCommas } from '../../utils/textFormat';
import DonateStore from '../../stores/DonateStore';
import DonateActions from '../../actions/DonateActions';
import Pricing from '../../routes/More/Pricing';

class PaidAccountUpgradeModal extends Component {
  // This modal will show a users ballot guides from previous and current elections.

  static propTypes = {
    classes: PropTypes.object,
    initialPricingPlan: PropTypes.string,
    pathname: PropTypes.string,
    show: PropTypes.bool,
    stripe: PropTypes.object,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      contactSalesRequired: false,
      couponCodeError: false,
      defaultPricing: {
        enterprisePlanFullPricePerMonthPayMonthly: 0,
        enterprisePlanFullPricePerMonthPayAnnually: 0,
        proPlanFullPricePerMonthPayMonthly: 0,
        proPlanFullPricePerMonthPayAnnually: 0,
        status: 'From constructor',
        success: false,
      },
      lastCouponResponseReceivedFromAPI: {
        couponAppliedMessage: '',
        couponCodeString: '25OFF',
        couponMatchFound: false,
        couponStillValid: false,
        enterprisePlanCouponPricePerMonthPayMonthly: 0,
        enterprisePlanCouponPricePerMonthPayAnnually: 0,
        proPlanCouponPricePerMonthPayMonthly: 14000,
        proPlanCouponPricePerMonthPayAnnually: 11500,
        validForProfessionalPlan: true,
        validForEnterprisePlan: false,
        status: 'From constructor',
        success: false,
      },
      pathname: undefined,
      paidAccountProcessStep: 'choosePlan',
      radioGroupValue: 'annualPlanRadio',
      couponCodeInputValue: '',
      // couponCodesFromAPI: [],
      isCouponCodeApplied: false,
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
    DonateStore.resetState();
    const defaultPricing = DonateStore.getDefaultPricing();
    this.setState({
      defaultPricing,
      pathname: this.props.pathname,
    });
    this.handleResize();
    this.donateStoreChange(); // Load up default pricing
    window.addEventListener('resize', this.handleResize);
    this.donateStoreListener = DonateStore.addListener(this.donateStoreChange);
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
    if (this.state.isCouponCodeApplied !== nextState.isCouponCodeApplied) {
      return true;
    }
    if (this.state.lastCouponResponseReceivedFromAPI !== nextState.lastCouponResponseReceivedFromAPI) {
      return true;
    }
    if (this.state.contactSalesRequired !== nextState.contactSalesRequired) {
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
    this.donateStoreListener.remove();
    window.removeEventListener('resize', this.handleResize);
  }

  onCouponInputChange (e) {
    this.setState({ couponCodeInputValue: e.target.value });
  }

  donateStoreChange = () => {
    // const msg = DonateStore.getCouponMessage();
    // if (msg.length > 0) {
    //   console.log('updating coupon message success validating coupon');
    //   $('.u-no-break').html(msg);
    // }
    //
    // if (DonateStore.getOrgSubscriptionAlreadyExists()) {
    //   console.log('updating coupon message organization subscription already exists');
    //   $('.u-no-break').html('A subscription already exists for this organization<br>The existing subscription was not altered, no credit card charge was made.');
    // }
    const { pricingPlanChosen, radioGroupValue } = this.state;
    const defaultPricing = DonateStore.getDefaultPricing();
    const lastCouponResponseReceivedFromAPI = DonateStore.getLastCouponResponseReceived();
    // console.log('donateStoreChange, lastCouponResponseReceivedFromAPI:', lastCouponResponseReceivedFromAPI);
    const { enterprisePlanFullPricePerMonthPayMonthly, enterprisePlanFullPricePerMonthPayAnnually, proPlanFullPricePerMonthPayAnnually, proPlanFullPricePerMonthPayMonthly } = defaultPricing;
    const { couponDiscountValue, couponReceived, couponViewed, couponMatchFound, couponStillValid, enterprisePlanCouponPricePerMonthPayMonthly, enterprisePlanCouponPricePerMonthPayAnnually, proPlanCouponPricePerMonthPayAnnually, proPlanCouponPricePerMonthPayMonthly } = lastCouponResponseReceivedFromAPI;

    // These values are different based on the plan chosen
    let contactSalesRequired;
    let planPriceForDisplayBilledMonthly;
    let planPriceForDisplayBilledAnnually;
    let currentSelectedPlanCostForPayment;
    if (couponMatchFound && couponStillValid) {
      contactSalesRequired = false;
      if (pricingPlanChosen === 'enterprise') {
        planPriceForDisplayBilledMonthly = enterprisePlanCouponPricePerMonthPayMonthly;
        planPriceForDisplayBilledAnnually = enterprisePlanCouponPricePerMonthPayAnnually;
      } else {
        planPriceForDisplayBilledMonthly = proPlanCouponPricePerMonthPayMonthly;
        planPriceForDisplayBilledAnnually = proPlanCouponPricePerMonthPayAnnually;
      }
    } else if (pricingPlanChosen === 'enterprise') {
      contactSalesRequired = true;
      planPriceForDisplayBilledMonthly = enterprisePlanFullPricePerMonthPayMonthly;
      planPriceForDisplayBilledAnnually = enterprisePlanFullPricePerMonthPayAnnually;
    } else {
      contactSalesRequired = false;
      planPriceForDisplayBilledMonthly = proPlanFullPricePerMonthPayMonthly;
      planPriceForDisplayBilledAnnually = proPlanFullPricePerMonthPayAnnually;
    }
    if (radioGroupValue === 'annualPlanRadio') {
      currentSelectedPlanCostForPayment = planPriceForDisplayBilledAnnually;
    } else {
      currentSelectedPlanCostForPayment = planPriceForDisplayBilledMonthly;
    }

    this.setState({
      contactSalesRequired,
      couponDiscountValue, // Replace this dollar discount with percentage
      currentSelectedPlanCostForPayment: this.convertPriceFromPenniesToDollars(currentSelectedPlanCostForPayment),
      defaultPricing,
      isCouponCodeApplied: couponMatchFound,
      lastCouponResponseReceivedFromAPI,
      planPriceForDisplayBilledMonthly: this.convertPriceFromPenniesToDollars(planPriceForDisplayBilledMonthly),
      planPriceForDisplayBilledAnnually: this.convertPriceFromPenniesToDollars(planPriceForDisplayBilledAnnually),
    });

    if (couponReceived && !couponViewed) {
      // console.log('couponViewed:', couponViewed);
      if (couponMatchFound === false) {
        this.setState({ couponCodeError: true, couponCodeInputValue: '' });
        setTimeout(() => {
          DonateActions.setLatestCouponViewed(true);
          this.setState({ couponCodeError: false });
        }, 3000);
      } else if (couponStillValid === false) {
        this.setState({ couponCodeError: true, couponCodeInputValue: '' });
        setTimeout(() => {
          DonateActions.setLatestCouponViewed(true);
          this.setState({ couponCodeError: false });
        }, 3000);
      }
    }
  };

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
    const { radioGroupValue, defaultPricing, lastCouponResponseReceivedFromAPI } = this.state;
    // console.log('pricingPlanChosenFunction pricingPlanChosen:', pricingPlanChosen, ', lastCouponResponseReceivedFromAPI:', lastCouponResponseReceivedFromAPI);
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
    const proPlanPriceForDisplayBilledAnnually = lastCouponResponseReceivedFromAPI.validForProfessionalPlan ? lastCouponResponseReceivedFromAPI.proPlanCouponPricePerMonthPayAnnually : defaultPricing.proPlanFullPricePerMonthPayAnnually;
    const enterprisePlanPriceForDisplayBilledAnnually = lastCouponResponseReceivedFromAPI.validForEnterprisePlan ? lastCouponResponseReceivedFromAPI.enterprisePlanCouponPricePerMonthPayAnnually : defaultPricing.enterprisePlanFullPricePerMonthPayAnnually;
    const proPlanPriceForDisplayBilledMonthly = lastCouponResponseReceivedFromAPI.validForProfessionalPlan ? lastCouponResponseReceivedFromAPI.proPlanCouponPricePerMonthPayMonthly : defaultPricing.proPlanFullPricePerMonthPayMonthly;
    const enterprisePlanPriceForDisplayBilledMonthly = lastCouponResponseReceivedFromAPI.validForEnterprisePlan ? lastCouponResponseReceivedFromAPI.enterprisePlanCouponPricePerMonthPayMonthly : defaultPricing.enterprisePlanFullPricePerMonthPayMonthly;

    if (radioGroupValue === 'annualPlanRadio') {
      currentSelectedPlanCostForPro = proPlanPriceForDisplayBilledAnnually;
      currentSelectedPlanCostForEnterprise = enterprisePlanPriceForDisplayBilledAnnually;
    } else {
      currentSelectedPlanCostForPro = proPlanPriceForDisplayBilledMonthly;
      currentSelectedPlanCostForEnterprise = enterprisePlanPriceForDisplayBilledMonthly;
    }

    switch (pricingPlanChosen) {
      case 'professional':
        this.setState({
          contactSalesRequired: false,
          planPriceForDisplayBilledMonthly: this.convertPriceFromPenniesToDollars(proPlanPriceForDisplayBilledMonthly),
          planPriceForDisplayBilledAnnually: this.convertPriceFromPenniesToDollars(proPlanPriceForDisplayBilledAnnually),
          currentSelectedPlanCostForPayment: this.convertPriceFromPenniesToDollars(currentSelectedPlanCostForPro),
        });

        if (!lastCouponResponseReceivedFromAPI.validForProfessionalPlan) {
          this.setState({
            isCouponCodeApplied: false,
            lastCouponResponseReceivedFromAPI: {},
            couponDiscountValue: 0,
            couponCodeInputValue: '',
          });
        }
        break;
      case 'enterprise':
        this.setState({
          planPriceForDisplayBilledMonthly: this.convertPriceFromPenniesToDollars(enterprisePlanPriceForDisplayBilledMonthly),
          planPriceForDisplayBilledAnnually: this.convertPriceFromPenniesToDollars(enterprisePlanPriceForDisplayBilledAnnually),
          currentSelectedPlanCostForPayment: this.convertPriceFromPenniesToDollars(currentSelectedPlanCostForEnterprise),
        });

        if (!lastCouponResponseReceivedFromAPI.validForEnterprisePlan) {
          this.setState({
            contactSalesRequired: true,
            isCouponCodeApplied: false,
            lastCouponResponseReceivedFromAPI: {},
            couponDiscountValue: 0,
            couponCodeInputValue: '',
          });
        }
        break;
      default:
        this.setState({
          contactSalesRequired: false,
          planPriceForDisplayBilledMonthly: this.convertPriceFromPenniesToDollars(proPlanPriceForDisplayBilledMonthly),
          planPriceForDisplayBilledAnnually: this.convertPriceFromPenniesToDollars(proPlanPriceForDisplayBilledAnnually),
          currentSelectedPlanCostForPayment: this.convertPriceFromPenniesToDollars(currentSelectedPlanCostForPro),
        });
    }
  }

  handleRadioGroupChange = (event) => {
    const { radioGroupValue, planPriceForDisplayBilledMonthly, planPriceForDisplayBilledAnnually } = this.state;
    if (radioGroupValue !== event.target.value) {
      this.setState({
        radioGroupValue: event.target.value || '',
      });
    }
    if (event.target.value === 'annualPlanRadio') {
      this.setState({ currentSelectedPlanCostForPayment: planPriceForDisplayBilledAnnually });
    } else {
      this.setState({ currentSelectedPlanCostForPayment: planPriceForDisplayBilledMonthly });
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
    const { defaultPricing, pricingPlanChosen, radioGroupValue } = this.state;

    let planPriceForDisplayBilledMonthly = 0;
    let planPriceForDisplayBilledAnnually = 0;
    let currentSelectedPlanCostForPayment = 0;
    let contactSalesRequired;
    if (pricingPlanChosen === 'enterprise') {
      contactSalesRequired = true;
      planPriceForDisplayBilledMonthly = defaultPricing.enterprisePlanFullPricePerMonthPayMonthly;
      planPriceForDisplayBilledAnnually = defaultPricing.enterprisePlanFullPricePerMonthPayAnnually;
    } else {
      contactSalesRequired = false;
      planPriceForDisplayBilledMonthly = defaultPricing.proPlanFullPricePerMonthPayMonthly;
      planPriceForDisplayBilledAnnually = defaultPricing.proPlanFullPricePerMonthPayAnnually;
    }
    if (radioGroupValue === 'annualPlanRadio') {
      currentSelectedPlanCostForPayment = planPriceForDisplayBilledAnnually;
    } else {
      currentSelectedPlanCostForPayment = planPriceForDisplayBilledMonthly;
    }
    this.setState({
      contactSalesRequired,
      isCouponCodeApplied: false,
      couponCodeInputValue: '',
      currentSelectedPlanCostForPayment: this.convertPriceFromPenniesToDollars(currentSelectedPlanCostForPayment),
      planPriceForDisplayBilledMonthly: this.convertPriceFromPenniesToDollars(planPriceForDisplayBilledMonthly),
      planPriceForDisplayBilledAnnually: this.convertPriceFromPenniesToDollars(planPriceForDisplayBilledAnnually),
      lastCouponResponseReceivedFromAPI: {},
      couponDiscountValue: 0,
    });
  }

  checkCouponCodeValidity () {
    const { couponCodeInputValue } = this.state;

    const planType = 'PROFESSIONAL_MONTHLY';
    DonateActions.validateCoupon(planType, couponCodeInputValue);
  }

  closePaidAccountUpgradeModal () {
    this.props.toggleFunction(this.state.pathname);
  }

  convertPriceFromPenniesToDollars (priceInPennies) {
    if (!priceInPennies) {
      return 0;
    }
    let priceInPenniesInt = 0;
    if (priceInPennies === parseInt(priceInPennies, 10)) {
      priceInPenniesInt = priceInPennies;
    } else {
      priceInPenniesInt = extractNumber(priceInPennies);
    }
    const priceInDollars = priceInPenniesInt / 100;
    return numberWithCommas(priceInDollars);
  }

  convertPriceFromDollarsStringToPenniesInt (priceInDollarsString) {
    if (!priceInDollarsString) {
      return 0;
    }
    const priceInDollarsInt = extractNumber(priceInDollarsString);
    return priceInDollarsInt * 100;
  }

  render () {
    renderLog(__filename);
    const { classes } = this.props;
    const { contactSalesRequired, radioGroupValue, couponCodeInputValue, couponDiscountValue, isCouponCodeApplied, paidAccountProcessStep, pricingPlanChosen, couponCodeError, planPriceForDisplayBilledMonthly, planPriceForDisplayBilledAnnually, currentSelectedPlanCostForPayment } = this.state;

    // console.log(this.state);

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
              {isCouponCodeApplied ? (
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
              {contactSalesRequired ? (
                <div>Contact Sales for Enterprise Coupon Code</div>
              ) : (
                <>
                  <Fieldset disabledMode={(radioGroupValue !== 'annualPlanRadio')}>
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
                              <PriceLabel>{planPriceForDisplayBilledAnnually}</PriceLabel>
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
                  <Fieldset disabledMode={(radioGroupValue !== 'monthlyPlanRadio')}>
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
                              <PriceLabel>{planPriceForDisplayBilledMonthly}</PriceLabel>
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
                </>
              )}
              <br />
              <SectionTitle>Coupon Code</SectionTitle>
              <OutlinedInput
                classes={{ root: isCouponCodeApplied ? classes.textFieldCouponApplied : classes.textField, input: couponCodeInputValue !== '' ? classes.textFieldInputUppercase : classes.textFieldInput }}
                inputProps={{ }}
                // margin="normal"
                // variant="outlined"
                placeholder="Enter Here..."
                fullWidth
                onChange={this.onCouponInputChange}
                disabled={isCouponCodeApplied}
                value={couponCodeInputValue}
              />
              {isCouponCodeApplied ? (
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
              {currentSelectedPlanCostForPayment}
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
                {isCouponCodeApplied ? (
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
                {contactSalesRequired ? (
                  <div>Contact Sales for Enterprise Coupon Code</div>
                ) : (
                  <>
                    <Fieldset disabledMode={(radioGroupValue !== 'annualPlanRadio')}>
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
                                <PriceLabel>{planPriceForDisplayBilledAnnually}</PriceLabel>
                                <PriceLabelSubText> /mo</PriceLabelSubText>
                              </>
                            )}
                            onClick={this.handleRadioGroupChoiceSubDomain}
                            checked={radioGroupValue === 'annualPlanRadio'}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Fieldset>
                    <Fieldset disabledMode={(radioGroupValue !== 'monthlyPlanRadio')}>
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
                                <PriceLabel>{planPriceForDisplayBilledMonthly}</PriceLabel>
                                <PriceLabelSubText> /mo</PriceLabelSubText>
                              </>
                            )}
                            onClick={this.handleRadioGroupChoiceSubDomain}
                            checked={radioGroupValue === 'monthlyPlanRadio'}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Fieldset>
                  </>
                )}
                <br />
                <div className="u-tc">
                  <SectionTitle>Coupon Code</SectionTitle>
                </div>
                <OutlinedInput
                  classes={{ root: isCouponCodeApplied ? classes.textFieldCouponApplied : classes.textField, input: couponCodeInputValue !== '' ? classes.textFieldInputUppercase : classes.textFieldInput }}
                  inputProps={{ }}
                  // margin="normal"
                  // variant="outlined"
                  placeholder="Enter Here..."
                  fullWidth
                  onChange={this.onCouponInputChange}
                  disabled={isCouponCodeApplied}
                  value={couponCodeInputValue}
                />
                {isCouponCodeApplied ? (
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
            {currentSelectedPlanCostForPayment}
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
        <ModalTitleArea noBoxShadowMode={(paidAccountProcessStep !== 'choosePlan')}>
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
    display: 'block',
    position: 'absolute',
    top: 9,
    right: 8,
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
  ${({ noBoxShadowMode }) => ((noBoxShadowMode) ? '' : 'box-shadow: 0 20px 40px -25px #999')};
  z-index: 999;
  @media (min-width: 769px) {
    text-align: center;
    ${({ noBoxShadowMode }) => ((noBoxShadowMode) ? '' : 'box-shadow: none')};
    border-bottom: 2px solid #f7f7f7;
  }
  ${({ noBoxShadowMode }) => ((noBoxShadowMode) ? '@media (max-width: 376px) {\n    padding: 8px 6px;\n  }' : '')}
`;
//
// const BackToButton = styled.div`
//   margin: 0;
//   @media (min-width: 769px) {
//     position: absolute;
//     top: 8;
//     left: 4;
//   }
// `;

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
  border: 2px solid ${({ disabledMode, theme }) => ((disabledMode) ? '#ddd' : theme.colors.main)};
  border-radius: 3px;
  margin-bottom: 16px;
  padding-bottom: 0;
  background: white;
  @media (min-width: 769px) {
    height: 76px;
    ${({ disabledMode }) => ((disabledMode) ? 'margin-bottom: 12px' : '')};
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

export default withTheme(withStyles(styles)(PaidAccountUpgradeModal));
