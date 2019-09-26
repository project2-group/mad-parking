document.addEventListener('DOMContentLoaded', () => {
  const map = document.querySelector('#map');
  const userArea = document.querySelector('.user-area');
  const input = document.querySelector('input');
  const body = document.querySelector('body');
  const nav = document.querySelector('nav');
 
  if(userArea){
      userArea.addEventListener("click", function (e) {
              e.preventDefault();
              userArea.classList.toggle('active');
              body.classList.toggle('active');
              nav.classList.toggle('active');
              nav.classList.toggle('show');

            });
    }
    if(map){
      map.addEventListener("click", function (e) {
        e.preventDefault();
        
        if(nav.classList.contains('show')) {
          userArea.classList.remove('active');
          nav.classList.remove('show');
          body.classList.remove('active');
          nav.classList.remove('active');
        }
      });
    }

    if(input) {
      input.addEventListener("click", function (e) {
        e.preventDefault();
        
        if(nav.classList.contains('show')) {
          userArea.classList.remove('active');
          nav.classList.remove('show');
          body.classList.remove('active');
          nav.classList.remove('active');
        }
  });
}
}, false);
  

