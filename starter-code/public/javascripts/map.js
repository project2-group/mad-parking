window.onload = () => {
  
  // Esta constante declara el centro de madrid
  const centerPoint = {
    lat: 40.4167,
    lng: -3.70325
  };

  // Recoge el contenedor del mapa del dom y pinta un mapa dentro haciendole el zoom definido y posicionando el centro
  const mapDOM = document.getElementById("map");
  const map = new google.maps.Map(mapDOM, {
    zoom: 11,
    center: centerPoint
  });

  // Pilla tu posicion actual para centrar todo en esa posición
  const infoWindow = new google.maps.InfoWindow();

  function initMap() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
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
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  // function initMap() {
    
  //   var card = document.getElementById("pac-card");
  //   var input = document.getElementById("pac-input");

  //   map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

  //   var autocomplete = new google.maps.places.Autocomplete(input);

  //   // Bind the map's bounds (viewport) property to the autocomplete object,
  //   // so that the autocomplete requests use the current map bounds for the
  //   // bounds option in the request.
  //   autocomplete.bindTo("bounds", map);

  //   // Set the data fields to return when the user selects a place.
  //   autocomplete.setFields(["address_components", "geometry", "icon", "name"]);

  //   var infowindow = new google.maps.InfoWindow();
  //   var infowindowContent = document.getElementById("infowindow-content");
  //   infowindow.setContent(infowindowContent);
  //   var marker = new google.maps.Marker({
  //     map: map,
  //     anchorPoint: new google.maps.Point(0, -29)
  //   });

  //   autocomplete.addListener("place_changed", function() {
  //     infowindow.close();
  //     marker.setVisible(false);
  //     var place = autocomplete.getPlace();
  //     if (!place.geometry) {
  //       // User entered the name of a Place that was not suggested and
  //       // pressed the Enter key, or the Place Details request failed.
  //       window.alert("No details available for input: '" + place.name + "'");
  //       return;
  //     }

  //     // If the place has a geometry, then present it on a map.
  //     if (place.geometry.viewport) {
  //       map.fitBounds(place.geometry.viewport);
  //     } else {
  //       map.setCenter(place.geometry.location);
  //       map.setZoom(17); // Why 17? Because it looks good.
  //     }
  //     marker.setPosition(place.geometry.location);
  //     marker.setVisible(true);

  //     var address = "";
  //     if (place.address_components) {
  //       address = [
  //         (place.address_components[0] &&
  //           place.address_components[0].short_name) ||
  //           "",
  //         (place.address_components[1] &&
  //           place.address_components[1].short_name) ||
  //           "",
  //         (place.address_components[2] &&
  //           place.address_components[2].short_name) ||
  //           ""
  //       ].join(" ");
  //     }

  //     infowindowContent.children["place-icon"].src = place.icon;
  //     infowindowContent.children["place-name"].textContent = place.name;
  //     infowindowContent.children["place-address"].textContent = address;
  //     infowindow.open(map, marker);
  //   });

  //   //Sets a listener on a radio button to change the filter type on Places
  //   // Autocomplete.
  //   function setupClickListener(id, types) {
  //     var radioButton = document.getElementById(id);
  //     radioButton.addEventListener("click", function() {
  //       autocomplete.setTypes(types);
  //     });
  //   }

  //   setupClickListener("changetype-all", []);
  //   setupClickListener("changetype-address", ["address"]);
  //   setupClickListener("changetype-establishment", ["establishment"]);
  //   setupClickListener("changetype-geocode", ["geocode"]);

  //   document
  //     .getElementById("use-strict-bounds")
  //     .addEventListener("click", function() {
  //       console.log("Checkbox clicked! New state=" + this.checked);
  //       autocomplete.setOptions({ strictBounds: this.checked });
  //     });
  // }

  initMap();

  // axios.get("/").then(({ data }) => {
  //   data.forEach(parking => {
  //     new google.maps.Marker({
  //       position: {
  //         lat: parking.location.coordinates[1],
  //         lng: parking.location.coordinates[0]
  //       },
  //       title: parking.name,
  //       map
  //     });
  //   });
    
  //   initMap();
  // });
};
