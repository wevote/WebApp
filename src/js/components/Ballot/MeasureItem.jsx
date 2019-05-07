import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import MeasureStore from '../../stores/MeasureStore';
import AppStore from '../../stores/AppStore';
import ReadMore from '../Widgets/ReadMore';
import { capitalizeString } from '../../utils/textFormat';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import BallotItemSupportOpposeComment from '../Widgets/BallotItemSupportOpposeComment';

class MeasureItem extends Component {
  static propTypes = {
    classes: PropTypes.object,
    measureWeVoteId: PropTypes.string.isRequired,
    theme: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemDisplayName: '',
      // measureSubtitle: '',
      measureText: '',
      measureWeVoteId: '',
      electionDisplayName: '',
      regionalDisplayName: '',
      stateCode: '',
      stateDisplayName: '',
      showPositionStatementActionBar: true,
      // scrolledDown: AppStore.getScrolledDown(),
    };
    this.getMeasureLink = this.getMeasureLink.bind(this);
    this.goToMeasureLink = this.goToMeasureLink.bind(this);
  }

  componentDidMount () {
    this.onMeasureStoreChange();
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
    this.appStoreListener.remove();
  }

  onMeasureStoreChange () {
    const measure = MeasureStore.getMeasure(this.props.measureWeVoteId);
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      // measureSubtitle: measure.measure_subtitle,
      measureText: measure.measure_text,
      measureWeVoteId: measure.we_vote_id,
      electionDisplayName: measure.election_display_name,
      regionalDisplayName: measure.regional_display_name,
      stateCode: measure.state_code,
      stateDisplayName: measure.state_display_name,
    });
  }

  onAppStoreChange () {
    this.setState({
      // scrolledDown: AppStore.getScrolledDown(),
    });
  }

  getMeasureLink (oneMeasureWeVoteId) {
    if (this.state.organization && this.state.organization.organization_we_vote_id) {
      // If there is an organization_we_vote_id, signal that we want to link back to voter_guide for that organization
      return `/measure/${oneMeasureWeVoteId}/btvg/${this.state.organization.organization_we_vote_id}`;
    } else {
      // If no organization_we_vote_id, signal that we want to link back to default ballot
      return `/measure/${oneMeasureWeVoteId}/b/btdb/`; // back-to-default-ballot
    }
  }

  goToMeasureLink (oneMeasureWeVoteId) {
    const measureLink = this.getMeasureLink(oneMeasureWeVoteId);
    historyPush(measureLink);
  }

  render () {
    renderLog(__filename);
    // const { supportProps, transitioning } = this.state;
    const { classes } = this.props;
    let {
      ballotItemDisplayName, stateDisplayName,
    } = this.state;
    const {
      measureText, measureWeVoteId, electionDisplayName, regionalDisplayName, stateCode,
    } = this.state;
    if (stateDisplayName === undefined && stateCode) {
      stateDisplayName = stateCode.toUpperCase();
    }

    const numberOfLines = 2;
    // measureSubtitle = capitalizeString(measureSubtitle);
    ballotItemDisplayName = capitalizeString(ballotItemDisplayName);

    return (
      <Card classes={{ root: classes.cardRoot }}>
        <InfoRow>
          <MeasureInfoWrapper onClick={() => { this.goToMeasureLink(measureWeVoteId); }}>
            <Title>
              {ballotItemDisplayName}
            </Title>
            { electionDisplayName || regionalDisplayName || stateDisplayName ?
              (
                <SubTitle>
                  <p>
                    { electionDisplayName || 'Appearing on the ballot in ' }
                    { electionDisplayName ? <span> &middot; </span> : null }
                    { regionalDisplayName || null }
                    { regionalDisplayName && stateDisplayName ? ', ' : null }
                    { stateDisplayName }
                  </p>
                </SubTitle>
              ) :
              null
            }
            {/* <SubTitle>{measureSubtitle}</SubTitle> */}
            { measureText ? (
              <div className="measure_text u-gray-mid">
                <ReadMore
                  num_of_lines={numberOfLines}
                  text_to_display={measureText}
                />
              </div>
            ) :
              null
            }
          </MeasureInfoWrapper>
          <BallotItemSupportOpposeCountDisplay ballotItemWeVoteId={measureWeVoteId} />
        </InfoRow>
        <BallotItemSupportOpposeComment
          ballotItemWeVoteId={measureWeVoteId}
          showPositionStatementActionBar={this.state.showPositionStatementActionBar}
        />
      </Card>
    );
  }
}

const styles = theme => ({
  cardRoot: {
    padding: '16px 16px 8px 16px',
    [theme.breakpoints.down('lg')]: {
      padding: '16px 16px 0 16px',
    },
  },
  endorsementIconRoot: {
    fontSize: 14,
    margin: '.3rem .3rem 0 .5rem',
  },
  cardHeaderIconRoot: {
    marginTop: '-.3rem',
    fontSize: 20,
  },
  cardFooterIconRoot: {
    fontSize: 14,
    margin: '0 0 .1rem .4rem',
  },
});

const InfoRow = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`;

const MeasureInfoWrapper = styled.div`
  display: flex;
  flex-flow: column;
  max-width: 75%;
  cursor: pointer;
  user-select: none;
  padding-right: 8px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 70%;
  }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin: .1rem 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 16px;
  }
`;

const SubTitle = styled.h3`
  font-size: 16px;
  font-weight: 300;
  color: #555;
  margin-top: .6rem;
  width: 135%;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 13px;
  }
`;

export default withTheme()(withStyles(styles)(MeasureItem));
