import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import _ from "lodash";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import IssueStore from "../../stores/IssueStore";
import getGroupedFilterSecondClass from "./utils/grouped-filter-second-class";

const Wrapper = styled.div`
  display: ${({ showAllFilters }) => (showAllFilters ? "flex" : "none")};
  flex-flow: column;
  padding-top: 1rem;
`;

const FilterRow = styled.div`
  display: flex;
  flex-flow: row;
`;

const FilterColumn = styled.div`
  display: flex;
  flex-flow: column;
  margin-right: 2rem;
`;

class VoterGuideOrganizationFilter extends Component {
  static propTypes = {
    allItems: PropTypes.array,
    onToggleFilter: PropTypes.func,
    onFilteredItemsChange: PropTypes.func,
    selectedFilters: PropTypes.array,
    showAllFilters: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      issues: IssueStore.getAllIssues(),
    };
  }

  componentDidUpdate (prevProps) {
    if (prevProps.selectedFilters !== this.props.selectedFilters) {
      this.props.onFilteredItemsChange(this.getNewFilteredItems());
    }
    // console.log(this.state.issues);
  }

  getFilteredItemsByLinkedIssue = (issueFilter) => {
    const { allItems } = this.props;
    return allItems.filter(item => item.issue_we_vote_ids_linked === issueFilter.issue_we_vote_id);
  }

  getNewFilteredItems = () => {
    const { allItems, selectedFilters } = this.props;
    let filteredItems = [];
    if (!selectedFilters.length) return allItems;
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case "news":
          filteredItems = [...filteredItems, ...allItems.filter(item => item.voter_guide_owner_type === "NW")];
          break;
        case "group":
          filteredItems = [...filteredItems, ...allItems.filter(item => item.voter_guide_owner_type === "G")];
          break;
        case "publicFigure":
          filteredItems = [...filteredItems, ...allItems.filter(item => item.voter_guide_owner_type === "PF")];
          break;
        case "pac":
          filteredItems = [...filteredItems, ...allItems.filter(item => item.voter_guide_owner_type === "P")];
          break;
        case "support":
          filteredItems = [...filteredItems, ...allItems.filter(item => item.is_support_or_positive_rating)];
          break;
        case "oppose":
          filteredItems = [...filteredItems, ...allItems.filter(item => item.is_oppose_or_negative_rating)];
          break;
        case "comment":
          filteredItems = [...filteredItems, ...allItems.filter(item => item.statement_text)];
          break;
        case "reach":
          if (filteredItems.length) {
            filteredItems = filteredItems.sort((firstGuide, secondGuide) => secondGuide.twitter_followers_count - firstGuide.twitter_followers_count);
          } else {
            filteredItems = allItems.sort((firstGuide, secondGuide) => secondGuide.twitter_followers_count - firstGuide.twitter_followers_count);
          }
          break;
        default:
          if (typeof filter === "object") {
            filteredItems = [...filteredItems, ...this.getFilteredItemsByLinkedIssue(filter)];
          }
          break;
      }
    });
    return _.uniqBy(filteredItems, x => x.we_vote_id);
  }

  handleChange = (name) => {
    this.props.onToggleFilter(name);
  }

  generateIssuesFilters = () => this.state.issues.slice(0, 1).map((item, itemIndex) => (
    <div
        key={item.filterName}
        className={`groupedFilter ${getGroupedFilterSecondClass(itemIndex, this.state.issues.length)} ${this.props.selectedFilters.indexOf(item.issue_we_vote_id) > -1 ? "listFilterSelected" : ""}`}
        onClick={() => this.toggleFilter(item.filterName)}
    >
      {
          item.iconName ? (
            <div>
              <ion-icon className="ion" name={item.iconName} />
            </div>
          ) : null
      }
      {
        item.filterDisplayName ? (
          <span className="listFilter__text">
            &nbsp;
            {item.filterDisplayName}
          </span>
        ) : null
      }
    </div>
  ));

  render () {
    const { showAllFilters } = this.props;

    return (
      <Wrapper showAllFilters={showAllFilters}>
        <FilterRow>
          <FilterColumn>
            <b>Sort By</b>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf("reach") > -1}
                  onChange={() => this.handleChange("reach")}
                  value="reach"
                  color="primary"
                />
              )}
              label="Reach"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf("useful") > -1}
                  onChange={() => this.handleChange("useful")}
                  value="useful"
                  color="primary"
                />
              )}
              label="Useful"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf("network") > -1}
                  onChange={() => this.handleChange("network")}
                  value="network"
                  color="primary"
                />
              )}
              label="Network"
            />
          </FilterColumn>
          <FilterColumn>
            <b>Organization</b>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf("news") > -1}
                  onChange={() => this.handleChange("news")}
                  value="news"
                  color="primary"
                />
              )}
              label="News"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf("group") > -1}
                  onChange={() => this.handleChange("group")}
                  value="group"
                  color="primary"
                />
              )}
              label="Group"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf("publicFigure") > -1}
                  onChange={() => this.handleChange("publicFigure")}
                  value="publicFigure"
                  color="primary"
                />
              )}
              label="Public Figure"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={this.props.selectedFilters.indexOf("pac") > -1}
                  onChange={() => this.handleChange("pac")}
                  value="pac"
                  color="primary"
                />
              )}
              label="PAC"
            />
          </FilterColumn>
        </FilterRow>
      </Wrapper>
    );
  }
}

export default VoterGuideOrganizationFilter;
