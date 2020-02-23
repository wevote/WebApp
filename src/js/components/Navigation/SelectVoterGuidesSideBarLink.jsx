import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { historyPush } from '../../utils/cordovaUtils';
import { capitalizeString, sentenceCaseString } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';


export default class SelectVoterGuidesSideBarLink extends Component {
  static propTypes = {
    label: PropTypes.string,
    subtitle: PropTypes.string,
    displaySubtitles: PropTypes.bool,
    electionId: PropTypes.number,
    voterGuideWeVoteId: PropTypes.string,
  };

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onVoterStoreChange();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const linkedOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    this.setState({
      linkedOrganizationWeVoteId,
    });
  }

  goToEditLink = () => {
    const { voterGuideWeVoteId } = this.props;
    const editLink = `/vg/${voterGuideWeVoteId}/settings/positions`;
    historyPush(editLink);
  }

  goToPreviewLink = () => {
    const { electionId } = this.props;
    const { linkedOrganizationWeVoteId } = this.state;
    const previewLink = `/voterguide/${linkedOrganizationWeVoteId}/ballot/election/${electionId}/positions`;
    historyPush(previewLink);
  }

  render () {
    // console.log('voterGuideWeVoteId:', this.props.voterGuideWeVoteId);
    renderLog('SelectVoterGuidesSideBarLink');  // Set LOG_RENDER_EVENTS to log all renders
    const labelInSentenceCase = capitalizeString(this.props.label);
    const subtitleInSentenceCase = sentenceCaseString(this.props.subtitle);

    return (
      <span>
        {labelInSentenceCase && labelInSentenceCase !== '' ? (
          <Wrapper>
            <Content>
              <Name>
                {labelInSentenceCase}
              </Name>
              { this.props.displaySubtitles ? (
                <Date>
                  {subtitleInSentenceCase}
                </Date>
              ) : null }
              <ButtonWrapper>
                <ButtonContainer>
                  <Button
                    color="primary"
                    fullWidth
                    onClick={this.goToEditLink}
                    variant="contained"
                  >
                    Edit
                  </Button>
                </ButtonContainer>
                <ButtonContainer>
                  <Button
                    fullWidth
                    onClick={this.goToPreviewLink}
                    variant="outlined"
                  >
                    Preview
                  </Button>
                </ButtonContainer>
              </ButtonWrapper>
            </Content>
          </Wrapper>
        ) :
          null
      }
      </span>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
`;

const Content = styled.div`

`;

const Name = styled.h3`
  font-size: 18px;
  color: black !important;
  font-weight: 700 !important;
  margin-bottom: 4px;
`;

const Date = styled.small`
  font-size: 14px;
  font-weight: normal;
  color: #666;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  @media (min-width: 768px) and (max-width: 868px) {
    flex-direction: column;
  }
  flex-direction: row;
  margin-top: 16px;
`;

const ButtonContainer = styled.div`
  &:first-child {
    margin-bottom: 0;
    margin-right: 8px;
  }
  width: 50%;
  @media (min-width: 768px) and (max-width: 868px) {
    &:first-child {
      margin-right: 0;
      margin-bottom: 8px;
    }
    width: 100%;
  }
`;
