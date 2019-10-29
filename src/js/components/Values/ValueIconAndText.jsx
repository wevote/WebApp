import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactSVG from 'react-svg';
import { cordovaDot } from '../../utils/cordovaUtils';
import StickyPopover from '../Ballot/StickyPopover';

class ValueIconAndText extends Component {
  static propTypes = {
    oneIssue: PropTypes.object,
    ballotItemWeVoteId: PropTypes.string,
    subtractTotalWidth: PropTypes.func,
    issueWidths: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.valueSpan = React.createRef();
  }

  componentDidUpdate (prevProps) {
    // console.log('ValueIconAndText componentDidUpdate');
    const { oneIssue } = this.props;
    if (!prevProps.issueWidths[oneIssue.issue_we_vote_id]) {
      const width = this.valueSpan.current.offsetWidth;
      if (width > 0) {
        this.props.subtractTotalWidth(this.props.oneIssue.issue_we_vote_id, width + 25);
      }
    }
  }

  valuePopover = () => {
    const { oneIssue } = this.props;
    return (
      <PopoverWrapper>
        <PopoverHeader>
          <PopoverTitleIcon>
            <ReactSVG src={cordovaDot(`/img/global/svg-icons/issues/${oneIssue.issue_icon_local_path}.svg`)}
              svgStyle={{ fill: '#fff', padding: '1px 1px 1px 0px' }}
            />
          </PopoverTitleIcon>
          <PopoverTitleText>
            {oneIssue.issue_name}
          </PopoverTitleText>
        </PopoverHeader>
        <PopoverDescriptionText>
          {oneIssue.issue_description}
        </PopoverDescriptionText>
      </PopoverWrapper>
    );
  }

  render () {
    const { oneIssue, ballotItemWeVoteId } = this.props;
    return (
      <StickyPopover
        delay={{ show: 1000000, hide: 100 }}
        popoverComponent={this.valuePopover()}
        placement="auto"
        id="issues-popover-trigger-click-root-close"
        key={`issueByBallotItemPopover-${ballotItemWeVoteId}-${oneIssue.issue_we_vote_id}`}
        openOnClick
        showCloseIcon
      >
        <ValueIconAndTextSpan
        id={`valueIconAndText-${oneIssue.issue_we_vote_id}`}
        key={`valueIconAndTextKey-${oneIssue.issue_we_vote_id}`}
        className="u-no-break u-cursor--pointer issue-icon-list__issue-block"
        >
          {oneIssue.issue_icon_local_path ? (
            <div className="issue-icon-list__issue-icon">
              <ReactSVG src={cordovaDot(`/img/global/svg-icons/issues/${oneIssue.issue_icon_local_path}.svg`)}
                      svgStyle={{ fill: '#999', padding: '1px 1px 1px 0px' }}
              />
            </div>
          ) : null
        }
          <div className="u-margin-left--xxs issue-icon-list__issue-label-name" ref={this.valueSpan}>
            {oneIssue.issue_name}
          </div>
        </ValueIconAndTextSpan>
        {/* <ValueIconAndTextListItem
          className="u-push--sm"
          key={`issue-icon-${oneIssue.issue_we_vote_id}`}
        /> */}
      </StickyPopover>
    );
  }
}

const PopoverWrapper = styled.div`
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  position: relative;
  right: 12px;
  bottom: 8px;
  border-radius: 3px;
  margin-left: 12px;
  margin-top: 8px;
`;

const ValueIconAndTextSpan = styled.span`
  position: relative;
  width: fit-content;
  flex: none;
  padding: 4px;
`;

const PopoverHeader = styled.div`
  background: ${({ theme }) => theme.colors.brandBlue};
  padding: 4px 8px;
  height: 35px;
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 4px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`;

const PopoverTitleIcon = styled.span`
  font-weight: bold;
  font-size: 16px;
`;

const PopoverTitleText = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-left: 8px;
`;

const PopoverDescriptionText = styled.div`
  padding: 8px;
`;

export default ValueIconAndText;
