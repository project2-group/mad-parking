document.addEventListener('DOMContentLoaded', () => {
  

    

    const goToSearchParking = (route) => restAppApi.get(route);
  
    document.getElementById("search-map").onclick = () => {
      goToSearchParking("search")
      .then(responseFromAPI => {
        // Invertir parametros
        loadView(responseFromAPI, "search");
        loadMapControllers();
        // restAppApi.get('javascripts/map.js')
        // .then(() => loadView(responseFromAPI, "search"))
        // .catch(err => console.log("Error is: ", err));
        

      })
      .catch(err => console.log("Error is: ", err));
    };

  

}, false);
