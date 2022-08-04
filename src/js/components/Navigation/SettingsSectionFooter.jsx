import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../stores/AppObservableStore';


class SettingsSectionFooter extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  openHowItWorksModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowHowItWorksModal(true);
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
              <Link to="/more/about"><TermsAndPrivacyText>About</TermsAndPrivacyText></Link>
              <span style={{ paddingLeft: 15 }} />
              <Link to="/more/about"><TermsAndPrivacyText>Team</TermsAndPrivacyText></Link>
              <span style={{ paddingLeft: 15 }} />
              <Link to="/more/credits"><TermsAndPrivacyText>Credits &amp; Thanks</TermsAndPrivacyText></Link>
            </>
          )}
        </OneRow>
        <DoesNotSupport centered={centered}>
          We Vote does not support or oppose any political candidate or party.
        </DoesNotSupport>
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

const TermsAndPrivacyText = styled('span')`
  color: #999;
  font-size: .9em;
  font-weight: 400;
  .u-cursor--pointer:hover {
    color: #0156b3;
    text-decoration: underline;
  }
  * {
    span:hover {
      color: #0156b3;
      text-decoration: underline;
    }
`;

const Wrapper = styled('div')`
`;

export default SettingsSectionFooter;
