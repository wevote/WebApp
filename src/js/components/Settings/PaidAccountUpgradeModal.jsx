import { Button, Dialog, DialogContent, FormControl, FormControlLabel, IconButton, OutlinedInput, Radio, RadioGroup } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { ArrowBack, ArrowBackIos, Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
// TODO 5/11/21: import { Elements, StripeProvider } from 'react-stripe-elements';
import styled from 'styled-components';
import DonateActions from '../../common/actions/DonateActions';
// TODO 5/11/21: import webAppConfig from '../../config';
import DonateStore from '../../common/stores/DonateStore';
import { hasIPhoneNotch, isIOS } from '../../utils/cordovaUtils';
import extractNumber from '../../common/utils/extractNumber';
import { normalizedHref } from '../../utils/hrefUtils';
import { renderLog } from '../../common/utils/logging';
import { numberWithCommas, stringContains } from '../../utils/textFormat';
// TODO 5/11/21: import SettingsStripePayment from './SettingsStripePayment';


const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const Pricing = React.lazy(() => import(/* webpackChunkName: 'Pricing' */'../../pages/More/Pricing'));

// April 2021:  Need to convert over to the up-to-date (allowed by stripe) "@stripe/react-stripe-js"
// TODO: Backport "@stripe/react-stripe-js" use from Campaigns

/* global $ */

class PaidAccountUpgradeModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      amountPaidViaStripe: 0,
      contactSalesRequired: false,
      couponCodeError: false,
      defaultPricing: {
        enterprisePlanFullPricePerMonthPayMonthly: 0,
        enterprisePlanFullPricePerMonthPayYearly: 0,
        proPlanFullPricePerMonthPayMonthly: 0,
        proPlanFullPricePerMonthPayYearly: 0,
        status: 'From constructor',
        success: false,
      },
      lastCouponResponseReceivedFromAPI: {
        couponAppliedMessage: '',
        couponCodeString: '25OFF',
        couponMatchFound: false,
        couponStillValid: false,
        enterprisePlanCouponPricePerMonthPayMonthly: 0,
        enterprisePlanCouponPricePerMonthPayYearly: 0,
        proPlanCouponPricePerMonthPayMonthly: 14000,
        proPlanCouponPricePerMonthPayYearly: 11500,
        validForProfessionalPlan: true,
        validForEnterprisePlan: false,
        status: 'From constructor',
        success: false,
      },
      paidAccountProcessStep: 'choosePlan',
      pricingPlanChosen: undefined,
      radioGroupValue: 'annualPlanRadio',
      couponCodeInputValue: '',
      // couponCodesFromAPI: [],
      isCouponCodeApplied: false,
      couponDiscountValue: 0,
      windowWidth: undefined,
    };

    this.backToChoosePlan = this.backToChoosePlan.bind(this);
    this.closePaidAccountUpgradeModal = this.closePaidAccountUpgradeModal.bind(this);
    this.checkCouponCodeValidity = this.checkCouponCodeValidity.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.onCouponInputChange = this.onCouponInputChange.bind(this);
    this.paymentProcessedFunction = this.paymentProcessedFunction.bind(this);
    this.resetCouponCode = this.resetCouponCode.bind(this);
  }

  componentDidMount () {
    DonateStore.resetState();
    const defaultPricing = DonateStore.getDefaultPricing();
    if (!defaultPricing.validForEnterprisePlan && !defaultPricing.validForProfessionalPlan) {
      DonateActions.defaultPricing();
    }
    if (this.props.initialPaidAccountProcessStep === 'payForPlan') {
      // set state of paidAccountProcessStep based on window size
      this.moveToPayForPlanStep();
    }
    this.setState({
      defaultPricing,
    });
    this.handleResize();
    this.onDonateStoreChange(); // Load up default pricing
    window.addEventListener('resize', this.handleResize);
    DonateActions.donationRefreshDonationList();
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange);
  }

  shouldComponentUpdate (nextProps, nextState) {
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
    if (this.state.paidAccountProcessStep !== nextState.paidAccountProcessStep) {
      return true;
    }
    if (this.state.numberOfMonthsService !== nextState.numberOfMonthsService) {
      return true;
    }
    if (this.state.payByMonthCostPerMonth !== nextState.payByMonthCostPerMonth) {
      return true;
    }
    if (this.state.payByYearCostPerYear !== nextState.payByYearCostPerYear) {
      return true;
    }
    if (this.state.pricingPlanChosen !== nextState.pricingPlanChosen) {
      return true;
    }
    if (this.state.validForEnterprisePlan !== nextState.validForEnterprisePlan) {
      return true;
    }
    if (this.state.validForProfessionalPlan !== nextState.validForProfessionalPlan) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
    window.removeEventListener('resize', this.handleResize);
    if (this.timer) clearTimeout(this.timer);
  }

  handleResize () {
    this.setState({
      windowWidth: window.innerWidth,
    });

    if (window.innerWidth < 769) {
      switch (this.state.paidAccountProcessStep) {
        case 'payForPlanDesktop':
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
          this.setState({ paidAccountProcessStep: 'payForPlanDesktop' });
          break;
        case 'payForPlanMobile':
          this.setState({ paidAccountProcessStep: 'payForPlanDesktop' });
          break;
      }
    }
  }

  onCouponInputChange (e) {
    this.setState({ couponCodeInputValue: e.target.value });
  }

  onDonateStoreChange = () => {
    const activePaidPlan = DonateStore.getActivePaidPlan();
    if (activePaidPlan && activePaidPlan.subscription_active) {
      let activePaidPlanChosen = '';
      let activePaidPlanChosenDisplay = '';
      if (stringContains('PROFESSIONAL', activePaidPlan.premium_plan_type_enum)) {
        activePaidPlanChosen = 'professional';
        activePaidPlanChosenDisplay = 'Professional';
      } else if (stringContains('ENTERPRISE', activePaidPlan.premium_plan_type_enum)) {
        activePaidPlanChosen = 'enterprise';
        activePaidPlanChosenDisplay = 'Enterprise';
      } else {
        activePaidPlanChosen = 'unknown';
        activePaidPlanChosenDisplay = 'Unknown';
      }
      this.setState({
        activePaidPlanChosen,
        activePaidPlanChosenDisplay,
      });
    }
    const msg = DonateStore.getCouponMessage();
    if (msg.length > 0) {
      console.log('PaidAccountUpgradeModal updating coupon message success validating coupon');
      $('.u-no-break').html(msg);
    }

    if (DonateStore.getOrgSubscriptionAlreadyExists()) {
      console.log('PaidAccountUpgradeModal updating coupon message organization subscription already exists');
      $('.u-no-break').html('A subscription already exists for this organization<br>The existing subscription was not altered, no credit card charge was made.');
    }
    const { pricingPlanChosen, radioGroupValue } = this.state;
    const defaultPricing = DonateStore.getDefaultPricing();
    const lastCouponResponseReceivedFromAPI = DonateStore.getLastCouponResponseReceived();
    // console.log('onDonateStoreChange, lastCouponResponseReceivedFromAPI:', lastCouponResponseReceivedFromAPI);
    const { proPlanFullPricePerMonthPayYearly, proPlanFullPricePerMonthPayMonthly } = defaultPricing;
    const { couponDiscountValue, couponReceived, couponViewed, couponMatchFound, couponStillValid, enterprisePlanCouponPricePerMonthPayMonthly, enterprisePlanCouponPricePerMonthPayYearly, proPlanCouponPricePerMonthPayYearly, proPlanCouponPricePerMonthPayMonthly, validForEnterprisePlan, validForProfessionalPlan } = lastCouponResponseReceivedFromAPI;

    // These values are different based on the plan chosen
    let contactSalesRequired;
    let numberOfMonthsService = 0;
    let payByMonthCostPerMonth = 0;
    let payByYearCostPerYear = 0;
    let planPriceForDisplayBilledMonthly;
    let planPriceForDisplayBilledYearly;
    // let currentSelectedPlanCostForPayment;
    if (couponMatchFound && couponStillValid) {
      if (pricingPlanChosen === 'enterprise') {
        if (validForEnterprisePlan) {
          contactSalesRequired = false;
          planPriceForDisplayBilledMonthly = enterprisePlanCouponPricePerMonthPayMonthly;
          planPriceForDisplayBilledYearly = enterprisePlanCouponPricePerMonthPayYearly;
        } else {
          contactSalesRequired = true;
        }
      } else if (validForProfessionalPlan) {
        planPriceForDisplayBilledMonthly = proPlanCouponPricePerMonthPayMonthly;
        planPriceForDisplayBilledYearly = proPlanCouponPricePerMonthPayYearly;
      } else {
        planPriceForDisplayBilledMonthly = proPlanFullPricePerMonthPayMonthly;
        planPriceForDisplayBilledYearly = proPlanFullPricePerMonthPayYearly;
      }
    } else if (pricingPlanChosen === 'enterprise') {
      contactSalesRequired = true;
    } else {
      contactSalesRequired = false;
      planPriceForDisplayBilledMonthly = proPlanFullPricePerMonthPayMonthly;
      planPriceForDisplayBilledYearly = proPlanFullPricePerMonthPayYearly;
    }
    if (radioGroupValue === 'annualPlanRadio') {
      // currentSelectedPlanCostForPayment = planPriceForDisplayBilledYearly;
      payByYearCostPerYear = 12 * planPriceForDisplayBilledYearly;
      numberOfMonthsService = 12;
    } else {
      // currentSelectedPlanCostForPayment = planPriceForDisplayBilledMonthly;
      payByMonthCostPerMonth = planPriceForDisplayBilledMonthly;
      numberOfMonthsService = 1;
    }

    this.setState({
      amountPaidViaStripe: DonateStore.getAmountPaidViaStripe(),
      contactSalesRequired,
      couponDiscountValue, // Replace this dollar discount with percentage
      // currentSelectedPlanCostForPayment: this.convertPriceFromPenniesToDollars(currentSelectedPlanCostForPayment),
      defaultPricing,
      isCouponCodeApplied: couponMatchFound,
      lastCouponResponseReceivedFromAPI,
      numberOfMonthsService,
      payByMonthCostPerMonth,
      payByYearCostPerYear,
      planPriceForDisplayBilledMonthly: this.convertPriceFromPenniesToDollars(planPriceForDisplayBilledMonthly),
      planPriceForDisplayBilledYearly: this.convertPriceFromPenniesToDollars(planPriceForDisplayBilledYearly),
      validForProfessionalPlan,
      validForEnterprisePlan,
    });

    if (couponReceived && !couponViewed) {
      console.log('couponViewed:', couponViewed);
      if (couponMatchFound === false) {
        this.setState({ couponCodeError: true, couponCodeInputValue: '' });
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          DonateActions.setLatestCouponViewed(true);
          this.setState({ couponCodeError: false });
        }, 3000);
      } else if (couponStillValid === false) {
        this.setState({ couponCodeError: true, couponCodeInputValue: '' });
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          DonateActions.setLatestCouponViewed(true);
          this.setState({ couponCodeError: false });
        }, 3000);
      }
    }
  };

  backToApplyCoupon = () => {
    this.setState({ paidAccountProcessStep: 'selectPlanDetailsMobile' });
  }

  moveToPayForPlanStep = () => {
    if (window.innerWidth > 768) {
      this.setState({
        paidAccountProcessStep: 'payForPlanDesktop',
      });
    } else {
      this.setState({
        paidAccountProcessStep: 'payForPlanMobile',
      });
    }
  }

  pricingPlanChosenFunction = (pricingPlanChosen) => {
    const pathname = normalizedHref();
    // console.log('pricingPlanChosenFunction pricingPlanChosen:', pricingPlanChosen);
    const pricingPlanChosenCleaned = pricingPlanChosen || '';
    const { activePaidPlanChosen, radioGroupValue, defaultPricing, lastCouponResponseReceivedFromAPI } = this.state;
    // console.log('pricingPlanChosenFunction pricingPlanChosen:', pricingPlanChosen, ', lastCouponResponseReceivedFromAPI:', lastCouponResponseReceivedFromAPI);
    if (pricingPlanChosenCleaned === activePaidPlanChosen) {
      this.setState({
        paidAccountProcessStep: 'activePaidPlanExists',
        pricingPlanChosen: pricingPlanChosenCleaned,
      });
    } else if (window.innerWidth > 768 && pricingPlanChosen !== 'free') {
      this.setState({
        paidAccountProcessStep: 'payForPlanDesktop',
        pricingPlanChosen: pricingPlanChosenCleaned,
      });
    } else if (pricingPlanChosen !== 'free') {
      this.setState({
        paidAccountProcessStep: 'selectPlanDetailsMobile',
        pricingPlanChosen: pricingPlanChosenCleaned,
      });
    } else {
      this.props.toggleFunction(pathname);
    }

    // let currentSelectedPlanCostForPro = 0;
    // let currentSelectedPlanCostForEnterprise = 0;
    const enterprisePlanPriceForDisplayBilledYearly = lastCouponResponseReceivedFromAPI.validForEnterprisePlan ? lastCouponResponseReceivedFromAPI.enterprisePlanCouponPricePerMonthPayYearly : defaultPricing.enterprisePlanFullPricePerMonthPayYearly;
    const enterprisePlanPriceForDisplayBilledMonthly = lastCouponResponseReceivedFromAPI.validForEnterprisePlan ? lastCouponResponseReceivedFromAPI.enterprisePlanCouponPricePerMonthPayMonthly : defaultPricing.enterprisePlanFullPricePerMonthPayMonthly;
    let numberOfMonthsService = 0;
    let payByMonthCostPerMonth = 0;
    let payByYearCostPerYear = 0;
    const proPlanPriceForDisplayBilledYearly = lastCouponResponseReceivedFromAPI.validForProfessionalPlan ? lastCouponResponseReceivedFromAPI.proPlanCouponPricePerMonthPayYearly : defaultPricing.proPlanFullPricePerMonthPayYearly;
    const proPlanPriceForDisplayBilledMonthly = lastCouponResponseReceivedFromAPI.validForProfessionalPlan ? lastCouponResponseReceivedFromAPI.proPlanCouponPricePerMonthPayMonthly : defaultPricing.proPlanFullPricePerMonthPayMonthly;

    if (radioGroupValue === 'annualPlanRadio') {
      // currentSelectedPlanCostForPro = proPlanPriceForDisplayBilledYearly;
      // currentSelectedPlanCostForEnterprise = enterprisePlanPriceForDisplayBilledYearly;
      numberOfMonthsService = 12;
    } else {
      // currentSelectedPlanCostForPro = proPlanPriceForDisplayBilledMonthly;
      // currentSelectedPlanCostForEnterprise = enterprisePlanPriceForDisplayBilledMonthly;
      numberOfMonthsService = 1;
    }

    switch (pricingPlanChosen) {
      case 'professional':
        if (numberOfMonthsService === 1) {
          payByMonthCostPerMonth = proPlanPriceForDisplayBilledMonthly;
        } else {
          payByYearCostPerYear = proPlanPriceForDisplayBilledYearly * 12;
        }
        this.setState({
          contactSalesRequired: false,
          numberOfMonthsService,
          payByMonthCostPerMonth,
          payByYearCostPerYear,
          planPriceForDisplayBilledMonthly: this.convertPriceFromPenniesToDollars(proPlanPriceForDisplayBilledMonthly),
          planPriceForDisplayBilledYearly: this.convertPriceFromPenniesToDollars(proPlanPriceForDisplayBilledYearly),
          // currentSelectedPlanCostForPayment: this.convertPriceFromPenniesToDollars(currentSelectedPlanCostForPro),
        });
        // console.log('lastCouponResponseReceivedFromAPI.validForProfessionalPlan:', lastCouponResponseReceivedFromAPI.validForProfessionalPlan);
        if (lastCouponResponseReceivedFromAPI.validForProfessionalPlan) {
          // Leave other values in place
          this.setState({
            isCouponCodeApplied: true,
          });
        } else {
          this.setState({
            isCouponCodeApplied: false,
            couponDiscountValue: 0,
            couponCodeInputValue: '',
          });
        }
        break;
      case 'enterprise':
        if (numberOfMonthsService === 1) {
          payByMonthCostPerMonth = enterprisePlanPriceForDisplayBilledMonthly;
        } else {
          payByYearCostPerYear = enterprisePlanPriceForDisplayBilledYearly * 12;
        }
        this.setState({
          // currentSelectedPlanCostForPayment: this.convertPriceFromPenniesToDollars(currentSelectedPlanCostForEnterprise),
          numberOfMonthsService,
          payByMonthCostPerMonth,
          payByYearCostPerYear,
          planPriceForDisplayBilledMonthly: this.convertPriceFromPenniesToDollars(enterprisePlanPriceForDisplayBilledMonthly),
          planPriceForDisplayBilledYearly: this.convertPriceFromPenniesToDollars(enterprisePlanPriceForDisplayBilledYearly),
        });
        // console.log('lastCouponResponseReceivedFromAPI.validForEnterprisePlan:', lastCouponResponseReceivedFromAPI.validForEnterprisePlan);
        if (lastCouponResponseReceivedFromAPI.validForEnterprisePlan) {
          // Leave other values in place
          this.setState({
            contactSalesRequired: false,
            isCouponCodeApplied: true,
          });
        } else {
          this.setState({
            contactSalesRequired: true,
            isCouponCodeApplied: false,
            couponDiscountValue: 0,
            couponCodeInputValue: '',
          });
        }
        break;
      default:
        if (numberOfMonthsService === 1) {
          payByMonthCostPerMonth = proPlanPriceForDisplayBilledMonthly;
        } else {
          payByYearCostPerYear = proPlanPriceForDisplayBilledYearly * 12;
        }
        this.setState({
          contactSalesRequired: false,
          // currentSelectedPlanCostForPayment: this.convertPriceFromPenniesToDollars(currentSelectedPlanCostForPro),
          numberOfMonthsService,
          payByMonthCostPerMonth,
          payByYearCostPerYear,
          planPriceForDisplayBilledMonthly: this.convertPriceFromPenniesToDollars(proPlanPriceForDisplayBilledMonthly),
          planPriceForDisplayBilledYearly: this.convertPriceFromPenniesToDollars(proPlanPriceForDisplayBilledYearly),
        });
    }
  }

  handleRadioGroupChange = (event) => {
    const { radioGroupValue, planPriceForDisplayBilledMonthly, planPriceForDisplayBilledYearly } = this.state;
    if (radioGroupValue !== event.target.value) {
      this.setState({
        radioGroupValue: event.target.value || '',
      });
    }
    let numberOfMonthsService;
    let payByMonthCostPerMonth = 0;
    let payByYearCostPerYear = 0;
    if (event.target.value === 'annualPlanRadio') {
      numberOfMonthsService = 12;
      payByMonthCostPerMonth = 0;
      payByYearCostPerYear = planPriceForDisplayBilledYearly * 12 * 100;
      this.setState({
        // currentSelectedPlanCostForPayment: planPriceForDisplayBilledYearly,
        numberOfMonthsService,
        payByMonthCostPerMonth,
        payByYearCostPerYear,
      });
    } else {
      numberOfMonthsService = 1;
      payByMonthCostPerMonth = planPriceForDisplayBilledMonthly * 100;
      payByYearCostPerYear = 0;
      this.setState({
        // currentSelectedPlanCostForPayment: planPriceForDisplayBilledMonthly,
        numberOfMonthsService,
        payByMonthCostPerMonth,
        payByYearCostPerYear,
      });
    }
  }

  paymentProcessedFunction () {
    this.setState({
      paidAccountProcessStep: 'paymentProcessed',
    });
  }

  backToChoosePlan () {
    this.setState({ paidAccountProcessStep: 'choosePlan' });
  }

  resetCouponCode () {
    const { defaultPricing, pricingPlanChosen, radioGroupValue } = this.state;

    let numberOfMonthsService = 0;
    let payByMonthCostPerMonth = 0;
    let payByYearCostPerYear = 0;
    let planPriceForDisplayBilledMonthly = 0;
    let planPriceForDisplayBilledYearly = 0;
    // let currentSelectedPlanCostForPayment = 0;
    let contactSalesRequired;
    if (pricingPlanChosen === 'enterprise') {
      contactSalesRequired = true;
      planPriceForDisplayBilledMonthly = defaultPricing.enterprisePlanFullPricePerMonthPayMonthly;
      planPriceForDisplayBilledYearly = defaultPricing.enterprisePlanFullPricePerMonthPayYearly;
    } else {
      contactSalesRequired = false;
      planPriceForDisplayBilledMonthly = defaultPricing.proPlanFullPricePerMonthPayMonthly;
      planPriceForDisplayBilledYearly = defaultPricing.proPlanFullPricePerMonthPayYearly;
    }
    if (radioGroupValue === 'annualPlanRadio') {
      // currentSelectedPlanCostForPayment = planPriceForDisplayBilledYearly;
      payByYearCostPerYear = 12 * planPriceForDisplayBilledYearly;
      numberOfMonthsService = 12;
    } else {
      // currentSelectedPlanCostForPayment = planPriceForDisplayBilledMonthly;
      payByMonthCostPerMonth = planPriceForDisplayBilledMonthly;
      numberOfMonthsService = 1;
    }
    this.setState({
      contactSalesRequired,
      isCouponCodeApplied: false,
      couponCodeInputValue: '',
      // currentSelectedPlanCostForPayment: this.convertPriceFromPenniesToDollars(currentSelectedPlanCostForPayment),
      numberOfMonthsService,
      payByMonthCostPerMonth,
      payByYearCostPerYear,
      planPriceForDisplayBilledMonthly: this.convertPriceFromPenniesToDollars(planPriceForDisplayBilledMonthly),
      planPriceForDisplayBilledYearly: this.convertPriceFromPenniesToDollars(planPriceForDisplayBilledYearly),
      lastCouponResponseReceivedFromAPI: {},
      couponDiscountValue: 0,
    });
  }

  checkCouponCodeValidity () {
    const { couponCodeInputValue } = this.state;
    DonateActions.couponSummaryRetrieve(couponCodeInputValue);
  }

  closePaidAccountUpgradeModal () {
    this.props.toggleFunction(normalizedHref());
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
    renderLog('PaidAccountUpgradeModal');  // Set LOG_RENDER_EVENTS to log all renders
    const pathname = normalizedHref();
    const { classes } = this.props;
    const {
      activePaidPlanChosen, activePaidPlanChosenDisplay, amountPaidViaStripe, numberOfMonthsService,
      // TODO 5/11/21: payByMonthCostPerMonth,
      // TODO 5/11/21: payByYearCostPerYear,
      contactSalesRequired, radioGroupValue, couponCodeInputValue, couponDiscountValue,
      isCouponCodeApplied, paidAccountProcessStep, pricingPlanChosen, couponCodeError, planPriceForDisplayBilledMonthly,
      planPriceForDisplayBilledYearly,
    } = this.state;
    // console.log('currentSelectedPlanCostForPayment:', currentSelectedPlanCostForPayment);
    // console.log(this.state);

    let modalTitle = '';
    let backToButton;
    let modalHtmlContents = <span />;
    const planNameTitle = `${pricingPlanChosen || ''} Plan`;
    const couponDiscountValueString = ` $${couponDiscountValue}`;

    switch (paidAccountProcessStep) {
      case 'choosePlan':
      default:
        modalTitle = 'Choose Your Plan';
        modalHtmlContents = (
          <Pricing
            initialPricingChoice="campaigns"
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
        modalTitle = 'Billing Options';
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
              {activePaidPlanChosen && (
                <div
                  className={classes.couponAlertError}
                >
                  You are already subscribed to a
                  {' '}
                  {activePaidPlanChosenDisplay}
                  {' '}
                  Plan.
                </div>
              )}
              {contactSalesRequired ? (
                <Suspense fallback={<></>}>
                  <OpenExternalWebSite
                    linkIdAttribute="weVoteSupportPaidAccountUpgradeModalMobile"
                    className="open-web-site"
                    url="https://help.wevote.us/hc/en-us/requests/new"
                    target="_blank"
                    body={<div>Contact Sales for Enterprise Coupon Code</div>}
                  />
                </Suspense>
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
                              <PriceLabel>{planPriceForDisplayBilledYearly}</PriceLabel>
                              <PriceLabelSubText> /month</PriceLabelSubText>
                              <MobilePricingPlanName>Billed Yearly</MobilePricingPlanName>
                            </>
                          )}
                          onClick={this.handleRadioGroupChoiceSubdomain}
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
                              <PriceLabelSubText> /month</PriceLabelSubText>
                              <MobilePricingPlanName>Billed Monthly</MobilePricingPlanName>
                            </>
                          )}
                          onClick={this.handleRadioGroupChoiceSubdomain}
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
                onClick={this.moveToPayForPlanStep}
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
            Billing Options
          </Button>
        );
        modalTitle = 'Credit Card';
        modalHtmlContents = (
          <MobileWrapper>
            {/* TODO 5/11/21: <StripeProvider apiKey={webAppConfig.STRIPE_API_KEY}> */}
            {/*  <Elements> */}
            {/*    <SettingsStripePayment */}
            {/*      numberOfMonthsService={numberOfMonthsService} */}
            {/*      payByMonthCostPerMonth={payByMonthCostPerMonth} */}
            {/*      payByYearCostPerYear={payByYearCostPerYear} */}
            {/*      paymentProcessedFunction={this.paymentProcessedFunction} */}
            {/*      pricingPlanChosen={pricingPlanChosen} */}
            {/*    /> */}
            {/*  </Elements> */}
            {/* </StripeProvider> */}
          </MobileWrapper>
        );
        break;
      case 'payForPlanDesktop':
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
                {activePaidPlanChosen && (
                  <div
                    className={classes.couponAlertError}
                  >
                    You are already subscribed to a
                    {' '}
                    {activePaidPlanChosenDisplay}
                    {' '}
                    Plan.
                  </div>
                )}
                {contactSalesRequired ? (
                  <Suspense fallback={<></>}>
                    <OpenExternalWebSite
                      linkIdAttribute="weVoteSupportPaidAccountUpgradeModalDesktop"
                      className="open-web-site"
                      url="https://help.wevote.us/hc/en-us/requests/new"
                      target="_blank"
                      body={<div>Contact Sales for Enterprise Coupon Code</div>}
                    />
                  </Suspense>
                ) : (
                  <>
                    <Fieldset disabledMode={(radioGroupValue !== 'annualPlanRadio')}>
                      <Legend>
                        Billed Yearly
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
                                <PriceLabel>{planPriceForDisplayBilledYearly}</PriceLabel>
                                <PriceLabelSubText> /month</PriceLabelSubText>
                              </>
                            )}
                            onClick={this.handleRadioGroupChoiceSubdomain}
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
                                <PriceLabelSubText> /month</PriceLabelSubText>
                              </>
                            )}
                            onClick={this.handleRadioGroupChoiceSubdomain}
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
                  <SectionTitle>Credit Card</SectionTitle>
                  {/* TODO 5/12/21 reimplement this: <StripeProvider apiKey={webAppConfig.STRIPE_API_KEY}> */}
                  {/*  <Elements> */}
                  {/*    <SettingsStripePayment */}
                  {/*      numberOfMonthsService={numberOfMonthsService} */}
                  {/*      payByMonthCostPerMonth={payByMonthCostPerMonth} */}
                  {/*      payByYearCostPerYear={payByYearCostPerYear} */}
                  {/*      paymentProcessedFunction={this.paymentProcessedFunction} */}
                  {/*      pricingPlanChosen={pricingPlanChosen} */}
                  {/*    /> */}
                  {/*  </Elements> */}
                  {/* </StripeProvider> */}
                </div>
              </WrapperRight>
            </div>
          </Row>
        );
        break;
      case 'paymentProcessed':
        modalTitle = 'Invoice';
        modalHtmlContents = (
          <Wrapper>
            <InvoiceItem>
              <InvoiceTitle>Plan</InvoiceTitle>
              <InvoiceValue>{pricingPlanChosen}</InvoiceValue>
            </InvoiceItem>
            <InvoiceItem>
              <InvoiceTitle>Amount Paid</InvoiceTitle>
              <InvoiceValue>
                $
                {amountPaidViaStripe / 100}
              </InvoiceValue>
            </InvoiceItem>
            <InvoiceItem>
              <InvoiceTitle>Period</InvoiceTitle>
              <InvoiceValue>{numberOfMonthsService === 1 ? 'Monthly' : 'Annually'}</InvoiceValue>
            </InvoiceItem>
            <InvoiceItem>
              <InvoiceTitle>Payment Method</InvoiceTitle>
              <InvoiceValue>PayPal</InvoiceValue>
            </InvoiceItem>
            <InvoiceItem>
              <InvoiceTitle>Next Invoice</InvoiceTitle>
              <InvoiceValue>10/10/19</InvoiceValue>
            </InvoiceItem>
            <InvoiceButtonsContainer>
              <Button
                color="primary"
                variant="outlined"
              >
                Download PDF
              </Button>
              <Button
                color="primary"
                onClick={() => { this.props.toggleFunction(pathname); }}
                variant="contained"
              >
                Back To Settings
              </Button>
            </InvoiceButtonsContainer>
          </Wrapper>
        );
        break;
      case 'activePaidPlanExists':
        backToButton = (
          <Button className={classes.backToButton} onClick={this.backToChoosePlan}>
            {isIOS() ? <ArrowBackIos /> : <ArrowBack />}
            Choose Different Plan
          </Button>
        );
        modalTitle = 'Current Subscription';
        modalHtmlContents = (
          <span>
            You are already subscribed to the
            {' '}
            {activePaidPlanChosenDisplay}
            {' '}
            Plan.
            <ButtonsContainer>
              <Button
                color="primary"
                onClick={() => { this.props.toggleFunction(pathname); }}
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
        onClose={() => { this.props.toggleFunction(pathname); }}
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
            <Close />
          </IconButton>
        </ModalTitleArea>
        {paidAccountProcessStep === 'choosePlan' ? (
          <DialogContent classes={{ root: classes.dialogContentWhite }}>
            <Suspense fallback={<></>}>
              {modalHtmlContents}
            </Suspense>
          </DialogContent>
        ) : (
          <DialogContent classes={{ root: classes.dialogContent }}>
            <Suspense fallback={<></>}>
              {modalHtmlContents}
            </Suspense>
          </DialogContent>
        )}
      </Dialog>
    );
  }
}
PaidAccountUpgradeModal.propTypes = {
  classes: PropTypes.object,
  initialPaidAccountProcessStep: PropTypes.string,
  initialPricingPlan: PropTypes.string,
  show: PropTypes.bool,
  // stripe: PropTypes.object,
  toggleFunction: PropTypes.func.isRequired,
};

const styles = () => ({
  button: {
    marginRight: 8,
  },
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 769px)': {
      maxWidth: '600px',
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
      padding: '8px 8px 8px',
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
    top: 4,
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
      // height: 35,
      fontSize: 14,
    },
    '@media (max-width: 769px)': {
      // height: 45,
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
    // height: 40,
    fontSize: 14,
    width: '100%',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    '@media (max-width: 569px)': {
      // height: 35,
      fontSize: 14,
    },
    '@media (max-width: 769px)': {
      // height: 45,
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
  padding: 12px 12px 4px 12px;
  ${({ noBoxShadowMode }) => ((noBoxShadowMode) ? '' : 'box-shadow: 0 20px 40px -25px #999')};
  z-index: 999;
  @media (min-width: 769px) {
    text-align: center;
    ${({ noBoxShadowMode }) => ((noBoxShadowMode) ? '' : 'box-shadow: none')};
    border-bottom: 2px solid #f7f7f7;
  }
  ${({ noBoxShadowMode }) => ((noBoxShadowMode) ? '@media (max-width: 376px) {\n    padding: 8px 6px;\n  }' : '')}
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


const Title = styled.h3`
  font-weight: bold;
  font-size: 24px;
  margin-top: 8px;
  padding: 0 10px;
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
  padding: 16px 18px 16px;
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

const Wrapper = styled.div`
  padding: 12px 30px;
  @media (max-width: 500px) {
    padding: 12px 0;
  }
`;

const InvoiceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  @media (max-width: 500px) {
    display: block;
  }
`;

const InvoiceTitle = styled.div`
  @media (max-width: 500px) {
    font-size: 16px;
  }
  color: #aaa;
  font-weight: bold;
  font-size: 18px;
`;

const InvoiceValue = styled.div`
  color: #000;
  font-weight: bold;
  font-size: 18px;
`;

const InvoiceButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 16px;
  @media(max-width: 500px) {
    display: block;
    padding: 0;
  }
  padding: 10px;
  * {
    width: 50%;
    @media(max-width: 500px) {
      width: 100%;
    }
  }
  >:first-child {
    margin-bottom: 8px;
    @media(min-width: 501px) {
      margin: 0 8px 0 0;
    }
  }
  >:last-child {
    @media(min-width: 501px) {
      margin: 0 0 0 8px;
    }
  }
`;

export default withTheme(withStyles(styles)(PaidAccountUpgradeModal));
