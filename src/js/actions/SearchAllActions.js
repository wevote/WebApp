import Dispatcher from "../dispatcher/Dispatcher";

export default {
  searchAll (textFromSearchField) {
    Dispatcher.loadEndpoint("searchAll",
      {
        textFromSearchField,
      });
  },

  exitSearch () {
    // setTimeout, as some components attempt to close the search
    // while it is already being closed
    setTimeout(() => Dispatcher.dispatch("exitSearch"), 0);
  },

  retrieveRecentSearches () {
    // Dispatcher.loadEndpoint("retrieveRecentSearches",
    //   {
    //   });
  },

  retrieveRelatedSearches () {
    // Dispatcher.loadEndpoint("retrieveRelatedSearches",
    //   {
    //   });
  },

};
