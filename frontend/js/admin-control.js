"use strict";


/*==========================================================
RESET LOGIN BUTTON
==========================================================*/

function resetLoginButton(){

    loginBtn.disabled = false;

    loginBtn.innerHTML = `

        <i class="fa-solid fa-shield-halved"></i>

        Secure Login

    `;

}

/*==========================================================
ELEMENTS
==========================================================*/
/*==========================================================
LOGIN MESSAGE
==========================================================*/

function showLoginMessage(message,type){

    loginMessage.textContent = message;

    loginMessage.className = `login-message ${type} show`;

}

function hideLoginMessage(){

    loginMessage.className = "login-message";

    loginMessage.textContent = "";

}

const loginMessage = document.getElementById("loginMessage");
const loginForm = document.getElementById("adminLoginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

const loginBtn = document.getElementById("loginBtn");

/*==========================================================
SHOW / HIDE PASSWORD
==========================================================*/

togglePassword.addEventListener("click",()=>{

    if(passwordInput.type==="password"){

        passwordInput.type="text";

        togglePassword.innerHTML=

        '<i class="fa-regular fa-eye-slash"></i>';

    }

    else{

        passwordInput.type="password";

        togglePassword.innerHTML=

        '<i class="fa-regular fa-eye"></i>';

    }

});

/*==========================================================
LOGIN
==========================================================*/

loginForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    const email = emailInput.value.trim();

    const password = passwordInput.value;

    if(!email || !password){

        showMessage(

            "Please fill in all fields.",

            "error"

        );

        return;

    }

    loginBtn.disabled = true;

    loginBtn.innerHTML =

    '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';

    try{

        const response = await fetch(

            "/api/admin/login",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                credentials:"include",

                body:JSON.stringify({

                    email,

                    password

                })

            }

        );

        const result = await response.json();

        if(!response.ok){

            showMessage(

                result.message,

                "error"

            );

            loginBtn.disabled = false;

            loginBtn.innerHTML =

            '<i class="fa-solid fa-shield-halved"></i> Secure Login';

            return;

        }

        showMessage(

            "Login successful.",

            "success"

        );

        setTimeout(()=>{

            window.location.href=

            "/admin/manage-dashboard.html";

        },800);

    }

    catch(error){

        console.error(error);

        showMessage(

            "Unable to login.",

            "error"

        );

       resetLoginButton();
    }

});

/*==========================================================
MESSAGE
==========================================================*/

function showMessage(message,type){

    showLoginMessage(message,type);

}