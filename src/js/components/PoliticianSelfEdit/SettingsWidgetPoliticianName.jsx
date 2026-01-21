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
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import PoliticianStore from '../../common/stores/PoliticianStore';
import VoterStore from '../../stores/VoterStore';

const delayBeforeApiUpdateCall = 2000;
const delayBeforeRemovingSavedStatus = 4000;

class SettingsWidgetPoliticianName extends Component {
  constructor (props) {
    super(props);
    this.state = {
      initialNameLoaded: false,
      politicianName: '',
      politicianNameSavedStatus: '',
    };

    this.handleKeyPressPoliticianName = this.handleKeyPressPoliticianName.bind(this);
    this.updatePoliticianName = this.updatePoliticianName.bind(this);
  }

  componentDidMount () {
    this.onPoliticianStoreChange();
    this.politicianStoreListener = PoliticianStore.addListener(
      this.onPoliticianStoreChange.bind(this),
    );
    const { displayOnly = false } = this.props;
    if (!displayOnly) {
      prepareForCordovaKeyboard('SettingsWidgetPoliticianName');
    }
  }

  componentWillUnmount () {
    this.politicianStoreListener.remove();
    if (this.clearStatusTimer) clearTimeout(this.clearStatusTimer);
    if (this.politicianNameTimer) clearTimeout(this.politicianNameTimer);
    const { displayOnly = false } = this.props;
    if (!displayOnly) {
      restoreStylesAfterCordovaKeyboard('SettingsWidgetPoliticianName');
    }
  }

  handleKeyPressPoliticianName () {
    const { politicianWeVoteId } = this.props;
    if (this.politicianNameTimer) clearTimeout(this.politicianNameTimer);
    if (this.props.voterHasMadeChangesFunction) {
      this.props.voterHasMadeChangesFunction();
    }

    if (this.politicianNameTimer) clearTimeout(this.politicianNameTimer);
    this.politicianNameTimer = setTimeout(() => {
      const { politicianName } = this.state;
      // console.log('SettingsWidgetPoliticianName handleKeyPressPoliticianName politicianName:', politicianName, ', politicianWeVoteId:', politicianWeVoteId);
      PoliticianActions.politicianNameSave(politicianWeVoteId, politicianName);
      this.setState({ politicianNameSavedStatus: 'Saved' }, () => {
        const dataLayerObject = {
          event: 'action',
          actionDetails: {
            actionType: 'save',
            buttonId: 'SavePoliticianName',
          },
          userDetails: VoterStore.getAnalyticsUserDetails(),
          pageDetails: getPageDetails(),
        };
        TagManager.dataLayer({ dataLayer: dataLayerObject });
      });
    }, delayBeforeApiUpdateCall);
  }

  onPoliticianStoreChange () {
    const { politicianWeVoteId } = this.props;
    const { initialNameLoaded } = this.state;
    const politician = PoliticianStore.getPoliticianByWeVoteId(politicianWeVoteId);
    // console.log('SettingsWidgetPoliticianName onPoliticianStoreChange politician:', politician, ', politicianWeVoteId:', politicianWeVoteId);
    if (politician && politician.politician_we_vote_id) {
      this.setState({
        politician,
      });
      if (!initialNameLoaded) {
        this.setState({
          politicianName: politician.politician_name,
          initialNameLoaded: true,
        });
      }
    }
  }

  updatePoliticianName (event) {
    // console.log('SettingsWidgetPoliticianName updatePoliticianName event.target.name:', event.target.name, ', event.target.value:', event.target.value);
    if (event.target.name === 'politicianName') {
      this.setState({
        politicianName: event.target.value,
        politicianNameSavedStatus: 'Saving Candidate Name...',
      });
    }
    // After some time, clear saved message
    if (this.clearStatusTimer) clearTimeout(this.clearStatusTimer);
    this.clearStatusTimer = setTimeout(() => {
      this.setState({ politicianNameSavedStatus: '' });
    }, delayBeforeRemovingSavedStatus);
  }

  render () {
    renderLog('SettingsWidgetPoliticianName'); // Set LOG_RENDER_EVENTS to log all renders
    const {
      politicianName,
      politician,
      politicianNameSavedStatus,
    } = this.state;
    const { classes, externalUniqueId } = this.props;

    if (!politician) {
      return LoadingWheel;
    }

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
                  label="Candidate Name for Ballot"
                  margin="dense"
                  variant="outlined"
                  autoComplete="given-name"
                  id={`politicianName-${externalUniqueId}`}
                  name="politicianName"
                  placeholder="Candidate Name for Ballot"
                  onKeyDown={this.handleKeyPressPoliticianName}
                  onChange={this.updatePoliticianName}
                  value={politicianName}
                />
              </FormControl>
            </ColumnFullWidth>
          </Row>
          <div className="u-gray-mid">{politicianNameSavedStatus}</div>
        </span>
      </form>
    );
  }
}
SettingsWidgetPoliticianName.propTypes = {
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

export default withStyles(styles)(SettingsWidgetPoliticianName);
