import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DesignTokenColors from '../Style/DesignTokenColors';

const ExplanationContent = ({
  unfurlInviteFriends,
  unfurlEarnPoints,
  unfurlMission,
  unfurlContestTerms,
}) => (
  <PointsWrapper>
    <TitleSection>
      <Paragraph>
        At the end of a challenge, the participant who has the most points is ranked as #1 and wins the challenge.
      </Paragraph>
    </TitleSection>
    <AccordionSection
      title="Invite friends to strengthen our democracy"
      isOpen={unfurlInviteFriends}
    >
      <Typography>
        Invite your friends to join you in this challenge and earn points together!
      </Typography>
    </AccordionSection>
    <AccordionSection
      title="How to earn points to improve your ranking"
      isOpen={unfurlEarnPoints}
    >
      <StyledTable>
        <thead>
          <tr>
            <Th>ACTION</Th>
            <Th>POINTS EARNED</Th>
          </tr>
        </thead>
        <tbody>
          <Tr>
            <Td>Adding a photo to your profile</Td>
            <Td>2</Td>
          </Tr>
          <Tr>
            <Td>Sending a challenge invitation to a friend</Td>
            <Td>5</Td>
          </Tr>
          <Tr>
            <Td>Friend you invited clicks the invitation link</Td>
            <Td>5</Td>
          </Tr>
          <Tr>
            <Td>Friend you invited joins the challenge</Td>
            <Td>10</Td>
          </Tr>
          <Tr>
            <Td>Whenever a friend you invited has earned 5 points</Td>
            <Td>1</Td>
          </Tr>
        </tbody>
      </StyledTable>
    </AccordionSection>
    <AccordionSection
      title="WeVote’s mission"
      isOpen={unfurlMission}
    >
      <Typography>
        WeVote is committed to increasing voter engagement and participation by providing tools that encourage people to join in our democracy.
      </Typography>
    </AccordionSection>
    <AccordionSection
      title="Contest terms"
      isOpen={unfurlContestTerms}
    >
      <StyledUnorderedList>
        <li>Sponsor: We Vote USA</li>
        <li>Eligibility: Open to residents of the USA who are 18 years or older.</li>
        <li>Entry Period: see challenge homepage</li>
        <li>How to Enter: To enter, simply click the Join Challenge button.</li>
        <li>Prize: No prizes are given by We Vote USA.</li>
        <li>Odds of Winning: Odds of winning depend on the number of eligible entries received.</li>
        <li>No Purchase necessary: No purchase is necessary to enter or win.</li>
        <li>Taxes: Winner is responsible for all applicable taxes.</li>
        <li>Winner Notification: Winners will be notified by email or phone.</li>
      </StyledUnorderedList>
    </AccordionSection>
  </PointsWrapper>
);
ExplanationContent.propTypes = {
  unfurlInviteFriends: PropTypes.bool,
  unfurlEarnPoints: PropTypes.bool,
  unfurlMission: PropTypes.bool,
  unfurlContestTerms: PropTypes.bool,
};

const AccordionSection = ({ title, children, isOpen }) => (
  <StyledAccordion defaultExpanded={isOpen}>
    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="subtitle1">{title}</Typography>
    </StyledAccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </StyledAccordion>
);
AccordionSection.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
  title: PropTypes.string.isRequired,
};


const PointsWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;

const TitleSection = styled('div')`
  margin-bottom: 16px;
`;

const Paragraph = styled(Typography)`
  font-size: 1rem;
  line-height: 1.5;
  font-weight: bold;
`;

const StyledAccordion = styled(Accordion)`
  background-color: ${DesignTokenColors.whiteUI} !important;
  border-radius: 12px !important;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, .3);
  &.MuiAccordion-root:before {
    display: none;
  }
  &:not(:last-child) {
    margin-bottom: 12px;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  background-color: ${DesignTokenColors.neutral50};
  border-radius: 8px;
  padding: 8px 16px !important;
`;

const StyledTable = styled('table')`
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  background-color: ${DesignTokenColors.whiteUI};
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled('th')`
  text-align: left;
  color: ${DesignTokenColors.neutral900};
  padding: 12px;
  background-color: ${DesignTokenColors.neutral100};
  &:nth-child(2) {
    text-align: right;
  }
`;

const Tr = styled('tr')`
  &:nth-child(even) {
    background-color: ${DesignTokenColors.neutral50};
  }
`;

const Td = styled('td')`
  color: ${DesignTokenColors.neutral900};
  padding: 12px;
  border-bottom: 1px solid ${DesignTokenColors.neutral300};

  &:nth-child(2) {
    text-align: right;
  }
`;

const StyledUnorderedList = styled('ul')`
  line-height: 1.5;
  text-align: left;
  padding-left: 20px;
`;

export default ExplanationContent;
