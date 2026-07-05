"use strict";

/*==========================================================
ELEMENTS
==========================================================*/

const withdrawForm = document.getElementById("withdrawForm");

const amountInput = document.getElementById("amount");

const coinSelect = document.getElementById("coin");

const walletInput = document.getElementById("walletAddress");

const trackerContainer = document.getElementById(
    "withdrawTrackerContainer"
);

const historyBody = document.getElementById(
    "withdrawHistory"
);

/*==========================================================
SUBMIT WITHDRAWAL
==========================================================*/

withdrawForm.addEventListener(
    "submit",
    submitWithdrawal
);

async function submitWithdrawal(e){

    e.preventDefault();

    const submitBtn = withdrawForm.querySelector(
        ".withdraw-btn"
    );

    const data = {

        amount:Number(
            amountInput.value
        ),

        coin:coinSelect.value,

        walletAddress:walletInput.value.trim()

    };

    /*======================================================
    VALIDATION
    ======================================================*/

    if(data.amount<=0){

        showToast(
            "Please enter a valid withdrawal amount.",
            "error"
        );

        return;

    }

    if(!data.coin){

        showToast(
            "Please select a cryptocurrency.",
            "error"
        );

        return;

    }

    if(!data.walletAddress){

        showToast(
            "Please enter your wallet address.",
            "error"
        );

        return;

    }

    submitBtn.disabled = true;

    submitBtn.innerHTML = `

        <i class="fa-solid fa-spinner fa-spin"></i>

        Processing...

    `;

    try{

        const response = await fetch(

            "/api/withdrawals",

            {

                method:"POST",

                credentials:"include",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(data)

            }

        );

        const result = await response.json();

        if(!response.ok){

            showToast(
                result.message,
                "error"
            );

        }

        else{

          showToast(
    "Withdrawal request sent successfully.",
    "success"
);

            withdrawForm.reset();

            await loadWithdrawals();

        }

    }

    catch(error){

        console.error(error);

        showToast(
            "Unable to submit withdrawal.",
            "error"
        );

    }

    finally{

        submitBtn.disabled = false;

        submitBtn.innerHTML = `

            <i class="fa-solid fa-paper-plane"></i>

            Request Withdrawal

        `;

    }

}



/*==========================================================
LOAD WITHDRAWALS
==========================================================*/

async function loadWithdrawals(){

    try{

        const response = await fetch(

            "/api/withdrawals",

            {

                credentials:"include"

            }

        );

        const result = await response.json();

        if(!response.ok){

            showToast(

                result.message || "Unable to load withdrawals.",

                "error"

            );

            return;

        }

        const withdrawals = result.withdrawals || [];

        /*======================================================
        SPLIT WITHDRAWALS
        ======================================================*/

        const pendingWithdrawals = withdrawals.filter(

            withdrawal => withdrawal.status === "Pending"

        );

        const historyWithdrawals = withdrawals.filter(

            withdrawal => withdrawal.status !== "Pending"

        );

        /*======================================================
        RENDER
        ======================================================*/

        renderPendingWithdrawals(

            pendingWithdrawals

        );

      renderWithdrawalHistory(withdrawals);

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to connect to server.",

            "error"

        );

    }

}


/*==========================================================
RENDER PENDING WITHDRAWALS
==========================================================*/

function renderPendingWithdrawals(withdrawals){

    trackerContainer.innerHTML = "";

    if(!withdrawals.length){

        trackerContainer.innerHTML = `

          

        `;

        return;

    }

    withdrawals.forEach(withdraw=>{

        trackerContainer.innerHTML += `

        <div class="withdraw-tracker show">

            <div class="tracker-top">

                <div class="tracker-header">

                    <i class="fa-solid fa-money-bill-transfer"></i>

                    <div>

                        <h3>

                            Withdrawal Request

                        </h3>

                        <small>

                            ${new Date(
                                withdraw.createdAt
                            ).toLocaleString()}

                        </small>

                    </div>

                </div>

                <div class="tracker-amount">

                    $${withdraw.amount.toLocaleString()}

                </div>

            </div>

            <div class="tracker-coin">

                ${withdraw.coin}

            </div>

            <h2 class="tracker-status">

                Processing...

            </h2>

            <div class="progress-bar">

                <div

                    class="progress-fill"

                    style="width:${withdraw.progress}%">

                </div>

            </div>

            <div class="progress-footer">

                <span>

                    Progress

                </span>

                <strong>

                    ${withdraw.progress}%

                </strong>

            </div>

        </div>

        `;

    });

}

/*==========================================================
RENDER WITHDRAWAL HISTORY
==========================================================*/

function renderWithdrawalHistory(withdrawals){

    historyBody.innerHTML = "";

    if(!withdrawals.length){

        historyBody.innerHTML = `

            <tr>

                <td colspan="5" class="no-data">

                    No completed withdrawals found.

                </td>

            </tr>

        `;

        return;

    }

    withdrawals.forEach(withdraw=>{

        let badgeClass = "";

        switch(withdraw.status){

            case "Approved":

                badgeClass = "success";

            break;

            case "Rejected":

                badgeClass = "danger";

            break;

        }

        historyBody.innerHTML += `

            <tr>

                <td>

                    $${withdraw.amount.toLocaleString()}

                </td>

                <td>

                    ${withdraw.coin}

                </td>

                <td>

                    ${withdraw.walletAddress}

                </td>

                <td>

                    <span class="status ${badgeClass}">

                        ${withdraw.status}

                    </span>

                </td>

                <td>

                    ${new Date(

                        withdraw.createdAt

                    ).toLocaleString()}

                </td>

            </tr>

        `;

    });

}


/*==========================================================
AUTO REFRESH
==========================================================*/

let refreshInterval;

function startAutoRefresh(){

    if(refreshInterval){

        clearInterval(refreshInterval);

    }

    refreshInterval = setInterval(

        loadWithdrawals,

        5000

    );

}

/*==========================================================
PAGE VISIBILITY
==========================================================*/

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(document.hidden){

            clearInterval(refreshInterval);

        }

        else{

            loadWithdrawals();

            startAutoRefresh();

        }

    }

);

/*==========================================================
INIT
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        loadWithdrawals();

        startAutoRefresh();

    }

);