import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';
import PositionItem from './PositionItem';

export default class PositionList extends Component {
  static propTypes = {
    ballotItemDisplayName: PropTypes.string.isRequired,
    incomingPositionList: PropTypes.array.isRequired,
    positionListExistsTitle: PropTypes.object,
    hideSimpleSupportOrOppose: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      positionList: [],
    };
  }

  componentDidMount () {
    this.setState({
      positionList: this.props.incomingPositionList,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      positionList: nextProps.incomingPositionList,
    });
  }

  render () {
    // console.log('PositionList render');
    renderLog(__filename);
    if (!this.state.positionList) {
      return null;
    }
    // console.log('PositionList with positionList: ', this.state.positionList);
    let showTitle = false;
    let count;
    if (this.props.hideSimpleSupportOrOppose) {
      // Only show a position if it has a comment associated with it
      for (count = 0; count < this.state.positionList.length; count++) {
        if (this.state.positionList[count].statement_text || this.state.positionList[count].has_video) {
          showTitle = true;
        }
      }
      return (
        <div>
          { showTitle ?
            <span>{this.props.positionListExistsTitle}</span> :
            null
        }
          <ul className="card-child__list-group">
            { this.state.positionList.map(onePosition => (
              <span key={`${onePosition.position_we_vote_id}-${onePosition.voter_guide_we_vote_id}-${onePosition.speaker_display_name}`}>
                { onePosition.statement_text || onePosition.has_video ? (
                  <PositionItem
                    ballotItemDisplayName={this.props.ballotItemDisplayName}
                    position={onePosition}
                  />
                ) :
                  null }
              </span>
            ))
          }
          </ul>
        </div>
      );
    } else {
      for (count = 0; count < this.state.positionList.length; count++) {
        showTitle = true;
      }
      return (
        <div>
          { showTitle ?
            <span>{this.props.positionListExistsTitle}</span> :
            null
        }
          <ul className="card-child__list-group">
            { this.state.positionList.map(onePosition => (
              <PositionItem
                key={`${onePosition.position_we_vote_id}-${onePosition.voter_guide_we_vote_id}-${onePosition.speaker_display_name}`}
                ballotItemDisplayName={this.props.ballotItemDisplayName}
                position={onePosition}
              />
            ))
          }
          </ul>
        </div>
      );
    }
  }
}
