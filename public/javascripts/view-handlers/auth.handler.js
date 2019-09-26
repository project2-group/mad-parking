document.addEventListener('DOMContentLoaded', () => {
  
  const loginBtn = document.querySelector('.loginBtn');
  const signBtn = document.querySelector('.signBtn');
  const container = document.querySelector('.main-container');

  if(loginBtn) {

  container.addEventListener('click', function(e) {
    const loginBox = document.querySelector('.pop-up');

    if(loginBox && loginBox.getBoundingClientRect().y < 715) {
      
      loginBox.classList.remove('show');

      setTimeout(function() {
      
        loginBox.remove();
      }, 40);
    } 
    
  });
  
  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const loginBox = document.querySelector('.pop-up');

    if(loginBox) return false;
    const body = document.querySelector('body');

    const div = document.createElement('div');

    div.classList.add('pop-up');
    

    
    loginForm =
    `
    <h2>Login</h2>

<form action="/auth/login" method="POST" id="form-container">
  <label for="username">Username</label>
  <input id="username" type="text" name="username" placeholder="JonSnow">

  <br><br>

  <label for="password">Password</label>
  <input id="password" type="password" name="password" placeholder="Your password">
  <br>
  
    <div class="error-message"></div>
  

  <br><br>

  <button>Login</button>

  <div style="clear:both; margin-bottom: 20px;"></div>
<a href="/auth/google/" class="social-login white" ><span>Log in with Google</span></a>



  <p class="account-message">
    ¿No tienes cuenta?
    <a href="/auth/signup">Signup</a>
  </p>
</form>
    `;

    div.innerHTML = loginForm;
    body.appendChild(div);

    
    setTimeout(function() {
      
      div.classList.add('show');
    }, 40);
    

    
  });

}

if(signBtn) {
  signBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const signBox = document.querySelector('.pop-up');

    if(signBox) return false;
    const body = document.querySelector('body');

    const div = document.createElement('div');

    div.classList.add('pop-up');
    div.classList.add('signFormBox');
    
    

    
    signForm =
    `
    <h2>Signup</h2>

<form action="/auth/signup" method="POST" enctype="multipart/form-data">
  
  <div class="form-field">
    <label for="email">Email</label>
    <input id="email" type="email" name="email" placeholder="Your email">
  </div>

  <div class="form-field">
    <label for="username">Username</label>
    <input id="username" type="text" name="username" placeholder="Username">
  </div>

  <div class="form-field">
    <label for="user-photo">Photo</label>
    <input type="file" name="userPhoto" id="user-photo" style="border: 0; position: relative; font-size: 14px;right: 40px;">
    
    </div>

  <div class="form-field">
    <label for="password">Password</label>
    <input id="password" type="password" name="password" placeholder="Password">
  </div>
  

    <div class="error-message"></div>
 

  <br><br>

  <button style="position:relative; top: -30px;">Create account</button>
  
</form>

    `;

    div.innerHTML = signForm;
    body.appendChild(div);

    
    setTimeout(function() {
      
      div.classList.add('show');
    }, 40);
    

    
  });
  
}
}, false);
  

