import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Headroom from "react-headroom";

import BallotStore from 'stores/BallotStore';
import BallotItem from 'components/Ballot/BallotItem';

export default class Ballot extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    BallotStore.initialize( (ballot_list) => this.setState({ ballot_list }) );
  }

  render () {
    var { ballot_list } = this.state;

    return (
      <div>
        <header className="row">
          <Headroom>
            <section className="separate-bottom container-fluid">
              <h4 className="pull-left gutter-left--window bold">
              <Link to="/more">
                <span className="glyphicon glyphicon-menu-hamburger glyphicon-line-adjustment device-icon--large"></span>
              </Link>
                My Ballot
              </h4>
              <aside className="pull-right gutter-right--window gutter-top--small">
                <Link to="/settings/location"className="font-lightest">
                  Oakland, CA
                </Link>
              </aside>
            </section>
          </Headroom>
        </header>
        <section className="container-fluid ballotList-bg fluff-tight--full separate-bottom">
          <div className="row">
            <div className="col-xs-6 col-md-6 text-center">
              <i className="icon-icon-add-friends-2-1 icon-light icon-medium">
              </i>
              <Link
                to="/friends/add"
                className="font-darkest fluff-left-narrow utils-align--super">
                  Add Friends
              </Link>
            </div>
            <div className="col-xs-6 col-md-6 text-center">
              <i className="icon-icon-more-opinions-2-2 icon-light icon-medium">
              </i>
              <Link
                to="/opinions"
                className="font-darkest fluff-left-narrow utils-align--super">
                  More Opinions
              </Link>
            </div>
          </div>
        </section>
        <div className="ballot-list">
          {
            ballot_list ? ballot_list
              .map( item =>
                <BallotItem key={item.we_vote_id} {...item} />
              ) : (
                <div className="box-loader">
                  <i className="fa fa-spinner fa-pulse"></i>
                  <p>Loading ... One Moment</p>
                </div>
              )
          }
        </div>
      </div>
    );
  }
};
