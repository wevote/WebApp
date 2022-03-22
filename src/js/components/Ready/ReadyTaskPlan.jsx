import { ArrowForward } from '@mui/icons-material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React from 'react';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import AppObservableStore from '../../stores/AppObservableStore';
import ReadyStore from '../../stores/ReadyStore';
import VoterStore from '../../stores/VoterStore';
import { ButtonLeft, ButtonText, Icon, PercentComplete, ReadyCard, StyledButton, StyledCheckbox, SubTitle, TitleRowWrapper } from './ReadyTaskStyles';

const plan0Percent = '../../../img/global/svg-icons/ready/plan-0-percent.svg';
const plan100Percent = '../../../img/global/svg-icons/ready/plan-100-percent.svg';

class ReadyTaskPlan extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      completed: false,
    };
  }

  componentDidMount () {
    this.readyStoreListener = ReadyStore.addListener(this.onReadyStoreChange.bind(this));
    const googleCivicElectionId = VoterStore.electionId();
    const voterPlanText = ReadyStore.getVoterPlanTextForVoterByElectionId(googleCivicElectionId);
    let completed = false;
    if (voterPlanText && voterPlanText.length > 0) {
      completed = true;
    }
    this.setState({
      completed,
      voterPlanText,
    });
  }

  componentWillUnmount () {
    this.readyStoreListener.remove();
  }

  onReadyStoreChange () {
    const googleCivicElectionId = VoterStore.electionId();
    const voterPlanText = ReadyStore.getVoterPlanTextForVoterByElectionId(googleCivicElectionId);
    let completed = false;
    if (voterPlanText && voterPlanText.length > 0) {
      completed = true;
    }
    this.setState({
      completed,
      voterPlanText,
    });
  }

  showVoterPlanModal = () => {
    AppObservableStore.setShowVoterPlanModal(true);
  }

  render () {
    renderLog('ReadyTaskPlan');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { completed, voterPlanText } = this.state;

    return (
      <ReadyCard showProgressColor={completed} className="card">
        <Icon className="u-cursor--pointer" onClick={this.showVoterPlanModal}>
          {completed ?  (
            <img
              src={normalizedImagePath(plan100Percent)}
              width="50"
              height="50"
              alt="Made a Plan to Vote"
            />
          ) : (
            <img
              src={normalizedImagePath(plan0Percent)}
              width="50"
              height="50"
              alt="Make a Plan to Vote"
            />
          )}
        </Icon>
        <div>
          <TitleRowWrapper>
            <PlanTitle
              className="u-cursor--pointer"
              onClick={this.showVoterPlanModal}
            >
              {completed ? (
                <>
                  <span className="u-show-mobile">
                    Your Voting Plan
                  </span>
                  <span className="u-show-desktop-tablet">
                    Your Voting Plan
                  </span>
                </>
              ) : (
                <>
                  <span className="u-show-mobile">
                    Make Plan to Vote
                  </span>
                  <span className="u-show-desktop-tablet">
                    Make Plan to Vote
                  </span>
                </>
              )}
            </PlanTitle>
            <PercentComplete showProgressColor={completed || undefined}>
              {completed ? '100%' : '0%'}
              {!!(completed) && (
                <span className="u-show-desktop-tablet">
                  {' '}
                  Complete
                </span>
              )}
            </PercentComplete>
          </TitleRowWrapper>
          {completed ? (
            <div className="u-cursor--pointer" onClick={this.showVoterPlanModal}>
              <VoterPlanPreview>
                {voterPlanText}
              </VoterPlanPreview>
            </div>
          ) : (
            <>
              <SubTitle className="u-cursor--pointer" onClick={this.showVoterPlanModal}>
                When will you cast your vote? By mail, or at polling location?
              </SubTitle>
              <StyledButton
                id="makeYourPlanNowButton"
                className="u-cursor--pointer"
                color="primary"
                completed={completed || undefined}
                onClick={this.showVoterPlanModal}
                variant="outlined"
                withoutsteps="1"
              >
                <ButtonLeft>
                  <StyledCheckbox />
                  <ButtonText>
                    <span className="u-show-mobile">
                      Make Your Plan
                    </span>
                    <span className="u-show-desktop-tablet">
                      Make Your Plan Now
                    </span>
                    <ArrowForward classes={{ root: classes.arrowRoot }} />
                  </ButtonText>
                </ButtonLeft>
              </StyledButton>
            </>
          )}
        </div>
      </ReadyCard>
    );
  }
}
ReadyTaskPlan.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  arrowRoot: {
    fontSize: 14,
    marginBottom: 3,
    marginLeft: 4,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
    },
  },
});

const PlanTitle = styled('h3')(({ theme }) => (`
  margin: 0;
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 6px;
  margin-top: 12px;
  ${theme.breakpoints.down('sm')} {
    font-size: 24px;
    margin-top: 0;
  }
  ${theme.breakpoints.down('xs')} {
    font-size: 20px;
    margin-top: 0;
  }
`));

const VoterPlanPreview = styled('div')`
  padding: 8px;
  background: #e8e8e8;
  font-size: 16px;
  border-radius: 5px;
  margin-top: 8px;
`;

export default withTheme(withStyles(styles)(ReadyTaskPlan));
