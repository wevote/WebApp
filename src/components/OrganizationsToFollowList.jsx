"use strict";

import React, { Component } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router";

import FollowOrIgnore from "components/FollowOrIgnore";
import VoterGuideActions from 'actions/VoterGuideActions';

export default class OrganizationsToFollowList extends Component {
	render() {
		return (
			<div>
				<div className="row">
					<div className="pull-left col-xs-1 col-md-4">
						<Link  to="org_endorsements" params={{org_id: 27}}>
							<i className="icon-icon-org-placeholder-6-2 icon-light"></i>{/* TODO icon-org-placeholder */}
						</Link>
        			</div>
        			<FollowOrIgnore action={VoterGuideActions} />
        			<div className="pull-right col-xs-7 col-md-8">
          				<div>
				            <Link to="org_endorsements" params={{id: 2, org_id: 27}} >
				              Organization Name
				            </Link>
          				</div>
						<span className="small">
							@OrgName1 (<Link to="org_endorsements" params={{id: 2, org_id: 27}}>read more</Link>)
						</span>
					</div>
				</div>
				<div className="row">
					<div className="pull-left col-xs-1 col-md-4">
						<Link to="org_endorsements" params={{org_id: 27}}>
							<i className="icon-icon-org-placeholder-6-2 icon-light"></i>{/* TODO icon-org-placeholder */}
						</Link>
		        	</div>
	        		<FollowOrIgnore action={VoterGuideActions} />
	        		<div className="pull-right col-xs-7 col-md-8">
	          			<div>
				            <Link to="org_endorsements" params={{id: 2, org_id: 27}}>
				              Another Organization Name
				            </Link>
	          			</div>
						<span className="small">
							@OrgName2 (<Link to="org_endorsements" params={{id: 2, org_id: 27}}>read more</Link>)
						</span>
	        		</div>
				</div>
			</div>
        );
	}
}
