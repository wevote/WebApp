import { List, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import BallotStore from '../../stores/BallotStore';
import { renderLog } from '../../utils/logging';
import BallotSideBarLink from './BallotSideBarLink';
import BallotSummaryAccordion from './BallotSummaryAccordion';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint no-restricted-syntax: 1 */
class BallotSideBar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      componentDidMountFinished: false,
      // expanded: undefined,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount () {
    const unsorted = BallotStore.ballot;
    this.setState({
      ballot: this._sortBallots(unsorted),
      componentDidMountFinished: true,
    });
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log('shouldComponentUpdate: componentDidMountFinished === false');
      return true;
    }
    if (this.state.ballot === undefined && nextState.ballot !== undefined) {
      // console.log('shouldComponentUpdate: new ballot found');
      return true;
    }
    if (this.state.ballot !== undefined && this.state.ballot.length !== nextState.ballot.length) {
      // console.log('shouldComponentUpdate: changed this.props.ballot.length', this.state.ballot.length, ', nextState.ballot.length', nextState.ballot.length);
      return true;
    }
    if (this.props.ballotWithAllItemsByFilterType.length !== nextProps.ballotWithAllItemsByFilterType.length) {
      // console.log('shouldComponentUpdate: changed this.props.ballotWithAllItemsByFilterType.length', this.props.ballotWithAllItemsByFilterType.length, ', nextState.ballotWithAllItemsByFilterType.length', nextProps.ballotWithAllItemsByFilterType.length);
      return true;
    }
    if (this.props.displayTitle !== nextProps.displayTitle) {
      // console.log('shouldComponentUpdate: changed this.props.displayTitle', this.props.displayTitle, ', nextState.displayTitle', nextProps.displayTitle);
      return true;
    }
    // if (pathname !== nextProps.pathname) {
    //   // console.log('shouldComponentUpdate: changed pathname', pathname, ', nextState.pathname', nextProps.pathname);
    //   return true;
    // }
    if (this.props.raceLevelFilterItemsInThisBallot !== nextProps.raceLevelFilterItemsInThisBallot) {
      return true;
    }
    if (this.props.activeRaceItem !== nextProps.activeRaceItem) {
      return true;
    }
    return false;
  }


  componentWillUnmount () {
    this.ballotStoreListener.remove();
  }

  handleClick () {
    // Fullscreen mode won't pass an onClick function, since the BallotSideBar does not go away after a click
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  onBallotStoreChange () {
    const unsorted = BallotStore.ballot;
    this.setState({
      ballot: this._sortBallots(unsorted),
    });
  }

  _sortBallots (unsorted) {
    if (unsorted) {
      // temporary array holds objects with position and sort-value
      const mapped = unsorted.map((item, i) => ({ index: i, value: item }));

      // sorting the mapped array based on local_ballot_order which came from the server
      mapped.sort((a, b) => +(
        parseInt(a.value.local_ballot_order, 10) >
            parseInt(b.value.local_ballot_order, 10)
      ) ||
          +(
            parseInt(a.value.local_ballot_order, 10) ===
            parseInt(b.value.local_ballot_order, 10)
          ) - 1);

      const orderedArray = [];
      for (const element of mapped) {
        orderedArray.push(element.value);
      }

      return orderedArray;
    } else {
      return {};
    }
  }

  // handleChange (panel) {
  //   this.setState({ expanded: panel });
  //   console.log('Running handle change, setting expanded to ', panel);
  // }

  filteredBallotToRender (ballot, ballotWithAllItemIdsByFilterType, type, key) {
    // console.log('BallotSideBar, filteredBallotToRender');
    const filteredBallot = ballot.filter((item) => {
      if (item.kind_of_ballot_item === 'MEASURE') {
        return type === 'Measure';
      } else {
        return type === item.race_office_level;
      }
    });

    if (!filteredBallot.length) {
      return null;
    }

    const filteredBallotListItems = filteredBallot.map((item) => {
      if (
        item.kind_of_ballot_item === 'OFFICE' ||
        item.kind_of_ballot_item === 'MEASURE'
      ) {
        return (
          <BallotSideBarLink
            url={this.renderUrl(item.we_vote_id, ballotWithAllItemIdsByFilterType)}
            ballotItemLinkHasBeenClicked={this.props.ballotItemLinkHasBeenClicked}
            label={item.ballot_item_display_name}
            subtitle={item.measure_subtitle}
            key={`ballot-side-bar-${item.we_vote_id}`}
            displaySubtitles={this.props.displaySubtitles}
            id={`ballotSideBarLink-${item.we_vote_id}`}
            onClick={this.handleClick}
          />
        );
      } else {
        return <span />;
      }
    });

    return (
      <div
        key={key}
        isOpen={this.props.activeRaceItem === type}
        label={type}
      >
        <ul className="BallotItem__summary__list">
          {filteredBallotListItems}
        </ul>
      </div>
    );
  }

  renderUrl (ballotItemWeVoteId) {
    if (ballotItemWeVoteId.indexOf('meas') > -1) return `/measure/${ballotItemWeVoteId}/b/btdb`;
    return `/office/${ballotItemWeVoteId}/b/btdb`;
  }

  render () {
    renderLog('BallotSideBar');  // Set LOG_RENDER_EVENTS to log all renders

    // let turnedOnNPSInput = false;
    // const BALLOT_ITEM_FILTER_TYPES = ['Federal', 'State', 'Measure', 'Local'];

    const { ballot } = this.state;
    const { classes, ballotWithAllItemsByFilterType, raceLevelFilterItemsInThisBallot } = this.props;
    const BALLOT_ITEM_FILTER_TYPES = ['Federal', 'State', 'Measure', 'Local']; // Properly ordered
    const raceLevelFilterItemsInThisBallotOrdered = [];
    // Make the incoming raceLevelFilterItems match the standard order
    if (raceLevelFilterItemsInThisBallot) {
      for (let i = 0; i < BALLOT_ITEM_FILTER_TYPES.length; i++) {
        if (raceLevelFilterItemsInThisBallot.findIndex((item) => BALLOT_ITEM_FILTER_TYPES[i].toLowerCase() === item.toLowerCase()) !== -1) {
          raceLevelFilterItemsInThisBallotOrdered.push(BALLOT_ITEM_FILTER_TYPES[i]);
        }
      }
    }
    if (ballot && ballot.length && raceLevelFilterItemsInThisBallotOrdered) {
      const ballotWithAllItemIdsByFilterType = [];
      ballotWithAllItemsByFilterType.forEach((itemByFilterType) => {
        ballotWithAllItemIdsByFilterType.push(itemByFilterType.we_vote_id);
      });
      // console.log('BallotSideBar, raceLevelFilterItemsInThisBallotOrdered:', raceLevelFilterItemsInThisBallotOrdered);
      return (
        <div className="card">
          { this.props.displayTitle ? (
            <>
              <Typography variant="h3" classes={{ root: classes.typography }}>Summary of Ballot Items</Typography>
              <Separator />
            </>
          ) :
            null}
          <List>
            <BallotSummaryAccordion activeRaceItem={this.props.activeRaceItem} allowMultipleOpen>
              {raceLevelFilterItemsInThisBallotOrdered.map((type, key) => this.filteredBallotToRender(ballot, ballotWithAllItemIdsByFilterType, type, key))}
            </BallotSummaryAccordion>
          </List>
          <div className="h4 text-left" />
          <SidebarFooter>
            <span className="terms-and-privacy">
              <Link id="ballotSideBarFAQ" to="/more/faq">
                <span className="u-no-break">Questions?</span>
              </Link>
            </span>
          </SidebarFooter>
          <SidebarFooter>
            <span className="terms-and-privacy">
              <Link id="ballotSideBarTermsOfService" to="/more/terms">
                <span className="u-no-break">Terms of Service</span>
              </Link>
            </span>
          </SidebarFooter>
          <SidebarFooter>
            <span className="terms-and-privacy">
              <Link id="ballotSideBarPrivacyPolicy" to="/more/privacy">
                <span className="u-no-break">Privacy Policy</span>
              </Link>
            </span>
          </SidebarFooter>
          <SidebarFooter>
            <span className="terms-and-privacy">
              <Link id="ballotSideBarAttributions" to="/more/attributions">Attributions</Link>
            </span>
          </SidebarFooter>
        </div>
      );
    } else {
      return <div />;
    }
  }
}
BallotSideBar.propTypes = {
  ballotWithAllItemsByFilterType: PropTypes.array,
  ballotItemLinkHasBeenClicked: PropTypes.func,
  displayTitle: PropTypes.bool,
  displaySubtitles: PropTypes.bool,
  onClick: PropTypes.func,
  raceLevelFilterItemsInThisBallot: PropTypes.array,
  classes: PropTypes.object,
  activeRaceItem: PropTypes.string,
};

const styles = (theme) => ({
  typography: {
    padding: '16px 0',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 600,
    [theme.breakpoints.down('lg')]: {
      padding: '12px 0',
    },
  },
});

const SidebarFooter = styled.div`
  margin-bottom: 10px;
  text-align: center;
`;

const Separator = styled.div`
  height: 2px;
  width: 90%;
  margin: 0 auto;
  background: #2a3757;
`;

export default withStyles(styles)(BallotSideBar);
