// Note 12/2/25, this relies on unreleased features "from the alpha stream"
// https://github.com/visgl/react-google-maps/discussions/707

/*
December 2025: This console log warning does not stop operation with GOOGLE_MAPS_API_KEY that were setup prior to this notice.
console log: As of March 1st, 2025, google.maps.places.Autocomplete is not available to new customers.
Please use google.maps.places.PlaceAutocompleteElement instead. At this time,
google.maps.places.Autocomplete is not scheduled to be discontinued, but
google.maps.places.PlaceAutocompleteElement is recommended over google.maps.places.Autocomplete.
While google.maps.places.Autocomplete will continue to receive bug fixes for any major regressions,
existing bugs in google.maps.places.Autocomplete will not be addressed.
At least 12 months notice will be given before support is discontinued.
Please see https://developers.google.com/maps/legacy for additional details and https://developers.google.com/maps/documentation/javascript/places-migration-overview for the migration guide.
*/
import { APIProvider } from '@vis.gl/react-google-maps';
import React, { useEffect, useRef } from 'react';
import webAppConfig from '../../config';

const ReactNewPlacesAutocomplete = () => {
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (window.google && mapRef.current) {
      // Initialize the map
      // const map = new window.google.maps.Map(mapRef.current, {
      //   center: { lat: -34.397, lng: 150.644 },
      //   zoom: 8,
      // });

      // Initialize the PlaceAutocompleteElement
      const placeAutocomplete = new window.google.maps.places.PlaceAutocompleteElement();
      autocompleteRef.current.appendChild(placeAutocomplete);

      // Add listener for place selection
      placeAutocomplete.addListener('place_changed', () => {
        const place = placeAutocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          // map.setCenter(place.geometry.location);
          // You can also add a marker or display place details here
        }
      });
    }
  }, []);

  return (
    <APIProvider apiKey={webAppConfig.GOOGLE_MAPS_API_KEY} libraries={['places']}>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }}>&nbsp;</div>
      {/* This div will host the autocomplete element */}
      <div ref={autocompleteRef}>&nbsp;</div>
    </APIProvider>
  );
};

export default ReactNewPlacesAutocomplete;
