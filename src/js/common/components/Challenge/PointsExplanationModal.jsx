import { DialogTitle } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../Style/DesignTokenColors';
import ModalDisplayTemplateA, { templateAStyles } from '../../../components/Widgets/ModalDisplayTemplateA';
import { renderLog } from '../../utils/logging';
import ExplanationContent from './ExplanationContent';

class PointsExplanationModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showTerms: false,
    };
  }

  render () {
    renderLog('PointsExplanationModalModal');
    const { show, toggleModal, unfurlContestTerms, unfurlEarnPoints, unfurlInviteFriends, unfurlMission } = this.props;

    // need to replace hardcode with props
    const dialogTitleText = 'About challenges and WeVote';

    return (
      <ModalDisplayTemplateA
        dialogTitleJSX={<DialogTitle>{dialogTitleText}</DialogTitle>}
        textFieldJSX={(
          <ExplanationContent
            unfurlContestTerms={unfurlContestTerms}
            unfurlEarnPoints={unfurlEarnPoints}
            unfurlInviteFriends={unfurlInviteFriends}
            unfurlMission={unfurlMission}
          />
        )}
        show={show}
        tallMode
        toggleModal={toggleModal}
      />
    );
  }
}
PointsExplanationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  unfurlContestTerms: PropTypes.bool,
  unfurlEarnPoints: PropTypes.bool,
  unfurlInviteFriends: PropTypes.bool,
  unfurlMission: PropTypes.bool,
};


export const CardRowsWrapper = styled('div')`
  margin-top: 2px;
`;

export const CardForListRow = styled('div')`
  color: ${DesignTokenColors.neutral900};
  //font-size: 12px;
  line-height: 1.5;
  padding-bottom: 8px;

  &:First-child {
    border-bottom: 1px solid ${DesignTokenColors.neutral300};
  }

  &:nth-child(2) {
    padding-top: 8px;
  }
`;

export const FlexDivLeft = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: start;
`;


export default withTheme(withStyles(templateAStyles)(PointsExplanationModal));
