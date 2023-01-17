import { CheckCircle } from '@mui/icons-material';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import DonateActions from '../../common/actions/DonateActions';
import DonateStore from '../../common/stores/DonateStore';
import { cordovaOpenSafariView } from '../../common/utils/cordovaUtils';
import { formatDateToYearMonthDay } from '../../common/utils/dateFormat';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import AppObservableStore from '../../common/stores/AppObservableStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import CreateConfiguredVersion from './CreateConfiguredVersion';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ '../../common/components/SignIn/SignInOptionsPanel'));


class SettingsSubscriptionPlan extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organization: {},
      organizationWeVoteId: '',
      voter: {},
      windowWidth: 0,
      mobileMode: false,
      subscriptionJournalHistory: {
        created: '',
        amount: '',
      },
      subscriptionJournalHistoryCount: 0,
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount () {
    // console.log("SettingsSubscriptionPlan componentDidMount");
    // disabled 6/10/21, needs to be revived: this.onVoterStoreChange();
    // disabled 6/10/21, needs to be revived: this.onDonateStoreChange();
    // disabled 6/10/21, needs to be revived: this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
    // disabled 6/10/21, needs to be revived: this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    // disabled 6/10/21, needs to be revived: this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // disabled 6/10/21, needs to be revived: DonateActions.donationRefreshDonationList();

    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.chosenFeaturePackage !== nextState.chosenFeaturePackage) {
      // console.log('this.state.chosenFeaturePackage', this.state.chosenFeaturePackage, ', nextState.chosenFeaturePackage', nextState.chosenFeaturePackage);
      return true;
    }
    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('this.state.organizationWeVoteId', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId', nextState.organizationWeVoteId);
      return true;
    }
    if (this.state.voterIsSignedIn !== nextState.voterIsSignedIn) {
      // console.log('this.state.voterIsSignedIn', this.state.voterIsSignedIn, ', nextState.voterIsSignedIn', nextState.voterIsSignedIn);
      return true;
    }
    if (this.state.windowWidth !== nextState.windowWidth) {
      // console.log('this.state.windowWidth', this.state.windowWidth, ', nextState.windowWidth', nextState.windowWidth);
      return true;
    }
    if (this.state.mobileMode !== nextState.mobileMode) {
      // console.log('this.state.mobileMode', this.state.mobileMode, ', nextState.mobileMode', nextState.mobileMode);
      return true;
    }
    if (this.state.activePaidPlanChosen !== nextState.activePaidPlanChosen) {
      // console.log('this.state.activePaidPlanChosen', this.state.activePaidPlanChosen, ', nextState.activePaidPlanChosen', nextState.activePaidPlanChosen);
      return true;
    }
    if (this.state.subscriptionJournalHistoryCount !== nextState.subscriptionJournalHistoryCount) {
      // console.log('this.state.subscriptionJournalHistoryCount', this.state.subscriptionJournalHistoryCount, ', nextState.subscriptionJournalHistoryCount', nextState.subscriptionJournalHistoryCount);
      return true;
    }

    const priorOrganization = this.state.organization;
    const nextOrganization = nextState.organization;

    const priorWeVoteCustomDomain = priorOrganization.we_vote_custom_domain || '';
    const nextWeVoteCustomDomain = nextOrganization.we_vote_custom_domain || '';

    if (priorWeVoteCustomDomain !== nextWeVoteCustomDomain) {
      // console.log('priorWeVoteCustomDomain', priorWeVoteCustomDomain, ', nextWeVoteCustomDomain', nextWeVoteCustomDomain);
      return true;
    }
    // console.log('shouldComponentUpdate false');
    return false;
  }

  componentWillUnmount () {
    // disabled 6/10/21, needs to be revived: this.donateStoreListener.remove();
    // disabled 6/10/21, needs to be revived: this.organizationStoreListener.remove();
    // disabled 6/10/21, needs to be revived: this.voterStoreListener.remove();
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize () {
    this.setState({
      windowWidth: window.innerWidth,
    });

    if (window.innerWidth < 569) {
      this.setState({ mobileMode: true });
    } else if (window.innerWidth >= 569) {
      this.setState({ mobileMode: false });
    }
  }

  onDonateStoreChange = () => {
    const activePaidPlan = DonateStore.getActivePaidPlan();
    let activePaidPlanChosen = '';
    let activePaidPlanChosenDisplay = '';
    // let activePaidPlanBillingFrequency = '';
    let activePaidPlanBillingFrequencyDisplay = '';
    // Kind of plan
    if (stringContains('PROFESSIONAL', activePaidPlan.premium_plan_type_enum)) {
      activePaidPlanChosen = 'professional';
      activePaidPlanChosenDisplay = 'Professional Plan';
    } else if (stringContains('ENTERPRISE', activePaidPlan.premium_plan_type_enum)) {
      activePaidPlanChosen = 'enterprise';
      activePaidPlanChosenDisplay = 'Enterprise Plan';
    } else {
      activePaidPlanChosen = 'free';
      activePaidPlanChosenDisplay = 'Free Plan';
    }
    // Billing frequency
    if (stringContains('MONTHLY', activePaidPlan.premium_plan_type_enum)) {
      // activePaidPlanBillingFrequency = 'monthly';
      activePaidPlanBillingFrequencyDisplay = 'Billed Monthly';
    } else if (stringContains('YEARLY', activePaidPlan.premium_plan_type_enum)) {
      // activePaidPlanBillingFrequency = 'yearly';
      activePaidPlanBillingFrequencyDisplay = 'Billed Yearly';
    } else if (stringContains('ONCE', activePaidPlan.premium_plan_type_enum)) {
      // activePaidPlanBillingFrequency = 'once';
      activePaidPlanBillingFrequencyDisplay = 'One Time Payment';
    } else {
      // activePaidPlanBillingFrequency = '';
      activePaidPlanBillingFrequencyDisplay = '';
    }
    const subscriptionJournalHistoryRaw = DonateStore.getSubscriptionJournalHistory();
    const subscriptionJournalHistory = subscriptionJournalHistoryRaw.filter((item) => item.record_enum !== 'SUBSCRIPTION_SETUP_AND_INITIAL');
    const subscriptionJournalHistoryCount = subscriptionJournalHistory.length;
    const nextInvoice = DonateStore.getNextInvoice();
    const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
    this.setState({
      activePaidPlanChosen,
      activePaidPlanChosenDisplay,
      // activePaidPlanBillingFrequency,
      activePaidPlanBillingFrequencyDisplay,
      chosenFeaturePackage,
      nextInvoice,
      subscriptionJournalHistory,
      subscriptionJournalHistoryCount,
    });
  };

  onOrganizationStoreChange = () => {
    const { organizationWeVoteId } = this.state;
    const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
    this.setState({
      chosenFeaturePackage,
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
    });
  };

  onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    const organizationWeVoteId = voter.linked_organization_we_vote_id;
    const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
    this.setState({
      chosenFeaturePackage,
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
      organizationWeVoteId,
      voter,
      voterIsSignedIn,
    });
  };

  openPaidAccountUpgradeModal = (paidAccountUpgradeMode) => {
    AppObservableStore.setShowPaidAccountUpgradeModal(paidAccountUpgradeMode);
  };

  onChangePlan = () => {
    const { activePaidPlanChosen } = this.state;
    let paidAccountUpgradeMode = '';
    switch (activePaidPlanChosen) {
      default:
      case 'free':
        paidAccountUpgradeMode = 'professional';
        break;
      case 'professional':
        paidAccountUpgradeMode = 'enterprise';
        break;
      case 'enterprise':
        paidAccountUpgradeMode = 'professional';
        break;
    }

    if (isWebApp()) {
      this.openPaidAccountUpgradeModal(paidAccountUpgradeMode);
    } else {
      cordovaOpenSafariView('https://wevote.us/more/pricing', null, 50);
    }
  };

  onCancelPlan = () => {
    const activePaidPlan = DonateStore.getActivePaidPlan();
    const subscriptionId = '';
    // console.log('onCancelPlan');
    DonateActions.donationCancelSubscriptionAction(subscriptionId, activePaidPlan.premium_plan_type_enum);
  };

  render () {
    renderLog('SettingsSubscriptionPlan');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      activePaidPlanChosen, activePaidPlanChosenDisplay, activePaidPlanBillingFrequencyDisplay, chosenFeaturePackage,
      nextInvoice, organization, organizationWeVoteId, subscriptionJournalHistory, subscriptionJournalHistoryCount,
      voter, voterIsSignedIn, mobileMode,
    } = this.state;
    const { classes, externalUniqueId } = this.props;
    if (!voter || !organizationWeVoteId) {
      // disabled 6/10/21, needs to be revived: return LoadingWheel;
      return (
        <h1 style={{
          margin: '50px 0 0 100px',
          fontSize: '18pt',
        }}
        >
          Coming soon
        </h1>
      );
    }

    if (!voterIsSignedIn) {
      // console.log('voterIsSignedIn is false');
      return (
        <Suspense fallback={<></>}>
          <DelayedLoad waitBeforeShow={1000}>
            <SignInOptionsPanel />
          </DelayedLoad>
        </Suspense>
      );
    }

    if (organization && organization.we_vote_custom_domain) {
      // console.log('SettingsSubscriptionPlan, Custom Domain: ', organization.we_vote_custom_domain);
    }

    let subscriptionPageHtmlContents = (<span />);

    if (mobileMode) {
      subscriptionPageHtmlContents = (
        <MobileWrapper className="d-block d-sm-none">
          <SectionCardMobile className="u-position-relative">
            <SectionTitle>
              Your Plan
            </SectionTitle>
            {chosenFeaturePackage === 'FREE' && (
              <>
                <CreateConfiguredVersion />
                <Separator />
              </>
            )}
            <h4 className="h4">
              <strong>
                {activePaidPlanChosenDisplay}
                {' '}
                {activePaidPlanBillingFrequencyDisplay && <span>•</span>}
                {' '}
                {activePaidPlanBillingFrequencyDisplay}
              </strong>
            </h4>
            <Button
              id={`changePlanButton-${externalUniqueId}`}
              classes={{ root: classes.changeCancelPlanButton }}
              color="primary"
              onClick={this.onChangePlan}
              size="small"
              variant="outlined"
            >
              Change Plan
            </Button>
          </SectionCardMobile>
          {nextInvoice && nextInvoice.next_invoice_found && (
            <>
              <SectionCardMobile className="u-position-relative">
                <SectionTitle>
                  Payment Method
                </SectionTitle>
                {/*
                <EditIcon>
                  <IconButton size="medium" classes={{ root: classes.iconButton }}>
                    <Edit />
                  </IconButton>
                </EditIcon>
                */}
                <SectionParagraph>
                  <InvoiceFlexContainer>
                    <FlexOne>Card ending in</FlexOne>
                    <FlexTwo>
                      ...
                      {nextInvoice.credit_card_last_four}
                    </FlexTwo>
                  </InvoiceFlexContainer>
                  <InvoiceFlexContainer>
                    <FlexOne>Expires</FlexOne>
                    <FlexTwo>{nextInvoice.credit_card_expiration}</FlexTwo>
                  </InvoiceFlexContainer>
                  {nextInvoice.billing_contact && (
                    <InvoiceFlexContainer>
                      <FlexOne>Billing contact</FlexOne>
                      <FlexTwo>{nextInvoice.billing_contact}</FlexTwo>
                    </InvoiceFlexContainer>
                  )}
                </SectionParagraph>
              </SectionCardMobile>
              <SectionCardMobile>
                <SectionTitle>
                  Next Invoice
                </SectionTitle>
                <SectionCard>
                  <SectionParagraph>
                    <InvoiceFlexContainer>
                      <FlexOne>Date</FlexOne>
                      <FlexTwo>{formatDateToYearMonthDay(nextInvoice.invoice_date)}</FlexTwo>
                    </InvoiceFlexContainer>
                    <InvoiceFlexContainer>
                      <FlexOne>Period</FlexOne>
                      <FlexTwo>
                        {formatDateToYearMonthDay(nextInvoice.period_start)}
                        {' '}
                        -
                        {' '}
                        {formatDateToYearMonthDay(nextInvoice.period_end)}
                      </FlexTwo>
                    </InvoiceFlexContainer>
                    <InvoiceFlexContainer>
                      <FlexOne>Amount</FlexOne>
                      <FlexTwo>
                        $
                        {nextInvoice.amount_due}
                      </FlexTwo>
                    </InvoiceFlexContainer>
                  </SectionParagraph>
                  {/*
                  <Button color="primary" size="small" classes={{ root: classes.viewInvoiceButton }}>
                    View Invoice
                  </Button>
                  */}
                </SectionCard>
              </SectionCardMobile>
            </>
          )}
          <SectionCardMobile>
            <SectionTitle>
              Paid Invoices (
              { subscriptionJournalHistoryCount }
              )
            </SectionTitle>
            {subscriptionJournalHistory.map((row) => {
              if (row.record_enum !== 'SUBSCRIPTION_SETUP_AND_INITIAL') {
                return (
                  <SectionCard key={`mobile-${row.donation_journal_id}`}>
                    <SectionParagraph>
                      <InvoiceFlexContainer>
                        <FlexOne>Date</FlexOne>
                        <FlexTwo>{formatDateToYearMonthDay(row.created)}</FlexTwo>
                      </InvoiceFlexContainer>
                      <InvoiceFlexContainer>
                        <FlexOne>Period</FlexOne>
                        <FlexTwo>{row.period}</FlexTwo>
                      </InvoiceFlexContainer>
                      <InvoiceFlexContainer>
                        <FlexOne>Amount</FlexOne>
                        <FlexTwo>
                          $
                          {row.amount}
                        </FlexTwo>
                      </InvoiceFlexContainer>
                    </SectionParagraph>
                    {/*
                    <Button
                      color="primary"
                      size="small"
                      classes={{ root: classes.viewInvoiceButton }}
                    >
                      View Invoice
                    </Button>
                    */}
                  </SectionCard>
                );
              } else {
                return null;
              }
            })}
            {/* subscriptionJournalHistoryCount > 3 && (
              <Button size="small" classes={{ root: classes.showMoreButton }}>
                Show More
                <ArrowBackIos classes={{ root: classes.showMoreIcon }} />
              </Button>
            ) */}
          </SectionCardMobile>
          {activePaidPlanChosen !== 'free' && (
            <SectionCardMobile className="u-position-relative">
              <SectionTitle>
                Cancel Plan
              </SectionTitle>
              <SectionParagraph>
                Upon cancelling, your team and members will lose the premium features provided by the
                {' '}
                {activePaidPlanChosenDisplay}
                . Cancelling will switch you to our Free Plan, which provides many features at no cost.
                {/* <a
                  href="https://google.com"
                >
                  {learnMoreLink}
                </a> */}
              </SectionParagraph>
              <Button
                id={`cancelPlanButton-${externalUniqueId}`}
                color="primary"
                classes={{ root: classes.changeCancelPlanButton }}
                onClick={this.onCancelPlan}
                size="small"
                variant="outlined"
              >
                Cancel Plan
              </Button>
            </SectionCardMobile>
          )}
        </MobileWrapper>
      );
    } else {
      subscriptionPageHtmlContents = (
        <Card className="card">
          <CardMain className="card-main">
            <h1 className="h2">Subscription Plan</h1>
            {chosenFeaturePackage === 'FREE' && (
              <>
                <CreateConfiguredVersion />
                <Separator />
              </>
            )}
            <SectionCard className="u-position-relative">
              <SectionTitle>
                Your Plan
              </SectionTitle>
              <h4 className="h4">
                <strong>
                  {activePaidPlanChosenDisplay}
                  {' '}
                  {activePaidPlanBillingFrequencyDisplay && <span>•</span>}
                  {' '}
                  {activePaidPlanBillingFrequencyDisplay}
                </strong>
              </h4>
              <Button
                id={`changePlanButton-${externalUniqueId}`}
                classes={{ root: classes.changeCancelPlanButton }}
                color="primary"
                onClick={this.onChangePlan}
                size="small"
                variant="outlined"
              >
                Change Plan
              </Button>
            </SectionCard>
            {nextInvoice && nextInvoice.next_invoice_found && (
              <>
                <Separator />
                <SectionCard className="u-position-relative">
                  <SectionTitle>
                    Payment Method
                  </SectionTitle>
                  {/*
                  <EditIcon>
                    <IconButton size="medium" classes={{ root: classes.iconButton }}>
                      <Edit />
                    </IconButton>
                  </EditIcon>
                  */}
                  <SectionParagraph>
                    {nextInvoice.credit_card_last_four && (
                      <>
                        Card ending in:
                        {' '}
                        <strong>
                          ...
                          {nextInvoice.credit_card_last_four}
                        </strong>
                      </>
                    )}
                    {(nextInvoice.credit_card_expiration && nextInvoice.credit_card_last_four) && (
                      <>
                        {' '}
                        •
                        {' '}
                      </>
                    )}
                    {nextInvoice.credit_card_expiration && (
                      <>
                        Expires:
                        {' '}
                        <strong>{nextInvoice.credit_card_expiration}</strong>
                      </>
                    )}
                  </SectionParagraph>
                  {nextInvoice.billing_contact && (
                    <SectionParagraph>
                      Billing contact:
                      {' '}
                      <strong>{nextInvoice.billing_contact}</strong>
                    </SectionParagraph>
                  )}
                </SectionCard>
              </>
            )}
            {nextInvoice && nextInvoice.next_invoice_found && (
              <>
                <Separator />
                <SectionCard>
                  <SectionTitle>
                    Next Invoice
                  </SectionTitle>
                  <Table classes={{ root: classes.table }}>
                    <TableHead>
                      <TableRow>
                        <TableCell classes={{ root: classes.tableHeadLeft }}>Date</TableCell>
                        <TableCell classes={{ root: classes.tableHead }}>Period</TableCell>
                        <TableCell classes={{ root: classes.tableHead }}>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell classes={{ root: classes.tableCellLeft }} component="th" scope="row">
                          {formatDateToYearMonthDay(nextInvoice.invoice_date)}
                        </TableCell>
                        <TableCell classes={{ root: classes.tableCell }}>
                          {formatDateToYearMonthDay(nextInvoice.period_start)}
                          {' '}
                          -
                          {' '}
                          {formatDateToYearMonthDay(nextInvoice.period_end)}
                        </TableCell>
                        <TableCell classes={{ root: classes.tableCell }}>
                          $
                          {nextInvoice.amount_due}
                        </TableCell>
                        {/*
                        <TableCell classes={{ root: classes.tableCellRight }} align="right">
                          <Button size="small" color="primary" classes={{ root: classes.viewInvoiceButton }}>View Invoice</Button>
                        </TableCell>
                        */}
                      </TableRow>
                    </TableBody>
                  </Table>
                </SectionCard>
              </>
            )}
            <Separator />
            <SectionCard>
              <SectionTitle>
                Paid Invoices (
                { subscriptionJournalHistoryCount }
                )
              </SectionTitle>
              <Table classes={{ root: classes.table }}>
                <TableHead>
                  <TableRow>
                    <TableCell classes={{ root: classes.tableCellCheckmark }} />
                    <TableCell classes={{ root: classes.tableHead }}>Date</TableCell>
                    <TableCell classes={{ root: classes.tableHead }}>Period</TableCell>
                    <TableCell classes={{ root: classes.tableHead }}>Amount</TableCell>
                    {/*
                    <TableCell classes={{ root: classes.tableHeadRight }} align="right">Actions</TableCell>
                    */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscriptionJournalHistory.map((row) => {
                    if (row.record_enum !== 'SUBSCRIPTION_SETUP_AND_INITIAL') {
                      return (
                        <TableRow key={`desktop-${row.donation_journal_id}`}>
                          <TableCell
                            classes={{ root: classes.tableCellCheckmark }}
                            component="th"
                            scope="row"
                          >
                            <CheckCircle classes={{ root: classes.checkIcon }} />
                          </TableCell>
                          <TableCell classes={{ root: classes.tableCell }}>{formatDateToYearMonthDay(row.created)}</TableCell>
                          <TableCell classes={{ root: classes.tableCell }}>{row.period}</TableCell>
                          <TableCell classes={{ root: classes.tableCell }}>
                            $
                            {row.amount}
                          </TableCell>
                          {/*
                          <TableCell classes={{ root: classes.tableCellRight }} align="right">
                            <Button
                              size="small"
                              color="primary"
                              classes={{ root: classes.viewInvoiceButton }}
                            >
                              View Invoice
                            </Button>
                          </TableCell>
                          */}
                        </TableRow>
                      );
                    } else {
                      return null;
                    }
                  })}
                </TableBody>
              </Table>
              {/* subscriptionJournalHistoryCount > 3 && (
                <Button size="small" classes={{ root: classes.showMoreButton }}>
                  Show More
                  <ArrowBackIos classes={{ root: classes.showMoreIcon }} />
                </Button>
              ) */}
            </SectionCard>
            {activePaidPlanChosen !== 'free' && (
              <>
                <Separator />
                <SectionCard className="u-position-relative">
                  <SectionTitle>
                    Cancel Plan
                  </SectionTitle>
                  <div className="row m-0">
                    <div className="col col-8 p-0">
                      <SectionParagraph>
                        Upon cancelling, your team and members will lose the premium features provided by the
                        {' '}
                        {activePaidPlanChosenDisplay}
                        . You will still have access to your data and analytics already gathered.
                        {' '}
                        Cancelling will switch you to our Free Plan, which provides many features at no cost.
                      </SectionParagraph>
                    </div>
                    <StaticColumn className="col col-4 p-0">
                      <Button
                        classes={{ root: classes.changeCancelPlanButton }}
                        color="primary"
                        onClick={this.onCancelPlan}
                        size="small"
                        variant="outlined"
                      >
                        Cancel Plan
                      </Button>
                    </StaticColumn>
                  </div>
                </SectionCard>
              </>
            )}
          </CardMain>
        </Card>
      );
    }

    return (
      <Wrapper>
        <Helmet title="Domain Settings" />
        {subscriptionPageHtmlContents}
      </Wrapper>
    );
  }
}
SettingsSubscriptionPlan.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
  table: {
    marginBottom: 8,
  },
  tableCellCheckmark: {
    color: 'rgb(31, 192, 111)',
    '@media (min-width: 769px) and (max-width: 937px), (max-width: 632px)': {
      padding: '12px 0 12px 0px !important',
    },
    '@media (min-width: 937px), (max-width: 768px) and (min-width: 633px)': {
      padding: '12px 0 12px 0 !important',
    },
  },
  tableCell: {
    '@media (min-width: 769px) and (max-width: 937px), (max-width: 632px)': {
      padding: '12px 14px 12px 8px !important',
    },
    '@media (min-width: 937px), (max-width: 768px) and (min-width: 633px)': {
      padding: '12px 20px 12px 12px !important',
    },
  },
  tableCellLeft: {
    '@media (min-width: 769px) and (max-width: 937px), (max-width: 632px)': {
      padding: '12px 14px 12px 0px !important',
    },
    '@media (min-width: 937px), (max-width: 768px) and (min-width: 633px)': {
      padding: '12px 20px 12px 0 !important',
    },
  },
  tableCellRight: {
    '@media (min-width: 769px) and (max-width: 937px), (max-width: 632px)': {
      padding: '12px 0 12px 8px !important',
    },
    '@media (min-width: 937px), (max-width: 768px) and (min-width: 633px)': {
      padding: '12px 0 12px 12px !important',
    },
  },
  tableHead: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#000',
    '@media (min-width: 769px) and (max-width: 937px), (max-width: 632px)': {
      padding: '12px 14px 12px 8px !important',
    },
    '@media (min-width: 937px), (max-width: 768px) and (min-width: 633px)': {
      padding: '12px 20px 12px 12px !important',
    },
  },
  tableHeadLeft: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#000',
    '@media (min-width: 769px) and (max-width: 937px), (max-width: 632px)': {
      padding: '12px 14px 12px 0px !important',
    },
    '@media (min-width: 937px), (max-width: 768px) and (min-width: 633px)': {
      padding: '12px 20px 12px 0 !important',
    },
  },
  tableHeadRight: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#000',
    '@media (min-width: 769px) and (max-width: 937px), (max-width: 632px)': {
      padding: '12px 0 12px 8px !important',
    },
    '@media (min-width: 937px), (max-width: 768px) and (min-width: 633px)': {
      padding: '12px 0 12px 12px !important',
    },
  },
  checkIcon: {
    position: 'relative',
    left: '6px',
    bottom: 1,
    fontSize: 20,
  },
  viewInvoiceButton: {
    fontWeight: 'bold',
    fontSize: 12,
    '@media (max-width: 575px)': {
      width: 'calc(100% + 48px)',
      position: 'relative',
      left: '-24px',
      bottom: '-16px',
      border: 'none',
      borderTop: '1px solid #ddd',
      borderRadius: 3,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
      boxShadow: 'none',
      padding: '8px',
    },
  },
  showMoreButton: {
    width: 'calc(100% + 48px)',
    position: 'relative',
    left: '-24px',
    bottom: '-24px',
    border: 'none',
    borderTop: '1px solid #ddd',
    borderRadius: 3,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    color: '#444',
    fontWeight: 'bold',
    textTransform: 'none',
    boxShadow: 'none',
    padding: '8px',
    '@media (max-width: 575px)': {
      width: 'calc(100% + 32px)',
      left: '-16px',
      bottom: '-16px',
    },
  },
  showMoreIcon: {
    transform: 'rotate(180deg)',
    color: '#444',
    fontSize: 14,
  },
  changeCancelPlanButton: {
    position: 'inherit',
    width: '100%',
    fontWeight: 'bold',
    padding: '4px 28px',
    margin: 0,
    marginTop: '12px',
    '@media (min-width: 576px)': {
      position: 'absolute',
      top: 16,
      right: 16,
      fontWeight: 'bold',
      width: 'fit-content',
    },
  },
});

const Wrapper = styled('div')`
`;

const Card = styled('div')`
`;

const CardMain = styled('div')`
`;

const MobileWrapper = styled('div')`
`;

const Separator = styled('div')`
  height: 1px;
  background: #ddd;
  width: 100%;
  margin: 24px 0;
`;

const SectionCard = styled('div')`
  width: 100%;
  border-radius: 3px;
  border: 1px solid #ddd;
  box-shadow: none;
  margin-bottom: 16px;
  padding: 16px 24px;
  @media (min-width: 576px) {
    padding: 24px;
  }
  max-width: 100%;
  overflow: hidden;
`;

const SectionCardMobile = styled('div')`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
  width: 100%;
  border-radius: 3px;
  padding: 16px;
  max-width: 100%;
  overflow: hidden;
  background: white;
  margin-bottom: 16px;
`;

const SectionTitle = styled('h4')`
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 16px;
  width: fit-content;
  color: #333;
`;

const SectionParagraph = styled('span')`
  font-size: 14px;
  margin-bottom: 4px;
  @media (min-width: 569px) {
    font-size: 14px;
  }
`;

const StaticColumn = styled('div')`
  position: static !important;
`;

const InvoiceFlexContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 4px;
`;

const FlexOne = styled('div')`
  font-weight: 500;
  color: #444;
`;

const FlexTwo = styled('div')`
  font-weight: 500;
  color: black;
`;

export default withStyles(styles)(SettingsSubscriptionPlan);
