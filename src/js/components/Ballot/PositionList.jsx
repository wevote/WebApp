import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';
import PositionItem from './PositionItem';

export default class PositionList extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    position_list: PropTypes.array.isRequired,
    positionListExistsTitle: PropTypes.object,
    hideSimpleSupportOrOppose: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      position_list: this.props.position_list,
    };
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      position_list: nextProps.position_list,
    });
  }

  render () {
    renderLog(__filename);
    if (!this.state.position_list) {
      return null;
    }
    let showTitle = false;
    let count;
    if (this.props.hideSimpleSupportOrOppose) {
      // Only show a position if it has a comment associated with it
      for (count = 0; count < this.state.position_list.length; count++) {
        if (this.state.position_list[count].statement_text || this.state.position_list[count].has_video) {
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
            { this.state.position_list.map(onePosition => (
              <span key={onePosition.position_we_vote_id}>
                { onePosition.statement_text || onePosition.has_video ? (
                  <PositionItem
                    ballot_item_display_name={this.props.ballot_item_display_name}
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
      for (count = 0; count < this.state.position_list.length; count++) {
        showTitle = true;
      }
      return (
        <div>
          { showTitle ?
            <span>{this.props.positionListExistsTitle}</span> :
            null
        }
          <ul className="card-child__list-group">
            { this.state.position_list.map(onePosition => (
              <PositionItem
                key={onePosition.position_we_vote_id}
                ballot_item_display_name={this.props.ballot_item_display_name}
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
