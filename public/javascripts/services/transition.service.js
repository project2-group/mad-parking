const transitionService = {

  create: function(container, contain) {
    this.createView(container, contain);
    this.show();
  },
  createView: function (container, contain) {
    
    const body = document.querySelector('body');
    const searchContainer = document.createElement('div');

    searchContainer.classList.add(`${container}-container`);
    searchContainer.innerHTML = 
    `
    <div class="search template-animated-view">
    ${contain}
    </div>
  `;

    body.appendChild(searchContainer); 

  },

  show: function () {
    const sectionDOM = document.querySelector(`.template-animated-view`);
    setTimeout(() =>  sectionDOM.classList.add("show"), 30);
  }

}