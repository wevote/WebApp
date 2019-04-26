import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';
import ImageHandler from '../ImageHandler';

export default class TeamMemberDisplayForList extends Component {
  static propTypes = {
    teamMember: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    renderLog(__filename);

    if (!this.props.teamMember) return null;

    const { image: teamMemberImage, name: teamMemberName, title: teamMemberTitle } = this.props.teamMember;

    return (
      <div className="col-4 col-sm-3" key={`${teamMemberName}-${teamMemberTitle}`}>
        <div className="team-member">
          <ImageHandler
            className="img-responsive team-member__photo"
            imageUrl={teamMemberImage}
            alt={teamMemberName}
          />
          <div className="media-body">
            <h4 className="team-member__name"><strong>{teamMemberName}</strong></h4>
            <p className="team-member__title">{teamMemberTitle[0]}</p>
            {/* Move to rollover: <p className="xx-small d-none d-sm-block">{teamMemberTitle[1]}</p> */}
          </div>
        </div>
      </div>
    );
  }
}
