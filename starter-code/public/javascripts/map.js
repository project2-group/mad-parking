window.onload = () => {
  const centerPoint = {
    lat: 40.4167,
    lng: -3.70325,
  };

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: centerPoint,
  });

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

  axios.get("/parkings").then(({ data }) => {
    data.forEach(parking => {
      new google.maps.Marker({
        position: {
          lat: parking.location.coordinates[1],
          lng: parking.location.coordinates[0]
        },
        title: parking.name,
        map
      });
    });
    initMap();
  });
};
