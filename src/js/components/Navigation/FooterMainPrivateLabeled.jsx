import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';


class FooterMainPrivateLabeled extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenAboutOrganizationExternalUrl: false,
    };
  }

  componentDidMount () {
    // console.log('FooterMainPrivateLabeled componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  // eslint-disable-next-line no-unused-vars
  onAppObservableStoreChange (msg) {
    // console.log('------ FooterMainPrivateLabeled, onAppObservableStoreChange received: ', msg);
    const chosenAboutOrganizationExternalUrl = AppObservableStore.getChosenAboutOrganizationExternalUrl();
    this.setState({
      chosenAboutOrganizationExternalUrl,
    });
  }

  render () {
    const { classes } = this.props;
    const { chosenAboutOrganizationExternalUrl } = this.state;

    return (
      <Wrapper>
        <TopSectionOuterWrapper>
          <TopSectionInnerWrapper>
            <Column>
              <OpenExternalWebSite
                linkIdAttribute="footerLinkAbout"
                url={chosenAboutOrganizationExternalUrl || 'https://wevote.us/more/about'}
                target="_blank"
                body={(
                  <span>About Us</span>
                )}
                className={classes.link}
              />
            </Column>
            <Column>
              <OpenExternalWebSite
                linkIdAttribute="footerLinkWeVoteHelp"
                url="https://help.wevote.us/hc/en-us"
                target="_blank"
                body={(
                  <span>Help</span>
                )}
                className={classes.link}
              />
            </Column>
            <Column>
              <Link id="footerLinkPrivacy" className={classes.link} to="/privacy">Privacy Policy</Link>
            </Column>
            <Column>
              <Link id="footerLinkTermsOfUse" className={classes.link} to="/terms">Terms of Service</Link>
            </Column>
          </TopSectionInnerWrapper>
        </TopSectionOuterWrapper>
      </Wrapper>
    );
  }
}
FooterMainPrivateLabeled.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  link: {
    color: '#333',
    fontSize: 14,
    marginBottom: '1em',
    '&:hover': {
      color: '#4371cc',
    },
    textDecoration: 'none',
    [theme.breakpoints.down('md')]: {
      fontSize: 14,
    },
  },
  bottomLink: {
    color: '#333',
    textDecoration: 'none',
    '&:hover': {
      color: '#4371cc',
    },
  },
});

const Column = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 150px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 50%;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    width: 100%;
  }
`;

const TopSectionInnerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  justify-content: space-between;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
  }
`;

const TopSectionOuterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(FooterMainPrivateLabeled);
