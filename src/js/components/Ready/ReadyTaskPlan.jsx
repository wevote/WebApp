import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { ArrowForward } from '@material-ui/icons';
import AppActions from '../../actions/AppActions';
import { cordovaDot } from '../../utils/cordovaUtils';
import plan0Percent from '../../../img/global/svg-icons/ready/plan-0-percent.svg';
import plan100Percent from '../../../img/global/svg-icons/ready/plan-100-percent.svg';
import ReadyStore from '../../stores/ReadyStore';
import { ButtonLeft, ButtonText, Icon, PercentComplete, ReadyCard, StyledButton, StyledCheckbox, SubTitle, Title, TitleRowWrapper } from './ReadyTaskStyles';
import VoterStore from '../../stores/VoterStore';

class ReadyTaskPlan extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
  };

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
    AppActions.setShowVoterPlanModal(true);
  }

  render () {
    const { classes } = this.props;
    const { completed, voterPlanText } = this.state;

    return (
      <ReadyCard showprogresscolor={completed} className="card">
        <Icon className="u-cursor--pointer" onClick={this.showVoterPlanModal}>
          {completed ?  (
            <img
              src={cordovaDot(plan100Percent)}
              width="50"
              height="50"
              alt="Made a Plan to Vote"
            />
          ) : (
            <img
              src={cordovaDot(plan0Percent)}
              width="50"
              height="50"
              alt="Make a Plan to Vote"
            />
          )}
        </Icon>
        <div>
          <TitleRowWrapper>
            <Title
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
                    When Will You Vote?
                  </span>
                  <span className="u-show-desktop-tablet">
                    When and Where Will You Vote?
                  </span>
                </>
              )}
            </Title>
            <PercentComplete showprogresscolor={completed || undefined}>
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
                Write your own adventure and cast your vote!
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

const styles = theme => ({
  arrowRoot: {
    fontSize: 14,
    marginBottom: 3,
    marginLeft: 4,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
    },
  },
});

const VoterPlanPreview = styled.div`
  padding: 8px;
  background: #e8e8e8;
  font-size: 16px;
  border-radius: 5px;
  margin-top: 8px;
`;

export default withTheme(withStyles(styles)(ReadyTaskPlan));
