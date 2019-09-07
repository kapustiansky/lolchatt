// Variables
let signupButton = document.getElementById('signup-button'),
    loginButton = document.getElementById('login-button'),
    userForms = document.getElementById('user_options-forms');


// Add event listener to the "Sign Up" button
signupButton.addEventListener('click', () => {
  userForms.classList.remove('login-click');
  userForms.classList.add('signup-click');
 // test
 //history.pushState(null, null, '/registration');
 //let stateObj = { foo: "registration" };
 //history.pushState(stateObj, "page 2", "registration");
}, false)


// Add event listener to the "Login" button
loginButton.addEventListener('click', () => {
  userForms.classList.remove('signup-click');
  userForms.classList.add('login-click');
 // test
 //history.pushState(null, null, '/login');
 //let stateObj = { foo: "login" };
 //history.pushState(stateObj, "page 2", "login");
}, false)

