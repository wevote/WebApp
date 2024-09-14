import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { isAndroidSizeWide } from '../../common/utils/cordovaUtils';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { isTablet } from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import { DeviceInformationSpan, TermsAndPrivacyText } from '../Style/pageLayoutStyles';
import DeviceDialog from '../Widgets/DeviceDialog';
import webAppConfig from '../../config';


class SettingsSectionFooter extends Component {
  constructor (props) {
    super(props);
    this.state = {
      inPrivateLabelMode: false,
      showDeviceDialog: false,
      siteConfigurationHasBeenRetrieved: false,
    };
    this.deviceTableVisibilityOn = this.deviceTableVisibilityOn.bind(this);
    this.deviceTableVisibilityOff = this.deviceTableVisibilityOff.bind(this);
  }

  componentDidMount () {
    // console.log('SettingsSectionFooter componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  // eslint-disable-next-line no-unused-vars
  onAppObservableStoreChange () {
    // console.log('------ SettingsSectionFooter, onAppObservableStoreChange received: ', msg);
    const inPrivateLabelMode = AppObservableStore.getHideWeVoteLogo(); // Using this setting temporarily
    const siteConfigurationHasBeenRetrieved = AppObservableStore.siteConfigurationHasBeenRetrieved();
    this.setState({
      inPrivateLabelMode,
      siteConfigurationHasBeenRetrieved,
    });
  }

  openHowItWorksModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowHowItWorksModal(true);
  }

  deviceTableVisibilityOff () {
    const { showDeviceDialog } = this.state;
    if (showDeviceDialog === true) {
      this.setState({ showDeviceDialog: false });
    }
  }

  deviceTableVisibilityOn () {
    this.setState({ showDeviceDialog: true });
  }

  render () {
    renderLog('SettingsSectionFooter');  // Set LOG_RENDER_EVENTS to log all renders
    const { centered } = this.props;
    const { inPrivateLabelMode, siteConfigurationHasBeenRetrieved } = this.state;
    if (!siteConfigurationHasBeenRetrieved) {
      return null;
    }

    return (
      <Wrapper>
        <OneRow centered={centered}>
          <span className="u-cursor--pointer u-link-color-on-hover" onClick={this.openHowItWorksModal}><TermsAndPrivacyText>How&nbsp;It&nbsp;Works</TermsAndPrivacyText></span>
          <span style={{ paddingLeft: 15 }} />
          <Link to="/more/faq"><TermsAndPrivacyText>About&nbsp;&amp;&nbsp;FAQ</TermsAndPrivacyText></Link>
        </OneRow>
        <OneRow centered={centered}>
          <OpenExternalWebSite
            linkIdAttribute="footerLinkWeVoteHelp"
            url="https://help.wevote.us/hc/en-us"
            target="_blank"
            body={(
              <TermsAndPrivacyText>Help</TermsAndPrivacyText>
            )}
          />
          <span style={{ paddingLeft: 15 }} />
          <Link to="/privacy"><TermsAndPrivacyText>Privacy</TermsAndPrivacyText></Link>
          <span style={{ paddingLeft: 15 }} />
          <Link to="/more/terms"><TermsAndPrivacyText>Terms</TermsAndPrivacyText></Link>
        </OneRow>
        <OneRow centered={centered}>
          {(isWebApp() && !inPrivateLabelMode) && (
            <>
              <OpenExternalWebSite
                linkIdAttribute="footerLinkTeam"
                url={`${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/more/about`}
                target="_blank"
                body={(
                  <TermsAndPrivacyText>Team</TermsAndPrivacyText>
                )}
              />
              <span style={{ paddingLeft: 15 }} />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkCredit"
                url={`${webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME}/more/credits`}
                target="_blank"
                body={(
                  <TermsAndPrivacyText className="u-no-break">Credits &amp; Thanks</TermsAndPrivacyText>
                )}
              />
            </>
          )}
          {isCordova() && (
            <>
              <Link to="/more/faq"><TermsAndPrivacyText>Frequently Asked Questions</TermsAndPrivacyText></Link>
              <span style={{ paddingLeft: 15 }} />
              <Link to="/more/attributions"><TermsAndPrivacyText>Attributions</TermsAndPrivacyText></Link>
            </>
          )}
        </OneRow>
        {(isCordova() || !inPrivateLabelMode) && (
          <DoesNotSupport centered={centered}>
            WeVote does not support or oppose any political candidate or party.
          </DoesNotSupport>
        )}
        { isCordova() && (isTablet() || isAndroidSizeWide()) && (
          <DoesNotSupport centered={centered}>
            <DeviceInformationSpan onClick={() => this.deviceTableVisibilityOn()}>
              Device Information
            </DeviceInformationSpan>
            <DeviceDialog visibilityOffFunction={this.deviceTableVisibilityOff} show={this.state.showDeviceDialog} />
          </DoesNotSupport>
        )}
      </Wrapper>
    );
  }
}
SettingsSectionFooter.propTypes = {
  centered: PropTypes.bool,
};

const DoesNotSupport = styled('div', {
  shouldForwardProp: (prop) => !['centered'].includes(prop),
})(({ centered }) => (`
  color: #999;
  font-size: .9em;
  font-weight: 400;
  margin-top: 24px;
  ${centered ? 'text-align: center;' : ''}
`));

const OneRow = styled('div', {
  shouldForwardProp: (prop) => !['centered'].includes(prop),
})(({ centered }) => (`
  ${centered ? 'display: flex;' : ''}
  ${centered ? 'justify-content: center;' : ''}
  margin-bottom: 8px;
`));

const Wrapper = styled('div')`
`;

export default SettingsSectionFooter;
