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
      },
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });

    return map;
  },

  drawMarkers: function(map) {
    axios.get("/api/parkingsForMarkers").then(({ data }) => {
      var icons = {
        true: {
          icon:
            "https://res.cloudinary.com/dctu91qjy/image/upload/v1569514586/Resources/markerP_h2bo9l.png"
        },
        false: {
          icon:
            "https://res.cloudinary.com/dctu91qjy/image/upload/v1569514574/Resources/plogorojo_dgdnod.png"
        }
      };

      data.forEach(parking => {
        (marker = new google.maps.Marker({
          position: {
            lat: parking.location.coordinates[1],
            lng: parking.location.coordinates[0]
          },
          icon: icons[parking.availableParking].icon,
          map
        })),
          marker.addListener("click", function(position) {

            if (document.querySelectorAll(".gm-style-iw-a"))
              document
                .querySelectorAll(".gm-style-iw-a")
                .forEach(val => val.remove());

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

    const infoWindow = new google.maps.InfoWindow({
      pixelOffset: new google.maps.Size(0, -30)
    });

    const marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29),
      icon: `https://res.cloudinary.com/dctu91qjy/image/upload/v1569491237/Resources/car_clj3su.png`
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          marker.setPosition(pos);
          marker.setVisible(true);

          infoWindow.setPosition(pos);
          infoWindow.setContent("Estás aquí");
          infoWindow.open(map);

          map.panTo(pos);
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
        map.panTo(place.geometry.location);
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
  },

  // drawFavorites: function(map) {
  //   axios.get("/").then(({ data }) => {
  //     data.forEach(parking => {
  //       (marker = new google.maps.Marker({
  //         position: {
  //           lat: parking.location.coordinates[1],
  //           lng: parking.location.coordinates[0]
  //         },
  //         icon:
  //           "https://res.cloudinary.com/dctu91qjy/image/upload/v1569514586/Resources/markerP_h2bo9l.png",
  //         map
  //       })),
  //         marker.addListener("click", function(position) {
  //           if (document.querySelectorAll(".gm-style-iw-a"))
  //             document
  //               .querySelectorAll(".gm-style-iw-a")
  //               .forEach(val => val.remove());
  //           infoWindow = new google.maps.InfoWindow({
  //             position: new google.maps.LatLng(
  //               parking.location.coordinates[1],
  //               parking.location.coordinates[0]
  //             ),
  //             content: `<div> Parking ${parking.nickName} </div> <a href="http://localhost:3000/search/${parking.id_ayto}">Más información</a>`,
  //             pixelOffset: new google.maps.Size(0, -10),
  //             map
  //           });

  //           infoWindow.setPosition(infoWindow.position);
  //           infoWindow.open(map);
  //           map.setCenter(infoWindow.position);
  //           map.setZoom(14);
  //         });
  //     });
  //   });
  // }
};




function showDetails(id) {

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
           
            
            const socialSite = document.querySelector('.socialSite');
            let button = (socialSite) ? `<a href="/api/parking/add-review/${id}">Añadir reseña</a><br>` : `<a href="auth/login">Necesario login</a>`;
              



            let rates = '';

            let avg = responseFromAPI.data[0].assessmentAverage;

           
            
            function isInt(n){
              return Number(n) === n && n % 1 === 0;
            }
            
            function isFloat(n){
                return Number(n) === n && n % 1 !== 0;
            }

            let avgTipo = "int";
            if(isFloat(avg)) avgTipo = "float";

            
           
            

            

            switch(avg) {

              case 0:
                rates = `
                <span class="icon-star-empty"></span>
                <span class="icon-star-empty"></span>
                <span class="icon-star-empty"></span>
                <span class="icon-star-empty"></span>
                <span class="icon-star-empty"></span>
                `; 
              break;
              case 0.5:
                  rates = `
                  <span class="icon-star-half1"></span>
                  <span class="icon-star-empty"></span>
                  <span class="icon-star-empty"></span>
                  <span class="icon-star-empty"></span>
                  <span class="icon-star-empty"></span>
                  `; 
              break;
              case 1:
                  rates = `
                  <span class="icon-star-full"></span>
                  <span class="icon-star-empty"></span>
                  <span class="icon-star-empty"></span>
                  <span class="icon-star-empty"></span>
                  <span class="icon-star-empty"></span>
                  `; 
              break;
              case 1.5:
                  rates = `
                  <span class="icon-star-full"></span>
                  <span class="icon-star-half1"></span>
                  <span class="icon-star-empty"></span>
                  <span class="icon-star-empty"></span>
                  <span class="icon-star-empty"></span>
                  `; 
              break;
              case 2:
                  rates = `
                  <span class="icon-star-full"></span>
                  <span class="icon-star-full"></span>
                  <span class="icon-star-empty"></span>
                  <span class="icon-star-empty"></span>
                  <span class="icon-star-empty"></span>
                  `; 
              break;
              case 2.5:
                  rates = `
                  <span class="icon-star-full"></span>
                  <span class="icon-star-full"></span>
                  <span class="icon-star-half1"></span>
                  <span class="icon-star-empty"></span>
                  <span class="icon-star-empty"></span>
                  `; 
              break;
              case 3:
                  rates = `
                  <span class="icon-star-full"></span>
                  <span class="icon-star-full"></span>
                  <span class="icon-star-full"></span>
                  <span class="icon-star-empty"></span>
                  <span class="icon-star-empty"></span>
                  `; 
              break;
              case 3.5:
                  rates = `
                  <span class="icon-star-full"></span>
                  <span class="icon-star-full"></span>
                  <span class="icon-star-full"></span>
                  <span class="icon-star-half1"></span>
                  <span class="icon-star-empty"></span>
                  `; 
              break;
              case 4:
                  rates = `
                  <span class="icon-star-full"></span>
                  <span class="icon-star-full"></span>
                  <span class="icon-star-full"></span>
                  <span class="icon-star-full"></span>
                  <span class="icon-star-empty"></span>
                  `; 
              break;
              case 4.5:
                  rates = `
                  <span class="icon-star-full"></span>
                  <span class="icon-star-full"></span>
                  <span class="icon-star-full"></span>
                  <span class="icon-star-full"></span>
                  <span class="icon-star-half1"></span>
                  `;
              break;
              case 5:
                  rates = `
                  <span style="icon-star-full"></span>
                  <span style="icon-star-full"></span>
                  <span style="icon-star-full"></span>
                  <span style="icon-star-full"></span>
                  <span style="icon-star-full"></span>
                  `;
              break;

            }

        
            let service = '';

            if(responseFromAPI.data[0].additionalServices.adaptedBathroom) {
              service += '<span  class="icon-wheelchair"></span>';
            }
            if(responseFromAPI.data[0].additionalServices.automatedPayment) {
              service += '<span class="icon-credit-card"></span>';
            }
            if(responseFromAPI.data[0].additionalServices.bathroom) {
              service += '<span class="icon-wc"></span>';
            }
            if(responseFromAPI.data[0].additionalServices.camera) {
              service += '<span class="icon-video-camera"></span>';
            }
            if(responseFromAPI.data[0].additionalServices.carWash) {
              service += '<span class="icon-local_car_wash"></span>';
            }
            if(responseFromAPI.data[0].additionalServices.cashier) {
              service += '<span class="icon-cashier-machine-profile"></span>';
            }
            if(responseFromAPI.data[0].additionalServices.elevator) {
              service += '<span class="icon-elevator1"></span>';
            }
            if(responseFromAPI.data[0].additionalServices.info) {
              service += '<span class="icon-info"></span>';
            }
           

            let typePay = '';

            if(responseFromAPI.data[0].paymentType.card) {
              typePay += '<span class="icon-credit-card"></span>';
            }
            if(responseFromAPI.data[0].paymentType.cash) {
              typePay += '<span class="icon-coins"></span>';
            }
            if(responseFromAPI.data[0].paymentType.mobile) {
              typePay += '<span class="icon-phone"></span>';
            }
            
            
            let places = '';

            if(responseFromAPI.data[0].parkingType[0].pmr) {
              places += '<span class="icon-wheelchair"></span>';
            }
            if(responseFromAPI.data[0].parkingType[0].electric) {
              places += '<span class="icon-electric-car"></span>';
            }
            if(responseFromAPI.data[0].parkingType[0].motorbike) {
              places += '<span class="icon-motorbike"></span>';
            }
            if(responseFromAPI.data[0].parkingType[0].bike) {
              places += '<span class="icon-directions_bike"></span>';
            }
            


            let reviews;



            responseFromAPI.data[0].comments.forEach(val => {

              reviews += `<h4 class="autorname">${val.authorID[0].username}</h4>
                <p class="text-review">${val.text}</p> <hr>`;
              });
          
              
            
            content = 
            `
              <div class="container-details">
                <div class="top-details">
                  <h3>${responseFromAPI.data[0].nickName}</h3>
                  <p>${rates}</p>
                  <a target="_blank" href="https://www.google.com/maps/dir/${responseFromAPI.data[0].location.coordinates[1]},${responseFromAPI.data[0].location.coordinates[0]}/">Como llegar</a>
                  <div style="clear: both;">
                  <h4>SERVICIOS</h4>
                  <p class="icons">${service}</p>
                  <h4>PLAZAS</h4> 
                  <p class="icons">${places}</p>
                  <h4>PAGO</h4>
                  <p class="icons">${typePay}</p> 
                </div>
                <div class="bottom-details">
                <h4>RESEÑAS</h4>
               
                ${button}
                <div style="clear: both;">
                    <div class="reviews-tpm">
                     ${reviews}
                    </div>
                </div>



              </div>
              
            `;
            
            content = content.replace('undefined', '');
            newDiv.innerHTML = content;
            

        
            setTimeout(() => {
              newDiv.classList.add('show');
              const addFav = document.querySelector('.add-fav');


              if(document.getElementById("search-map")) {
                const goAddFavorites = (route) => restAppApi.post(route);
                
              
                addFav.onclick = () => {
                  goAddFavorites("api/parking/add-favorite")
                    .then(() => {
                      document.querySelector('.addFavorite').classList.add('icon-star-full');
                      document.querySelector('.addFavorite').classList.add('icon-star-empty');
                    })
                    .catch(err => console.log("Error is: ", err));
                };
              }


            }, 300);
            body.appendChild(newDiv);
         

          setTimeout(() => {
            newDiv.classList.add("show");
          }, 300);
          body.appendChild(newDiv);
        })
        .catch(err => console.log("Error is: ", err));
    });


  }, 1000);

}

