import Dispatcher from "../dispatcher/Dispatcher";
const cookies = require("../utils/cookies");

module.exports = {
  voterSignOut: function (){
    cookies.setItem("voter_device_id", "", -1, "/");
    Dispatcher.loadEndpoint("voterSignOut", {sign_out_all_devices: false}); // signOut();
  },

  setVoterDeviceIdCookie (id){
    cookies.setItem("voter_device_id", id, Infinity, "/");
  },

  signOut: function (){
    Dispatcher.loadEndpoint("voterSignOut", {sign_out_all_devices: false});
  }
};
