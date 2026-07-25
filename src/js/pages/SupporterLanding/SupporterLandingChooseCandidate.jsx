import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import CandidateInfoCard from '../../components/SupporterLanding/CandidateInfoCard';
import CollapsedStepHeadline from '../../components/SupporterLanding/CollapsedStepHeadline';
import DecideLaterFooter from '../../components/SupporterLanding/DecideLaterFooter';
import PersonalMessageCollapse from '../../components/SupporterLanding/PersonalMessageCollapse';
import StepFourCard from '../../components/SupporterLanding/StepFourCard';
import StepFourComplete from '../../components/SupporterLanding/StepFourComplete';
import StepOneCard from '../../components/SupporterLanding/StepOneCard';
import StepProgressBar from '../../components/SupporterLanding/StepProgressBar';
import StepThreeCard from '../../components/SupporterLanding/StepThreeCard';
import StepTwoCard from '../../components/SupporterLanding/StepTwoCard';
import SupporterLandingMobileHeader from '../../components/SupporterLanding/SupporterLandingMobileHeader';
import SupporterLandingSidebar from '../../components/SupporterLanding/SupporterLandingSidebar';
import SupporterLandingTopBar from '../../components/SupporterLanding/SupporterLandingTopBar';
import WelcomeMessage from '../../components/SupporterLanding/WelcomeMessage';
import {
  DEMO_CANDIDATE, DEMO_COMMENTS, DEMO_COUNTS, DEMO_VOTER, DEMO_VOTER_HAS_NAME,
  SHARE_OPTION_GROUPS, STEP_FOUR, STEP_THREE, STEP_TWO, SUPPORTER_LANDING_STEPS, WHAT_ELSE_ITEMS,
} from '../../components/SupporterLanding/supporterLandingConstants';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';

// SupporterLanding — Step 1: "Choose Jane Dough".
// DEMO ONLY: all data is placeholder (see supporterLandingConstants) and no store /
// API calls are made. Clicking "Choose" flips the page into its "chosen & following"
// state so both designs can be previewed. Renders under the normal app header/footer.
// Route: /supporterlanding
export default function SupporterLandingChooseCandidate () {
  renderLog('SupporterLandingChooseCandidate');
  const [chosen, setChosen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [supportPublic, setSupportPublic] = useState(false);
  const [wordSpread, setWordSpread] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const chosenCount = DEMO_COUNTS.chosenCount + (chosen ? 1 : 0);

  const handleChoose = () => setChosen((prev) => !prev);
  const handleFollow = () => setFollowing((prev) => !prev);
  const goToNextStep = () => setActiveStep((prev) => Math.min(prev + 1, SUPPORTER_LANDING_STEPS.length));
  const goToPreviousStep = () => setActiveStep((prev) => Math.max(prev - 1, 1));

  // After "Make support public", the "made public" state shows briefly, then auto-advances
  // to Step 4 (the mockup pairs this with a 2s confetti moment). The timer is cancelled on
  // unmount so it can't fire after the voter has navigated away.
  const advanceTimerRef = useRef(null);
  const handleMadePublic = () => {
    setSupportPublic(true);
    advanceTimerRef.current = setTimeout(goToNextStep, 2000);
  };
  useEffect(() => () => clearTimeout(advanceTimerRef.current), []);

  // Whether the active step counts as complete (drives its green check + label).
  // TODO: Make each step have its own route (do not use URL params)
  // Use <Route exact path="/supporterlanding/:stepID" convention
  let activeStepComplete = false;
  if (activeStep === 1) activeStepComplete = chosen || following;
  else if (activeStep === 3) activeStepComplete = supportPublic;
  else if (activeStep === 4) activeStepComplete = wordSpread;

  return (
    <PageContentContainer>
      <Helmet title="Support Jane Dough - WeVote" />
      <OuterWrapper>
        <SupporterLandingTopBar />
        <BodyLayout>
          <SupporterLandingSidebar />
          <MainColumn>
            {/* Sidebar + landing top bar are hidden on mobile, so the mobile header carries
                the logo, nav, tagline and profile nudge instead */}
            <SupporterLandingMobileHeader />

            {activeStep === 1 ? (
              <>
                <WelcomeMessage
                  voterFirstName={DEMO_VOTER.firstName}
                  candidateName={DEMO_CANDIDATE.name}
                />
                {/* On mobile the candidate card sits above the personal message (mockup order),
                    so this pair reverses below 576px */}
                <PersonalAndCandidate>
                  <PersonalMessageCollapse
                    candidateName={DEMO_CANDIDATE.name}
                    message={DEMO_CANDIDATE.personalMessage}
                    previewText={DEMO_CANDIDATE.personalMessagePreview}
                  />
                  <CandidateInfoCard candidate={DEMO_CANDIDATE} />
                </PersonalAndCandidate>
              </>
            ) : (
              <CollapsedStepHeadline
                headline={`Help ${DEMO_CANDIDATE.name} get elected in 4 easy steps!`}
                onClick={goToPreviousStep}
              />
            )}

            <StepProgressBar
              steps={SUPPORTER_LANDING_STEPS}
              activeStep={activeStep}
              chosen={activeStepComplete}
              onPrevious={goToPreviousStep}
              onNext={goToNextStep}
            />

            {activeStep === 1 && (
              <StepOneCard
                candidate={DEMO_CANDIDATE}
                chosen={chosen}
                following={following}
                chosenCount={chosenCount}
                followingCount={DEMO_COUNTS.followingCount}
                onChoose={handleChoose}
                onFollow={handleFollow}
              />
            )}
            {activeStep === 2 && <StepTwoCard stepTwo={STEP_TWO} comments={DEMO_COMMENTS} />}
            {activeStep === 3 && (
              <StepThreeCard
                stepThree={STEP_THREE}
                voterHasName={DEMO_VOTER_HAS_NAME}
                isPublic={supportPublic}
                onMadePublic={handleMadePublic}
              />
            )}
            {activeStep === 4 && (
              <StepFourCard
                stepFour={STEP_FOUR}
                groups={SHARE_OPTION_GROUPS}
                completed={wordSpread}
                onComplete={() => setWordSpread(true)}
              />
            )}
            {activeStep === 4 && wordSpread && (
              <StepFourComplete
                heading={STEP_FOUR.completeHeading}
                whatElseHeading={STEP_FOUR.whatElseHeading}
                items={WHAT_ELSE_ITEMS}
              />
            )}

            {activeStep <= 3 && (
              <DecideLaterFooter
                prompt={SUPPORTER_LANDING_STEPS[activeStep - 1].footerPrompt}
                linkText={SUPPORTER_LANDING_STEPS[activeStep - 1].footerLinkText}
                onGoToNextStep={goToNextStep}
              />
            )}
          </MainColumn>
        </BodyLayout>
      </OuterWrapper>
    </PageContentContainer>
  );
}

const BodyLayout = styled.div`
  display: flex;
  gap: 32px;

  @media (max-width: 575px) {
    gap: 0;
  }
`;

const MainColumn = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
  padding-top: 8px;

  @media (max-width: 575px) {
    gap: 16px;
  }
`;

const OuterWrapper = styled.div`
  margin: 0 auto;
  padding: 0 20px 48px;
  width: 100%;
`;

const PersonalAndCandidate = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;

  @media (max-width: 575px) {
    flex-direction: column-reverse;
  }
`;
