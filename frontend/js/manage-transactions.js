"use strict";

/*==========================================================
ELEMENTS
==========================================================*/

const transactionTable = document.getElementById("transactionTable");

const searchInput = document.getElementById("searchTransaction");

const typeFilter = document.getElementById("typeFilter");

const statusFilter = document.getElementById("statusFilter");

const previousBtn = document.getElementById("previousPage");

const nextBtn = document.getElementById("nextPage");

const currentPageText = document.getElementById("currentPage");

const totalPagesText = document.getElementById("totalPages");

const totalTransactions = document.getElementById("totalTransactions");

const pendingTransactions = document.getElementById("pendingTransactions");

const approvedTransactions = document.getElementById("approvedTransactions");

const rejectedTransactions = document.getElementById("rejectedTransactions");

const transactionModal = document.getElementById("transactionModal");

const closeTransactionModalBtn = document.getElementById("closeTransactionModal");

let currentPage = 1;

const limit = 10;

let totalPages = 1;

let search = "";

let type = "all";

let status = "all";


/*==========================================================
LOAD TRANSACTIONS
==========================================================*/

async function loadTransactions(){

    try{

        const response = await fetch(

            `/api/admin/transactions?page=${currentPage}&limit=${limit}&search=${search}&type=${type}&status=${status}`,

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

        renderTransactions(

            result.transactions

        );

        totalTransactions.textContent = result.totalTransactions;

        pendingTransactions.textContent = result.pending;

        approvedTransactions.textContent = result.approved;

        rejectedTransactions.textContent = result.rejected;

        totalPages = result.totalPages || 1;

        currentPageText.textContent = currentPage;

        totalPagesText.textContent = totalPages;

        previousBtn.disabled = currentPage === 1;

        nextBtn.disabled = currentPage === totalPages;

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to load transactions.",

            "error"

        );

    }

}


/*==========================================================
RENDER
==========================================================*/

function renderTransactions(transactions){

    transactionTable.innerHTML = "";

    if(!transactions.length){

        transactionTable.innerHTML = `

        <tr>

            <td colspan="8">

                No transactions found.

            </td>

        </tr>

        `;

        return;

    }

    transactions.forEach(transaction=>{

        transactionTable.innerHTML += `

        <tr>

            <td>

                ${transaction.user.username}

            </td>

            <td>

                ${transaction.type}

            </td>

            <td>

                $${Number(transaction.amount).toLocaleString()}

            </td>

            <td>

                <span class="status ${transaction.status.toLowerCase()}">

                    ${transaction.status}

                </span>

            </td>

            <td>

                ${transaction.coin || "-"}

            </td>

            <td>

                ${transaction.reference}

            </td>

            <td>

                ${new Date(

                    transaction.createdAt

                ).toLocaleDateString()}

            </td>

            <td>

                <button

                    class="view-btn"

                    data-id="${transaction._id}">

                    View

                </button>

            </td>

        </tr>

        `;

    });

    initializeViewButtons();

}


/*==========================================================
VIEW TRANSACTION
==========================================================*/

async function openTransaction(id){

    try{

        const response = await fetch(

            `/api/admin/transactions/${id}`,

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

        const transaction = result.transaction;

        document.getElementById("detailUsername").textContent =
            transaction.user.username;

        document.getElementById("detailFullName").textContent =
            transaction.user.fullName;

        document.getElementById("detailEmail").textContent =
            transaction.user.email;

        document.getElementById("detailType").textContent =
            transaction.type;

        document.getElementById("detailAmount").textContent =
            "$" + Number(transaction.amount).toLocaleString();

        document.getElementById("detailStatus").textContent =
            transaction.status;

        document.getElementById("detailCoin").textContent =
            transaction.coin || "-";

        document.getElementById("detailReference").textContent =
            transaction.reference;

        document.getElementById("detailWallet").textContent =
            transaction.wallet || "-";

        document.getElementById("detailCreated").textContent =
            new Date(transaction.createdAt).toLocaleString();

        document.getElementById("detailDescription").textContent =
            transaction.description || "-";

        transactionModal.classList.remove("hidden");

    }

    catch(error){

        console.error(error);

    }

}

/*==========================================================
VIEW BUTTONS
==========================================================*/

function initializeViewButtons(){

    document.querySelectorAll(".view-btn").forEach(button=>{

        button.addEventListener(

            "click",

            ()=>{

                openTransaction(

                    button.dataset.id

                );

            }

        );

    });

}

/*==========================================================
CLOSE MODAL
==========================================================*/

closeTransactionModalBtn.addEventListener(

    "click",

    ()=>{

        transactionModal.classList.add(

            "hidden"

        );

    }

);

transactionModal.addEventListener(

    "click",

    e=>{

        if(e.target===transactionModal){

            transactionModal.classList.add(

                "hidden"

            );

        }

    }

);

/*==========================================================
SEARCH
==========================================================*/

searchInput.addEventListener(

    "input",

    ()=>{

        search = searchInput.value.trim();

        currentPage = 1;

        loadTransactions();

    }

);

/*==========================================================
TYPE FILTER
==========================================================*/

typeFilter.addEventListener(

    "change",

    ()=>{

        type = typeFilter.value;

        currentPage = 1;

        loadTransactions();

    }

);

/*==========================================================
STATUS FILTER
==========================================================*/

statusFilter.addEventListener(

    "change",

    ()=>{

        status = statusFilter.value;

        currentPage = 1;

        loadTransactions();

    }

);

/*==========================================================
PAGINATION
==========================================================*/

previousBtn.addEventListener(

    "click",

    ()=>{

        if(currentPage>1){

            currentPage--;

            loadTransactions();

        }

    }

);

nextBtn.addEventListener(

    "click",

    ()=>{

        if(currentPage<totalPages){

            currentPage++;

            loadTransactions();

        }

    }

);


/*==========================================================
INIT
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        loadTransactions();

    }

);