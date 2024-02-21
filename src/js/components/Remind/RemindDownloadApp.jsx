import withStyles from '@mui/styles/withStyles';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import { renderLog } from '../../common/utils/logging';
import {
  SetUpAccountTitle,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';
import DownloadAppsButtons from './DownloadAppsButtons';

class RemindDownloadApp extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  componentDidUpdate (prevProps) {
    // console.log('RemindDownloadApp componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      if (this.props.goToNextStep) {
        this.props.goToNextStep();
      }
    }
  }

  componentWillUnmount () {
    if (this.functionToUseWhenProfileCompleteTimer) {
      clearTimeout(this.functionToUseWhenProfileCompleteTimer);
    }
  }

  render () {
    renderLog('RemindDownloadApp');  // Set LOG_RENDER_EVENTS to log all renders

    return (
      <StepCenteredWrapper>
        <>
          <SetUpAccountTitle>
            Download the WeVote App
          </SetUpAccountTitle>
          <SetUpAccountImportText>
            If you download the
            {' '}
            <span className="u-no-break">
              WeVote
            </span>
            {' '}
            app for your phone or tablet, you can remind friends by text message.
          </SetUpAccountImportText>
        </>
        <ImageAndButtonsWrapper>
          <DownloadAppsButtons />
        </ImageAndButtonsWrapper>
      </StepCenteredWrapper>
    );
  }
}
RemindDownloadApp.propTypes = {
  nextButtonClicked: PropTypes.bool,
  goToNextStep: PropTypes.func,
};

const styles = () => ({
});

const ImageAndButtonsWrapper = styled('div')`
  margin-top: 24px;
  width: 100%;
`;

const SetUpAccountImportText = styled('div')(({ theme }) => (`
  color: #6c757d;
  font-size: 18px;
  padding: 0 20px;
  text-align: center;
  width: 275px;
  ${theme.breakpoints.up('sm')} {
    width: 350px;
  }
`));

export default withStyles(styles)(RemindDownloadApp);
