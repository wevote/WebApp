import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';

class SharedItemIntroduction extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('SharedItemIntroduction');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <OuterWrapper>
        <InnerWrapper>
          <IntroHeader>
            We Vote makes
            <span className="u-show-mobile"><br /></span>
            <span className="u-show-desktop-tablet">{' '}</span>
            being a voter easier:
          </IntroHeader>
          <ListWrapper>
            <ListMaxWidth>
              <ListTitleRow>
                <Dot><StepNumber>1</StepNumber></Dot>
                <StepTitle>Make sure you&apos;re ready to vote</StepTitle>
              </ListTitleRow>
              <ListRow>
                <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                <StepText>Verify your registration. Make a plan for casting your vote. Find your polling location.</StepText>
              </ListRow>

              <ListTitleRow>
                <Dot><StepNumber>2</StepNumber></Dot>
                <StepTitle>See what&apos;s on your ballot</StepTitle>
              </ListTitleRow>
              <ListRow>
                <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                <StepText>Who&apos;s running for office? What do they stand for? With over 12,400 candidates running for 3,600 offices this year, We Vote helps you make sense of your choices.</StepText>
              </ListRow>

              <ListTitleRow>
                <Dot><StepNumber>3</StepNumber></Dot>
                <StepTitle>Learn from friends you trust</StepTitle>
              </ListTitleRow>
              <ListRow>
                <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
                <StepText>Between the nonstop misleading TV ads, texts, calls and overflowing mailboxes, who has time to make sense of the madness? Get help from people you trust.</StepText>
              </ListRow>
            </ListMaxWidth>
          </ListWrapper>
        </InnerWrapper>
      </OuterWrapper>
    );
  }
}

const styles = theme => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 4px',
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
});

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-left: 12px;
  padding-right: 12px;
`;

const InnerWrapper = styled.div`
`;

const IntroHeader = styled.div`
  color: #2e3c5d;
  font-size: 24px;
  font-weight: 600;
  padding-top: 32px;
  padding-bottom: 0;
  text-align: center;
  @include breakpoints(max mid-small) {
    font-size: 22px;
  }
`;

const ListWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ListMaxWidth = styled.div`
  max-width: 450px;
`;

const ListTitleRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  padding-top: 14px;
`;

const ListRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

const Dot = styled.div`
  padding-top: 2px;
  text-align: center;
  vertical-align: top;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 3px;
  }
`;

const StepNumber = styled.div`
  background: ${props => props.theme.colors.brandBlue};
  border-radius: 4px;
  color: white;
  font-size: 16px;
  width: 22px;
  height: 22px;
  padding-top: 1px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 14px;
    min-width: 20px;
    width: 20px;
    height: 20px;
  }
`;

const StepTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 17px;
  }
`;

const StepText = styled.div`
  color: #555;
  font-size: 16px;
  font-weight: 200;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

const StepNumberPlaceholder = styled.div`
  width: 22px;
  height: 22px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 20px;
    height: 20px;
    min-width: 20px;
  }
`;

export default withTheme(withStyles(styles)(SharedItemIntroduction));
