import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';


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

  openHowItWorksModal = () => {
    AppObservableStore.setShowHowItWorksModal(true);
  }

  render () {
    const { classes } = this.props;
    const { chosenAboutOrganizationExternalUrl } = this.state;

    return (
      <Wrapper>
        <TopSectionOuterWrapper>
          <TopSectionInnerWrapper>
            <OneRow>
              <div id="footerLinkHowItWorks" className={classes.onClickDiv} onClick={this.openHowItWorksModal}>How It Works</div>
              <RowSpacer />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkWeVoteHelp"
                url="https://help.wevote.us/hc/en-us"
                target="_blank"
                body={(
                  <span>Help</span>
                )}
                className={classes.link}
              />
              <RowSpacer />
              <Link id="footerLinkPrivacy" className={classes.link} to="/more/privacy">Privacy</Link>
              <RowSpacer />
              <Link id="footerLinkTermsOfUse" className={classes.link} to="/more/terms">Terms</Link>
            </OneRow>
            {chosenAboutOrganizationExternalUrl && (
              <OneRow>
                <OpenExternalWebSite
                  linkIdAttribute="footerLinkAbout"
                  url={chosenAboutOrganizationExternalUrl}
                  target="_blank"
                  body={(
                    <span>About</span>
                  )}
                  className={classes.link}
                />
              </OneRow>
            )}
          </TopSectionInnerWrapper>
        </TopSectionOuterWrapper>
      </Wrapper>
    );
  }
}
FooterMainPrivateLabeled.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  link: {
    color: '#808080',
    '&:hover': {
      color: '#4371cc',
    },
    textDecoration: 'none',
  },
  bottomLink: {
    color: '#333',
    textDecoration: 'none',
    '&:hover': {
      color: '#4371cc',
    },
  },
  onClickDiv: {
    color: '#808080',
    cursor: 'pointer',
    textDecoration: 'none',
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
});

const OneRow = styled('div')`
  color: #808080;
  display: flex;
  font-size: 13px;
  justify-content: center;
  margin-bottom: 15px;
`;

const RowSpacer = styled('div')`
  margin-right: 15px;
`;

const TopSectionInnerWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const TopSectionOuterWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Wrapper = styled('div')`
`;

export default withStyles(styles)(FooterMainPrivateLabeled);
