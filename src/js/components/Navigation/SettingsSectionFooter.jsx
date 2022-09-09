import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { isTablet } from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../stores/AppObservableStore';
import { TermsAndPrivacyText } from '../Style/pageLayoutStyles';
import DeviceDialog from '../Widgets/DeviceDialog';


class SettingsSectionFooter extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showDeviceDialog: false,
    };
    this.deviceTableVisibilityOn = this.deviceTableVisibilityOn.bind(this);
    this.deviceTableVisibilityOff = this.deviceTableVisibilityOff.bind(this);
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

    return (
      <Wrapper>
        <OneRow centered={centered}>
          <span className="u-cursor--pointer" onClick={this.openHowItWorksModal}><TermsAndPrivacyText>How It Works</TermsAndPrivacyText></span>
          <span style={{ paddingLeft: 15 }} />
          <OpenExternalWebSite
            linkIdAttribute="footerLinkWeVoteHelp"
            url="https://help.wevote.us/hc/en-us"
            target="_blank"
            body={(
              <TermsAndPrivacyText>Help</TermsAndPrivacyText>
            )}
          />
          <span style={{ paddingLeft: 15 }} />
          <Link to="/more/privacy"><TermsAndPrivacyText>Privacy</TermsAndPrivacyText></Link>
          <span style={{ paddingLeft: 15 }} />
          <Link to="/more/terms"><TermsAndPrivacyText>Terms</TermsAndPrivacyText></Link>
        </OneRow>
        <OneRow centered={centered}>
          { isWebApp() ? (
            <>
              <OpenExternalWebSite
                linkIdAttribute="footerLinkAbout"
                url="https://wevote.us/more/about"
                target="_blank"
                body={(
                  <TermsAndPrivacyText>About</TermsAndPrivacyText>
                 )}
              />
              <span style={{ paddingLeft: 15 }} />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkTeam"
                url="https://wevote.us/more/about"
                target="_blank"
                body={(
                  <TermsAndPrivacyText>Team</TermsAndPrivacyText>
                )}
              />
              <span style={{ paddingLeft: 15 }} />
              <OpenExternalWebSite
                linkIdAttribute="footerLinkCredit"
                url="https://wevote.us/more/credits"
                target="_blank"
                body={(
                  <TermsAndPrivacyText className="u-no-break">Credits &amp; Thanks</TermsAndPrivacyText>
                )}
              />
            </>
          ) : (
            <>
              { isWebApp() ? (
                <>
                  {/* August 2022: The about header is very old and needs a fair amount of work to avoid a big white section at top in Cordova */}
                  <Link to="/more/about"><TermsAndPrivacyText>About</TermsAndPrivacyText></Link>
                  <span style={{ paddingLeft: 15 }} />
                  <Link to="/more/about"><TermsAndPrivacyText>Team</TermsAndPrivacyText></Link>
                  <span style={{ paddingLeft: 15 }} />
                  <Link to="/more/credits"><TermsAndPrivacyText>Credits &amp; Thanks</TermsAndPrivacyText></Link>
                </>
              ) : (
                <>
                  <Link to="/more/faq"><TermsAndPrivacyText>Frequently Asked Questions</TermsAndPrivacyText></Link>
                  <span style={{ paddingLeft: 15 }} />
                </>
              )}
            </>
          )}
        </OneRow>
        <DoesNotSupport centered={centered}>
          We Vote does not support or oppose any political candidate or party.
        </DoesNotSupport>
        { isCordova() && isTablet() && (
          <DoesNotSupport centered={centered}>
            <span className="hamburger-terms__text" onClick={() => this.deviceTableVisibilityOn()} style={{ color: 'black', opacity: '0.6', fontSize: '14px' }}>
              Device Information
            </span>
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
