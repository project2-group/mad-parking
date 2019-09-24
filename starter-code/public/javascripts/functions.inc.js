const showSection = () => {
  
  const sectionDOM = document.querySelector(`.template-animated-view`);
  setTimeout(() =>  sectionDOM.classList.add("show"), 30);
}

const loadView = (responseFromAPI, section) => {
  
  let bodyContent = responseFromAPI.data.substring(
    responseFromAPI.data.indexOf(`<section class="container-section">`) + 36,
    responseFromAPI.data.indexOf(`</section>`)
  )

  const body = document.querySelector("body");
  body.innerHTML += bodyContent;
  window.history.pushState("", "", `/${section}`);
    
  showSection();
}

