import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import BallotStore from 'stores/BallotStore';
import BallotItem from 'components/Ballot/BallotItem';

export default class BallotList extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    BallotStore.initialize( ballot_list => this.setState({ ballot_list }));
  }

  render () {
    return (
      <div>
        <header className="row">
          <section className="separate-bottom fluff-loose--full container-fluid">
            <h4 className="pull-left gutter-left--window bold">
              MY BALLOT
            </h4>
            <aside className="pull-right gutter-right-window gutter-top-small">
              <Link to="/settings/location"className="font-lightest text-uppercase">
                Oakland, CA (change)
              </Link>
            </aside>
          </section>
          <section className="container-fluid ballotList-bg fluff-tight--full separate-bottom">
            <div className="row">
              <div className="col-xs-6 col-md-6 text-center">
                <i className="icon-icon-add-friends-2-1 icon-light icon-medium">
                </i>
                <Link
                  to="/friends/add"
                  className="font-darkest fluff-left-narrow">
                    Add Friends
                </Link>
              </div>
              <div className="col-xs-6 col-md-6 text-center">
                <i className="icon-icon-more-opinions-2-2 icon-light icon-medium">
                </i>
                <Link
                  to="/ballot/opinions"
                  className="font-darkest fluff-left-narrow">
                    More Opinions
                </Link>
              </div>
            </div>
          </section>
        </header>
        <div className="ballot-list">
          {
            this.state.ballot_list ?
            this.state.ballot_list.map( item =>
              <BallotItem key={item.we_vote_id} {...item} />
            ) : 'loading...'
          }
        </div>
      </div>
    );
  }
};
