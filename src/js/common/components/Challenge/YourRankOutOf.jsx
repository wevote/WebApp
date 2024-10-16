import React, { PureComponent, Suspense } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import DesignTokenColors from '../Style/DesignTokenColors';
import { InfoOutlined } from '@mui/icons-material';

const PointsExplanationModal = React.lazy(() => import(/* webpackChunkName: 'PointsExplanationModal' */ './PointsExplanationModal')); // eslint-disable-line import/no-cycle

class YourRankOutOf extends PureComponent {
    constructor (props) {
      super(props);
      this.state = {
        pointsExplanationModalOpen: false,
        moreInfoIconHovered: false,
      };
    }
    
    openPointsExplanationModal = () => {
        this.setState({
          pointsExplanationModalOpen: true,
        });
    };

    toggleYourRankFunction = () => {
        const { pointsExplanationModalOpen } = this.state;
        this.setState({
          pointsExplanationModalOpen: !pointsExplanationModalOpen,
        });
      };

    handleMoreInfoIconHover = () => {
        this.setState({
          moreInfoIconHovered: true,
        });
    }

    handleMoreInfoIconLeave = () => {
        this.setState({
          moreInfoIconHovered: false,
        });
    }


    render() {
        const { rankOfVoter, participantsCount } = this.props;
        const { pointsExplanationModalOpen, moreInfoIconHovered } = this.state;

        return (
            <RankContainer>
            <RankText>You&apos;re</RankText>
            {' '}
            <RankNumber>
              #
              {rankOfVoter}
            </RankNumber>
            {' '}
            <RankDetails>
              (of
              {' '}
              {participantsCount}
              )
            </RankDetails>
            {' '}
            <InfoOutlined
                style={{ color: moreInfoIconHovered ? DesignTokenColors.primary500 : DesignTokenColors.neutral600, cursor: 'pointer' }}
                onMouseEnter={() => this.handleMoreInfoIconHover()}
                onMouseLeave={() => this.handleMoreInfoIconLeave()}
                onClick={() => this.openPointsExplanationModal()}
            />
            {pointsExplanationModalOpen && (
                <Suspense fallback={<div>Loading...</div>}>
                    <PointsExplanationModal
                        show={this.state.pointsExplanationModalOpen}
                        toggleModal={this.toggleYourRankFunction}/>
                </Suspense>
            )}
          </RankContainer>
        );
    }
}

YourRankOutOf.propTypes = {
    rankOfVoter: PropTypes.number.isRequired,
    participantsCount: PropTypes.number.isRequired,
};

// Styles
const RankContainer = styled.div`
  font-size: 16px;
  color: ${DesignTokenColors.neutral900}; /* Default color */
`;

const RankText = styled.span`
  font-weight: bold;
  color: ${DesignTokenColors.neutral900};  /* Color for "You're" */
`;

const RankNumber = styled.span`
  font-weight: bold;
  color: ${DesignTokenColors.accent500};  /* Accent color for the rank number */
`;

const RankDetails = styled.span`
  color: ${DesignTokenColors.neutral600};  /* Subdued color for "(of 6441)" */
`;

export default YourRankOutOf;