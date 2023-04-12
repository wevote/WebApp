import { FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ShareActions from '../../actions/ShareActions';
import ShareStore from '../../stores/ShareStore';
import { renderLog } from '../../utils/logging';
import politicianListToSentenceString from '../../utils/politicianListToSentenceString';
import CampaignStore from '../../stores/CampaignStore';
import superSharingSuggestedEmailText from '../../utils/superSharingSuggestedEmailText';

class SuperShareItemComposeInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignTitle: '',
      campaignXPoliticianList: [],
      personalizedMessage: '',
      personalizedSubject: '',
      placeholderMessage: '',
      placeholderSubject: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updatePersonalizedSubject = this.updatePersonalizedSubject.bind(this);
    this.updatePersonalizedMessage = this.updatePersonalizedMessage.bind(this);
  }

  componentDidMount () {
    // console.log('SuperShareItemComposeInputField, componentDidMount');
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onShareStoreChange();
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.setPersonalizedTextIfBlank();
  }

  componentDidUpdate (prevProps) {
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
      if (!superShareItemId || superShareItemId === 0) {
        this.onShareStoreChange();
      }
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
        this.onShareStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
    this.shareStoreListener.remove();
    if (this.setPersonalizedTextTimer) {
      clearTimeout(this.setPersonalizedTextTimer);
    }
  }

  handleKeyPress () {
    //
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    const {
      campaign_title: campaignTitle,
    } = campaignX;
    const campaignXPoliticianList = CampaignStore.getCampaignXPoliticianList(campaignXWeVoteId);
    this.setState({
      campaignTitle,
      campaignXPoliticianList,
    });
  }

  onShareStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
    if (superShareItemId) {
      const superShareItem = ShareStore.getSuperShareItemById(superShareItemId);
      const {
        personalized_message: personalizedMessage,
        personalized_subject: personalizedSubject,
      } = superShareItem;
      const personalizedMessageQueuedToSave = ShareStore.getPersonalizedMessageQueuedToSave(superShareItemId);
      const personalizedMessageQueuedToSaveSet = ShareStore.getPersonalizedMessageQueuedToSaveSet(superShareItemId);
      let personalizedMessageAdjusted = personalizedMessage;
      if (personalizedMessageQueuedToSaveSet) {
        personalizedMessageAdjusted = personalizedMessageQueuedToSave;
      }
      const personalizedSubjectQueuedToSave = ShareStore.getPersonalizedSubjectQueuedToSave(superShareItemId);
      const personalizedSubjectQueuedToSaveSet = ShareStore.getPersonalizedSubjectQueuedToSaveSet(superShareItemId);
      let personalizedSubjectAdjusted = personalizedSubject;
      if (personalizedSubjectQueuedToSaveSet) {
        personalizedSubjectAdjusted = personalizedSubjectQueuedToSave;
      }
      // console.log('onShareStoreChange personalizedSubject: ', personalizedSubject, ', personalizedSubjectAdjusted: ', personalizedSubjectAdjusted);
      // console.log('onShareStoreChange personalizedMessage: ', personalizedMessage, ', personalizedMessageAdjusted: ', personalizedMessageAdjusted);
      this.setState({
        personalizedMessage: personalizedMessageAdjusted,
        personalizedSubject: personalizedSubjectAdjusted,
      });
      const delayBeforeSettingPersonalizedText = 200;
      this.setPersonalizedTextTimer = setTimeout(() => {
        this.setPersonalizedTextIfBlank();
      }, delayBeforeSettingPersonalizedText);
    }
  }

  setPersonalizedTextIfBlank = (resetDefaultText = false) => {
    const { campaignXWeVoteId } = this.props;
    const { campaignTitle, campaignXPoliticianList } = this.state;
    const politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
    const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
    let superShareItem;
    let superShareItemExists = false;
    if (superShareItemId) {
      superShareItem = ShareStore.getSuperShareItemById(superShareItemId);
    }
    if (superShareItem) {
      if (superShareItem.super_share_item_id) {
        superShareItemExists = true;
      }
    }
    // console.log('setPersonalizedTextIfBlank superShareItem: ', superShareItem, ', superShareItemExists:', superShareItemExists);
    // Only proceed if we know a superShareItem has been returned by API server
    if (superShareItemExists) {
      const {
        suggestedMessage,
        suggestedSubject,
      } = superSharingSuggestedEmailText(campaignTitle, politicianListSentenceString);
      const {
        personalized_message: personalizedMessage,
        personalized_subject: personalizedSubject,
      } = superShareItem;
      const personalizedMessageQueuedToSaveSet = ShareStore.getPersonalizedMessageQueuedToSaveSet(superShareItemId);
      const savedPersonalizedMessageExists = personalizedMessage.trim() !== '';
      const setPersonalizedMessageToDefault = resetDefaultText || (!savedPersonalizedMessageExists && !personalizedMessageQueuedToSaveSet);
      // console.log('setPersonalizedMessageToDefault:', setPersonalizedMessageToDefault);
      if (setPersonalizedMessageToDefault) {
        // Now set it locally
        ShareActions.personalizedMessageQueuedToSave(superShareItemId, suggestedMessage);
        this.setState({
          personalizedMessage: suggestedMessage,
          placeholderMessage: suggestedMessage,
        });
      }
      const personalizedSubjectQueuedToSaveSet = ShareStore.getPersonalizedSubjectQueuedToSaveSet(superShareItemId);
      const savedPersonalizedSubjectExists = personalizedSubject.trim() !== '';
      const setPersonalizedSubjectToDefault = resetDefaultText || (!savedPersonalizedSubjectExists && !personalizedSubjectQueuedToSaveSet);
      // console.log('setPersonalizedSubjectToDefault:', setPersonalizedSubjectToDefault);
      if (setPersonalizedSubjectToDefault) {
        // Now set it locally
        ShareActions.personalizedSubjectQueuedToSave(superShareItemId, suggestedSubject);
        this.setState({
          personalizedSubject: suggestedSubject,
          placeholderSubject: suggestedSubject,
        });
      }
    }
  }

  updatePersonalizedSubject (event) {
    if (event.target.name === 'personalizedSubject') {
      const { campaignXWeVoteId } = this.props;
      const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
      ShareActions.personalizedSubjectQueuedToSave(superShareItemId, event.target.value);
      this.setState({
        personalizedSubject: event.target.value,
      });
    }
  }

  updatePersonalizedMessage (event) {
    if (event.target.name === 'personalizedMessage') {
      const { campaignXWeVoteId } = this.props;
      const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
      ShareActions.personalizedMessageQueuedToSave(superShareItemId, event.target.value);
      this.setState({
        personalizedMessage: event.target.value,
      });
    }
  }

  render () {
    renderLog('SuperShareItemComposeInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId } = this.props;
    const { personalizedSubject, personalizedMessage, placeholderSubject, placeholderMessage } = this.state;
    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  id={`PersonalizedSubjectTextArea-${externalUniqueId}`}
                  label="Subject"
                  name="personalizedSubject"
                  margin="dense"
                  multiline
                  rows={1}
                  variant="outlined"
                  placeholder={placeholderSubject}
                  value={personalizedSubject || ''}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updatePersonalizedSubject}
                />
              </FormControl>
            </ColumnFullWidth>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  id={`PersonalizedMessageTextArea-${externalUniqueId}`}
                  name="personalizedMessage"
                  margin="dense"
                  multiline
                  rows={8}
                  variant="outlined"
                  placeholder={placeholderMessage}
                  value={personalizedMessage}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updatePersonalizedMessage}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
SuperShareItemComposeInputField.propTypes = {
  // campaignXNewsItemWeVoteId: PropTypes.string,
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
  flex-direction: column;
  margin-left: -12px;
  width: 100%;
`;

export default withStyles(styles)(SuperShareItemComposeInputField);
