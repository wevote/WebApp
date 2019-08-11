import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Edit from '@material-ui/icons/Edit';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import CheckCircle from '@material-ui/icons/CheckCircle';
import { IconButton, withStyles, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@material-ui/core';
import FacebookStore from '../../stores/FacebookStore';
import LoadingWheel from '../LoadingWheel';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

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
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount () {
    // console.log("SettingsSubscriptionPlan componentDidMount");
    this.onVoterStoreChange();
    this.organizationStoreListener = FacebookStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

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
      // console.log('this.state.voterIsSignedIn', this.state.voterIsSignedIn, ', nextState.voterIsSignedIn', nextState.voterIsSignedIn);
      return true;
    }
    if (this.state.mobileMode !== nextState.mobileMode) {
      // console.log('this.state.voterIsSignedIn', this.state.voterIsSignedIn, ', nextState.voterIsSignedIn', nextState.voterIsSignedIn);
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
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

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
    const { organization, organizationWeVoteId, voter, voterIsSignedIn, mobileMode } = this.state;
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
    const completedInvoices = [
      createData('2/10/2019', '2/10/2019 - 4/10/2019', '$1200', <Button size="small" color="primary" classes={{ root: classes.viewInvoiceButton }}>View Invoice</Button>),
      createData('4/10/2019', '4/10/2019 - 6/10/2019', '$1200', <Button size="small" color="primary" classes={{ root: classes.viewInvoiceButton }}>View Invoice</Button>),
      createData('6/10/2019', '6/10/2019 - 8/10/2019', '$1200', <Button size="small" color="primary" classes={{ root: classes.viewInvoiceButton }}>View Invoice</Button>),
    ];

    // Simulated invoices: these will come from the API
    const upcomingInvoices = [
      createData('12/10/2012', '12/10/2012 - 12/12/2012', '$1200', <Button size="small" color="primary" classes={{ root: classes.viewInvoiceButton }}>View Invoice</Button>),
    ];

    let subscriptionPageHtmlContents = (<span />);
    const learnMoreLink = ' Learn more';

    if (mobileMode) {
      subscriptionPageHtmlContents = (
        <MobileWrapper className="d-block d-sm-none">
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
                <FlexTwo>barrack-obama@gmail.com</FlexTwo>
              </InvoiceFlexContainer>
            </SectionParagraph>
          </SectionCardMobile>
          <Seperator />
          <SectionCardMobile>
            <SectionTitle>
              Invoices
            </SectionTitle>
            {completedInvoices.map(row => (
              <SectionCard>
                <SectionParagraph>
                  <InvoiceFlexContainer>
                    <FlexOne>Date</FlexOne>
                    <FlexTwo>{row.date}</FlexTwo>
                  </InvoiceFlexContainer>
                  <InvoiceFlexContainer>
                    <FlexOne>Period</FlexOne>
                    <FlexTwo>{row.period}</FlexTwo>
                  </InvoiceFlexContainer>
                  <InvoiceFlexContainer>
                    <FlexOne>Amount</FlexOne>
                    <FlexTwo>{row.amount}</FlexTwo>
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
          <Seperator />
          <SectionCardMobile>
            <SectionTitle>
              Next Invoice
            </SectionTitle>
            {upcomingInvoices.map(row => (
              <SectionCard>
                <SectionParagraph>
                  <InvoiceFlexContainer>
                    <FlexOne>Date</FlexOne>
                    <FlexTwo>{row.date}</FlexTwo>
                  </InvoiceFlexContainer>
                  <InvoiceFlexContainer>
                    <FlexOne>Period</FlexOne>
                    <FlexTwo>{row.period}</FlexTwo>
                  </InvoiceFlexContainer>
                  <InvoiceFlexContainer>
                    <FlexOne>Amount</FlexOne>
                    <FlexTwo>{row.amount}</FlexTwo>
                  </InvoiceFlexContainer>
                </SectionParagraph>
                <Button color="primary" size="small" classes={{ root: classes.viewInvoiceButton }}>
                  View Invoice
                </Button>
              </SectionCard>
            ))}
          </SectionCardMobile>
          <Seperator />
          <SectionCardMobile className="u-position-relative">
            <SectionTitle>
              My Plan
            </SectionTitle>
            <h4 className="h4"><strong>Premium Plan • Monthly</strong></h4>
            <Button variant="outlined" color="primary" size="small" classes={{ root: classes.changeCancelPlanButton }}>
              Change Plan
            </Button>
          </SectionCardMobile>
          <Seperator />
          <SectionCardMobile className="u-position-relative">
            <SectionTitle>
              Cancel Plan
            </SectionTitle>
            <SectionParagraph>
              Upon cancelling, you and your team will lose access to customer data in FullStory. You can switch to our Free Plan to continue using FullStory at no cost.
              <a
                href="https://google.com"
              >
                {learnMoreLink}
              </a>
            </SectionParagraph>
            <Button variant="outlined" color="primary" size="small" classes={{ root: classes.changeCancelPlanButton }}>
              Cancel Plan
            </Button>
          </SectionCardMobile>
        </MobileWrapper>
      );
    } else {
      subscriptionPageHtmlContents = (
        <Card className="card">
          <CardMain className="card-main">
            <h1 className="h3">Subscription Plan</h1>
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
                Card ending in: <strong>0223</strong> • Expires: <strong>02/23</strong> • Next bill: <strong>June 21, 2019</strong>
              </SectionParagraph>
              <SectionParagraph>
                Billing contact: <strong>barrack-obama@gmail.com</strong>
              </SectionParagraph>
            </SectionCard>
            <Seperator />
            <SectionCard>
              <SectionTitle>
                Invoices
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
                  {completedInvoices.map(row => (
                    <TableRow key={row.date}>
                      <TableCell classes={{ root: classes.tableCellCheckmark }} component="th" scope="row">
                        <CheckCircle classes={{ root: classes.checkIcon }} />
                      </TableCell>
                      <TableCell classes={{ root: classes.tableCell }}>{row.date}</TableCell>
                      <TableCell classes={{ root: classes.tableCell }}>{row.period}</TableCell>
                      <TableCell classes={{ root: classes.tableCell }}>{row.amount}</TableCell>
                      <TableCell classes={{ root: classes.tableCellRight }} align="right">{row.actions}</TableCell>
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
                      <TableCell classes={{ root: classes.tableCellRight }} align="right">{row.actions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SectionCard>
            <Seperator />
            <SectionCard className="u-position-relative">
              <SectionTitle>
                My Plan
              </SectionTitle>
              <h4 className="h4"><strong>Premium Plan • Monthly</strong></h4>
              <Button variant="outlined" color="primary" size="small" classes={{ root: classes.changeCancelPlanButton }}>
                Change Plan
              </Button>
            </SectionCard>
            <Seperator />
            <SectionCard className="u-position-relative">
              <SectionTitle>
                Cancel Plan
              </SectionTitle>

              <div className="row m-0">
                <div className="col col-8 p-0">
                  <SectionParagraph>
                    Upon cancelling, you and your team will lose access to customer data in FullStory. You can switch to our Free Plan to continue using FullStory at no cost.
                    <a
                      href="https://google.com"
                    >
                      {learnMoreLink}
                    </a>
                  </SectionParagraph>
                </div>
                <StaticColumn className="col col-4 p-0">
                  <Button variant="outlined" color="primary" size="small" classes={{ root: classes.changeCancelPlanButton }}>
                    Cancel Plan
                  </Button>
                </StaticColumn>
              </div>

            </SectionCard>
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
`;

const SectionCardMobile = styled.div`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
  width: 100%;
  border-radius: 3px;
  padding: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
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