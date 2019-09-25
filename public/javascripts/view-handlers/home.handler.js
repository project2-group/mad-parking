document.addEventListener('DOMContentLoaded', () => {

  const goToSearchParking = (route) => restAppApi.get(route);

  document.getElementById("search-map").onclick = () => {
    goToSearchParking("api/parkings")
      .then(responseFromAPI => {

        
        searchView.create();
        window.history.pushState("", "", `/search`);
      })
      .catch(err => console.log("Error is: ", err));
  };
}, false);
