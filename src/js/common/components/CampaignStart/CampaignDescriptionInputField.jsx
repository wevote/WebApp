import { FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CampaignStartActions from '../../actions/CampaignStartActions';
import { renderLog } from '../../utils/logging';
import CampaignStartStore from '../../stores/CampaignStartStore';
import CampaignStore from '../../stores/CampaignStore';

class CampaignDescriptionInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignDescription: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateCampaignDescription = this.updateCampaignDescription.bind(this);
  }

  componentDidMount () {
    // console.log('CampaignDescriptionInputField, componentDidMount');
    this.campaignStartStoreListener = CampaignStartStore.addListener(this.onCampaignStartStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStartStoreChange.bind(this));
    this.onCampaignStartStoreChange();
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignDescriptionInputField componentDidUpdate');
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
    let campaignDescription = '';
    if (editExistingCampaign) {
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      if (campaignX && campaignX.campaignx_we_vote_id) {
        campaignDescription = campaignX.campaign_description;
      }
    } else {
      campaignDescription = CampaignStartStore.getCampaignDescription();
    }
    const campaignDescriptionQueuedToSave = CampaignStartStore.getCampaignDescriptionQueuedToSave();
    const campaignDescriptionQueuedToSaveSet = CampaignStartStore.getCampaignDescriptionQueuedToSaveSet();
    let campaignDescriptionAdjusted = campaignDescription;
    if (campaignDescriptionQueuedToSaveSet) {
      campaignDescriptionAdjusted = campaignDescriptionQueuedToSave;
    }
    // console.log('onCampaignStartStoreChange campaignDescription: ', campaignDescription, ', campaignDescriptionQueuedToSave: ', campaignDescriptionQueuedToSave, ', campaignDescriptionAdjusted:', campaignDescriptionAdjusted);
    this.setState({
      campaignDescription: campaignDescriptionAdjusted,
    });
  }

  updateCampaignDescription (event) {
    if (event.target.name === 'campaignDescription') {
      CampaignStartActions.campaignDescriptionQueuedToSave(event.target.value);
      this.setState({
        campaignDescription: event.target.value,
      });
    }
  }

  render () {
    renderLog('CampaignDescriptionInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId } = this.props;
    const { campaignDescription } = this.state;

    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  id={`campaignDescriptionTextArea-${externalUniqueId}`}
                  name="campaignDescription"
                  margin="dense"
                  multiline
                  rows={8}
                  variant="outlined"
                  placeholder="Why is it important for candidate(s) to win?"
                  value={campaignDescription}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateCampaignDescription}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
CampaignDescriptionInputField.propTypes = {
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

export default withStyles(styles)(CampaignDescriptionInputField);
