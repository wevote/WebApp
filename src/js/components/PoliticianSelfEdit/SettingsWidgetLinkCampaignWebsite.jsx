import { FormControl, TextField } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import PoliticianActions from '../../common/actions/PoliticianActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import { prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import PoliticianStore from '../../common/stores/PoliticianStore';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import VoterStore from '../../stores/VoterStore';

const delayBeforeApiUpdateCall = 2000;
const delayBeforeRemovingSavedStatus = 4000;

class SettingsWidgetLinkCampaignWebsite extends Component {
  constructor (props) {
    super(props);
    this.state = {
      initialCampaignWebsiteLoaded: false,
      campaignWebsite: '',
      campaignWebsiteSavedStatus: '',
    };

    this.handleKeyPressCampaignWebsite = this.handleKeyPressCampaignWebsite.bind(this);
    this.updateCampaignWebsite = this.updateCampaignWebsite.bind(this);
  }

  componentDidMount () {
    this.onPoliticianStoreChange();
    this.politicianStoreListener = PoliticianStore.addListener(
      this.onPoliticianStoreChange.bind(this),
    );
    const { displayOnly = false } = this.props;
    if (!displayOnly) {
      prepareForCordovaKeyboard('SettingsWidgetLinkCampaignWebsite');
    }
  }

  componentWillUnmount () {
    this.politicianStoreListener.remove();
    if (this.clearStatusTimer) clearTimeout(this.clearStatusTimer);
    if (this.campaignWebsiteTimer) clearTimeout(this.campaignWebsiteTimer);
    const { displayOnly = false } = this.props;
    if (!displayOnly) {
      restoreStylesAfterCordovaKeyboard('SettingsWidgetLinkCampaignWebsite');
    }
  }

  handleKeyPressCampaignWebsite (buttonId) {
    const { politicianWeVoteId } = this.props;
    if (this.campaignWebsiteTimer) clearTimeout(this.campaignWebsiteTimer);
    if (this.props.voterHasMadeChangesFunction) {
      this.props.voterHasMadeChangesFunction();
    }

    if (this.campaignWebsiteTimer) clearTimeout(this.campaignWebsiteTimer);
    this.campaignWebsiteTimer = setTimeout(() => {
      const { campaignWebsite } = this.state;
      // console.log('SettingsWidgetLinkCampaignWebsite handleKeyPressCampaignWebsite campaignWebsite:', campaignWebsite, ', politicianWeVoteId:', politicianWeVoteId);
      PoliticianActions.politicianCampaignWebsiteSave(politicianWeVoteId, campaignWebsite);
      this.setState({ campaignWebsiteSavedStatus: 'Saved' }, () => {
        const dataLayerObject = {
          event: 'action',
          actionDetails: {
            actionType: 'save',
            buttonId,
          },
          userDetails: VoterStore.getAnalyticsUserDetails(),
          pageDetails: getPageDetails(),
        };
        if (politicianWeVoteId) {
          dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
        }
        TagManager.dataLayer({ dataLayer: dataLayerObject });
      });
    }, delayBeforeApiUpdateCall);
  }

  onPoliticianStoreChange () {
    const { politicianWeVoteId } = this.props;
    const { initialCampaignWebsiteLoaded } = this.state;
    const politician = PoliticianStore.getPoliticianByWeVoteId(politicianWeVoteId);
    // console.log('SettingsWidgetLinkCampaignWebsite onPoliticianStoreChange politician:', politician, ', politicianWeVoteId:', politicianWeVoteId);
    if (politician && politician.politician_we_vote_id) {
      this.setState({
        politician,
      });
      if (!initialCampaignWebsiteLoaded) {
        this.setState({
          campaignWebsite: politician.politician_url,
          initialCampaignWebsiteLoaded: true,
        });
      }
    }
  }

  updateCampaignWebsite (event) {
    // console.log('SettingsWidgetLinkCampaignWebsite updateCampaignWebsite event.target.name:', event.target.name, ', event.target.value:', event.target.value);
    if (event.target.name === 'campaignWebsite') {
      this.setState({
        campaignWebsite: event.target.value,
        campaignWebsiteSavedStatus: 'Saving Campaign Website...',
      });
    }
    // After some time, clear saved message
    if (this.clearStatusTimer) clearTimeout(this.clearStatusTimer);
    this.clearStatusTimer = setTimeout(() => {
      this.setState({ campaignWebsiteSavedStatus: '' });
    }, delayBeforeRemovingSavedStatus);
  }

  render () {
    renderLog('SettingsWidgetLinkCampaignWebsite'); // Set LOG_RENDER_EVENTS to log all renders
    const {
      campaignWebsite,
      politician,
      campaignWebsiteSavedStatus,
    } = this.state;
    const { classes, externalUniqueId } = this.props;

    if (!politician) {
      return LoadingWheel;
    }
    const campaignWebsiteID = `linkCampaignWebsite-${externalUniqueId}`;
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >

        <span>
          <Row>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <StyledTextField
                  type="text"
                  // className={classes.input}
                  label="Campaign Website"
                  margin="dense"
                  variant="outlined"
                  id={campaignWebsiteID}
                  name="campaignWebsite"
                  placeholder="Campaign Website"
                  onKeyDown={() => this.handleKeyPressCampaignWebsite(campaignWebsiteID)}
                  onChange={this.updateCampaignWebsite}
                  value={campaignWebsite}
                />
              </FormControl>
            </ColumnFullWidth>
          </Row>
          <div className="u-gray-mid">{campaignWebsiteSavedStatus}</div>
        </span>
      </form>
    );
  }
}
SettingsWidgetLinkCampaignWebsite.propTypes = {
  classes: PropTypes.object,
  displayOnly: PropTypes.bool,
  externalUniqueId: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
  voterHasMadeChangesFunction: PropTypes.func,
};

const styles = () => ({
  formControl: {
    // width: '50%',
    // margin: '12px',
    // marginBottom: '12px',
    width: '100%',
  },
  input: {
    padding: '12px',
  },
});

const Row = styled('div')`
  width: calc(100% + 24px);
  margin-left: -12px;
  display: flex;
  justify-content: space-between;
`;

const ColumnFullWidth = styled('div')`
  padding: 6px 12px;
  width: 100%;
`;

const StyledTextField = styled(TextField)`
  * {
    margin: 0 !important;
  }
  margin: 0 !important;
`;

export default withStyles(styles)(SettingsWidgetLinkCampaignWebsite);
