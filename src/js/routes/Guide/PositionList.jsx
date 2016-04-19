import React, { Component, PropTypes } from "react";
import OrganizationActions from "../../actions/OrganizationActions";
import LoadingWheel from "../../components/LoadingWheel";
import OrganizationStore from "../../stores/OrganizationStore";
import OrganizationPositionItem from "../../components/VoterGuide/OrganizationPositionItem";
import SupportToggle from "../../components/SupportToggle";
import Image from "../../components/Image";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/94226088 */
function numberWithCommas (x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

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

    const {organization_twitter_handle, twitter_followers_count,
      organization_photo_url, organization_website,
      organization_name, position_list} = this.state.organization;

    return <div>
        <div className="container-fluid well well-90">
          <ul className="list-group">
            <li className="list-group-item">
              <h3>
                <SupportToggle we_vote_id={this.props.params.we_vote_id} />
                { organization_photo_url ?
                 <span>
                 <Image imageUrl={organization_photo_url} class="img-square" />
                  </span> :
                <i className="icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color"></i> }
                {organization_name}<br />{/* TODO icon-org-placeholder */}
              </h3>
              { organization_twitter_handle ?
               <span>@{organization_twitter_handle}&nbsp;&nbsp;&nbsp;</span> :
               <span></span> }
              See <a href={organization_website} target="_blank">Website</a><br />
              {/*5 of your friends follow Organization Name<br />*/}
              {numberWithCommas(twitter_followers_count)} people follow<br />
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
