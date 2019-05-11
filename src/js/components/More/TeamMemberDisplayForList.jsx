import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { renderLog } from '../../utils/logging';
import ImageHandler from '../ImageHandler';

class TeamMemberDisplayForList extends Component {
  static propTypes = {
    teamMember: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      hover: null,
      hasDescription: false,
    };
    this.handleEnterCard = this.handleEnterCard.bind(this);
    this.handleLeaveCard = this.handleLeaveCard.bind(this);
    this.setDescriptionTrue = this.setDescriptionTrue.bind(this);
    this.setDescriptionFalse = this.setDescriptionFalse.bind(this);
  }

  componentDidMount () {
    if (this.props.teamMember.title[1]) {
      this.setDescriptionTrue();
    } else {
      this.setDescriptionFalse();
    }
  }

  setDescriptionTrue () {
    this.setState({ hasDescription: true });
  }

  setDescriptionFalse () {
    this.setState({ hasDescription: false });
  }

  handleEnterCard () {
    this.setState({ hover: true });
  }

  handleLeaveCard () {
    this.setState({ hover: false });
  }

  render () {
    renderLog(__filename);

    if (!this.props.teamMember) return null;

    const { image: teamMemberImage, name: teamMemberName, title: teamMemberTitle } = this.props.teamMember;

    return (
      <Col className="col-12 col-sm-6 col-md-4 mb-3" key={`${teamMemberName}-${teamMemberTitle}`}>
        <MemberContainer onMouseEnter={this.handleEnterCard} onMouseLeave={this.handleLeaveCard} onTouchStart={this.handleEnterCard} onTouchEnd={this.handleLeaveCard}>
          {this.state.hover && this.state.hasDescription ? (
            <CardHover>
              <ImageHover>
                <ImageHandler
                  className="img-responsive team-member__photo"
                  imageUrl={teamMemberImage}
                  alt={teamMemberName}
                />
              </ImageHover>
              <TextWrapper>
                <NameHover>{teamMemberName}</NameHover>
                <TitleHover>{teamMemberTitle[0]}</TitleHover>
              </TextWrapper>
              <Divider />
              <Description>{teamMemberTitle[1]}</Description>
            </CardHover>
          ) : (
            <CardDefault>
              <Image>
                <ImageHandler
                  imageUrl={teamMemberImage}
                  alt={teamMemberName}
                />
              </Image>
              <div>
                <NameDefault>{teamMemberName}</NameDefault>
                <TitleDefault>{teamMemberTitle[0]}</TitleDefault>
              </div>
              {/* </FlexMobile> */}
            </CardDefault>
          )}
        </MemberContainer>
      </Col>
    );
  }
}

const Col = styled.div`
  @media (min-width: 992px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const MemberContainer = styled.div`
  width: 90%;
  height: 100%;
  margin: 0 auto;
`;

const CardDefault = styled.div`
  text-align: left;
  height: 100%;
  @media (max-width: 576px) {
    padding: 16px;
    box-shadow: 1px .5px 5px 0 #cacaca;
    border-radius: 3px;
    text-align: center;
  }
`;

const scaleCard = keyframes`
  from {
    box-shadow: 1px .5px 5px 0 #cacaca;
  }
  to {
    box-shadow: 2px 1px 20px 5px #e1e1e1;
  }
`;

const CardHover = styled.div`
  background: white;
  margin: 0 auto;
  z-index: 999;
  text-align: center;
  border-radius: 3px;
  padding: 16px;
  box-shadow: 1px .5px 5px 0 #cacaca;
  border: 1px solid #cacaca;
  @media (min-width: 576px) {
    animation: ${scaleCard} .25s ease-out;
    animation-fill-mode: forwards;
    text-align: left;
  }
`;

const Image = styled.div`
  width: 100%;
  > * {
    width: 100%;
  }
  @media (max-width: 576px) {
    width: 40%;
    margin: 0 auto;
    > * {
      border-radius: 50%;
    }
  }
`;

const ImageHover = styled.div`
  width: 75px;
  height: 75px;
  @media (max-width: 576px) {
    margin: 0 auto;
    text-align: center;
  }
`;

const TextWrapper = styled.div`
  @media (max-width: 576px) {
    position: relative;
    bottom: 4px;
  }
`;

const NameHover = styled.h4`
  @media (max-width: 576px) {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  font-size: 16px;
  font-weight: bold;
  text-align: left;
`;

const NameDefault = styled.h3`
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin-top: 8px;
  margin-bottom: 4px;
  @media (max-width: 576px) {
    text-align: center;
  }
`;

const TitleHover = styled.p`
  color: #cacaca;
  font-size: 12px;
  text-align: left;
  @media (max-width: 576px) {
    font-size: 16px;
    text-align: center;
  }
`;

const TitleDefault = styled.p`
  font-size: 16px;
  color: #cacaca;
  text-align: left;
  @media (max-width: 576px) {
    text-align: center;
  }
`;

const Divider = styled.div`
  height: 2px;
  background: #e3e3e3;
  width: 100%;
`;

const Description = styled.p`
  font-size: 16px;
  color: black;
  margin-top: 8px;
`;

export default TeamMemberDisplayForList;
