import Dispatcher from "../dispatcher/Dispatcher";
const cookies = require("../utils/cookies");

module.exports = {
  voterSignOut: function (){
    Dispatcher.loadEndpoint("voterSignOut", {sign_out_all_devices: false});
    cookies.setItem("voter_device_id", "", -1, "/");
    cookies.setItem("voter_orientation_complete", "", -1, "/");
  },

  setVoterDeviceIdCookie (id){
    cookies.setItem("voter_device_id", id, Infinity, "/");
  },
};
