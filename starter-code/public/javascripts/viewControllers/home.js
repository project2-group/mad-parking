document.addEventListener('DOMContentLoaded', () => {
  
  

  const goToSearchParking = (route) => restAppApi.get(route);
  
  document.getElementById("search-map").onclick = () => {
    goToSearchParking("search")
    .then(responseFromAPI => loadView(responseFromAPI, "search"))
    .catch(err => console.log("Error is: ", err));
  };

}, false);
