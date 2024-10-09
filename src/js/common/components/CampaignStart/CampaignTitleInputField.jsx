import { FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CampaignStartActions from '../../actions/CampaignStartActions';
import { renderLog } from '../../utils/logging';
import CampaignStartStore from '../../stores/CampaignStartStore';
import CampaignStore from '../../stores/CampaignStore';

class CampaignTitleInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignTitle: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateCampaignTitle = this.updateCampaignTitle.bind(this);
  }

  componentDidMount () {
    // console.log('CampaignTitleInputField, componentDidMount');
    this.campaignStartStoreListener = CampaignStartStore.addListener(this.onCampaignStartStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStartStoreChange.bind(this));
    this.onCampaignStartStoreChange();
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignTitleInputField componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStartStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignStartStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onCampaignStartStoreChange () {
    const { campaignXWeVoteId, editExistingCampaign } = this.props;
    // console.log('CampaignTitleInputField campaignXWeVoteId:', campaignXWeVoteId);
    let campaignTitle = '';
    if (editExistingCampaign) {
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      if (campaignX && campaignX.campaignx_we_vote_id) {
        campaignTitle = campaignX.campaign_title;
      }
    } else {
      campaignTitle = CampaignStartStore.getCampaignTitle();
    }
    // console.log('CampaignTitleInputField campaignTitle:', campaignTitle);
    const campaignTitleQueuedToSave = CampaignStartStore.getCampaignTitleQueuedToSave();
    const campaignTitleQueuedToSaveSet = CampaignStartStore.getCampaignTitleQueuedToSaveSet();
    let campaignTitleAdjusted = campaignTitle;
    if (campaignTitleQueuedToSaveSet) {
      campaignTitleAdjusted = campaignTitleQueuedToSave;
    }
    // console.log('onCampaignStartStoreChange campaignTitle: ', campaignTitle, ', campaignTitleQueuedToSave: ', campaignTitleQueuedToSave, ', campaignTitleAdjusted:', campaignTitleAdjusted);
    this.setState({
      campaignTitle: campaignTitleAdjusted,
    });
  }

  updateCampaignTitle (event) {
    if (event.target.name === 'campaignTitle') {
      CampaignStartActions.campaignTitleQueuedToSave(event.target.value);
      this.setState({
        campaignTitle: event.target.value,
      });
    }
  }

  render () {
    renderLog('CampaignTitleInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { campaignTitlePlaceholder, classes, externalUniqueId } = this.props;
    const { campaignTitle } = this.state;
    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  id={`campaignTitleTextArea-${externalUniqueId}`}
                  name="campaignTitle"
                  margin="dense"
                  variant="outlined"
                  placeholder={campaignTitlePlaceholder || 'Campaign title - the name voters will see'}
                  value={campaignTitle}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateCampaignTitle}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
CampaignTitleInputField.propTypes = {
  campaignTitlePlaceholder: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  editExistingCampaign: PropTypes.bool,
  externalUniqueId: PropTypes.string,
};

const styles = () => ({
  formControl: {
    width: '100%',
  },
  // TODO: Figure out how to apply to TextField
  textField: {
    fontSize: '22px',
  },
});

const ColumnFullWidth = styled('div')`
  padding: 8px 12px;
  width: 100%;
`;

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(CampaignTitleInputField);
