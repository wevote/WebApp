import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CheckCircle from '@material-ui/icons/CheckCircle';
import AppActions from '../../actions/AppActions';
import ballot0Percent from '../../../img/global/svg-icons/ready/ballot-0-percent.svg';
import ballot50Percent from '../../../img/global/svg-icons/ready/ballot-50-percent.svg';
import ballot100Percent from '../../../img/global/svg-icons/ready/ballot-100-percent.svg';
import BallotActions from '../../actions/BallotActions';
import BallotStore from '../../stores/BallotStore';
import { cordovaDot, historyPush } from '../../utils/cordovaUtils';
import { ButtonLeft, ButtonText, Icon, PercentComplete, ReadyCard, StyledButton, StyledCheckbox, StyledCheckboxCompleted, SubTitle, Title, TitleRowWrapper } from './ReadyTaskStyles';
import ShowMoreButtons from './ShowMoreButtons';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import VoterConstants from '../../constants/VoterConstants';

class ReadyTaskBallot extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      allCandidatesButtonNeeded: false, // Are there candidates on this ballot?
      allCandidatesAllCompleted: false,
      allCandidatesNumberCompleted: 0,
      allCandidatesShowButton: false, // Given all of the buttons we need to show, should this one be "unfurled"?
      allCandidatesTotalNumber: 0,
      federalButtonNeeded: false, // Are there Federal candidates on this ballot?
      federalAllCompleted: false,
      federalNumberCompleted: 0,
      federalShowButton: false,
      federalTotalNumber: 0,
      howItWorksCompleted: false,
      howItWorksShowButton: true,
      localButtonNeeded: false, // Are there Local candidates on this ballot?
      localShowButton: false,
      localAllCompleted: false,
      localNumberCompleted: 0,
      localTotalNumber: 0,
      measureButtonNeeded: false, // Are there measures on this ballot?
      measureShowButton: false,
      measureAllCompleted: false,
      measureNumberCompleted: 0,
      measureTotalNumber: 0,
      percentCompleted: 0,
      personalizedScoreIntroCompleted: false,
      personalizedScoreIntroShowButton: true,
      showMoreButtonWasClicked: false,
      showMoreShowButton: false,
      stateButtonNeeded: false, // Are there State candidates on this ballot?
      stateShowButton: false,
      stateAllCompleted: false,
      stateNumberCompleted: 0,
      stateTotalNumber: 0,
    };
  }

  componentDidMount () {
    const { showMoreButtonWasClicked } = this.state;
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.setCompletedStatus();
    const ballotItemsStatusCounts = BallotStore.getBallotItemsStatusCounts();
    // console.log('componentDidMount ballotItemsStatusCounts:', ballotItemsStatusCounts);
    this.setState(ballotItemsStatusCounts);
    this.calculateScore(ballotItemsStatusCounts);
    this.calculateShowButtonStates(ballotItemsStatusCounts, showMoreButtonWasClicked);
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onBallotStoreChange () {
    const { showMoreButtonWasClicked } = this.state;
    const ballotItemsStatusCounts = BallotStore.getBallotItemsStatusCounts();
    // console.log('onBallotStoreChange ballotItemsStatusCounts:', ballotItemsStatusCounts);
    this.setState(ballotItemsStatusCounts);
    this.calculateScore(ballotItemsStatusCounts);
    this.calculateShowButtonStates(ballotItemsStatusCounts, showMoreButtonWasClicked);
  }

  onSupportStoreChange () {
    const { showMoreButtonWasClicked } = this.state;
    const ballotItemsStatusCounts = BallotStore.getBallotItemsStatusCounts();
    // console.log('onSupportStoreChange ballotItemsStatusCounts:', ballotItemsStatusCounts);
    this.setState(ballotItemsStatusCounts);
    this.calculateScore(ballotItemsStatusCounts);
    this.calculateShowButtonStates(ballotItemsStatusCounts, showMoreButtonWasClicked);
  }

  onVoterStoreChange () {
    const { showMoreButtonWasClicked } = this.state;
    this.setCompletedStatus();
    const ballotItemsStatusCounts = BallotStore.getBallotItemsStatusCounts();
    this.calculateScore(ballotItemsStatusCounts);
    this.calculateShowButtonStates(ballotItemsStatusCounts, showMoreButtonWasClicked);
  }

  goToFederalRaces = () => {
    BallotActions.completionLevelFilterTypeSave('All');
    BallotActions.raceLevelFilterTypeSave('Federal');
    historyPush('/ballot');
  }

  goToLocalRaces = () => {
    BallotActions.completionLevelFilterTypeSave('All');
    BallotActions.raceLevelFilterTypeSave('Local');
    historyPush('/ballot');
  }

  goToMeasureRaces = () => {
    BallotActions.completionLevelFilterTypeSave('All');
    BallotActions.raceLevelFilterTypeSave('Measure');
    historyPush('/ballot');
  }

  goToStateRaces = () => {
    BallotActions.completionLevelFilterTypeSave('All');
    BallotActions.raceLevelFilterTypeSave('State');
    historyPush('/ballot');
  }

  goToBallot = () => {
    BallotActions.completionLevelFilterTypeSave('All');
    BallotActions.raceLevelFilterTypeSave('All');
    historyPush('/ballot');
  }

  openHowItWorksModal = () => {
    // console.log('Opening modal');
    AppActions.setShowHowItWorksModal(true);
  }

  openPersonalizedScoreIntroModal = () => {
    // console.log('Opening modal');
    AppActions.setShowPersonalizedScoreIntroModal(true);
  }

  calculateScore = (ballotItemsStatusCounts) => {
    let percentCompleted = 0;
    const howItWorksCompleted = VoterStore.getInterfaceFlagState(VoterConstants.HOW_IT_WORKS_WATCHED);
    const personalizedScoreIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    const {
      federalNumberCompleted, federalTotalNumber,
      localNumberCompleted, localTotalNumber,
      measureNumberCompleted, measureTotalNumber,
      stateNumberCompleted, stateTotalNumber,
    } = ballotItemsStatusCounts;
    const totalNumber = federalTotalNumber + localTotalNumber + measureTotalNumber + stateTotalNumber;
    const numberCompleted = federalNumberCompleted + localNumberCompleted + measureNumberCompleted + stateNumberCompleted;
    const percentOfChoicesCompleted = (numberCompleted / totalNumber) * 100;
    if (percentOfChoicesCompleted === 1) {
      // If all choices made, ignore onboarding
      percentCompleted = 100;
    } else {
      const racePortionOfPercentOfChoicesCompleted = percentOfChoicesCompleted * 0.9;
      percentCompleted = Math.floor(racePortionOfPercentOfChoicesCompleted);
      percentCompleted += howItWorksCompleted ? 5 : 0;
      percentCompleted += personalizedScoreIntroCompleted ? 5 : 0;
    }
    if (percentCompleted) {
      this.setState({
        percentCompleted,
      });
    }
  }

  calculateShowButtonStates = (ballotItemsStatusCounts, showMoreButtonWasClicked = false) => {
    const {
      federalButtonNeeded, federalAllCompleted, federalNumberCompleted,
      localButtonNeeded, localAllCompleted, localNumberCompleted,
      measureButtonNeeded, measureAllCompleted,
      stateButtonNeeded, stateAllCompleted, stateNumberCompleted,
    } = ballotItemsStatusCounts;
    const howItWorksCompleted = VoterStore.getInterfaceFlagState(VoterConstants.HOW_IT_WORKS_WATCHED);
    const personalizedScoreIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    let allCandidatesShowButton = false;
    let allDecisionsMadeCount = 0;
    let allDecisionsNeededCount = 0;
    let atLeastOneCandidateDecisionNeeded = false;
    let candidateRaceTypesWithAtLeastOneDecision = 0;
    let candidateRaceTypesCompletelyDecided = 0;
    let candidateRaceTypesThatNeedDecisions = 0;
    let federalShowButton = false;
    let howItWorksButtonHidden = false;
    let howItWorksShowButton = !howItWorksCompleted;
    let localShowButton = false;
    let measureShowButton;
    let personalizedScoreIntroButtonHidden = false;
    let personalizedScoreIntroShowButton = !personalizedScoreIntroCompleted;
    let stateShowButton = false;
    let showMoreShowButton = false;
    let visibleButtonCount = 0;
    allDecisionsNeededCount += federalButtonNeeded ? 1 : 0;
    allDecisionsNeededCount += localButtonNeeded ? 1 : 0;
    allDecisionsNeededCount += measureButtonNeeded ? 1 : 0;
    allDecisionsNeededCount += stateButtonNeeded ? 1 : 0;
    // console.log('allNeededButtonsCount:', allNeededButtonsCount);
    // Figure out how many candidate races types there are in this election
    atLeastOneCandidateDecisionNeeded = federalButtonNeeded || localButtonNeeded || stateButtonNeeded;
    if (atLeastOneCandidateDecisionNeeded) {
      // How many candidate race types have choices?
      candidateRaceTypesThatNeedDecisions += federalButtonNeeded ? 1 : 0;
      candidateRaceTypesThatNeedDecisions += localButtonNeeded ? 1 : 0;
      candidateRaceTypesThatNeedDecisions += stateButtonNeeded ? 1 : 0;
      // How many candidate race types have 1 or more decisions made?
      candidateRaceTypesWithAtLeastOneDecision += federalNumberCompleted ? 1 : 0;
      candidateRaceTypesWithAtLeastOneDecision += localNumberCompleted ? 1 : 0;
      candidateRaceTypesWithAtLeastOneDecision += stateNumberCompleted ? 1 : 0;
      // How many candidate race types have been totally decided?
      candidateRaceTypesCompletelyDecided += federalAllCompleted ? 1 : 0;
      candidateRaceTypesCompletelyDecided += localAllCompleted ? 1 : 0;
      candidateRaceTypesCompletelyDecided += stateAllCompleted ? 1 : 0;
      // If not candidate decisions have been made
      if ((candidateRaceTypesWithAtLeastOneDecision === 0) ||
          (candidateRaceTypesThatNeedDecisions === candidateRaceTypesCompletelyDecided)) {
        // Show "allCandidates" instead of each of the candidate race types
        allCandidatesShowButton = true;
      }
    }
    // console.log('candidateRaceTypesThatNeedDecisions:', candidateRaceTypesThatNeedDecisions, ', candidateRaceTypesCompletelyDecided:', candidateRaceTypesCompletelyDecided);
    if (!allCandidatesShowButton) {
      federalShowButton = (federalButtonNeeded);
      localShowButton = (localButtonNeeded);
      stateShowButton = (stateButtonNeeded);
    }
    // If there are measures, measureShowButton is always true
    measureShowButton = (measureButtonNeeded);
    // console.log('measureButtonNeeded:', measureButtonNeeded, ', measureShowButton:', measureShowButton);
    // If all of the possible decisions have been made
    allDecisionsMadeCount += federalAllCompleted ? 1 : 0;
    allDecisionsMadeCount += localAllCompleted ? 1 : 0;
    allDecisionsMadeCount += measureAllCompleted ? 1 : 0;
    allDecisionsMadeCount += stateAllCompleted ? 1 : 0;
    if ((allDecisionsNeededCount > 0) && (allDecisionsMadeCount >= allDecisionsNeededCount)) {
      // No need to show the onboarding buttons
      howItWorksShowButton = false;
      personalizedScoreIntroShowButton = false;
      showMoreShowButton = false;
    } else if (allDecisionsMadeCount > 0) {
      // A decision has been made in at least one section, so hide the how it works status unless showMoreButtonWasClicked
      if (!showMoreButtonWasClicked) {
        howItWorksShowButton = !howItWorksCompleted;
        howItWorksButtonHidden = true;
        personalizedScoreIntroShowButton = !personalizedScoreIntroCompleted;
        personalizedScoreIntroButtonHidden = true;
      }
    }

    // ///////////////////
    // This section is to limit the number shown to 3, unless "show more" has been clicked
    if (showMoreButtonWasClicked) {
      // The "show more" button has been clicked. Show all buttons.
      visibleButtonCount = 0; // Count up the number of buttons that are shown, so we know whether or not to turn on the "show more" button
      // Show both onboarding buttons when "show more" clicked
      howItWorksShowButton = true;
      personalizedScoreIntroShowButton = true;
      visibleButtonCount += howItWorksButtonHidden ? 1 : 0;
      visibleButtonCount += howItWorksShowButton ? 1 : 0;
      visibleButtonCount += personalizedScoreIntroButtonHidden ? 1 : 0;
      visibleButtonCount += personalizedScoreIntroShowButton ? 1 : 0;
      visibleButtonCount += allCandidatesShowButton ? 1 : 0;
      visibleButtonCount += federalShowButton ? 1 : 0;
      visibleButtonCount += localShowButton ? 1 : 0;
      visibleButtonCount += measureShowButton ? 1 : 0;
      visibleButtonCount += stateShowButton ? 1 : 0;
      if (visibleButtonCount > 3) {
        showMoreShowButton = true;
      }
    } else {
      // The "show more" button has not been clicked. Roll-up what we can
      // Should we turn on "show more" link?
      let buttonCouldBeShownCount = 2; // The onboarding buttons could always be shown
      buttonCouldBeShownCount += federalButtonNeeded ? 1 : 0;
      buttonCouldBeShownCount += localButtonNeeded ? 1 : 0;
      buttonCouldBeShownCount += measureButtonNeeded ? 1 : 0;
      buttonCouldBeShownCount += stateButtonNeeded ? 1 : 0;
      if (buttonCouldBeShownCount > 3) {
        showMoreShowButton = true;
      }

      // Turn off all visible items past the first three
      visibleButtonCount = 0;
      visibleButtonCount += allCandidatesShowButton ? 1 : 0;
      if (visibleButtonCount > 3) {
        allCandidatesShowButton = false;
      }
      visibleButtonCount += federalShowButton ? 1 : 0;
      if (visibleButtonCount > 3) {
        federalShowButton = false;
      }
      visibleButtonCount += localShowButton ? 1 : 0;
      if (visibleButtonCount > 3) {
        localShowButton = false;
      }
      visibleButtonCount += measureShowButton ? 1 : 0;
      if (visibleButtonCount > 3) {
        measureShowButton = false;
      }
      visibleButtonCount += stateShowButton ? 1 : 0;
      if (visibleButtonCount > 3) {
        stateShowButton = false;
      }
      visibleButtonCount += howItWorksShowButton ? 1 : 0;
      if (visibleButtonCount > 3) {
        howItWorksShowButton = false;
      }
      visibleButtonCount += personalizedScoreIntroShowButton ? 1 : 0;
      if (visibleButtonCount > 3) {
        personalizedScoreIntroShowButton = false;
      }
    }
    // console.log('showMoreButtonWasClicked: ', showMoreButtonWasClicked);

    this.setState({
      allCandidatesShowButton,
      federalButtonNeeded,
      federalShowButton,
      howItWorksShowButton,
      localButtonNeeded,
      localShowButton,
      measureButtonNeeded,
      measureShowButton,
      personalizedScoreIntroShowButton,
      showMoreShowButton,
      stateButtonNeeded,
      stateShowButton,
    });
  }

  setCompletedStatus = () => {
    const howItWorksCompleted = VoterStore.getInterfaceFlagState(VoterConstants.HOW_IT_WORKS_WATCHED);
    const personalizedScoreIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    this.setState({
      howItWorksCompleted,
      personalizedScoreIntroCompleted,
    });
  }

  showMoreButtonsLink = () => {
    const { showMoreButtonWasClicked } = this.state;
    this.setState({
      showMoreButtonWasClicked: !showMoreButtonWasClicked,
    });
    const ballotItemsStatusCounts = BallotStore.getBallotItemsStatusCounts();
    this.calculateShowButtonStates(ballotItemsStatusCounts, !showMoreButtonWasClicked);
  }

  render () {
    const { classes } = this.props;
    const {
      allCandidatesButtonNeeded, allCandidatesAllCompleted, allCandidatesNumberCompleted, allCandidatesShowButton, allCandidatesTotalNumber,
      federalButtonNeeded, federalAllCompleted, federalNumberCompleted, federalShowButton, federalTotalNumber,
      howItWorksCompleted, howItWorksShowButton,
      localButtonNeeded, localAllCompleted, localNumberCompleted, localShowButton, localTotalNumber,
      measureButtonNeeded, measureAllCompleted, measureNumberCompleted, measureShowButton, measureTotalNumber,
      percentCompleted,
      personalizedScoreIntroCompleted, personalizedScoreIntroShowButton,
      showMoreShowButton, showMoreButtonWasClicked,
      stateButtonNeeded, stateAllCompleted, stateNumberCompleted, stateShowButton, stateTotalNumber,
    } = this.state;

    let ballotImage;
    let altValue;
    let yourBallotTitle;
    let yourBallotSubtitle;
    if (percentCompleted === 0) {
      altValue = 'Start deciding';
      ballotImage = ballot0Percent;
      yourBallotTitle = 'Voting?';
      yourBallotSubtitle = 'Start deciding how you\'ll vote.';
    } else if (percentCompleted < 100) {
      altValue = 'Ballot decisions underway';
      ballotImage = ballot50Percent;
      yourBallotTitle = 'Your Ballot Progress';
      if (percentCompleted < 10) {
        yourBallotSubtitle = 'The first step of any journey is the hardest.';
      } else if (percentCompleted < 50) {
        yourBallotSubtitle = 'Keep deciding how you\'ll vote!';
      } else if (percentCompleted === 50) {
        yourBallotSubtitle = 'You\'re half way there!';
      } else if (percentCompleted < 80) {
        yourBallotSubtitle = 'Excellent work.';
      } else {
        yourBallotSubtitle = 'You are almost there, keep up the good work!';
      }
    } else {
      altValue = 'Ballot Completed';
      ballotImage = ballot100Percent;
      yourBallotTitle = 'Your Ballot is Complete!';
      yourBallotSubtitle = 'Review your decisions.';
    }
    const completedIcon = (
      <img
        src={cordovaDot(ballotImage)}
        width="50"
        height="50"
        alt={altValue}
      />
    );
    return (
      <ReadyCard showprogresscolor={percentCompleted > 0} className="card">
        <Icon className="u-cursor--pointer" onClick={this.goToBallot}>
          {completedIcon}
        </Icon>
        <div>
          <TitleRowWrapper>
            <Title
              className="u-cursor--pointer"
              onClick={this.goToBallot}
            >
              {yourBallotTitle}
            </Title>
            <PercentComplete showprogresscolor={percentCompleted > 0}>
              {percentCompleted}
              %
              {!!(percentCompleted) && (
                <>
                  {' '}
                  Complete
                </>
              )}
            </PercentComplete>
          </TitleRowWrapper>
          <SubTitle className="u-cursor--pointer" onClick={this.goToBallot}>
            {yourBallotSubtitle}
          </SubTitle>
          {/* ************ */}
          {/* How It Works */}
          {/* ************ */}
          {howItWorksShowButton && (
            <StyledButton
              id="howItWorksButton"
              className="u-cursor--pointer"
              color="primary"
              completed={howItWorksCompleted ? 'true' : undefined}
              onClick={this.openHowItWorksModal}
              variant="outlined"
            >
              <ButtonLeft>
                {howItWorksCompleted ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
                <ButtonText>
                  {howItWorksCompleted ? (
                    <>
                      <span className="u-show-mobile">
                        How We Vote Works
                      </span>
                      <span className="u-show-desktop-tablet">
                        How We Vote Works Completed
                      </span>
                    </>
                  ) : (
                    <span>
                      <span className="u-show-mobile-iphone5-or-smaller">
                        How We Vote Works
                      </span>
                      <span className="u-show-mobile-bigger-than-iphone5">
                        How We Vote Works
                        <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                      </span>
                      <span className="u-show-desktop-tablet">
                        How We Vote Works
                        <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                      </span>
                    </span>
                  )}
                </ButtonText>
              </ButtonLeft>
              {!howItWorksCompleted && (
                <NumberComplete>
                  (0/1)
                </NumberComplete>
              )}
            </StyledButton>
          )}
          {/* ************************ */}
          {/* Personalized Score Intro */}
          {/* ************************ */}
          {personalizedScoreIntroShowButton && (
            <StyledButton
              id="whatsAPersonalizedScoreButton"
              className="u-cursor--pointer"
              color="primary"
              completed={personalizedScoreIntroCompleted ? 'true' : undefined}
              onClick={this.openPersonalizedScoreIntroModal}
              variant="outlined"
            >
              <ButtonLeft>
                {personalizedScoreIntroCompleted ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
                <ButtonText>
                  {personalizedScoreIntroCompleted ? (
                    <>
                      <span className="u-show-mobile">
                        Personalized Score
                      </span>
                      <span className="u-show-desktop-tablet">
                        Personalized Score Completed
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="u-show-mobile-iphone5-or-smaller">
                        My Score?
                      </span>
                      <span className="u-show-mobile-bigger-than-iphone5">
                        Personalized Score?
                      </span>
                      <span className="u-show-desktop-tablet">
                        What&apos;s a Personalized Score?
                      </span>
                      <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              {!personalizedScoreIntroCompleted && (
                <NumberComplete>
                  (0/1)
                </NumberComplete>
              )}
            </StyledButton>
          )}
          {/* ************* */}
          {/* Decide on All Candidates */}
          {/* ************* */}
          {(allCandidatesShowButton && allCandidatesButtonNeeded) && (
            <StyledButton
              id="decideOnCandidatesButton"
              className="u-cursor--pointer"
              color="primary"
              completed={allCandidatesAllCompleted ? 'true' : undefined}
              onClick={this.goToBallot}
              variant="outlined"
            >
              <ButtonLeft>
                {allCandidatesAllCompleted ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
                <ButtonText>
                  {allCandidatesAllCompleted ? (
                    <>
                      <span className="u-show-mobile">
                        All Candidates Chosen
                      </span>
                      <span className="u-show-desktop-tablet">
                        Your Decisions on Candidates
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="u-show-mobile">
                        All Candidates
                      </span>
                      <span className="u-show-desktop-tablet">
                        Decide on Candidates
                      </span>
                      <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              {!allCandidatesAllCompleted && (
                <NumberComplete>
                  (
                  {allCandidatesNumberCompleted}
                  /
                  {allCandidatesTotalNumber}
                  )
                </NumberComplete>
              )}
            </StyledButton>
          )}
          {/* ************* */}
          {/* Federal Races */}
          {/* ************* */}
          {(federalShowButton && federalButtonNeeded) && (
            <StyledButton
              className="u-cursor--pointer"
              color="primary"
              completed={federalAllCompleted ? 'true' : undefined}
              onClick={this.goToFederalRaces}
              variant="outlined"
            >
              <ButtonLeft>
                {federalAllCompleted ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
                <ButtonText>
                  {federalAllCompleted ? (
                    <>
                      <span className="u-show-mobile">
                        Federal Races
                      </span>
                      <span className="u-show-desktop-tablet">
                        Your Decisions on Federal Races
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="u-show-mobile">
                        Federal Races
                      </span>
                      <span className="u-show-desktop-tablet">
                        Decide on Federal Races
                      </span>
                      <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              {!federalAllCompleted && (
                <NumberComplete>
                  (
                  {federalNumberCompleted}
                  /
                  {federalTotalNumber}
                  )
                </NumberComplete>
              )}
            </StyledButton>
          )}
          {/* ************* */}
          {/* State Races */}
          {/* ************* */}
          {(stateShowButton && stateButtonNeeded) && (
            <StyledButton
              className="u-cursor--pointer"
              color="primary"
              completed={stateAllCompleted ? 'true' : undefined}
              onClick={this.goToStateRaces}
              variant="outlined"
            >
              <ButtonLeft>
                {stateAllCompleted ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
                <ButtonText>
                  {stateAllCompleted ? (
                    <>
                      <span className="u-show-mobile">
                        State Races
                      </span>
                      <span className="u-show-desktop-tablet">
                        Your Decisions on State Races
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="u-show-mobile">
                        State Races
                      </span>
                      <span className="u-show-desktop-tablet">
                        Decide on State Races
                      </span>
                      <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              {!stateAllCompleted && (
                <NumberComplete>
                  (
                  {stateNumberCompleted}
                  /
                  {stateTotalNumber}
                  )
                </NumberComplete>
              )}
            </StyledButton>
          )}
          {/* ************* */}
          {/* Measures */}
          {/* ************* */}
          {(measureShowButton && measureButtonNeeded) && (
            <StyledButton
              className="u-cursor--pointer"
              color="primary"
              completed={measureAllCompleted ? 'true' : undefined}
              onClick={this.goToMeasureRaces}
              variant="outlined"
            >
              <ButtonLeft>
                {measureAllCompleted ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
                <ButtonText>
                  {measureAllCompleted ? (
                    <>
                      <span className="u-show-mobile">
                        All Measures
                      </span>
                      <span className="u-show-desktop-tablet">
                        Your Decisions on Measures
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="u-show-mobile">
                        All Measures
                      </span>
                      <span className="u-show-desktop-tablet">
                        Decide on Measures
                      </span>
                      <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              {!measureAllCompleted && (
                <NumberComplete>
                  (
                  {measureNumberCompleted}
                  /
                  {measureTotalNumber}
                  )
                </NumberComplete>
              )}
            </StyledButton>
          )}
          {/* *********** */}
          {/* Local Races */}
          {/* *********** */}
          {(localShowButton && localButtonNeeded) && (
            <StyledButton
              className="u-cursor--pointer"
              color="primary"
              completed={localAllCompleted ? 'true' : undefined}
              onClick={this.goToLocalRaces}
              variant="outlined"
            >
              <ButtonLeft>
                {localAllCompleted ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
                <ButtonText>
                  {localAllCompleted ? (
                    <>
                      <span className="u-show-mobile">
                        Local Races
                      </span>
                      <span className="u-show-desktop-tablet">
                        Your Decisions on Local Races
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="u-show-mobile">
                        Local Races
                      </span>
                      <span className="u-show-desktop-tablet">
                        Decide on Local Races
                      </span>
                      <ArrowForwardIcon classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              {!localAllCompleted && (
                <NumberComplete>
                  (
                  {localNumberCompleted}
                  /
                  {localTotalNumber}
                  )
                </NumberComplete>
              )}
            </StyledButton>
          )}
          {showMoreShowButton && (
            <ShowMoreButtons
              showMoreId="showMoreBallotButtons"
              showMoreButtonWasClicked={showMoreButtonWasClicked}
              showMoreButtonsLink={this.showMoreButtonsLink}
            />
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

const NumberComplete = styled.div`
  font-size: 12px;
`;

export default withTheme(withStyles(styles)(ReadyTaskBallot));
