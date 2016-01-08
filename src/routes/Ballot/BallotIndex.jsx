import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class BallotIndex extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  render () {
    return (
      <div className="ballot">
        <header className="row">
          <section className="bottom-separator container-fluid">
            <h4 className="pull-left no-space bold">
              My Ballot
            </h4>
            <aside className="pull-right">
              <Link to="/settings/location"className="font-lightest">
                Oakland, CA (change)
              </Link>
            </aside>
          </section>
          <section className="container-fluid bg-light bottom-separator">
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

        { this.props.children }

      </div>
    );
  }
};
