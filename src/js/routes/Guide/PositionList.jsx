import React, { Component, PropTypes } from "react";
import OrganizationActions from "../../actions/OrganizationActions";
import LoadingWheel from "../../components/LoadingWheel";
import OrganizationStore from "../../stores/OrganizationStore";
import OrganizationPositionItem from "../../components/VoterGuide/OrganizationPositionItem";
import FollowToggle from "../../components/Widgets/FollowToggle";
import Image from "../../components/Image";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/94226088 */

export default class GuidePositionList extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount (){
    let we_vote_id = this.props.params.we_vote_id;
    this.listener = OrganizationStore.addListener(this._onChange.bind(this));
    OrganizationActions.retrieve(we_vote_id);
    OrganizationActions.retrievePositions(we_vote_id);
  }

  componentWillUnmount (){
    this.listener.remove();
  }

  _onChange (){
    this.setState({ organization: OrganizationStore.get(this.props.params.we_vote_id)});
  }

  render () {
    if (!this.state.organization){
      return <div>{LoadingWheel}</div>;
    }

    const {organization_twitter_handle, twitter_description, twitter_followers_count,
      organization_photo_url, organization_website,
      organization_name, position_list} = this.state.organization;

    // If the displayName is in the twitterDescription, remove it from twitterDescription
    let displayName = organization_name ? organization_name : "";
    let twitterDescription = twitter_description ? twitter_description : "";
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);

    return <div>
        <div className="container-fluid well well-90">
          <ul className="list-group">
            <li className="list-group-item">
                <FollowToggle we_vote_id={this.props.params.we_vote_id} />
                { organization_photo_url ?
                 <span>
                 <Image imageUrl={organization_photo_url} class="img-square" />
                  </span> :
                <i className="icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color"></i> }
                <div className="h4 page__display-name">{displayName}</div>
                { twitterDescriptionMinusName ? <p className="page__short-bio">{twitterDescriptionMinusName}</p> :
                    null}
                <br />{/* TODO icon-org-placeholder */}
              { organization_twitter_handle ?
               <span>@{organization_twitter_handle}&nbsp;&nbsp;</span> :
               <span></span> }
              {twitter_followers_count ?
                <span className="twitter-followers__badge">
                  <span className="fa fa-twitter twitter-followers__icon"></span>
                  {numberWithCommas(twitter_followers_count)}
                </span> :
                null}
              &nbsp;&nbsp;
              <a href={organization_website} target="_blank">Website</a><br />
              {/*5 of your friends follow Organization Name<br />*/}
              {/*
              <strong>2016 General Election, November 2nd</strong>
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur posuere vulputate massa ut efficitur.
              Phasellus rhoncus hendrerit ultricies. Fusce hendrerit vel elit et euismod. Etiam bibendum ultricies
              viverra. Integer ut bibendum ex. Suspendisse eleifend mi accumsan, euismod enim at, malesuada nibh.
              Duis a eros fringilla, dictum leo vitae, vulputate mi. Nunc vitae neque nec erat fermentum... (more)<br />
                <AskOrShareAction link_text={"Share Organization"} />*/}
              <br />
            </li>
          </ul>
           <ul className="list-group">
          {position_list ?
            position_list.map( item => { return <OrganizationPositionItem key={item.position_we_vote_id} position={item}/>; }) :
            <div>{LoadingWheel}</div>}
            </ul>
        </div>
          {/*<CopyLinkNavigation button_text={"Copy Link to Voter Guide"} />*/}
      </div>;
  }
}
