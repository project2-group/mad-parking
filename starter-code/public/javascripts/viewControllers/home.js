document.addEventListener('DOMContentLoaded', () => {
  
  const goToSearchParking = (route) => restAppApi.get(route);
  
  document.getElementById("search-map").onclick = () => {
    goToSearchParking("test")
    .then(responseFromAPI => loadView(responseFromAPI, "test"))
    .catch(err => console.log("Error is: ", err));
  };

}, false);
