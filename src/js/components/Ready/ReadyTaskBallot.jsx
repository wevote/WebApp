import { ArrowForward, CheckCircle } from '@mui/icons-material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React from 'react';
import BallotActions from '../../actions/BallotActions';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import VoterConstants from '../../constants/VoterConstants';
import AppObservableStore from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import SupportStore from '../../stores/SupportStore';
import VoterStore from '../../stores/VoterStore';
import {
  BallotToDoTitle, ButtonLeft, ButtonText, Icon,
  PercentComplete, ReadyCard, StyledButton, StyledCheckbox,
  StyledCheckboxCompleted, TitleRowWrapper,
} from './ReadyTaskStyles';
import ShowMoreButtons from '../Widgets/ShowMoreButtons';

const ballot0Percent = '../../../img/global/svg-icons/ready/ballot-0-percent.svg';
const ballot50Percent = '../../../img/global/svg-icons/ready/ballot-50-percent.svg';
const ballot100Percent = '../../../img/global/svg-icons/ready/ballot-100-percent.svg';

class ReadyTaskBallot extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      allCandidatesButtonNeeded: false, // Are there candidates on this ballot?
      allCandidatesAllCompleted: false,
      allCandidatesNumberCompleted: 0,
      allCandidatesShowButton: false, // Given all the buttons we need to show, should this one be "unfurled"?
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
    // console.log('ReadyTaskBallot, onVoterStoreChange voter: ', VoterStore.getVoter());
    const { showMoreButtonWasClicked } = this.state;
    this.setCompletedStatus();
    const ballotItemsStatusCounts = BallotStore.getBallotItemsStatusCounts();
    this.calculateScore(ballotItemsStatusCounts);
    this.calculateShowButtonStates(ballotItemsStatusCounts, showMoreButtonWasClicked);
  }

  goToCandidateTypeAfterCalculation = () => {
    const { federalTotalNumber, localTotalNumber, stateTotalNumber } = this.state;
    if (federalTotalNumber) {
      this.goToFederalRaces();
    } else if (stateTotalNumber) {
      this.goToStateRaces();
    } else if (localTotalNumber) {
      this.goToLocalRaces();
    } else {
      this.goToBallot();
    }
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
    AppObservableStore.setShowHowItWorksModal(true);
  }

  openPersonalizedScoreIntroModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowPersonalizedScoreIntroModal(true);
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
    if (percentCompleted || percentCompleted === 0) {
      this.setState({
        percentCompleted,
      });
    }
  }

  calculateShowButtonStates = (ballotItemsStatusCounts, showMoreButtonWasClicked = false) => {
    const {
      federalButtonNeeded, federalAllCompleted, federalNumberCompleted, federalTotalNumber,
      localButtonNeeded, localAllCompleted, localNumberCompleted, localTotalNumber,
      measureButtonNeeded, measureAllCompleted,
      stateButtonNeeded, stateAllCompleted, stateNumberCompleted, stateTotalNumber,
    } = ballotItemsStatusCounts;
    const howItWorksCompleted = VoterStore.getInterfaceFlagState(VoterConstants.HOW_IT_WORKS_WATCHED);
    const personalizedScoreIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    let allCandidatesButtonNeeded = false;
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
      // If no candidate decisions have been made
      if ((candidateRaceTypesWithAtLeastOneDecision === 0) ||
          (candidateRaceTypesThatNeedDecisions === candidateRaceTypesCompletelyDecided)) {
        // Show "allCandidates" instead of each of the candidate race types
        allCandidatesButtonNeeded = true;
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
    // If all the possible decisions have been made
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
      allCandidatesButtonNeeded,
      allCandidatesShowButton,
      federalButtonNeeded,
      federalShowButton,
      federalTotalNumber,
      howItWorksShowButton,
      localButtonNeeded,
      localShowButton,
      localTotalNumber,
      measureButtonNeeded,
      measureShowButton,
      personalizedScoreIntroShowButton,
      showMoreShowButton,
      stateButtonNeeded,
      stateShowButton,
      stateTotalNumber,
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
    renderLog('ReadyTaskBallot');  // Set LOG_RENDER_EVENTS to log all renders
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
    // let yourBallotSubtitle;
    if (percentCompleted === 0) {
      altValue = 'Start deciding';
      ballotImage = ballot0Percent;
      yourBallotTitle = 'Decide How To Vote';
      // yourBallotSubtitle = 'Start deciding how you\'ll vote.';
    } else if (percentCompleted < 100) {
      altValue = 'Ballot decisions underway';
      ballotImage = ballot50Percent;
      yourBallotTitle = 'Decide How To Vote';
      // if (percentCompleted < 10) {
      //   yourBallotSubtitle = 'Start filling out your ballot now!';
      // } else if (percentCompleted < 50) {
      //   yourBallotSubtitle = 'Keep filling out your ballot now!';
      // } else if (percentCompleted === 50) {
      //   yourBallotSubtitle = 'You\'re half way there! Filling out your ballot completely will feel soooo good.';
      // } else if (percentCompleted < 80) {
      //   yourBallotSubtitle = 'After you finish filling out your ballot, you can buy yourself a donut.';
      // } else {
      //   yourBallotSubtitle = 'You are almost there! Finish filling out your ballot.';
      // }
    } else {
      altValue = 'Ballot Completed';
      ballotImage = ballot100Percent;
      yourBallotTitle = 'Your Ballot is Complete!';
      // yourBallotSubtitle = 'Review your decisions.';
    }
    const completedIcon = (
      <img
        src={normalizedImagePath(ballotImage)}
        width="50"
        height="50"
        alt={altValue}
      />
    );
    return (
      <ReadyCard showProgressColor={percentCompleted > 0} className="card">
        <Icon className="u-cursor--pointer" onClick={this.goToBallot}>
          {completedIcon}
        </Icon>
        <div>
          <TitleRowWrapper>
            <BallotToDoTitle
              className="u-cursor--pointer"
              onClick={this.goToBallot}
            >
              {yourBallotTitle}
            </BallotToDoTitle>
            <PercentComplete
              className="u-cursor--pointer"
              onClick={() => this.showMoreButtonsLink()}
              showProgressColor={percentCompleted > 0}
            >
              {percentCompleted}
              %
              {!!(percentCompleted) && (
                <>
                  <span className="u-show-desktop-tablet">
                    {' '}
                    Complete
                  </span>
                </>
              )}
            </PercentComplete>
          </TitleRowWrapper>
          {/* <SubTitle className="u-cursor--pointer" onClick={this.goToBallot}> */}
          {/*  {yourBallotSubtitle} */}
          {/* </SubTitle> */}
          {/* ************* */}
          {/* Decide on All Candidates */}
          {/* ************* */}
          {(allCandidatesShowButton && allCandidatesButtonNeeded) && (
            <StyledButton
              id="decideOnCandidatesButton"
              classes={{ root: classes.toDoButton }}
              className="u-cursor--pointer"
              color="primary"
              completed={allCandidatesAllCompleted ? 'true' : undefined}
              onClick={this.goToBallot} // onClick={this.goToCandidateTypeAfterCalculation}
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
                      <ButtonTextMobileFontSmallest className="u-show-mobile-iphone5-or-smaller">
                        All Candidates
                      </ButtonTextMobileFontSmallest>
                      <ButtonTextMobileFont className="u-show-mobile-bigger-than-iphone5">
                        All Candidates
                      </ButtonTextMobileFont>
                      <span className="u-show-desktop-tablet">
                        Decide on Candidates
                      </span>
                      <ArrowForward classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              <NumberComplete>
                (
                {allCandidatesNumberCompleted}
                /
                {allCandidatesTotalNumber}
                )
              </NumberComplete>
            </StyledButton>
          )}
          {/* ************* */}
          {/* Federal Races */}
          {/* ************* */}
          {(federalShowButton && federalButtonNeeded) && (
            <StyledButton
              classes={{ root: classes.toDoButton }}
              className="u-cursor--pointer"
              color="primary"
              completed={federalAllCompleted ? 'true' : undefined}
              id="federalRacesButton"
              onClick={this.goToFederalRaces}
              variant="outlined"
            >
              <ButtonLeft>
                {federalAllCompleted ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
                <ButtonText>
                  {federalAllCompleted ? (
                    <>
                      <ButtonTextMobileFontSmallest className="u-show-mobile-iphone5-or-smaller">
                        Federal Races
                      </ButtonTextMobileFontSmallest>
                      <ButtonTextMobileFont className="u-show-mobile-bigger-than-iphone5">
                        Federal Races
                      </ButtonTextMobileFont>
                      <span className="u-show-desktop-tablet">
                        Your Decisions on Federal Races
                      </span>
                    </>
                  ) : (
                    <>
                      <ButtonTextMobileFontSmallest className="u-show-mobile-iphone5-or-smaller">
                        Federal Races
                      </ButtonTextMobileFontSmallest>
                      <ButtonTextMobileFont className="u-show-mobile-bigger-than-iphone5">
                        Federal Races
                      </ButtonTextMobileFont>
                      <span className="u-show-desktop-tablet">
                        Decide on Federal Races
                      </span>
                      <ArrowForward classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              <NumberComplete>
                (
                {federalNumberCompleted}
                /
                {federalTotalNumber}
                )
              </NumberComplete>
            </StyledButton>
          )}
          {/* ************* */}
          {/* State Races */}
          {/* ************* */}
          {(stateShowButton && stateButtonNeeded) && (
            <StyledButton
              classes={{ root: classes.toDoButton }}
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
                      <ButtonTextMobileFontSmallest className="u-show-mobile-iphone5-or-smaller">
                        State Races
                      </ButtonTextMobileFontSmallest>
                      <ButtonTextMobileFont className="u-show-mobile-bigger-than-iphone5">
                        State Races
                      </ButtonTextMobileFont>
                      <span className="u-show-desktop-tablet">
                        Your Decisions on State Races
                      </span>
                    </>
                  ) : (
                    <>
                      <ButtonTextMobileFontSmallest className="u-show-mobile-iphone5-or-smaller">
                        State Races
                      </ButtonTextMobileFontSmallest>
                      <ButtonTextMobileFont className="u-show-mobile-bigger-than-iphone5">
                        State Races
                      </ButtonTextMobileFont>
                      <span className="u-show-desktop-tablet">
                        Decide on State Races
                      </span>
                      <ArrowForward classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              <NumberComplete>
                (
                {stateNumberCompleted}
                /
                {stateTotalNumber}
                )
              </NumberComplete>
            </StyledButton>
          )}
          {/* ************* */}
          {/* Measures */}
          {/* ************* */}
          {(measureShowButton && measureButtonNeeded) && (
            <StyledButton
              id="decideOnMeasuresButton"
              classes={{ root: classes.toDoButton }}
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
                      <ButtonTextMobileFontSmallest className="u-show-mobile-iphone5-or-smaller">
                        All Measures
                      </ButtonTextMobileFontSmallest>
                      <ButtonTextMobileFont className="u-show-mobile-bigger-than-iphone5">
                        All Measures
                      </ButtonTextMobileFont>
                      <span className="u-show-desktop-tablet">
                        Your Decisions on Measures
                      </span>
                    </>
                  ) : (
                    <>
                      <ButtonTextMobileFontSmallest className="u-show-mobile-iphone5-or-smaller">
                        All Measures
                      </ButtonTextMobileFontSmallest>
                      <ButtonTextMobileFont className="u-show-mobile-bigger-than-iphone5">
                        All Measures
                      </ButtonTextMobileFont>
                      <span className="u-show-desktop-tablet">
                        Decide on Measures
                      </span>
                      <ArrowForward classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              <NumberComplete>
                (
                {measureNumberCompleted}
                /
                {measureTotalNumber}
                )
              </NumberComplete>
            </StyledButton>
          )}
          {/* *********** */}
          {/* Local Races */}
          {/* *********** */}
          {(localShowButton && localButtonNeeded) && (
            <StyledButton
              classes={{ root: classes.toDoButton }}
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
                      <ButtonTextMobileFontSmallest className="u-show-mobile-iphone5-or-smaller">
                        Local Races
                      </ButtonTextMobileFontSmallest>
                      <ButtonTextMobileFont className="u-show-mobile-bigger-than-iphone5">
                        Local Races
                      </ButtonTextMobileFont>
                      <span className="u-show-desktop-tablet">
                        Your Decisions on Local Races
                      </span>
                    </>
                  ) : (
                    <>
                      <ButtonTextMobileFontSmallest className="u-show-mobile-iphone5-or-smaller">
                        Local Races
                      </ButtonTextMobileFontSmallest>
                      <ButtonTextMobileFont className="u-show-mobile-bigger-than-iphone5">
                        Local Races
                      </ButtonTextMobileFont>
                      <span className="u-show-desktop-tablet">
                        Decide on Local Races
                      </span>
                      <ArrowForward classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              <NumberComplete>
                (
                {localNumberCompleted}
                /
                {localTotalNumber}
                )
              </NumberComplete>
            </StyledButton>
          )}
          {/* ************ */}
          {/* How It Works */}
          {/* ************ */}
          {howItWorksShowButton && (
            <StyledButton
              id="howItWorksButton"
              classes={{ root: classes.toDoButton }}
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
                      <ButtonTextMobileFontSmallest className="u-show-mobile-iphone5-or-smaller">
                        How It Works
                      </ButtonTextMobileFontSmallest>
                      <ButtonTextMobileFont className="u-show-mobile-bigger-than-iphone5">
                        How It Works
                      </ButtonTextMobileFont>
                      <span className="u-show-desktop-tablet">
                        How WeVote Works Completed
                      </span>
                    </>
                  ) : (
                    <span>
                      <ButtonTextMobileFontSmallest className="u-show-mobile-iphone5-or-smaller">
                        How It Works
                      </ButtonTextMobileFontSmallest>
                      <ButtonTextMobileFont className="u-show-mobile-bigger-than-iphone5">
                        How It Works
                      </ButtonTextMobileFont>
                      <span className="u-show-desktop-tablet">
                        How WeVote Works
                      </span>
                      <ArrowForward classes={{ root: classes.arrowRoot }} />
                    </span>
                  )}
                </ButtonText>
              </ButtonLeft>
              {howItWorksCompleted ? (
                <NumberComplete>
                  (1/1)
                </NumberComplete>
              ) : (
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
              classes={{ root: classes.toDoButton }}
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
                      <ButtonTextMobileFontSmallest className="u-show-mobile-iphone5-or-smaller">
                        My Score?
                      </ButtonTextMobileFontSmallest>
                      <span className="u-show-mobile-bigger-than-iphone5">
                        Personalized Score?
                      </span>
                      <span className="u-show-desktop-tablet">
                        What&apos;s a Personalized Score?
                      </span>
                      <ArrowForward classes={{ root: classes.arrowRoot }} />
                    </>
                  )}
                </ButtonText>
              </ButtonLeft>
              {personalizedScoreIntroCompleted ? (
                <NumberComplete>
                  (1/1)
                </NumberComplete>
              ) : (
                <NumberComplete>
                  (0/1)
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
ReadyTaskBallot.propTypes = {
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
  backgroundClip: 'border-box',
  backgroundColor: 'rgb(255, 255, 255)',
  borderBottomColor: 'rgb(51, 51, 51)',
  borderBottomLeftRadius: 4,
  borderBottomRightRadius: 4,
  borderBottomStyle: 'none',
  borderBottomWidth: 0,
  borderImageOutset: 0,
  borderImageRepeat: 'stretch',
  borderImageSlice: '100%',
  borderImageSource: 'none',
  borderImageWidth: 1,
  borderLeftColor: 'rgb(51, 51, 51)',
  borderLeftStyle: 'none',
  borderLeftWidth: 0,
  borderRightColor: 'rgb(51, 51, 51)',
  borderRightStyle: 'none',
  borderRightWidth: 0,
  borderTopColor: 'rgb(51, 51, 51)',
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  borderTopStyle: 'none',
  borderTopWidth: 0,
  boxShadow: standardBoxShadow(),
  boxSizing: 'content-box',
  color: 'rgb(51, 51, 51)',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: '"Poppins", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: 16,
  height: 173,
  lineHeight: 22,
  marginBottom: 16,
  minWidth: 0,
  overflowWrap: 'normal',
  paddingBottom: 16,
  paddingLeft: 82,
  paddingRight: 16,
  paddingTop: 16,
  position: 'relative',
  textSizeAdjust: '100%',
  toDoButton: {
    display: 'flex',
    justifyContent: 'start',
  },
  width: 562,
});

const ButtonTextMobileFont = styled('span')`
  font-size: 16px;
`;

const ButtonTextMobileFontSmallest = styled('span')`
  font-size: 12px;
`;

const NumberComplete = styled('div')`
  font-size: 12px;
`;

export default withTheme(withStyles(styles)(ReadyTaskBallot));
