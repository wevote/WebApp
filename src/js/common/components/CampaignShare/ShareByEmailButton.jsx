import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { EmailShareButton } from 'react-share';
import styled from 'styled-components';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import { isAndroid } from '../../utils/cordovaUtils';
import { isCordova } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import politicianListToSentenceString from '../../utils/politicianListToSentenceString';
import CampaignStore from '../../stores/CampaignStore';
import { cordovaSocialSharingByEmail, generateQuoteForSharing, generateSharingLink } from './shareButtonCommon';

class ShareByEmailButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignX: {},
      numberOfPoliticians: 0,
      politicianListSentenceString: '',
    };
  }

  componentDidMount () {
    // console.log('ShareByEmailButton componentDidMount');
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('ShareByEmailButton componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    const campaignXPoliticianList = CampaignStore.getCampaignXPoliticianList(campaignXWeVoteId);
    let numberOfPoliticians = 0;
    if (campaignXPoliticianList && campaignXPoliticianList.length > 0) {
      numberOfPoliticians = campaignXPoliticianList.length;
    }
    let politicianListSentenceString = '';
    if (numberOfPoliticians > 0) {
      politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
    }
    // console.log('onCampaignStoreChange politicianListSentenceString:', politicianListSentenceString);
    this.setState({
      campaignX,
      numberOfPoliticians,
      politicianListSentenceString,
    });
  }

  generateFullCampaignLink = () => {
    const { campaignXNewsItemWeVoteId } = this.props;
    const { campaignX } = this.state;
    return generateSharingLink(campaignX, campaignXNewsItemWeVoteId);
  }

  saveActionShareButton = () => {
    CampaignSupporterActions.shareButtonClicked(true);
  }

  render () {
    renderLog('ShareByEmailButton');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`ShareByEmailButton window.location.href: ${window.location.href}`);
    }
    const { darkButton, mobileMode } = this.props;
    const { campaignX, numberOfPoliticians, politicianListSentenceString } = this.state;
    const {
      campaign_title: campaignTitle,
    } = campaignX;
    let linkToBeShared = this.generateFullCampaignLink();
    linkToBeShared = linkToBeShared.replace('https://file:/', 'https://campaigns.wevote.us/');  // Cordova
    const quoteForSharing = generateQuoteForSharing(campaignTitle, numberOfPoliticians, politicianListSentenceString);
    // console.log('quoteForSharing:', quoteForSharing);
    const quoteForSharingEncoded = encodeURI(quoteForSharing);
    let subjectForSharing = `Vote for${politicianListSentenceString}`;
    if (subjectForSharing) {
      subjectForSharing = subjectForSharing.trim();
    }
    const subjectForSharingEncoded = encodeURI(subjectForSharing);
    // console.log('subjectForSharing:', subjectForSharing);
    return (
      <Wrapper>
        <div id="androidEmail"
             onClick={() => isAndroid() &&
               cordovaSocialSharingByEmail(subjectForSharingEncoded, quoteForSharingEncoded)}
        >
          <EmailShareButton
            className={mobileMode ? 'material_ui_button_mobile' : ''}
            id="shareByEmailButton"
            onClick={this.saveActionShareButton}
            body={quoteForSharing}
            openShareDialogOnClick
            subject={subjectForSharing}
            url={linkToBeShared}
            windowWidth={mobileMode ? 350 : 750}
            windowHeight={mobileMode ? 600 : 600}
            disabled={isAndroid()}
            disabledStyle={isAndroid() ? { opacity: 1 } : {}}
          >
            <div className={darkButton ? 'material_ui_dark_button' : 'material_ui_light_button'}>
              <div>
                Share from your email
              </div>
            </div>
          </EmailShareButton>
        </div>
      </Wrapper>
    );
  }
}
ShareByEmailButton.propTypes = {
  campaignXNewsItemWeVoteId: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
  darkButton: PropTypes.bool,
  mobileMode: PropTypes.bool,
};

const styles = () => ({
});

const Wrapper = styled('div')`
  width: 100%;
  display: block;
`;

export default withStyles(styles)(ShareByEmailButton);
