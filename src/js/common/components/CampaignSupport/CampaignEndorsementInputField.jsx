import { FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import { renderLog } from '../../utils/logging';
import politicianListToSentenceString from '../../utils/politicianListToSentenceString';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';

class CampaignEndorsementInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignXPoliticianList: [],
      supporterEndorsement: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateSupporterEndorsement = this.updateSupporterEndorsement.bind(this);
  }

  componentDidMount () {
    // console.log('CampaignEndorsementInputField, componentDidMount');
    this.onCampaignStoreChange();
    this.onCampaignSupporterStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignEndorsementInputField componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
        this.onCampaignSupporterStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const campaignXPoliticianList = CampaignStore.getCampaignXPoliticianList(campaignXWeVoteId);
    this.setState({
      campaignXPoliticianList,
    });
  }

  onCampaignSupporterStoreChange () {
    const { campaignXWeVoteId } = this.props;
    let supporterEndorsement = '';
    if (campaignXWeVoteId) {
      const campaignXSupporter = CampaignSupporterStore.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('campaignXSupporter:', campaignXSupporter);
      ({ supporter_endorsement: supporterEndorsement } = campaignXSupporter);
    }
    const supporterEndorsementQueuedToSave = CampaignSupporterStore.getSupporterEndorsementQueuedToSave();
    const supporterEndorsementQueuedToSaveSet = CampaignSupporterStore.getSupporterEndorsementQueuedToSaveSet();
    let supporterEndorsementAdjusted = supporterEndorsement;
    if (supporterEndorsementQueuedToSaveSet) {
      supporterEndorsementAdjusted = supporterEndorsementQueuedToSave;
    }
    // console.log('onCampaignSupporterStoreChange supporterEndorsement: ', supporterEndorsement, ', supporterEndorsementQueuedToSave: ', supporterEndorsementQueuedToSave, ', supporterEndorsementAdjusted:', supporterEndorsementAdjusted);
    this.setState({
      supporterEndorsement: supporterEndorsementAdjusted,
    });
  }

  updateSupporterEndorsement (event) {
    if (event.target.name === 'supporterEndorsement') {
      CampaignSupporterActions.supporterEndorsementQueuedToSave(event.target.value);
      this.setState({
        supporterEndorsement: event.target.value,
      });
    }
  }

  render () {
    renderLog('CampaignEndorsementInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId } = this.props;
    const { campaignXPoliticianList, supporterEndorsement } = this.state;
    let numberOfPoliticians = 0;
    if (campaignXPoliticianList && campaignXPoliticianList.length > 0) {
      numberOfPoliticians = campaignXPoliticianList.length;
    }
    let placeholderText = '';
    if (numberOfPoliticians > 0) {
      const politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
      placeholderText += `I am supporting${politicianListSentenceString}.`;
      placeholderText += ' It is important they win because...';
    } else {
      placeholderText += 'It is important for them to win because...';
    }
    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  id={`supporterEndorsementTextArea-${externalUniqueId}`}
                  name="supporterEndorsement"
                  margin="dense"
                  multiline
                  rows={6}
                  variant="outlined"
                  placeholder={placeholderText}
                  value={supporterEndorsement || ''}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateSupporterEndorsement}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
CampaignEndorsementInputField.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  classes: PropTypes.object,
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
  padding: 8px 12px 0 12px;
  width: 100%;
`;

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(CampaignEndorsementInputField);
