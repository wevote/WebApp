import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  searchAll: function (text_from_search_field) {
    Dispatcher.loadEndpoint("searchAll",
      {
        text_from_search_field: text_from_search_field
      });
  },

  exitSearch: function () {
    // setTimeout, as some components attempt to close the search
    // while it is already being closed
    setTimeout(() => Dispatcher.dispatch("exitSearch"), 0);
  },

  retrieveRecentSearches: function () {
    // Dispatcher.loadEndpoint("retrieveRecentSearches",
    //   {
    //   });
  },

  retrieveRelatedSearches: function () {
    // Dispatcher.loadEndpoint("retrieveRelatedSearches",
    //   {
    //   });
  },

};
