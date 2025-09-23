import { FormControl, TextField } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import PoliticianActions from '../../common/actions/PoliticianActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import { prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import PoliticianStore from '../../common/stores/PoliticianStore';

const delayBeforeApiUpdateCall = 2000;
const delayBeforeRemovingSavedStatus = 4000;

class SettingsWidgetPoliticianStatement extends Component {
  constructor (props) {
    super(props);
    this.state = {
      initialPoliticianStatementLoaded: false,
      politicianStatement: '',
      politicianStatementSavedStatus: '',
    };

    this.handleKeyPressPoliticianStatement = this.handleKeyPressPoliticianStatement.bind(this);
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
    if (this.politicianStatementTimer) clearTimeout(this.politicianStatementTimer);
    const { displayOnly = false } = this.props;
    if (!displayOnly) {
      restoreStylesAfterCordovaKeyboard('SettingsWidgetPoliticianStatement');
    }
  }

  handleKeyPressPoliticianStatement () {
    const { politicianWeVoteId } = this.props;
    if (this.politicianStatementTimer) clearTimeout(this.politicianStatementTimer);
    if (this.props.voterHasMadeChangesFunction) {
      this.props.voterHasMadeChangesFunction();
    }

    if (this.politicianStatementTimer) clearTimeout(this.politicianStatementTimer);
    this.politicianStatementTimer = setTimeout(() => {
      const { politicianStatement } = this.state;
      // console.log('SettingsWidgetPoliticianStatement handleKeyPressPoliticianStatement politicianStatement:', politicianStatement, ', politicianWeVoteId:', politicianWeVoteId);
      PoliticianActions.politicianStatementSave(politicianWeVoteId, politicianStatement);
      this.setState({ politicianStatementSavedStatus: 'Saved' });
    }, delayBeforeApiUpdateCall);
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
        politicianStatementSavedStatus: 'Saving Candidate Name...',
      });
    }
    // After some time, clear saved message
    if (this.clearStatusTimer) clearTimeout(this.clearStatusTimer);
    this.clearStatusTimer = setTimeout(() => {
      this.setState({ politicianStatementSavedStatus: '' });
    }, delayBeforeRemovingSavedStatus);
  }

  render () {
    renderLog('SettingsWidgetPoliticianStatement'); // Set LOG_RENDER_EVENTS to log all renders
    const {
      politicianStatement,
      politician,
      politicianStatementSavedStatus,
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
                  autoComplete="given-name"
                  // className={classes.input}
                  fullWidth
                  id={`official-statement-${externalUniqueId}`}
                  label="Official Statement"
                  margin="dense"
                  multiline
                  name="politicianStatement"
                  placeholder="Your official statement as a candidate, including your platform and what you believe."
                  onKeyDown={this.handleKeyPressPoliticianStatement}
                  onChange={this.updatePoliticianStatement}
                  rows={4}
                  type="text"
                  value={politicianStatement}
                  variant="outlined"
                />
              </FormControl>
            </ColumnFullWidth>
          </Row>
          <div className="u-gray-mid">{politicianStatementSavedStatus}</div>
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

export default withStyles(styles)(SettingsWidgetPoliticianStatement);
