import React, { Component } from 'react';
import { Link } from 'react-router';
import BallotStore from 'stores/BallotStore';

import 'assets/css/navigation.css';
import AddressBox from 'components/AddressBox/AddressBox';

export default class Ballot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ballot_items: BallotStore.getOrderedBallotItems()
        };
    }

    componentDidMount () {
        BallotStore._addChangeListener(this._onChange.bind(this));
    }

    componentWillUnmount () {
        BallotStore._removeChangeListener(this._onChange.bind(this));
    }

    render () {
        var items = [];
        this.state.ballot_items.forEach( item => {
            items.push(
                <div className="ballot-item" key={ item.office_we_vote_id }>
                    { item.office_name }
                </div>
            )
        });

        return (
            <div className="ballot">
            <header className="row">
                <section className="bottom-separator container-fluid">
                    <h4 className="pull-left no-space bold">My Ballot</h4>
                    <aside className="pull-right">
                        <Link to="/settings/location"className="font-lightest">
                            Oakland, CA (change)
                        </Link>
                    </aside>
                </section>
                <section className="container-fluid bg-light bottom-separator">
                    <div className="row">
                        <div className="col-xs-6 col-md-6 text-center">
                            <i className="icon-icon-add-friends-2-1 icon-light icon-medium"></i>
                            <Link to="/friends/add"
                                  className="font-darkest fluff-left-narrow">Add Friends
                            </Link>
                        </div>
                        <div className="col-xs-6 col-md-6 text-center">
                            <i className="icon-icon-more-opinions-2-2 icon-light icon-medium"></i>
                            <Link to="/ballot/opinions"
                                  className="font-darkest fluff-left-narrow">More Opinions
                            </Link>
                        </div>
                    </div>
                </section>
            </header>
                { items }
            </div>
        );
    }

    _onChange(data) {
        this.setState({
            ballot_items: BallotStore.getOrderedBallotItems()
        });
    }
};
