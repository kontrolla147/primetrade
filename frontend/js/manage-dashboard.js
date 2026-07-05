"use strict";

/*==========================================================
VERIFY ADMIN
==========================================================*/

async function verifyAdmin() {

    try {

        const response = await fetch(

            "/api/admin/verify",

            {

                credentials: "include"

            }

        );

        if (!response.ok) {

            window.location.href = "/admin/admin-control.html";

            return false;

        }

        return true;

    }

    catch (error) {

        window.location.href = "/admin/admin-control.html";

        return false;

    }

}

/*==========================================================
ELEMENTS
==========================================================*/

const searchInput = document.getElementById("searchUser");

const usersTableBody = document.getElementById("usersTableBody");

const balanceModal = document.getElementById("balanceModal");

const closeBalanceModal = document.getElementById("closeBalanceModal");

const selectedUserName = document.getElementById("selectedUserName");

const selectedUsername = document.getElementById("selectedUsername");

const selectedBalance = document.getElementById("selectedBalance");

const profitAmount = document.getElementById("profitAmount");

const bonusAmount = document.getElementById("bonusAmount");

const referralAmount = document.getElementById("referralAmount");

/*==========================================================
DATA
==========================================================*/

let users = [];

let selectedUser = null;

/*==========================================================
INIT
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        const authenticated = await verifyAdmin();

        if (!authenticated) return;

        await loadUsers();

    }

);

/*==========================================================
LOAD USERS
==========================================================*/

async function loadUsers() {

    try {

        const response = await fetch(

            "/api/admin/users",

            {

                credentials: "include"

            }

        );

        const result = await response.json();

        if (!response.ok) {

            showToast(

                result.message,

                "error"

            );

            return;

        }

        users = result.users;

        renderUsers(users);

    }

    catch (error) {

        console.error(error);

        showToast(

            "Unable to load users.",

            "error"

        );

    }

}

/*==========================================================
RENDER USERS
==========================================================*/

function renderUsers(data) {

    usersTableBody.innerHTML = "";

    if (!data.length) {

        usersTableBody.innerHTML = `

            <tr>

                <td colspan="5" class="no-users">

                    No users found.

                </td>

            </tr>

        `;

        return;

    }

    data.forEach(user => {

        usersTableBody.innerHTML += `

            <tr>

                <td>${user.fullName}</td>

                <td>${user.username}</td>

                <td>${user.email}</td>

                <td class="balance">

                    ${formatCurrency(user.balance)}

                </td>

                <td>

                    <button

                        class="manage-user"

                        data-id="${user._id}">

                        Manage

                    </button>

                </td>

            </tr>

        `;

    });

}

/*==========================================================
LIVE SEARCH
==========================================================*/

searchInput.addEventListener(

    "input",

    () => {

        const value = searchInput.value

            .trim()

            .toLowerCase();

        if (!value) {

            renderUsers(users);

            return;

        }

        const filtered = users.filter(user => {

            return (

                user.fullName

                    .toLowerCase()

                    .includes(value)

                ||

                user.username

                    .toLowerCase()

                    .includes(value)

                ||

                user.email

                    .toLowerCase()

                    .includes(value)

            );

        });

        renderUsers(filtered);

    }

);

/*==========================================================
OPEN MODAL
==========================================================*/

usersTableBody.addEventListener(

    "click",

    (event) => {

        const button =

            event.target.closest(

                ".manage-user"

            );

        if (!button) return;

        const user = users.find(

            item => item._id === button.dataset.id

        );

        if (!user) return;

        openModal(user);

    }

);

/*==========================================================
CLOSE MODAL
==========================================================*/

closeBalanceModal.addEventListener(

    "click",

    () => {

        balanceModal.classList.remove(

            "show"

        );

    }

);

balanceModal.addEventListener(

    "click",

    (event) => {

        if (

            event.target === balanceModal

        ) {

            balanceModal.classList.remove(

                "show"

            );

        }

    }

);



/*==========================================================
PROFIT BUTTONS
==========================================================*/

const addProfitBtn = document.getElementById("addProfit");

const removeProfitBtn = document.getElementById("removeProfit");

/*==========================================================
ADD PROFIT
==========================================================*/

addProfitBtn.addEventListener(

    "click",

    () => {

        submitProfit(

            "/api/admin/profit/add",

            addProfitBtn,

            "Adding..."

        );

    }

);

/*==========================================================
REMOVE PROFIT
==========================================================*/

removeProfitBtn.addEventListener(

    "click",

    () => {

        submitProfit(

            "/api/admin/profit/remove",

            removeProfitBtn,

            "Removing..."

        );

    }

);

/*==========================================================
SUBMIT PROFIT
==========================================================*/

async function submitProfit(

    endpoint,

    button,

    loadingText

){

    if(!selectedUser){

        showToast(

            "Select a user first.",

            "error"

        );

        return;

    }

    if(!profitAmount.value){

        showToast(

            "Enter a profit amount.",

            "error"

        );

        return;

    }

    try{

        startButtonLoading(

            button,

            loadingText

        );

        const response = await fetch(

            endpoint,

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                credentials:"include",

                body:JSON.stringify({

                    userId:selectedUser._id,

                    amount:Number(profitAmount.value)

                })

            }

        );

        const result = await response.json();

        stopButtonLoading(button);

        if(!response.ok){

            showToast(

                result.message,

                "error"

            );

            return;

        }

        showToast(

            result.message,

            "success"

        );
selectedUser = result.user;

updateTable(result.user);

selectedBalance.textContent =
    "Balance: " +
    formatCurrency(result.user.balance);

        profitAmount.value = "";

    }

    catch(error){

        console.error(error);

        stopButtonLoading(button);

        showToast(

            "Unable to update profit.",

            "error"

        );

    }

}


/*==========================================================
ADD BONUS
==========================================================*/

document.getElementById("addBonus").addEventListener(

    "click",

    () => {

        submitAction(

            "/api/admin/bonus/add",

            bonusAmount,

            document.getElementById("addBonus"),

            "Adding..."

        );

    }

);

/*==========================================================
REMOVE BONUS
==========================================================*/

document.getElementById("removeBonus").addEventListener(

    "click",

    () => {

        submitAction(

            "/api/admin/bonus/remove",

            bonusAmount,

            document.getElementById("removeBonus"),

            "Removing..."

        );

    }

);

/*==========================================================
ADD REFERRAL
==========================================================*/

document.getElementById("addReferral").addEventListener(

    "click",

    () => {

        submitAction(

            "/api/admin/referral/add",

            referralAmount,

            document.getElementById("addReferral"),

            "Adding..."

        );

    }

);

/*==========================================================
REMOVE REFERRAL
==========================================================*/

document.getElementById("removeReferral").addEventListener(

    "click",

    () => {

        submitAction(

            "/api/admin/referral/remove",

            referralAmount,

            document.getElementById("removeReferral"),

            "Removing..."

        );

    }

);

/*==========================================================
SUBMIT ACTION
==========================================================*/

async function submitAction(

    endpoint,

    input,

    button,

    loadingText

){

    if(!selectedUser){

        showToast(

            "Select a user first.",

            "error"

        );

        return;

    }

    if(!input.value){

        showToast(

            "Enter an amount.",

            "error"

        );

        return;

    }

    try{

        startButtonLoading(

            button,

            loadingText

        );

        const response = await fetch(

            endpoint,

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                credentials:"include",

                body:JSON.stringify({

                    userId:selectedUser._id,

                    amount:Number(input.value)

                })

            }

        );

        const result = await response.json();

        stopButtonLoading(button);

        if(!response.ok){

            showToast(

                result.message,

                "error"

            );

            return;

        }

        showToast(

            result.message,

            "success"

        );

       selectedUser = result.user;

updateTable(result.user);

selectedBalance.textContent =
    "Balance: " +
    formatCurrency(result.user.balance);                 

        input.value = "";

    }

    catch(error){

        console.error(error);

        stopButtonLoading(button);

        showToast(

            "Request failed.",

            "error"

        );

    }

}

/*==========================================================
REFRESH USERS
==========================================================*/

async function refreshUsers(){

    try{

        const response = await fetch(

            "/api/admin/users",

            {

                credentials:"include"

            }

        );

        const result = await response.json();

        if(!response.ok) return;

        users = result.users;

        renderUsers(users);

        if(selectedUser){

            const updatedUser = users.find(

                user =>

                user._id === selectedUser._id

            );

            if(updatedUser){

                selectedUser = updatedUser;

                selectedBalance.textContent =

                    "Balance: " +

                    formatCurrency(

                        updatedUser.balance

                    );

            }

        }

    }

    catch(error){

        console.error(error);

    }

}

/*==========================================================
ESC KEY CLOSE
==========================================================*/

document.addEventListener(

    "keydown",

    (event)=>{

        if(

            event.key === "Escape"

        ){

            balanceModal.classList.remove(

                "show"

            );

        }

    }

);

/*==========================================================
CLEAR MODAL
==========================================================*/

function clearModal(){

    profitAmount.value = "";

    bonusAmount.value = "";

    referralAmount.value = "";

}

/*==========================================================
CLOSE MODAL
==========================================================*/

function closeModal(){

    clearModal();

    balanceModal.classList.remove(

        "show"

    );

}

/*==========================================================
OPEN MODAL
==========================================================*/

function openModal(user){

    selectedUser = user;

    selectedUserName.textContent =

        user.fullName;

    selectedUsername.textContent =

        "@" + user.username;

    selectedBalance.textContent =

        "Balance: " +

        formatCurrency(user.balance);

    clearModal();

    balanceModal.classList.add(

        "show"

    );

}

/*==========================================================
UPDATE TABLE
==========================================================*/

function updateTable(user){

    const index = users.findIndex(

        item =>

        item._id === user._id

    );

    if(index !== -1){

        users[index] = user;

    }

    renderUsers(users);

}