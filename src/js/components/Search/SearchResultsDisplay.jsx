import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router';
import { capitalizeString } from '../../utils/textFormat';
import ImageHandler from '../ImageHandler';

export default class SearchResultsDisplay extends Component {
  static propTypes = {
    searchResults: PropTypes.array.isRequired,
    selectedIndex: PropTypes.number,
    textFromSearchField: PropTypes.string.isRequired,
    onSearchElectionResultClick: PropTypes.func,
    onSearchResultMouseOver: PropTypes.func,
    onSearchResultClick: PropTypes.func,
    links: PropTypes.array,
  };

  searchHasContent () {
    return this.props.searchResults.length > 0;
  }

  render () {
    let searchResultsDisplay = null;
    const {
      links,
      searchResults,
      selectedIndex,
      textFromSearchField,
      onSearchElectionResultClick,
      onSearchResultMouseOver,
      onSearchResultClick,
    } = this.props;
    const seeAllResultsUrlString = encodeURIComponent(textFromSearchField);
    let seeMoreLink = null;

    if (textFromSearchField.length > 0) {
      seeMoreLink = <Link to={`/more/search_page/${seeAllResultsUrlString}`} className="search-container__links search-container__election-title"> See all results </Link>;
    }

    if (this.searchHasContent()) {
      searchResultsDisplay = searchResults.map((oneResult, idx) => {
        const capitalizedTitle = capitalizeString(oneResult.result_title);
        if (oneResult.kind_of_owner === 'ELECTION') {
          const searchResultClasses = classNames({
            'search-container__election_results': true,
            'search-container__election_results--highlighted': idx === selectedIndex,
            'u-flex u-align-start u-justify-between': true,
          });
          const electionDay = oneResult.result_summary.split(' ').splice(-1);
          const today = new Date();
          const electionDate = new Date(`${electionDay} 0:00:00`);
          const pastElection = today > electionDate ? ' In Past' : 'Upcoming Election';
          return (
            <Link
              key={oneResult.local_id}
              data-idx={idx}
              onFocus={onSearchResultMouseOver}
              onMouseOver={onSearchResultMouseOver}
              className="search-container__links"
              onClick={() => onSearchElectionResultClick(oneResult.google_civic_election_id)}
            >
              <div className={searchResultClasses}>
                <div className="search-container__election-title">{capitalizedTitle}</div>
                <div className="search-container__election__details u-no-break">
                  <div className="search-container__election-date">{electionDay}</div>
                  <div className="search-container__election-type">{pastElection}</div>
                </div>
              </div>
            </Link>
          );
        } else {
          const searchResultClasses = classNames({
            'search-container__results': true,
            'search-container__results--highlighted': idx === selectedIndex,
          });

          return (
            <Link
              key={oneResult.we_vote_id}
              data-idx={idx}
              to={links[idx]}
              onFocus={onSearchResultMouseOver}
              onMouseOver={onSearchResultMouseOver}
              className="search-container__links"
              onClick={onSearchResultClick}
            >
              <div className={searchResultClasses}>
                <span>
                  <ImageHandler
                    imageUrl={oneResult.result_image}
                    kind_of_ballot_item={oneResult.kind_of_owner}
                    sizeClassName="search-image "
                    className={oneResult.kind_of_owner}
                  />
                </span>
                {capitalizedTitle}
              </div>
            </Link>
          );
        }
      });
    } else if (textFromSearchField.length) {
      searchResultsDisplay = (
        <div className="search-container__results">
          <div className="search-container__election-title">
            Nothing found for &quot;
            {textFromSearchField}
            &quot;.
          </div>
        </div>
      );
    }
    return (
      <div>
        {' '}
        {searchResultsDisplay}
        {' '}
        {seeMoreLink}
        {' '}
      </div>
    );
  }
}
