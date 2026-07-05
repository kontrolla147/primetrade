"use strict";

/*==========================================================
REGISTER
==========================================================*/

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const submitBtn = registerForm.querySelector("button[type='submit']");

        const data = {

            fullName: document.getElementById("fullName").value.trim(),

            username: document.getElementById("username").value.trim(),

            email: document.getElementById("email").value.trim(),

            phone: document.getElementById("phone").value.trim(),

            country: document.getElementById("country").value,

            password: document.getElementById("password").value,

            confirmPassword: document.getElementById("confirmPassword").value

        };

        /*==========================================
        REQUIRED FIELDS
        ==========================================*/

        if (

            !data.fullName ||

            !data.username ||

            !data.email ||

            !data.phone ||

            !data.country ||

            !data.password ||

            !data.confirmPassword

        ) {

            showToast("Please fill in all fields.", "error");

            return;

        }

        /*==========================================
        EMAIL VALIDATION
        ==========================================*/

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(data.email)) {

            showToast("Please enter a valid email address.", "error");

            return;

        }

        /*==========================================
        PASSWORD LENGTH
        ==========================================*/

        if (data.password.length < 5) {

    showToast("Password must be at least 5 characters.", "error");

    return;

}

        /*==========================================
        PASSWORD MATCH
        ==========================================*/

        if (data.password !== data.confirmPassword) {

            showToast("Passwords do not match.", "error");

            return;

        }

        /*==========================================
        LOADING
        ==========================================*/

        submitBtn.disabled = true;

        submitBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Creating Account...
        `;

        try {

            const response = await fetch("/api/auth/register", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(data)

            });

            const result = await response.json();

            console.log(result);

            if (!response.ok) {

                showToast(result.message || "Registration failed.", "error");

                submitBtn.disabled = false;

                submitBtn.innerHTML = "Create Account";

                return;

            }

            showToast(result.message, "success");

            setTimeout(() => {

                window.location.href = "/pages/login.html";

            }, 1500);

        }

        catch (error) {

            console.error(error);

            showToast("Unable to connect to server.", "error");

            submitBtn.disabled = false;

            submitBtn.innerHTML = "Create Account";

        }

    });

}

/*==========================================================
LOAD COUNTRIES
==========================================================*/

const countrySelect = document.getElementById("country");

if (countrySelect) {

    const countries = [

        "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
        "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia",
        "Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada",
        "Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Costa Rica","Croatia","Cuba","Cyprus",
        "Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea",
        "Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece",
        "Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran",
        "Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos",
        "Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia",
        "Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia",
        "Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger",
        "Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea",
        "Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis",
        "Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal",
        "Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa",
        "South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan",
        "Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
        "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu",
        "Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"

    ];

    countrySelect.innerHTML = `<option value="">Select Country</option>`;

    countries.sort().forEach(country => {

        const option = document.createElement("option");

        option.value = country;

        option.textContent = country;

        countrySelect.appendChild(option);

    });

}