

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
          icon: `../../images/parking.png`,
          map
        })),
          marker.addListener("click", function(position) {

            


            infoWindow = new google.maps.InfoWindow({
              position: new google.maps.LatLng(
                parking.location.coordinates[1],
                parking.location.coordinates[0]
              ),
              content: `<div> <a id="${parking.id_ayto}" data-id="${parking.id_ayto}" class="load-details" href="#">${parking.nickName} </a></div> <a data-id="${parking.id_ayto}" href="#">Más información</a>`,
              pixelOffset: new google.maps.Size(0, -10),
              map
            });
            infoWindow.setPosition(infoWindow.position);


            showDetails(parking.id_ayto, this.user);

            infoWindow.open(map);


            
            
            
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
          const marker = new google.maps.Marker({
            map,
            anchorPoint: new google.maps.Point(0, -29),
            icon: `../../images/car.png`
          });

          infoWindow.setPosition(pos);
          infoWindow.setContent("Estás aquí");
          infoWindow.open(map, marker);
          marker.setVisible(true);  
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
      icon: `../../images/car.png`
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
        map.setZoom(17);
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


function setUser(userX) {
  
  user = userX;
}


function showDetails(id, user) {

  setTimeout(() => {
    
    const title = document.getElementById(id);
    
    title.addEventListener('click', function(e, user) {
      const goToSearchParking = (route) => restAppApi.get(route);
  
      

    goToSearchParking('api/parking/' + id)
        .then(responseFromAPI => {
  
          
          if(document.querySelector('.detailsBox')) {
            
            document.querySelector('.detailsBox').remove();

          }

            const body = document.querySelector('body');

            const newDiv = document.createElement('div');
            newDiv.classList.add('detailsBox');
            console.log(responseFromAPI);
           
            console.log(user);
            let button = (user) ? `<a href="#">Añadir reseña</a>` : `<a href="auth/login">Necesario login</a>`;
              
            

            
            
            content = 
            `
              <div class="container-details">
                <div class="top-details">
                  <h3>${responseFromAPI.data[0].nickName}</h3>
                  <a target="_blank" href="https://www.google.com/maps/dir/${responseFromAPI.data[0].location.coordinates[1]},${responseFromAPI.data[0].location.coordinates[0]}/">Como llegar</a>
                  <h4>SERVICIOS</h4>

                  <h4>PLAZAS</h4>


                  <h4>TARIFAS</h4>
                </div>

                <div class="bottom-details>
                <h4>RESEÑAS</h4>
                ${button}
                </div>
              </div>
            `;

            newDiv.innerHTML = content;

            setTimeout(() => {
              newDiv.classList.add('show');
            }, 300);
            body.appendChild(newDiv);
         

          
        })
        .catch(err => console.log("Error is: ", err));
    });


  }, 1000);
 
    



  

  
}