import React from "react";
import Router from "react-router";
import ReactDOM from "react-dom";
import { createHistory } from "history";

import VoterStore from "./stores/VoterStore";
import routes from "./Root";

// polyfill
if (!Object.assign) Object.assign = React.__spread;

// wrapping for privacy
(function () {

  function handleVoterError (err) {
    console.error("Error initializing voter object", err);
  }

  function renderApp (firstVisit, voter) {
    ReactDOM.render(
      <Router history={createHistory()}>
        { routes(firstVisit, voter) }
      </Router>, document.getElementById("app")
    );
  }


  if (VoterStore.hasDeviceId() && VoterStore.hasVoterId() && VoterStore.hasLocation()) {

    VoterStore.getVoterObject( (err, voter) => { //noop - base case, all cookies are set
      if (err) handleVoterError(err);

      renderApp(false, voter);

    });

  } else if (VoterStore.hasDeviceId() && VoterStore.hasVoterId() && !VoterStore.hasLocation()) {

    VoterStore.getLocation( (err) => {
      if (err) handleVoterError(err);

      VoterStore.getVoterObject( (_err, voter) => {
        if (_err) handleVoterError(_err);

        renderApp(false, voter);

      });

    });

  } else if (VoterStore.hasDeviceId() && !VoterStore.hasVoterId() && !VoterStore.hasLocation()) {

    VoterStore.createVoter( (err) => {
      if (err) handleVoterError(err);

      VoterStore.getLocation( (error) => {
        if (error) handleVoterError(error);

        VoterStore.getVoterObject( (_err, voter) => {
          if (_err) handleVoterError(_err);

          renderApp(true, voter);

        });

      });

    });

  } else {

    VoterStore.getDeviceId( (err) => {
      if (err) handleVoterError(err);

      VoterStore.createVoter( (err) => {
        if (err) handleVoterError(err);

        VoterStore.getLocation( (err) => {
          if (err) handleVoterError(err);

          VoterStore.getVoterObject( (err, voter) => {
            if (err) handleVoterError(err);

            renderApp(true, voter)

          });

        });

      });

    });

  }

}())