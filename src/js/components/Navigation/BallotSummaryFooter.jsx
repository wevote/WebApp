import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Ballot from '@material-ui/icons/Ballot';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import BallotStore from '../../stores/BallotStore';
import BallotSideBarLink from './BallotSideBarLink';
import { renderLog } from '../../utils/logging';
import BallotSummaryFooterItem from './BallotSummaryFooterItem';

class BallotSummaryFooter extends Component {
  static propTypes = {
    activeRaceItem: PropTypes.string,
    ballotWithAllItemsByFilterType: PropTypes.array,
    ballotItemLinkHasBeenClicked: PropTypes.func,
    classes: PropTypes.object,
    displayTitle: PropTypes.bool,
    displaySubtitles: PropTypes.bool,
    onClick: PropTypes.func,
    pathname: PropTypes.string,
    raceLevelFilterItemsInThisBallot: PropTypes.array,
    setActiveRaceItem: PropTypes.func,
  };

  static defaultProps = {
    pathname: '/ballot',
  };

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
    if (this.props.pathname !== nextProps.pathname) {
      // console.log('shouldComponentUpdate: changed this.props.pathname', this.props.pathname, ', nextState.pathname', nextProps.pathname);
      return true;
    }
    if (this.props.raceLevelFilterItemsInThisBallot !== nextProps.raceLevelFilterItemsInThisBallot) {
      return true;
    }
    if (this.props.activeRaceItem !== nextProps.activeRaceItem) {
      return true;
    }
    // console.log('shouldComponentUpdate return false');
    return false;
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
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
      // for (const element of mapped) {
      //   orderedArray.push(element.value);
      // }
      for (let count = 0; count < mapped.length; count++) {
        orderedArray.push(mapped[count].value);
      }

      return orderedArray;
    } else {
      return {};
    }
  }

  handleClick () {
    // Fullscreen mode won't pass an onClick function, since the BallotSummaryFooter does not go away after a click
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  filteredBallotToRender (ballot, ballotWithAllItemIdsByFilterType, type, key) {
    // console.log('BallotSummaryFooter, filteredBallotToRender');
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

    const filteredBallotListItems = filteredBallot.map((item, index) => {
      if (
        (item.kind_of_ballot_item === 'OFFICE' ||
        item.kind_of_ballot_item === 'MEASURE') &&
        index < 3
      ) {
        return (
          <BallotSideBarLink
            plainTextLink
            url={this.renderUrl(item.we_vote_id, ballotWithAllItemIdsByFilterType)}
            ballotItemLinkHasBeenClicked={this.props.ballotItemLinkHasBeenClicked}
            label={item.ballot_item_display_name}
            subtitle={item.measure_subtitle}
            key={`ballot-summary-footer-${item.we_vote_id}`}
            displaySubtitles={this.props.displaySubtitles}
            id={`ballotSummaryFooterLink-${item.we_vote_id}`}
            onClick={this.handleClick}
          />
        );
      } else {
        return <span key={`ballot-summary-footer-${item.we_vote_id}`} />;
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
    if (ballotItemWeVoteId.indexOf('meas') > -1) return `/measure/${ballotItemWeVoteId}/b/btdb/`;
    return `/office/${ballotItemWeVoteId}/b/btdb/`;
  }

  render () {
    // console.log('BallotSummaryFooter render');
    renderLog(__filename);

    // let turnedOnNPSInput = false;
    // const BALLOT_ITEM_FILTER_TYPES = ['Federal', 'State', 'Measure', 'Local'];

    const { ballot } = this.state;
    const { classes, ballotWithAllItemsByFilterType, raceLevelFilterItemsInThisBallot } = this.props;
    const BALLOT_ITEM_FILTER_TYPES = ['Federal', 'State', 'Measure', 'Local']; // Properly ordered
    const raceLevelFilterItemsInThisBallotOrdered = [];
    // Make the incoming raceLevelFilterItems match the standard order
    if (raceLevelFilterItemsInThisBallot) {
      for (let i = 0; i < BALLOT_ITEM_FILTER_TYPES.length; i++) {
        if (raceLevelFilterItemsInThisBallot.findIndex(item => BALLOT_ITEM_FILTER_TYPES[i].toLowerCase() === item.toLowerCase()) !== -1 && BALLOT_ITEM_FILTER_TYPES[i].toLowerCase() !== this.props.activeRaceItem.toLowerCase()) {
          raceLevelFilterItemsInThisBallotOrdered.push(BALLOT_ITEM_FILTER_TYPES[i]);
        }
      }
    }
    if (ballot && ballot.length && raceLevelFilterItemsInThisBallotOrdered && raceLevelFilterItemsInThisBallotOrdered.length > 1) {
      const ballotWithAllItemIdsByFilterType = [];
      ballotWithAllItemsByFilterType.forEach((itemByFilterType) => {
        ballotWithAllItemIdsByFilterType.push(itemByFilterType.we_vote_id);
      });
      // console.log('BallotSummaryFooter, raceLevelFilterItemsInThisBallotOrdered:', raceLevelFilterItemsInThisBallotOrdered);
      return (
        <div className={classes.card}>
          <div className={classes.cardBody}>
            { this.props.displayTitle ? (
              <>
                <Typography variant="h2" classes={{ root: classes.typography }}>
                  <Ballot className={classes.icon} />
                  Show More Ballot Items
                </Typography>
              </>
            ) :
              null
            }
            <Row className="row">
              <BallotSummaryFooterItem setActiveRaceItem={type => this.props.setActiveRaceItem(type)} activeRaceItem={this.props.activeRaceItem}>
                {raceLevelFilterItemsInThisBallotOrdered.map((type, key) => this.filteredBallotToRender(ballot, ballotWithAllItemIdsByFilterType, type, key))}
              </BallotSummaryFooterItem>
            </Row>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

const styles = theme => ({
  typography: {
    padding: '16px 0',
    fontWeight: 600,
    fontSize: 18,
    [theme.breakpoints.down('lg')]: {
      padding: '12px 0',
    },
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '0px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12)',
    marginBottom: '16px',
    overflowY: 'none',
    border: 'none',
  },
  cardBody: {
    padding: '20px',
  },
  icon: {
    marginRight: 12,
    color: '#2E3C5D',
    fontSize: 32,
  },
});

const Row = styled.div`
  margin: 0 -8px;
`;

export default withStyles(styles)(BallotSummaryFooter);
