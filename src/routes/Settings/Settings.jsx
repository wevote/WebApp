import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class Settings extends Component {
    static propTypes = {
        children: PropTypes.object
    }

    render () {
        return (
            <li className="list-group settings center">
                <Link className="group-item" to="/settings/location"> Location </Link>
            </li>
        );
    }
}
