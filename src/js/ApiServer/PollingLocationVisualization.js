// apis_v1/static/js/PollingLocationVisualization.js
// Draw a Google Map, and overlay it with the Map Points in polling_location_visualize.html

let map;
let state = '';
let stateHtml = '';
let googleCivicID = 0;
let infoWindow;
const markers = [];
const { $ } = window;

// https://developers.google.com/maps/documentation/javascript/tutorial
// https://developers.google.com/maps/documentation/javascript/markers
// https://developers.google.com/maps/documentation/javascript/custom-markers
// https://developers.google.com/maps/solutions/store-locator/clothing-store-locator

function createSelect () {
  const stateListString = $('#state_list').val();
  // "[('AK', 'Alaska'), ('AL', 'Alabama'), ('AR', 'Arkansas')
  const regex = /(\(.*?\))/gm;
  const matches = Array.from(stateListString.matchAll(regex));
  let selectComponent = "<span>Select a state: <select id='state_code' name='state_code'>";
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i][0];                      // "('AL', 'Alabama')"
    const matchStateCode = match.substring(2, 4);
    if (matchStateCode !== 'NA') {
      const matchStateLong = match.substring(8, match.length - 2);
      const selected = matchStateCode.toUpperCase() === state.toUpperCase() ? ' selected=\'selected\'' : '';
      selectComponent += `<option value='${matchStateCode}' ${selected} >${matchStateLong}</option>`;      // <option value='AK'>Alaska</option>
    }
  }
  selectComponent += '</select></span>';
  $(selectComponent).insertBefore('#map');

  $('select').change(() => {
    const selectedState = $('select option:selected').val();   // "PA"
    let { href } = window.location;
    const n = href.lastIndexOf('=') + 1;
    href = href.substring(0, n) + selectedState;
    window.location.href = href;
  });
}


function setStateVariable () {
  stateCodeSelector = $('#state_code');
  if (stateCodeSelector.length) {
    stateHtml = stateCodeSelector.val().toUpperCase();
  }
  if (stateHtml.length === 2) {
    state = stateHtml;
  } else {
    const regex = /state_code=(.*?)(&|$)/gm
    const match = regex.exec(window.location.href)
    const stateFromStateURL = match[1];
    state = stateFromStateURL && stateFromStateURL.length > 0 ? stateFromStateURL : 'CA';
  }
}

function createMarker (latlng, name, address, icon, showPin) {
  const html = `<b>${name}</b> <br/>${address}`;
  const marker = new google.maps.Marker({
    position: latlng,
    icon: icon,
    map,
    visible: showPin,
  });

  marker.addListener("click", () => {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

function addMarkers (resultsMap) {
  // Create markers.
  for (const [key, item] of resultsMap) {
    const { latitude, longitude, location_name: locationName, line1, city, state: resultsState, we_vote_id: weVoteId,
      id: pollingLocTableId, icon, showPin  } = item;
    let { href } = window.location;
    const offset = href.lastIndexOf('/pl/') > 0 ? href.lastIndexOf('/pl/') : href.lastIndexOf('/e/');
    const url = `${href.substring(0, offset)}/pl/${pollingLocTableId}/summary/`;
    const link = `<a href='${url}' target='_blank'>Open ${weVoteId}</a>`;
    const address = `${line1}, ${city} ${resultsState.toUpperCase()}<br/>${link}`;
    createMarker(new google.maps.LatLng(latitude, longitude), locationName, address, icon, showPin);
  }
}

// See https://developers.google.com/maps/solutions/store-locator/clothing-store-locator
// for a nicer way to do this, call it on initialization of page, instead of from
// google.maps.api inclusion.  Low priority.
window.initMap = async function () {
  alert('OK, From inside my js')
  const geoCenterLatSelector = $('#geo_center_lat');
  const geoCenterLngSelector = $('#geo_center_lng');
  const geoCenterZoomSelector = $('#geo_center_zoom');
  const geoLat = parseFloat(geoCenterLatSelector.val());
  const geoLng = parseFloat(geoCenterLngSelector.val());
  const geoZoom = parseInt(geoCenterZoomSelector.val());
  const myLatLng = { lat: geoLat, lng: geoLng };

 // Create the icons
  const iconUrlBase = $('#icon_url_base').val();
  const iconScaleBase = parseInt($('#icon_scale_base').val());
  const iconBase = {
    url: iconUrlBase,
    scaledSize: new google.maps.Size(iconScaleBase, iconScaleBase), // scaled size
  };

  if (googleCivicID === 0) {
    googleCivicID = parseInt($('#google_civic_election_id').val()) || 0;
  }

  let iconNo;
  if (googleCivicID > 0) {
    const iconUrlNo = $('#icon_url_no').val();
    const iconScaleNo = parseInt($('#icon_scale_no').val());
    iconNo = {
      url: iconUrlNo,
      scaledSize: new google.maps.Size(iconScaleNo, iconScaleNo), // scaled size
    };
  }

  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: geoZoom,
  });
  const mapdiv = $('#map');
  mapdiv.css('width', '100%');
  mapdiv.css('height', '600px');
  mapdiv.css('border', 'thin solid black');

  // When the user zooms, or moves the center of the map, update the input hidden values
  map.addListener("zoom_changed", () => {
    const newGeoCenterZoom =  map.getZoom();
    geoCenterZoomSelector.val(newGeoCenterZoom);
  });

  map.addListener("center_changed", () => {
    geoCenterLatSelector.val(map.getCenter().lat());
    geoCenterLngSelector.val(map.getCenter().lng());
  });

  infoWindow = new google.maps.InfoWindow();
  const showBasePinsSelector = $('#show_base_pins');
  const showBasePins = showBasePinsSelector.length === 0 ||  showBasePinsSelector.val().toLowerCase() === "true";
  const showNoPinsSelector = $('#show_no_pins');
  const showNoPins = showNoPinsSelector.length === 0 ||  showNoPinsSelector.val().toLowerCase() === "true";

  if (!state || state.length < 2) {     // sometimes we don't get the state var initialized at this point
    setStateVariable();
  }

  let pollingLocResults;
  const apiURL = `${window.location.origin}/apis/v1/pollingLocationsSyncOut/`;
  $.getJSON(apiURL, { state, google_civic_election_id: googleCivicID }, (results) => {
    pollingLocResults = results;
    const resultsMap = new Map();
    if ( !('success' in results) && !(results.success) ) {
      for (const pollLocObj of pollingLocResults) {
        const {we_vote_id: pollLocId} = pollLocObj;
        const icon = googleCivicID === 0 ? iconBase : iconNo;  // If all are base fill with base, if all start as exception, fill with 'no'
        resultsMap.set(pollLocId, {...pollLocObj, icon: icon, showPin: showBasePins});
      }
      if (googleCivicID === 0) {
        addMarkers(resultsMap);
      } else {
        let ballotReturnedLocResults;
        const apiURLBallot = `${window.location.origin}/apis/v1/ballotReturnedSyncOut`;
        $.getJSON(apiURLBallot, {state_code: state, google_civic_election_id: googleCivicID}, (results) => {
          ballotReturnedLocResults = results;
          for (const ballotLocObj of ballotReturnedLocResults) {
            const {polling_location_we_vote_id: ballotLocId} = ballotLocObj;
            const pollLocObj = resultsMap.get(ballotLocId);
            resultsMap.delete(ballotLocId);
            resultsMap.set(ballotLocId, {...pollLocObj, icon: iconBase, showPin: showNoPins});
          }
          addMarkers(resultsMap);
        }).fail((err) => {
          console.log('error ballotReturnedSyncOut', err);
        });
      }
    }
  });
};



$(() => {
  const theMap = $('#map');
  googleCivicID = parseInt($('#google_civic_election_id').val()) || 0;

  setStateVariable();

  const targetHeight = window.innerHeight - 150;
  theMap.css({
    width: '100%',
    height: targetHeight,
    border: 'thin solid black',
    'margin-top': '10px',
  });

  const nationalSelector = $('#is_national_election');
  if(nationalSelector.length === 0 || nationalSelector.val().toLowerCase() === "true") {
    createSelect();
  }
});
