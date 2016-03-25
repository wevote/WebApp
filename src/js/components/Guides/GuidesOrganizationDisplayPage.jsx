import AskOrShareAction from "components/base/AskOrShareAction";
import CopyLinkNavigation from "components/navigation/CopyLinkNavigation";
import InfoIconAction from "components/base/InfoIconAction";
import HeaderBackNavigation from "components/navigation/HeaderBackNavigation";
import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import StarAction from "components/base/StarAction";

export default class GuidesOrganizationDisplayPagePage extends React.Component {
	constructor (props) {
		super(props);
	}

	static getProps () {
		return {};
	}

	render () {
		var floatRight = {
			float: "right"
		};
		return <div>
				<HeaderBackNavigation header_text={""} back_to_text={"< Back"} link_route={"guides_voter"} />
				<div className="container-fluid well well-90">
					<ul className="list-group">
						<li className="list-group-item">
							<h3>
								<span style={floatRight}><Button bsStyle="info" bsSize="xsmall">Following</Button></span>
								<span className="glyphicon glyphicon-small glyphicon-tower"></span>&nbsp;
								Organization Name Voter Guide<br />{/* TODO icon-org-placeholder */}
							</h3>
							@OrgName1&nbsp;&nbsp;&nbsp;See Website<br />
							5 of your friends follow Organization Name<br />
							22,452 people follow<br />

							<strong>2016 General Election, November 2nd</strong>
							<InfoIconAction we_vote_id={"wvcand001"} />
							<br />
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur posuere vulputate massa ut efficitur.
							Phasellus rhoncus hendrerit ultricies. Fusce hendrerit vel elit et euismod. Etiam bibendum ultricies
							viverra. Integer ut bibendum ex. Suspendisse eleifend mi accumsan, euismod enim at, malesuada nibh.
							Duis a eros fringilla, dictum leo vitae, vulputate mi. Nunc vitae neque nec erat fermentum... (more)<br />
							<AskOrShareAction link_text={"Share Organization"} />
							<br />
						</li>
					</ul>
					<ul className="list-group">
						<li className="list-group-item">
							<StarAction we_vote_id={"wvcand001"} />
							<Link to="ballot_candidate_one_org_position" params={{id: 2, org_id: 27}} />
							<i className="icon-icon-add-friends-2-1 icon-light icon-medium"></i>{/* TODO icon-person-placeholder */}
							&nbsp;<span>supports</span> Fictional Candidate
							<InfoIconAction we_vote_id={"wvcand001"} />
							<br />

							<StarAction we_vote_id={"wvcand001"} />
							Running for US House - District 12
							<InfoIconAction we_vote_id={"wvcand001"} />
							<br />
								Integer ut bibendum ex. Suspendisse eleifend mi accumsan, euismod enim at, malesuada nibh.
								Duis a eros fringilla, dictum leo vitae, vulputate mi. Nunc vitae neque nec erat fermentum... (more)
							<br />
						</li>
					</ul>
					<ul className="list-group">
						<li className="list-group-item">
							<StarAction we_vote_id={"wvcand001"} />
							<Link to="ballot_candidate_one_org_position" params={{id: 2, org_id: 27}} />
							<i className="icon-icon-add-friends-2-1 icon-light icon-medium"></i>{/* TODO icon-person-placeholder */}
							&nbsp;<span>supports</span> Politician Name
							<InfoIconAction we_vote_id={"wvcand001"} />
							<br />

							<StarAction we_vote_id={"wvcand001"} />
							Running for Governor
							<InfoIconAction we_vote_id={"wvcand001"} />
							<br />
						</li>
					</ul>
					<ul className="list-group">
						<li className="list-group-item">
							<StarAction we_vote_id={"wvcand001"} />
							<Link to="ballot_candidate_one_org_position" params={{id: 2, org_id: 27}} />
							<i className="icon-icon-add-friends-2-1 icon-light icon-medium"></i>{/* TODO icon-person-placeholder */}
							&nbsp;<span>opposes</span> Another Candidate
							<InfoIconAction we_vote_id={"wvcand001"} />
							<br />

							<StarAction we_vote_id={"wvcand001"} />
							Running for Judge
							<InfoIconAction we_vote_id={"wvcand001"} />
							<br />
						</li>
					</ul>
				</div>
				<CopyLinkNavigation button_text={"Copy Link to Voter Guide"} />
			</div>;
	}
}
