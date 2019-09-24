const searchView = {

  container: 'search',
  contain: `<div id="map" class="map"></div>

    <div id="pac-container">
      <input id="pac-input" type="text" placeholder="Enter a location">
      <a id="usar-ubicacion" href="#">usar ubicación</a>
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
      mapService.geolocalMap(map)
    });

  }
}


