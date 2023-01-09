import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import { renderLog } from '../../utils/logging';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';

class VisibleToPublicCheckbox extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visibleToPublic: true, // Default setting
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateVisibleToPublic = this.updateVisibleToPublic.bind(this);
  }

  componentDidMount () {
    // console.log('VisibleToPublicCheckbox, componentDidMount');
    this.onCampaignSupporterStoreChange();
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('VisibleToPublicCheckbox componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignSupporterStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignSupporterStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onCampaignSupporterStoreChange () {
    const { campaignXWeVoteId } = this.props;
    let visibleToPublicFromDatabase;
    if (campaignXWeVoteId) {
      const campaignXSupporter = CampaignSupporterStore.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('campaignXSupporter:', campaignXSupporter);
      if ('visible_to_public' in campaignXSupporter) {
        ({ visible_to_public: visibleToPublicFromDatabase } = campaignXSupporter);
      }
    }
    const visibleToPublicQueuedToSave = CampaignSupporterStore.getVisibleToPublicQueuedToSave();
    const visibleToPublicQueuedToSaveSet = CampaignSupporterStore.getVisibleToPublicQueuedToSaveSet();
    // console.log('onCampaignSupporterStoreChange visibleToPublicFromDatabase: ', visibleToPublicFromDatabase, ', visibleToPublicQueuedToSave: ', visibleToPublicQueuedToSave);
    if (visibleToPublicQueuedToSaveSet) {
      this.setState({
        visibleToPublic: visibleToPublicQueuedToSave,
      });
    } else if (visibleToPublicFromDatabase !== undefined) {
      this.setState({
        visibleToPublic: visibleToPublicFromDatabase,
      });
    }
  }

  updateVisibleToPublic (event) {
    if (event.target.name === 'visibleToPublic') {
      const visibleToPublic = Boolean(event.target.checked);
      CampaignSupporterActions.visibleToPublicQueuedToSave(visibleToPublic);
      this.setState({
        visibleToPublic,
      });
    }
  }

  render () {
    renderLog('VisibleToPublicCheckbox');  // Set LOG_RENDER_EVENTS to log all renders

    const { campaignXWeVoteId, classes, externalUniqueId } = this.props;
    const { visibleToPublic } = this.state;
    return (
      <div className="">
        {!!(campaignXWeVoteId) && (
          <form onSubmit={(e) => { e.preventDefault(); }}>
            <Wrapper>
              <ColumnFullWidth>
                <FormControl classes={{ root: classes.formControl }}>
                  <CheckboxLabel
                    classes={{ label: classes.checkboxLabel }}
                    control={(
                      <Checkbox
                        checked={visibleToPublic}
                        classes={{ root: classes.checkboxRoot }}
                        color="primary"
                        id={`visibleToPublicCheckbox-${externalUniqueId}`}
                        name="visibleToPublic"
                        onChange={this.updateVisibleToPublic}
                        onKeyDown={this.handleKeyPress}
                      />
                    )}
                    label="Display my name, photo and comment with this campaign"
                  />
                </FormControl>
              </ColumnFullWidth>
            </Wrapper>
          </form>
        )}
      </div>
    );
  }
}
VisibleToPublicCheckbox.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
};

const styles = () => ({
  formControl: {
    width: '100%',
  },
  checkboxRoot: {
    paddingTop: 0,
    paddingLeft: '9px',
    paddingBottom: 0,
  },
  checkboxLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});

const CheckboxLabel = styled(FormControlLabel)`
  margin-bottom: 0 !important;
`;

const ColumnFullWidth = styled('div')`
  padding: 0 12px;
  width: 100%;
`;

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(VisibleToPublicCheckbox);
