const searchView = {

  container: 'search',
  contain: `<div id="map" class="map"></div>

    <div id="pac-container">
      <div><input id="pac-input" type="text" placeholder="Selecciona tu ubicación">
      <a id="usar-ubicacion" href="#"><span class="icon-location"></span></a><span id="btn-search" class="icon-search"></span></div>
    </div>

    <div id="infowindow-content">
      <img src="" width="16" height="16" id="place-icon">
      <span id="place-name" class="title"></span><br>
      <span id="place-address"></span>
    </div> `,

  create: function () {

    transitionService.create(this.container, this.contain);
    const map = mapService.init();
    
    mapService.createInputSearch(map);

    const ubicationButton = document.querySelector('#usar-ubicacion');
    ubicationButton.addEventListener("click", function (e) {
      e.preventDefault();
      mapService.geolocalMap(map);
    });
<<<<<<< HEAD
=======
    

    const mainContainer = document.querySelector('.main-container');

    mainContainer.classList.add('hidden');

    const header = document.querySelector('header');

      setTimeout(function() {
        
        header.classList.add('top');

        setTimeout(function() {
          
          document.querySelector('h1').classList.remove('hidden');
          header.classList.add('top');

          document.querySelector('.user-area').classList.add('show');
        }, 30);


      }, 30);
    
    
    
>>>>>>> 53eae12f607b08ae84b1ec53d7d036f7ec4a0a92
  }
}


