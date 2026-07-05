"use strict";

/*==========================================================
AUTH UI
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*==========================================
    SHOW / HIDE PASSWORD
    ==========================================*/

    const toggles = document.querySelectorAll(".toggle-password");

    toggles.forEach(toggle => {

        toggle.addEventListener("click", () => {

            const input = toggle.previousElementSibling;

            const icon = toggle.querySelector("i");

            if (input.type === "password") {

                input.type = "text";

                icon.classList.remove("fa-eye");

                icon.classList.add("fa-eye-slash");

            } else {

                input.type = "password";

                icon.classList.remove("fa-eye-slash");

                icon.classList.add("fa-eye");

            }

        });

    });

    /*==========================================
    INPUT ANIMATION
    ==========================================*/

    const inputs = document.querySelectorAll("input, select");

    inputs.forEach(input => {

        input.addEventListener("focus", () => {

            input.parentElement.classList.add("active");

        });

        input.addEventListener("blur", () => {

            if (input.value === "") {

                input.parentElement.classList.remove("active");

            }

        });

    });

});

/*==========================================================
PASSWORD MATCH
==========================================================*/

const password = document.getElementById("password");

const confirmPassword = document.getElementById("confirmPassword");

if(password && confirmPassword){

    const message = document.createElement("small");

    message.id = "passwordMessage";

    confirmPassword.parentElement.parentElement.appendChild(message);

    function checkPassword(){

        if(confirmPassword.value === ""){

            message.textContent = "";

            confirmPassword.style.borderColor = "";

            return;

        }

        if(password.value === confirmPassword.value){

            message.textContent = "✓ Passwords match";

            message.style.color = "#22c55e";

            confirmPassword.style.border = "1px solid #22c55e";

        }

        else{

            message.textContent = "✕ Passwords do not match";

            message.style.color = "#ef4444";

            confirmPassword.style.border = "1px solid #ef4444";

        }

    }

    password.addEventListener("input",checkPassword);

    confirmPassword.addEventListener("input",checkPassword);

}