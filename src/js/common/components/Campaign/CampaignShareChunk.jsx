import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import ShareByCopyLink from '../CampaignShare/ShareByCopyLink';
import ShareByEmailButton from '../CampaignShare/ShareByEmailButton';
import ShareOnFacebookButton from '../CampaignShare/ShareOnFacebookButton';
import ShareOnTwitterButton from '../CampaignShare/ShareOnTwitterButton';
import { CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper, CampaignSupportMobileButtonPanel, CampaignSupportMobileButtonWrapper, CampaignSupportSection, CampaignSupportSectionWrapper } from '../Style/CampaignSupportStyles';


class CampaignShareChunk extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignShareChunk componentDidMount');
  }

  getCampaignBasePath = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.props;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
    }
    return campaignBasePath;
  }

  superSharingIntro = (sms = false) => {
    if (sms) {
      historyPush(`${this.getCampaignBasePath()}/super-sharing-campaign-sms`);
    } else {
      historyPush(`${this.getCampaignBasePath()}/super-sharing-campaign-email`);
    }
  }

  render () {
    renderLog('CampaignShareChunk');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      campaignXNewsItemWeVoteId, campaignXWeVoteId, classes, darkButtonsOff,
      privatePublicIntroductionsOff,
    } = this.props;
    return (
      <div>
        <CampaignSupportSectionWrapper marginTopOff={privatePublicIntroductionsOff}>
          <CampaignSupportSection marginBottomOff={privatePublicIntroductionsOff}>
            {!privatePublicIntroductionsOff && (
              <CampaignSupportDesktopButtonWrapper>
                <CampaignSupportDesktopButtonPanel>
                  <PublicOrPrivateSectionHeader>Share privately. </PublicOrPrivateSectionHeader>
                  <PublicOrPrivateSectionText>
                    Share 1-on-1 with friends who share your values.
                  </PublicOrPrivateSectionText>
                </CampaignSupportDesktopButtonPanel>
              </CampaignSupportDesktopButtonWrapper>
            )}
            <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
              <CampaignSupportDesktopButtonPanel>
                <Button
                  classes={{ root: classes.buttonDesktop }}
                  color="primary"
                  id="superSharingIntroDesktop"
                  onClick={() => this.superSharingIntro(false)}
                  variant={darkButtonsOff ? 'outlined' : 'contained'}
                >
                  Private emails, supercharged
                </Button>
              </CampaignSupportDesktopButtonPanel>
            </CampaignSupportDesktopButtonWrapper>
            <CampaignSupportMobileButtonWrapper className="u-show-mobile">
              <CampaignSupportMobileButtonPanel>
                <Button
                  classes={{ root: classes.buttonDesktop }}
                  color="primary"
                  id="superSharingIntroMobile"
                  onClick={() => this.superSharingIntro(false)}
                  variant={darkButtonsOff ? 'outlined' : 'contained'}
                >
                  Private emails, supercharged
                </Button>
              </CampaignSupportMobileButtonPanel>
            </CampaignSupportMobileButtonWrapper>
            <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
              <CampaignSupportDesktopButtonPanel>
                <ShareByEmailButton campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} />
              </CampaignSupportDesktopButtonPanel>
            </CampaignSupportDesktopButtonWrapper>
            <CampaignSupportMobileButtonWrapper className="u-show-mobile">
              <CampaignSupportMobileButtonPanel>
                <ShareByEmailButton campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} mobileMode />
              </CampaignSupportMobileButtonPanel>
            </CampaignSupportMobileButtonWrapper>
            <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
              <CampaignSupportDesktopButtonPanel>
                <ShareByCopyLink campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} />
              </CampaignSupportDesktopButtonPanel>
            </CampaignSupportDesktopButtonWrapper>
            <CampaignSupportMobileButtonWrapper className="u-show-mobile">
              <CampaignSupportMobileButtonPanel>
                <ShareByCopyLink campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} mobileMode />
              </CampaignSupportMobileButtonPanel>
            </CampaignSupportMobileButtonWrapper>
          </CampaignSupportSection>
        </CampaignSupportSectionWrapper>
        <CampaignSupportSectionWrapper marginTopOff={privatePublicIntroductionsOff}>
          <CampaignSupportSection marginBottomOff={privatePublicIntroductionsOff}>
            {!privatePublicIntroductionsOff && (
              <CampaignSupportDesktopButtonWrapper>
                <CampaignSupportDesktopButtonPanel>
                  <PublicOrPrivateSectionHeader>Share publicly. </PublicOrPrivateSectionHeader>
                  <PublicOrPrivateSectionText>
                    Share with everyone and make your voice heard.
                  </PublicOrPrivateSectionText>
                </CampaignSupportDesktopButtonPanel>
              </CampaignSupportDesktopButtonWrapper>
            )}
            <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
              <CampaignSupportDesktopButtonPanel>
                <ShareOnFacebookButton campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} darkButton={!darkButtonsOff} />
              </CampaignSupportDesktopButtonPanel>
            </CampaignSupportDesktopButtonWrapper>
            <CampaignSupportMobileButtonWrapper className="u-show-mobile">
              <CampaignSupportMobileButtonPanel>
                <ShareOnFacebookButton campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} mobileMode />
              </CampaignSupportMobileButtonPanel>
            </CampaignSupportMobileButtonWrapper>
            <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
              <CampaignSupportDesktopButtonPanel>
                <ShareOnTwitterButton campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} />
              </CampaignSupportDesktopButtonPanel>
            </CampaignSupportDesktopButtonWrapper>
            <CampaignSupportMobileButtonWrapper className="u-show-mobile">
              <CampaignSupportMobileButtonPanel>
                <ShareOnTwitterButton campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} mobileMode />
              </CampaignSupportMobileButtonPanel>
            </CampaignSupportMobileButtonWrapper>
          </CampaignSupportSection>
        </CampaignSupportSectionWrapper>
      </div>
    );
  }
}
CampaignShareChunk.propTypes = {
  campaignSEOFriendlyPath: PropTypes.string,
  campaignXNewsItemWeVoteId: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  darkButtonsOff: PropTypes.bool,
  privatePublicIntroductionsOff: PropTypes.bool,
};

const styles = () => ({
  buttonDesktop: {
    border: '1px solid #2e3c5d',
    boxShadow: '0 4px 6px rgb(50 50 93 / 11%)',
    fontSize: '18px',
    height: '45px !important',
    minWidth: '300px',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
});

const PublicOrPrivateSectionHeader = styled('span')`
  font-weight: 600;
`;

const PublicOrPrivateSectionText = styled('span')`
  color: #999;
`;

export default withStyles(styles)(CampaignShareChunk);
