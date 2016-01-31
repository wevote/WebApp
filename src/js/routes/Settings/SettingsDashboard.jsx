import { Component, PropTypes } from 'react';

export default class SettingsDashboard extends Component {
    static propTypes = {
        children: PropTypes.object
    };

    render () {
        return (
            <div className="settings-dashboard">
                { this.props.children }
            </div>
        );
    }
}
