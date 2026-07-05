"use strict";

/*==========================================================
VERIFY ADMIN
==========================================================*/

async function verifyAdmin() {

    try {

        const response = await fetch(

            "/api/admin/verify",

            {

                credentials:"include"

            }

        );

        if(!response.ok){

            window.location.href="/admin/admin-control.html";

            return false;

        }

        return true;

    }

    catch(error){

        window.location.href="/admin/admin-control.html";

        return false;

    }

}

/*==========================================================
ELEMENTS
==========================================================*/

const searchInput=document.getElementById("searchDeposit");

const depositGrid=document.getElementById("depositGrid");

let deposits=[];

/*==========================================================
INIT
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        const authenticated=

        await verifyAdmin();

        if(!authenticated) return;

        await loadDeposits();

    }

);

/*==========================================================
LOAD DEPOSITS
==========================================================*/

async function loadDeposits(){

    try{

        const response=await fetch(

            "/api/admin/deposits",

            {

                credentials:"include"

            }

        );

        const result=

        await response.json();

        if(!response.ok){

            showToast(

                result.message,

                "error"

            );

            return;

        }

        deposits=result.deposits;

        renderDeposits(deposits);

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to load deposits.",

            "error"

        );

    }

}

/*==========================================================
RENDER DEPOSITS
==========================================================*/

function renderDeposits(data){

    depositGrid.innerHTML="";

    if(!data.length){

        depositGrid.innerHTML=`

        <div class="no-data">

            <i class="fa-solid fa-wallet"></i>

            <h3>No Deposits Found</h3>

        </div>

        `;

        return;

    }

    data.forEach(deposit=>{

        let actionButtons="";

        if(deposit.status==="Pending"){

            actionButtons=`

            <div class="deposit-actions">

                <button

                    class="approve-btn"

                    data-id="${deposit._id}">

                    <i class="fa-solid fa-check"></i>

                    Approve

                </button>

                <button

                    class="reject-btn"

                    data-id="${deposit._id}">

                    <i class="fa-solid fa-xmark"></i>

                    Reject

                </button>

            </div>

            `;

        }

        if(deposit.status==="Approved"){

            actionButtons=`

            <button

                class="approved-btn"

                disabled>

                Approved

            </button>

            `;

        }

        if(deposit.status==="Rejected"){

            actionButtons=`

            <button

                class="rejected-btn"

                disabled>

                Rejected

            </button>

            `;

        }

        depositGrid.innerHTML+=`

        <div class="deposit-card">

            <div class="deposit-header">

                <div class="deposit-user">

                    <div class="deposit-avatar">

                        <i class="fa-solid fa-user"></i>

                    </div>

                    <div>

                        <h3>

                            ${deposit.user.fullName}

                        </h3>

                        <span>

                            @${deposit.user.username}

                        </span>

                    </div>

                </div>

                <span class="status ${deposit.status.toLowerCase()}">

                    ${deposit.status}

                </span>

            </div>

            <div class="deposit-details">

                <div class="deposit-item">

                    <small>Coin</small>

                    <strong>

                        ${deposit.coin}

                    </strong>

                </div>

                <div class="deposit-item">

                    <small>Amount</small>

                    <strong>

                        ${formatCurrency(deposit.amount)}

                    </strong>

                </div>

                <div class="deposit-item">

                    <small>Wallet</small>

                    <strong>

                        ${deposit.walletAddress}

                    </strong>

                </div>

                <div class="deposit-item">

                    <small>Date</small>

                    <strong>

                        ${new Date(

                            deposit.createdAt

                        ).toLocaleDateString()}

                    </strong>

                </div>

            </div>

            ${actionButtons}

        </div>

        `;

    });

}

/*==========================================================
SEARCH
==========================================================*/

searchInput.addEventListener("input", () => {

    const value = searchInput.value

        .trim()

        .toLowerCase();

    if (!value) {

        renderDeposits(deposits);

        return;

    }

    const filtered = deposits.filter(deposit => {

        return (

            deposit.user.fullName.toLowerCase().includes(value) ||

            deposit.user.username.toLowerCase().includes(value) ||

            deposit.user.email.toLowerCase().includes(value)

        );

    });

    renderDeposits(filtered);

});

/*==========================================================
APPROVE / REJECT
==========================================================*/

depositGrid.addEventListener("click", async (event) => {

    const approveButton = event.target.closest(".approve-btn");

    const rejectButton = event.target.closest(".reject-btn");

    if (approveButton) {

        await updateDeposit(

            approveButton.dataset.id,

            "approve"

        );

    }

    if (rejectButton) {

        await updateDeposit(

            rejectButton.dataset.id,

            "reject"

        );

    }

});

/*==========================================================
UPDATE DEPOSIT
==========================================================*/

async function updateDeposit(id, action) {

    const confirmed = await showConfirm(

        action === "approve"

            ? "Approve Deposit"

            : "Reject Deposit",

        action === "approve"

            ? "Approve this deposit?"

            : "Reject this deposit?"

    );

    if (!confirmed) return;

    try {

        const response = await fetch(

            `/api/admin/deposits/${id}/${action}`,

            {

                method: "PATCH",

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

        showToast(

            result.message,

            "success"

        );

        await loadDeposits();

    }

    catch (error) {

        console.error(error);

        showToast(

            "Unable to update deposit.",

            "error"

        );

    }

}
