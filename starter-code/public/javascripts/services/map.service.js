const mapService = {

  createMap: function() {
    const centerPoint = {
      lat: 40.4167,
      lng: -3.70325
    };
    
    this.map = new google.maps.Map(document.getElementById("map"), {
      zoom: 11,
      center: centerPoint
    });
  },

  createInfoWindow: function() {
    this.infoWindow = new google.maps.InfoWindow();
  },
  setInfoWindow: function(contain, position) {
    this.infoWindow.setContent(contain);
    if(position) this.infoWindow.setPosition(position);
    
  },

  openInfoWindow: function(marker) {

    if(marker) return this.infoWindow.open(this.map, marker);
    this.infoWindow.open(this.map);
  },

  closeInfoWindow: function() {
    this.infoWindow.close();
  },

  setMapFocus: function(zoom,position) {

    if(zoom) this.map.setZoom(zoom);
    if(position) this.map.setCenter(position);      
  },

  createMarker: function() {
    return marker = new google.maps.Marker({
      map: this.map,
      anchorPoint: new google.maps.Point(0, -29)
    });
  },

  getAddress: function(addressComponents) {
    return [
      (addressComponents[0] &&
        addressComponents[0].short_name) ||
        "",
      (addressComponents[1] &&
        addressComponents[1].short_name) ||
        "",
      (addressComponents[2] &&
        addressComponents[2].short_name) ||
        ""
    ].join(" ");
  },

  geolocalMap: function() {
    if(this.infoWindow)  {
      this.closeInfoWindow();
      this.infoWindow.setContent('');

    }
    this.createInfoWindow();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          this.setInfoWindow("Location found.", pos);
          this.openInfoWindow();
          this.setMapFocus(14, pos);
          
        }.bind(this),

        function() {
          handleLocationError(true, this.map.getCenter(), this);
        }.bind(this)
      );
      
    } else {
      handleLocationError(false, this.map.getCenter(),this);
    }

    function handleLocationError(browserHasGeolocation, pos, scope) {

      scope.setInfoWindow(browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation.", pos
      );
    }
  },

  createInputSearch: function() {
    

    const card = document.getElementById("pac-card");
    const input = document.getElementById("pac-input");

    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", this.map);
    autocomplete.setFields(["address_components", "geometry", "icon", "name"]);

    if(this.infoWindow)  {
      this.closeInfoWindow();
      this.infoWindow.setContent('');
    }
    this.createInfoWindow();

    let infowindowContent = document.getElementById("infowindow-content");
    this.setInfoWindow(infowindowContent);
    
    const marker = this.createMarker();
    

    autocomplete.addListener("place_changed", function() {

    
      this.closeInfoWindow();
      
      
      marker.setVisible(false);

      const place = autocomplete.getPlace();
      if (!place.geometry) {
        // Valida si metemos info falsa en el input
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {

        this.setMapFocus(17, place.geometry.location)
        
      }
      
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);


      
      let address = '';
      
      if (place.address_components) address = this.getAddress(place.address_components);

      infowindowContent.children["place-icon"].src = place.icon;
      infowindowContent.children["place-name"].textContent = place.name;
      infowindowContent.children["place-address"].textContent = address;
      
      this.openInfoWindow(marker);
    }.bind(this));

  }

}