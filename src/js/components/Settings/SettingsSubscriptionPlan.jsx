import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Edit from '@material-ui/icons/Edit';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import CheckCircle from '@material-ui/icons/CheckCircle';
import { IconButton, withStyles, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@material-ui/core';
import DonateStore from '../../stores/DonateStore';
import DonateActions from '../../actions/DonateActions';
import LoadingWheel from '../LoadingWheel';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';
import { formatDateToYearMonthDay, stringContains } from '../../utils/textFormat';
import AppActions from '../../actions/AppActions';

class SettingsSubscriptionPlan extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

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
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount () {
    // console.log("SettingsSubscriptionPlan componentDidMount");
    this.onVoterStoreChange();
    this.onDonateStoreChange();
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    DonateActions.donationRefreshDonationList();

    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  shouldComponentUpdate (nextProps, nextState) {
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
    if (this.state.activePaidPlan !== nextState.activePaidPlan) {
      // console.log('this.state.activePaidPlan', this.state.activePaidPlan, ', nextState.activePaidPlan', nextState.activePaidPlan);
      return true;
    }
    if (this.state.activePaidPlanChosen !== nextState.activePaidPlanChosen) {
      // console.log('this.state.activePaidPlanChosen', this.state.activePaidPlanChosen, ', nextState.activePaidPlanChosen', nextState.activePaidPlanChosen);
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
    this.donateStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onDonateStoreChange = () => {
    const activePaidPlan = DonateStore.getActivePaidPlan();
    let activePaidPlanChosen = '';
    let activePaidPlanChosenDisplay = '';
    // let activePaidPlanBillingFrequency = '';
    let activePaidPlanBillingFrequencyDisplay = '';
    // Kind of plan
    if (stringContains('PROFESSIONAL', activePaidPlan.plan_type_enum)) {
      activePaidPlanChosen = 'professional';
      activePaidPlanChosenDisplay = 'Professional Plan';
    } else if (stringContains('ENTERPRISE', activePaidPlan.plan_type_enum)) {
      activePaidPlanChosen = 'enterprise';
      activePaidPlanChosenDisplay = 'Enterprise Plan';
    } else {
      activePaidPlanChosen = 'free';
      activePaidPlanChosenDisplay = 'Free Plan';
    }
    // Billing frequency
    if (stringContains('MONTHLY', activePaidPlan.plan_type_enum)) {
      // activePaidPlanBillingFrequency = 'monthly';
      activePaidPlanBillingFrequencyDisplay = 'Billed Monthly';
    } else if (stringContains('YEARLY', activePaidPlan.plan_type_enum)) {
      // activePaidPlanBillingFrequency = 'yearly';
      activePaidPlanBillingFrequencyDisplay = 'Billed Yearly';
    } else if (stringContains('ONCE', activePaidPlan.plan_type_enum)) {
      // activePaidPlanBillingFrequency = 'once';
      activePaidPlanBillingFrequencyDisplay = 'One Time Payment';
    } else {
      // activePaidPlanBillingFrequency = '';
      activePaidPlanBillingFrequencyDisplay = '';
    }
    const subscriptionJournalHistory = DonateStore.getSubscriptionJournalHistory();

    this.setState({
      activePaidPlan,
      activePaidPlanChosen,
      activePaidPlanChosenDisplay,
      // activePaidPlanBillingFrequency,
      activePaidPlanBillingFrequencyDisplay,
      subscriptionJournalHistory,
    });
  };

  onOrganizationStoreChange = () => {
    const { organizationWeVoteId } = this.state;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
    });
  }

  onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    const organizationWeVoteId = voter.linked_organization_we_vote_id;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
      organizationWeVoteId,
      voter,
      voterIsSignedIn,
    });
  }

  openPaidAccountUpgradeModal = (paidAccountUpgradeMode) => {
    AppActions.setShowPaidAccountUpgradeModal(paidAccountUpgradeMode);
  }

  onClickHandler = () => {
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
    this.openPaidAccountUpgradeModal(paidAccountUpgradeMode);
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

  render () {
    renderLog(__filename);
    const { activePaidPlanChosen, activePaidPlanChosenDisplay, activePaidPlanBillingFrequencyDisplay, organization, organizationWeVoteId, subscriptionJournalHistory, voter, voterIsSignedIn, mobileMode } = this.state;
    const { classes } = this.props;
    if (!voter || !organizationWeVoteId) {
      return LoadingWheel;
    }

    if (voterIsSignedIn) {
      // console.log('SettingsSubscriptionPlan, Signed In.');
    }
    if (organization && organization.we_vote_custom_domain) {
      // console.log('SettingsSubscriptionPlan, Custom Domain: ', organization.we_vote_custom_domain);
    }

    function createData (date, period, amount, actions) {
      return { date, period, amount, actions };
    }

    // Simulated invoices: these will come from the API
    // const paidInvoices = [
    //   createData('2/10/2019', '2/10/2019 - 4/10/2019', '$1200', <Button size="small" color="primary" classes={{ root: classes.viewInvoiceButton }}>View Invoice</Button>),
    //   createData('4/10/2019', '4/10/2019 - 6/10/2019', '$1200', <Button size="small" color="primary" classes={{ root: classes.viewInvoiceButton }}>View Invoice</Button>),
    //   createData('6/10/2019', '6/10/2019 - 8/10/2019', '$1200', <Button size="small" color="primary" classes={{ root: classes.viewInvoiceButton }}>View Invoice</Button>),
    // ];

    // Simulated invoices: these will come from the API
    const upcomingInvoices = [
      createData('12/10/2012', '12/10/2012 - 12/12/2012', '$1200', <Button size="small" color="primary" classes={{ root: classes.viewInvoiceButton }}>View Invoice</Button>),
    ];

    let subscriptionPageHtmlContents = (<span />);

    if (mobileMode) {
      subscriptionPageHtmlContents = (
        <MobileWrapper className="d-block d-sm-none">
          <SectionCardMobile className="u-position-relative">
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
              classes={{ root: classes.changeCancelPlanButton }}
              color="primary"
              onClick={this.onClickHandler}
              size="small"
              variant="outlined"
            >
              Change Plan
            </Button>
          </SectionCardMobile>
          <SectionCardMobile className="u-position-relative">
            <SectionTitle>
              Payment
            </SectionTitle>
            <EditIcon>
              <IconButton size="medium" classes={{ root: classes.iconButton }}>
                <Edit />
              </IconButton>
            </EditIcon>
            <SectionParagraph>
              <InvoiceFlexContainer>
                <FlexOne>Card ending in</FlexOne>
                <FlexTwo>0223</FlexTwo>
              </InvoiceFlexContainer>
              <InvoiceFlexContainer>
                <FlexOne>Expires</FlexOne>
                <FlexTwo>02/23</FlexTwo>
              </InvoiceFlexContainer>
              <InvoiceFlexContainer>
                <FlexOne>Next bill</FlexOne>
                <FlexTwo>June 21, 2019</FlexTwo>
              </InvoiceFlexContainer>
              <InvoiceFlexContainer>
                <FlexOne>Billing contact</FlexOne>
                <FlexTwo>email@domain.com</FlexTwo>
              </InvoiceFlexContainer>
            </SectionParagraph>
          </SectionCardMobile>
          <SectionCardMobile>
            <SectionTitle>
              Paid Invoices
            </SectionTitle>
            {subscriptionJournalHistory.map(row => (
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
                <Button color="primary" size="small" classes={{ root: classes.viewInvoiceButton }}>
                  View Invoice
                </Button>
              </SectionCard>
            ))}
            <Button size="small" classes={{ root: classes.showMoreButton }}>
              Show More
              <ArrowBackIos classes={{ root: classes.showMoreIcon }} />
            </Button>
          </SectionCardMobile>
          <SectionCardMobile>
            <SectionTitle>
              Next Invoice
            </SectionTitle>
            {upcomingInvoices.map(row => (
              <SectionCard>
                <SectionParagraph>
                  <InvoiceFlexContainer>
                    <FlexOne>Date</FlexOne>
                    <FlexTwo>{formatDateToYearMonthDay(row.date)}</FlexTwo>
                  </InvoiceFlexContainer>
                  <InvoiceFlexContainer>
                    <FlexOne>Period</FlexOne>
                    <FlexTwo>{row.period}</FlexTwo>
                  </InvoiceFlexContainer>
                  <InvoiceFlexContainer>
                    <FlexOne>Amount</FlexOne>
                    <FlexTwo>
                      {row.amount}
                    </FlexTwo>
                  </InvoiceFlexContainer>
                </SectionParagraph>
                <Button color="primary" size="small" classes={{ root: classes.viewInvoiceButton }}>
                  View Invoice
                </Button>
              </SectionCard>
            ))}
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
              <Button variant="outlined" color="primary" size="small" classes={{ root: classes.changeCancelPlanButton }}>
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
                classes={{ root: classes.changeCancelPlanButton }}
                color="primary"
                onClick={this.onClickHandler}
                size="small"
                variant="outlined"
              >
                Change Plan
              </Button>
            </SectionCard>
            <Seperator />
            <SectionCard className="u-position-relative">
              <SectionTitle>
                Payment
              </SectionTitle>
              <EditIcon>
                <IconButton size="medium" classes={{ root: classes.iconButton }}>
                  <Edit />
                </IconButton>
              </EditIcon>
              <SectionParagraph>
                Card ending in:
                {' '}
                <strong>0223</strong>
                {' '}
                •
                {' '}
                Expires:
                {' '}
                <strong>02/23</strong>
                {' '}
                •
                {' '}
                Next bill:
                {' '}
                <strong>June 21, 2019</strong>
              </SectionParagraph>
              <SectionParagraph>
                Billing contact:
                {' '}
                <strong>email@domain.com</strong>
              </SectionParagraph>
            </SectionCard>
            <Seperator />
            <SectionCard>
              <SectionTitle>
                Paid Invoices
              </SectionTitle>
              <Table classes={{ root: classes.table }}>
                <TableHead>
                  <TableRow>
                    <TableCell classes={{ root: classes.tableCellCheckmark }} />
                    <TableCell classes={{ root: classes.tableHead }}>Date</TableCell>
                    <TableCell classes={{ root: classes.tableHead }}>Period</TableCell>
                    <TableCell classes={{ root: classes.tableHead }}>Amount</TableCell>
                    <TableCell classes={{ root: classes.tableHeadRight }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscriptionJournalHistory.map(row => (
                    <TableRow key={`desktop-${row.donation_journal_id}`}>
                      <TableCell classes={{ root: classes.tableCellCheckmark }} component="th" scope="row">
                        <CheckCircle classes={{ root: classes.checkIcon }} />
                      </TableCell>
                      <TableCell classes={{ root: classes.tableCell }}>{formatDateToYearMonthDay(row.created)}</TableCell>
                      <TableCell classes={{ root: classes.tableCell }}>{row.period}</TableCell>
                      <TableCell classes={{ root: classes.tableCell }}>
                        $
                        {row.amount}
                      </TableCell>
                      <TableCell classes={{ root: classes.tableCellRight }} align="right">
                        <Button size="small" color="primary" classes={{ root: classes.viewInvoiceButton }}>View Invoice</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button size="small" classes={{ root: classes.showMoreButton }}>
                Show More
                <ArrowBackIos classes={{ root: classes.showMoreIcon }} />
              </Button>
            </SectionCard>
            <Seperator />
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
                    <TableCell classes={{ root: classes.tableHeadRight }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {upcomingInvoices.map(row => (
                    <TableRow key={row.date}>
                      <TableCell classes={{ root: classes.tableCellLeft }} component="th" scope="row">
                        {row.date}
                      </TableCell>
                      <TableCell classes={{ root: classes.tableCell }}>{row.period}</TableCell>
                      <TableCell classes={{ root: classes.tableCell }}>{row.amount}</TableCell>
                      <TableCell classes={{ root: classes.tableCellRight }} align="right">
                        <Button size="small" color="primary" classes={{ root: classes.viewInvoiceButton }}>View Invoice</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SectionCard>
            {activePaidPlanChosen !== 'free' && (
              <>
                <Seperator />
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
                        . Cancelling will switch you to our Free Plan, which provides many features at no cost.
                      </SectionParagraph>
                    </div>
                    <StaticColumn className="col col-4 p-0">
                      <Button variant="outlined" color="primary" size="small" classes={{ root: classes.changeCancelPlanButton }}>
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

const Wrapper = styled.div`
`;

const Card = styled.div`
`;

const CardMain = styled.div`
`;

const MobileWrapper = styled.div`
`;

const Seperator = styled.div`
  height: 1px;
  background: #ddd;
  width: 100%;
  margin: 24px 0;
`;

const SectionCard = styled.div`
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

const SectionCardMobile = styled.div`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
  width: 100%;
  border-radius: 3px;
  padding: 16px;
  max-width: 100%;
  overflow: hidden;
  background: white;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 16px;
  width: fit-content;
  color: #333;
`;

const EditIcon = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
`;

const SectionParagraph = styled.p`
  font-size: 14px;
  margin-bottom: 4px;
  @media (min-width: 569px) {
    font-size: 14px;
  } 
`;

const StaticColumn = styled.div`
  position: static !important;
`;

const InvoiceFlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 4px;
`;

const FlexOne = styled.div`
  font-weight: 500;
  color: #444;
`;
const FlexTwo = styled.div`
  font-weight: 500;
  color: black;
`;
export default withStyles(styles)(SettingsSubscriptionPlan);
