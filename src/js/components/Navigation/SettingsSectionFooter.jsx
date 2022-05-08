import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
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
          <TermsAndPrivacyText>
            <span onClick={this.openHowItWorksModal}>How It Works</span>
            <span style={{ paddingLeft: 15 }} />
            <OpenExternalWebSite
              linkIdAttribute="footerLinkWeVoteHelp"
              url="https://help.wevote.us/hc/en-us"
              target="_blank"
              body={(
                <span>Help</span>
              )}
            />
            <span style={{ paddingLeft: 15 }} />
            <Link to="/more/privacy">Privacy</Link>
            <span style={{ paddingLeft: 15 }} />
            <Link to="/more/terms">Terms</Link>
          </TermsAndPrivacyText>
        </OneRow>
        <OneRow centered={centered}>
          <TermsAndPrivacyText>
            <OpenExternalWebSite
              linkIdAttribute="footerLinkAbout"
              url="https://wevote.us/more/about"
              target="_blank"
              body={(
                <span>About</span>
              )}
            />
            <span style={{ paddingLeft: 15 }} />
            <OpenExternalWebSite
              linkIdAttribute="footerLinkTeam"
              url="https://wevote.us/more/about"
              target="_blank"
              body={(
                <span>Team</span>
              )}
            />
            <span style={{ paddingLeft: 15 }} />
            <OpenExternalWebSite
              linkIdAttribute="footerLinkTeam"
              url="https://wevote.us/more/credits"
              target="_blank"
              body={(
                <span className="u-no-break">Credits &amp; Thanks</span>
              )}
            />
            <span style={{ paddingLeft: 15 }} />
            <OpenExternalWebSite
              linkIdAttribute="footerLinkCareers"
              url="https://www.idealist.org/en/nonprofit/f917ce3db61a46cb8ad2b0d4e335f0af-we-vote-oakland#volops"
              target="_blank"
              body={(
                <span>Jobs</span>
              )}
            />
          </TermsAndPrivacyText>
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
  * {
    color: #999;
    font-weight: 400;
  }
`;

const Wrapper = styled('div')`
`;

export default SettingsSectionFooter;
