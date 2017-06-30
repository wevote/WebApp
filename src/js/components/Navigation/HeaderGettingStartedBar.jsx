import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router";
import BallotIntroFollowIssues from "../../components/Ballot/BallotIntroFollowIssues";
import BallotIntroFollowAdvisers from "../../components/Ballot/BallotIntroFollowAdvisers";
import BallotIntroPositionBar from "../../components/Ballot/BallotIntroPositionBar";
import cookies from "../../utils/cookies";
import Slider from "react-slick";

export default class HeaderGettingStartedBar extends Component {
  static propTypes = {
    voter: PropTypes.object,
    pathname: PropTypes.string
  };

  constructor (props){
    super(props);
    this.state = {
      showIssuesIntroModal: false,
    };
  }

  componentDidMount () {
      this._toggleIssuesIntroModal = this._toggleIssuesIntroModal.bind(this);
      this._nextSliderPage = this._nextSliderPage.bind(this);
  }

  componentWillUnmount (){
  }

  _toggleIssuesIntroModal () {
    this.setState({ showIssuesIntroModal: !this.state.showIssuesIntroModal });
  }

  _nextSliderPage () {
    this.refs.slider.slickNext();
  }

  render () {
    var slider_settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
      accessibility: true,
      //react-slick default left & right nav arrows
      arrows: false,
    };

    let voter_is_signed_in = this.props.voter && this.props.voter.is_signed_in;
    let voter_orientation_complete = cookies.getItem("voter_orientation_complete") || voter_is_signed_in;

    const IssuesIntroModal = <Modal bsClass="background-brand-blue modal"
                                    show={this.state.showIssuesIntroModal}
                                    onHide={()=>{this._toggleIssuesIntroModal(this);}}>
        <Modal.Body>
          <Slider dotsClass="slick-dots intro-modal__gray-dots" className="calc-height" ref="slider" {...slider_settings}>
            <div key={1}><BallotIntroFollowIssues next={this._nextSliderPage}/></div>
            <div key={2}><BallotIntroFollowAdvisers next={this._nextSliderPage}/></div>
            <div key={3}><BallotIntroPositionBar next={this._nextSliderPage}/></div>
          </Slider>
        </Modal.Body>
      </Modal>;

    return <div>
      { voter_orientation_complete ?
          <header className="page-getting-started-header">
            <div className="header-getting-started-nav">
              {/* Issues Icon & Modal */}
              <Link onClick={this._toggleIssuesIntroModal} className={ "header-getting-started-nav__item header-getting-started-nav__item--has-icon"}>
                <span title="Issues">
                  <img className="glyphicon" src="/img/global/svg-icons/issues-v1-64x42.svg" />
                </span>
                <span className="header-getting-started-nav__label">
                  Issues
                  </span>
              </Link>
            </div>
          </header> :
          null
      }
      { this.state.showIssuesIntroModal ? IssuesIntroModal : null }
    </div>;
  }
}
