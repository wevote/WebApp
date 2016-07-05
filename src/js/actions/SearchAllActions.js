import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {
  searchAll: function (text_from_search_field) {
    Dispatcher.loadEndpoint("searchAll", 
      { 
        text_from_search_field: text_from_search_field
      });
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
