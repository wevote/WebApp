import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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
    console.log('Handling enter');
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
      <div className="col-12 col-sm-6 col-md-4" key={`${teamMemberName}-${teamMemberTitle}`}>
        <Card onMouseEnter={this.handleEnterCard} onMouseLeave={this.handleLeaveCard}>
          {this.state.hover && this.state.hasDescription ? (
            <CardHover>
              {/* <FlexMobile> */}
              <ImageHover>
                <ImageHandler
                  className="img-responsive team-member__photo"
                  sizeClassName="small"
                  imageUrl={teamMemberImage}
                  alt={teamMemberName}
                />
              </ImageHover>
              <TextWrapper>
                <NameHover>{teamMemberName}</NameHover>
                <TitleHover>{teamMemberTitle[0]}</TitleHover>
              </TextWrapper>
              {/* </FlexMobile> */}
              <Divider />
              <Description>{teamMemberTitle[1]}</Description>
              {/* <MemberSubTitle></MemberSubTitle>
              <Divider></Divider>
              <MemberDescription></MemberDescription> */}
            </CardHover>
          ) : (
            <CardDefault>
              {/* <FlexMobile> */}
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
        </Card>
      </div>
    );
  }
}

const Card = styled.div`
  width: 90%;
  margin: 0 auto;
`;

const CardDefault = styled.div`
  text-align: left;
  height: 100%;
  @media (max-width: 576px) {
    padding: 16px;
    box-shadow: 1px .5px 5px 0 #cacaca;
    border-radius: 3px;
    margin: 8px 0;
    text-align: center;
  }
`;

// const FlexMobile = styled.div`
//   @media (max-width: 576px) {
//     display: flex;
//     align-items: center;
//   }
// `;

const CardHover = styled.div`
  text-align: left;
  border-radius: 3px;
  box-shadow: 1px .5px 5px 0 #cacaca;
  padding: 16px;
  margin: 8px 0;
  height: 100%;
`;

const Image = styled.div`
  width: 100%;
  > * {
    width: 100%;
  }
  @media (max-width: 576px) {
    width: 40%;
    margin: 0 auto;
    border-radius: 50%;
  }
`;

const ImageHover = styled.div`
  width: 75px;
  height: 75px;
  margin-bottom: 8px;
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
`;

const TitleHover = styled.p`
  color: #cacaca;
  font-size: 12px;
  text-align: left;
  @media (max-width: 576px) {
    font-size: 16px;
  }
`;

const TitleDefault = styled.p`
  font-size: 16px;
  color: #cacaca;
  text-align: left;
`;

const Divider = styled.div`
  height: 2px;
  background: #e3e3e3;
  width: 100%;
`;

const Description = styled.p`
  font-size: 16px;
  color: black;
`;

export default TeamMemberDisplayForList;
