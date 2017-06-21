import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  issuesRetrieve: function (){
    Dispatcher.loadEndpoint("issuesRetrieve");
  },

  issueFollow: function (issue_we_vote_id) {
    console.log("User follows issue " + issue_we_vote_id);
    Dispatcher.loadEndpoint("issueFollow", {issue_we_vote_id: issue_we_vote_id, follow: true, ignore: false} );
  },

  issueUnFollow: function (issue_we_vote_id) {
    console.log("User Unfollows issue " + issue_we_vote_id);
    Dispatcher.loadEndpoint("issueFollow", {issue_we_vote_id: issue_we_vote_id, follow: false, ignore: false} );
  },
};
