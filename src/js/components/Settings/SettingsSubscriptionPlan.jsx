import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Edit from '@material-ui/icons/Edit';
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

    const rows = [
      createData('12/10/2012', '12/10/2012 - 12/12/2012', '$1200', <Button size="small" color="primary" classes={{ root: classes.viewInvoiceButton }}>View Invoice</Button>),
      createData('12/10/2012', '12/10/2012 - 12/12/2012', '$1200', <Button size="small" color="primary" classes={{ root: classes.viewInvoiceButton }}>View Invoice</Button>),
      createData('12/10/2012', '12/10/2012 - 12/12/2012', '$1200', <Button size="small" color="primary" classes={{ root: classes.viewInvoiceButton }}>View Invoice</Button>),
    ];

    let subscriptionPageHtmlContents = (<span />);

    if (mobileMode) {
      subscriptionPageHtmlContents = (
        <MobileWrapper className="d-block d-sm-none">
          <SectionCard>
            <SectionTitle>
              Payment
            </SectionTitle>
              <SectionParagraph>
                Card ending in: <strong>0223</strong> | Expires: <strong>02/23</strong> | Next bill: <strong>June 21, 2019</strong>
              </SectionParagraph>
          </SectionCard>
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
                Card ending in: <strong>0223</strong> | Expires: <strong>02/23</strong> | Next bill: <strong>June 21, 2019</strong>
              </SectionParagraph>
              <SectionParagraph>
                Billing contact: <strong>barrack-obama@gmail.com</strong>
              </SectionParagraph>
            </SectionCard>
            <SectionCard>
              <SectionTitle>
                Invoices
              </SectionTitle>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell classes={{ root: classes.tableHeadLeft }}>Date</TableCell>
                    <TableCell classes={{ root: classes.tableHead }}>Period</TableCell>
                    <TableCell classes={{ root: classes.tableHead }}>Amount</TableCell>
                    <TableCell classes={{ root: classes.tableHeadRight }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
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
  viewInvoiceButton: {
    fontWeight: 'bold',
    fontSize: 12,
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
  margin: 16px 0;
`;

const SectionCard = styled.div`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
  width: 100%;
  border-radius: 3px;
  padding: 16px;
  margin-bottom: 16px;
  @media (min-width: 569px) {
    border: 1px solid #ddd;
    box-shadow: none;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 16px;
  width: fit-content;
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

export default withStyles(styles)(SettingsSubscriptionPlan);