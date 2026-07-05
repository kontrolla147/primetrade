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

const userModal = document.getElementById("userModal");

const closeUserModal = document.getElementById("closeUserModal");

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

            "/api/admin/manage-users",

            {

                credentials: "include"

            }

        );

        const result = await response.json();

        if (!response.ok) {

            showToast(result.message, "error");

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

            <td>

                <span class="status ${user.accountStatus}">

                    ${user.accountStatus}

                </span>

            </td>

            <td>

                <button

                    class="manage-btn"

                    data-id="${user._id}">

                    <i class="fa-solid fa-user-gear"></i>

                    Manage

                </button>

            </td>

        </tr>

        `;

    });

}

/*==========================================================
SEARCH
==========================================================*/

searchInput.addEventListener(

    "input",

    () => {

        const value =

            searchInput.value

            .trim()

            .toLowerCase();

        if (!value) {

            renderUsers(users);

            return;

        }

        const filtered = users.filter(user => {

            return (

                user.fullName.toLowerCase().includes(value)

                ||

                user.username.toLowerCase().includes(value)

                ||

                user.email.toLowerCase().includes(value)

            );

        });

        renderUsers(filtered);

    }

);

/*==========================================================
OPEN USER
==========================================================*/

usersTableBody.addEventListener(

    "click",

    async (event) => {

        const button = event.target.closest(".manage-btn");

        if (!button) return;

        await openUser(

            button.dataset.id

        );

    }

);

/*==========================================================
OPEN USER
==========================================================*/

async function openUser(id){

    try{

        const response = await fetch(

            "/api/admin/manage-users/" + id,

            {

                credentials:"include"

            }

        );

        const result = await response.json();

        if(!response.ok){

            showToast(

                result.message,

                "error"

            );

            return;

        }

        selectedUser = result.user;

        fillUser(result.user);

        userModal.classList.add("show");

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to load user.",

            "error"

        );

    }

}


/*==========================================================
FILL USER
==========================================================*/

function fillUser(user){

    document.getElementById("modalFullName").textContent =
        user.fullName;

    document.getElementById("modalUsername").textContent =
        "@" + user.username;

    document.getElementById("fullName").value =
        user.fullName || "";

    document.getElementById("username").value =
        user.username || "";

    document.getElementById("email").value =
        user.email || "";

    document.getElementById("phone").value =
        user.phone || "";

    document.getElementById("country").value =
        user.country || "";

    document.getElementById("btcWallet").value =
        user.customWallets?.BTC || "";

    document.getElementById("ethWallet").value =
        user.customWallets?.ETH || "";

    document.getElementById("trcWallet").value =
        user.customWallets?.USDT_TRC20 || "";

    document.getElementById("ercWallet").value =
        user.customWallets?.USDT_ERC20 || "";

    const statusButton = document.getElementById("toggleStatus");

    statusButton.textContent =

        user.accountStatus === "active"

        ? "Suspend User"

        : "Activate User";

}

/*==========================================================
SAVE USER
==========================================================*/

document.getElementById("saveUser")

.addEventListener(

    "click",

    saveUser

);

async function saveUser(){

    if(!selectedUser) return;

    const button = document.getElementById("saveUser");

    try{

        startButtonLoading(

            button,

            "Saving..."

        );

        const response = await fetch(

            "/api/admin/manage-users/" +

            selectedUser._id,

            {

                method:"PUT",

                credentials:"include",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    fullName:

                        document.getElementById("fullName").value,

                    username:

                        document.getElementById("username").value,

                    email:

                        document.getElementById("email").value,

                    phone:

                        document.getElementById("phone").value,

                    country:

                        document.getElementById("country").value

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

        await loadUsers();

        fillUser(result.user);

    }

    catch(error){

        console.error(error);

        stopButtonLoading(button);

        showToast(

            "Unable to save user.",

            "error"

        );

    }

}

/*==========================================================
CLOSE MODAL
==========================================================*/

closeUserModal.addEventListener(

    "click",

    ()=>{

        userModal.classList.remove(

            "show"

        );

    }

);

userModal.addEventListener(

    "click",

    event=>{

        if(

            event.target===userModal

        ){

            userModal.classList.remove(

                "show"

            );

        }

    }

);

document.addEventListener(

    "keydown",

    event=>{

        if(

            event.key==="Escape"

        ){

            userModal.classList.remove(

                "show"

            );

        }

    }

);


/*==========================================================
UPDATE WALLETS
==========================================================*/

document.getElementById("saveWallets")?.addEventListener(

    "click",

    updateWallets

);

async function updateWallets(){

    if(!selectedUser) return;

    const button = document.getElementById("saveWallets");

    try{

        startButtonLoading(button,"Saving...");

        const response = await fetch(

            `/api/admin/manage-users/${selectedUser._id}/wallets`,

            {

                method:"PUT",

                credentials:"include",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    BTC:document.getElementById("btcWallet").value,

                    ETH:document.getElementById("ethWallet").value,

                    USDT_TRC20:document.getElementById("trcWallet").value,

                    USDT_ERC20:document.getElementById("ercWallet").value

                })

            }

        );

        const result = await response.json();

        stopButtonLoading(button);

        if(!response.ok){

            showToast(result.message,"error");

            return;

        }

        selectedUser=result.user;

        showToast(result.message,"success");

    }

    catch(error){

        console.error(error);

        stopButtonLoading(button);

        showToast("Unable to update wallets.","error");

    }

}

/*==========================================================
SUSPEND / ACTIVATE
==========================================================*/

document.getElementById("toggleStatus")

.addEventListener(

    "click",

    async()=>{

        if(!selectedUser) return;

        const response = await fetch(

            `/api/admin/manage-users/${selectedUser._id}/status`,

            {

                method:"PATCH",

                credentials:"include"

            }

        );

        const result = await response.json();

        if(!response.ok){

            showToast(result.message,"error");

            return;

        }

        selectedUser=result.user;

        fillUser(result.user);

        await loadUsers();

        showToast(result.message,"success");

    }

);

/*==========================================================
APPROVE KYC
==========================================================*/

document.getElementById("approveKyc")

.addEventListener(

    "click",

    async()=>{

        if(!selectedUser) return;

        const response = await fetch(

            `/api/admin/manage-users/${selectedUser._id}/kyc/approve`,

            {

                method:"PATCH",

                credentials:"include"

            }

        );

        const result = await response.json();

        if(!response.ok){

            showToast(result.message,"error");

            return;

        }

        selectedUser=result.user;

        showToast(result.message,"success");

    }

);

/*==========================================================
REJECT KYC
==========================================================*/

document.getElementById("rejectKyc")

.addEventListener(

    "click",

    async()=>{

        if(!selectedUser) return;

        const response = await fetch(

            `/api/admin/manage-users/${selectedUser._id}/kyc/reject`,

            {

                method:"PATCH",

                credentials:"include"

            }

        );

        const result = await response.json();

        if(!response.ok){

            showToast(result.message,"error");

            return;

        }

        selectedUser=result.user;

        showToast(result.message,"success");

    }

);

/*==========================================================
DELETE USER
==========================================================*/

document.getElementById("deleteUser")

.addEventListener(

    "click",

    async()=>{

        if(!selectedUser) return;

        if(!confirm("Delete this user permanently?")){

            return;

        }

        const response = await fetch(

            `/api/admin/manage-users/${selectedUser._id}`,

            {

                method:"DELETE",

                credentials:"include"

            }

        );

        const result = await response.json();

        if(!response.ok){

            showToast(result.message,"error");

            return;

        }

        showToast(result.message,"success");

        userModal.classList.remove("show");

        await loadUsers();

    }

);

/*==========================================================
LOGIN AS USER
==========================================================*/

document.getElementById("loginAsUser")

.addEventListener(

    "click",

    async()=>{

        if(!selectedUser) return;

        const response = await fetch(

            `/api/admin/manage-users/${selectedUser._id}/login-as`,

            {

                method:"POST",

                credentials:"include"

            }

        );

        const result = await response.json();

        if(!response.ok){

            showToast(result.message,"error");

            return;

        }

        window.location.href=result.redirect;

    }

);