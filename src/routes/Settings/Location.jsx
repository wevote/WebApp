import HeaderBackNavigation from 'components/Navigation/HeaderBackNavigation';
import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

export default class Location extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HeaderBackNavigation />  {/* TODO DALE Discuss with Nick */}
            	<div className="container-fluid well well-90">
            		<h2 className="text-center">Change Location</h2>
            		<div>
            			<span className="small">Please enter the address (or just the city) where you registered to
            			vote. The more location information you can provide, the more ballot information will
            			be visible.</span>
            			<input type="text" name="address" className="form-control" defaultValue="Oakland, CA" />
                        <span>
                            <ButtonToolbar>
                                <Button bsStyle="primary">Save Location</Button>
                            </ButtonToolbar>
                        </span>
            		</div>
            	</div>
            </div>
        );
    }
}
