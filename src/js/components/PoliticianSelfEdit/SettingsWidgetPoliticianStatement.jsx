import { Button, FormControl, TextField } from '@mui/material';
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

const delayBeforeRemovingSavedStatus = 4000;

class SettingsWidgetPoliticianStatement extends Component {
  constructor (props) {
    super(props);
    this.state = {
      initialPoliticianStatementLoaded: false,
      politicianStatement: '',
      politicianStatementSavedStatus: '',
    };

    this.handleSavePoliticianStatement = this.handleSavePoliticianStatement.bind(this);
    this.updatePoliticianStatement = this.updatePoliticianStatement.bind(this);
  }

  componentDidMount () {
    this.onPoliticianStoreChange();
    this.politicianStoreListener = PoliticianStore.addListener(
      this.onPoliticianStoreChange.bind(this),
    );
    const { displayOnly = false } = this.props;
    if (!displayOnly) {
      prepareForCordovaKeyboard('SettingsWidgetPoliticianStatement');
    }
  }

  componentWillUnmount () {
    this.politicianStoreListener.remove();
    if (this.clearStatusTimer) clearTimeout(this.clearStatusTimer);
    const { displayOnly = false } = this.props;
    if (!displayOnly) {
      restoreStylesAfterCordovaKeyboard('SettingsWidgetPoliticianStatement');
    }
  }

  handleSavePoliticianStatement (buttonId) {
    const { politicianWeVoteId } = this.props;
    const { politicianStatement } = this.state;

    // console.log('SettingsWidgetPoliticianStatement handleSavePoliticianStatement politicianStatement:', politicianStatement, ', politicianWeVoteId:', politicianWeVoteId);
    PoliticianActions.politicianStatementSave(politicianWeVoteId, politicianStatement);

    this.setState({
      politicianStatementSavedStatus: 'Saved',
      hasUnsavedChanges: false,
    }, () => {
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

    // Clear saved message after delay
    if (this.clearStatusTimer) clearTimeout(this.clearStatusTimer);
    this.clearStatusTimer = setTimeout(() => {
      this.setState({ politicianStatementSavedStatus: '' });
    }, delayBeforeRemovingSavedStatus);
  }

  onPoliticianStoreChange () {
    const { politicianWeVoteId } = this.props;
    const { initialPoliticianStatementLoaded } = this.state;
    const politician = PoliticianStore.getPoliticianByWeVoteId(politicianWeVoteId);
    // console.log('SettingsWidgetPoliticianStatement onPoliticianStoreChange politician:', politician, ', politicianWeVoteId:', politicianWeVoteId);
    if (politician && politician.politician_we_vote_id) {
      this.setState({
        politician,
      });
      if (!initialPoliticianStatementLoaded) {
        this.setState({
          politicianStatement: politician.ballot_guide_official_statement,
          initialPoliticianStatementLoaded: true,
        });
      }
    }
  }

  updatePoliticianStatement (event) {
    // console.log('SettingsWidgetPoliticianStatement updatePoliticianStatement event.target.name:', event.target.name, ', event.target.value:', event.target.value);
    if (event.target.name === 'politicianStatement') {
      this.setState({
        politicianStatement: event.target.value,
        hasUnsavedChanges: true,
      });
    }
  }

  render () {
    renderLog('SettingsWidgetPoliticianStatement'); // Set LOG_RENDER_EVENTS to log all renders
    const {
      politician,
      politicianStatement,
      politicianStatementSavedStatus,
      hasUnsavedChanges,
    } = this.state;
    const { classes, externalUniqueId } = this.props;

    if (!politician) {
      return LoadingWheel;
    }
    const politicianStatementID = `official-statement-${externalUniqueId}`;
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
                  autoComplete="given-name"
                  // className={classes.input}
                  fullWidth
                  id={politicianStatementID}
                  label="Official Statement"
                  margin="dense"
                  multiline
                  name="politicianStatement"
                  placeholder="Your official statement as a candidate, including your platform and what you believe."
                  onChange={this.updatePoliticianStatement}
                  rows={4}
                  type="text"
                  value={politicianStatement}
                  variant="outlined"
                />
              </FormControl>
            </ColumnFullWidth>
          </Row>
          <Row>
            <ColumnFullWidth>
              <ButtonContainer>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={() => this.handleSavePoliticianStatement(politicianStatementID)}
                  disabled={!hasUnsavedChanges}
                  className={classes.saveButton}
                >
                  Save
                </Button>
                {politicianStatementSavedStatus && (
                  <StatusMessage className="u-gray-mid">
                    {politicianStatementSavedStatus}
                  </StatusMessage>
                )}
              </ButtonContainer>
            </ColumnFullWidth>
          </Row>
        </span>
      </form>
    );
  }
}

SettingsWidgetPoliticianStatement.propTypes = {
  classes: PropTypes.object,
  displayOnly: PropTypes.bool,
  externalUniqueId: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
};

const styles = () => ({
  formControl: {
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

const ButtonContainer = styled('div')`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`;

const StatusMessage = styled('span')`
  font-size: 14px;
`;
export default withStyles(styles)(SettingsWidgetPoliticianStatement);
