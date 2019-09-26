const mapService = {
  init: function() {
    const centerPoint = {
      lat: 40.4167,
      lng: -3.70325
    };

    const madridBounds = {
      north: 40.5,
      south: 40.33,
      west: -4.0,
      east: -3.4
    };

    let map = new google.maps.Map(document.getElementById("map"), {
      zoom: 11,
      center: centerPoint,
      restriction: {
        latLngBounds: madridBounds,
        strictBounds: true
      }
    });

    return map;
  },

  drawMarkers: function(map) {
    axios.get("/api/parkingsForMarkers").then(({ data }) => {
      data.forEach(parking => {
        (marker = new google.maps.Marker({
          position: {
            lat: parking.location.coordinates[1],
            lng: parking.location.coordinates[0]
          },
          icon: `https://res.cloudinary.com/dctu91qjy/image/upload/v1569491227/Resources/parking_yzgpct.png`,
          map
        })),
          marker.addListener("click", function(position) {
            
            infoWindow = new google.maps.InfoWindow({
              position: new google.maps.LatLng(
                parking.location.coordinates[1],
                parking.location.coordinates[0]
              ),
              content: `<div> Parking ${parking.nickName} </div> <a href="http://localhost:3000/search/${parking.id_ayto}">Más información</a>`,
              pixelOffset: new google.maps.Size(0, -10),
              map
            });
            

            infoWindow.setPosition(infoWindow.position);
            infoWindow.open(map);
            map.setCenter(infoWindow.position);
            map.setZoom(14);
          
          });
      });
    });
  },

  geolocalMap: function(map) {
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support geolocation."
      );
      infoWindow.open(map);
    }

    const infoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Estás aquí");
          infoWindow.open(map);
          map.setCenter(pos);
          map.setZoom(14);
        },
        function() {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

    mapService.drawMarkers(map);
  },

  createInputSearch: function(map) {
    const card = document.getElementById("pac-card");
    const input = document.getElementById("pac-input");
    const options = {
      componentRestrictions: {
        country: "es"
      }
    };

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    const autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.bindTo("bounds", map);
    autocomplete.setFields(["address_components", "geometry", "icon", "name"]);

    const infowindow = new google.maps.InfoWindow();

    const infowindowContent = document.getElementById("infowindow-content");
    infowindow.setContent(infowindowContent);

    const marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29),
      icon: `https://res.cloudinary.com/dctu91qjy/image/upload/v1569491237/Resources/car_clj3su.png`
    });

    autocomplete.addListener("place_changed", function() {
      infowindow.close();
      marker.setVisible(false);
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(14);
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      let address = "";
      if (place.address_components) {
        address = [
          (place.address_components[0] &&
            place.address_components[0].short_name) ||
            "",
          (place.address_components[1] &&
            place.address_components[1].short_name) ||
            "",
          (place.address_components[2] &&
            place.address_components[2].short_name) ||
            ""
        ].join(" ");
      }

      infowindowContent.children["place-icon"].src = place.icon;
      infowindowContent.children["place-name"].textContent = place.name;
      infowindowContent.children["place-address"].textContent = address;
      infowindow.open(map, marker);
      mapService.drawMarkers(map);
    });
  }
};
