import { Tab } from '@mui/material';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class TabWithoutPushHistory extends Component {
	handleClick = () => {
		const { change: handleTabChange, value } = this.props;
		if (handleTabChange) {
			handleTabChange(value);
		}
	};

	render () {
		const {
			classes, id, label, icon, iconPosition,
		} = this.props;

		return (
			<Tab
				classes={classes}
				id={id}
				label={label}
				icon={icon}
				iconPosition={iconPosition}
				tabIndex={0}
				role="tab"
				onClick={this.handleClick}
			/>
		);
	}
}

TabWithoutPushHistory.propTypes = {
	classes: PropTypes.object.isRequired,
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	value: PropTypes.number.isRequired,
	change: PropTypes.func.isRequired,
	icon: PropTypes.element,
	iconPosition: PropTypes.oneOf(['start', 'end', 'top', 'bottom']),
};
