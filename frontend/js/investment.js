"use strict";

/*==========================================================
ELEMENTS
==========================================================*/

const plansContainer = document.getElementById("plansContainer");

const investmentCard = document.getElementById("investmentCard");

const investmentForm = document.getElementById("investmentForm");

const selectedPlan = document.getElementById("selectedPlan");

const selectedROI = document.getElementById("selectedROI");

const selectedDuration = document.getElementById("selectedDuration");

const investmentAmount = document.getElementById("investmentAmount");

const expectedProfit = document.getElementById("expectedProfit");

const totalReturn = document.getElementById("totalReturn");

let currentPlan = null;

/*==========================================================
LOAD PLANS
==========================================================*/

async function loadPlans(){

    try{

        const response = await fetch("/api/investment-plans");

        const result = await response.json();

        if(!response.ok){

            showToast(result.message,"error");

            return;

        }

        plansContainer.innerHTML = "";

        result.plans.forEach(plan=>{

    plansContainer.innerHTML += `

    <div class="plan-card">

        <div class="plan-header">

            <span class="plan-badge">

                ${plan.badge || "Standard"}

            </span>

            <span class="plan-status">

                ${plan.status}

            </span>

        </div>

        <div class="plan-name">

            ${plan.name}

        </div>

        <div class="plan-roi">

            ${plan.roi}% ROI

        </div>

        <div class="plan-duration">

            ${plan.duration} Days

        </div>

        <div class="plan-details">

            <div>

                <span>Minimum</span>

                <strong>

                    $${Number(plan.minimum).toLocaleString()}

                </strong>

            </div>

            <div>

                <span>Maximum</span>

                <strong>

                    $${Number(plan.maximum).toLocaleString()}

                </strong>

            </div>

        </div>

        <p class="plan-description">

            ${plan.description || ""}

        </p>

        <button

            class="investNow"

            data-id="${plan._id}"

            data-name="${plan.name}"

            data-roi="${plan.roi}"

            data-duration="${plan.duration}"

            data-min="${plan.minimum}"

            data-max="${plan.maximum}">

            <i class="fa-solid fa-chart-line"></i>

            Invest Now

        </button>

    </div>

    `;

});
        registerButtons();

    }

    catch(error){

        console.error(error);

    }

}

/*==========================================================
OPEN INVESTMENT FORM
==========================================================*/

function registerButtons(){

    document.querySelectorAll(".investNow").forEach(button=>{

        button.addEventListener("click",()=>{

            currentPlan = {

                id:button.dataset.id,

                name:button.dataset.name,

                roi:Number(button.dataset.roi),

                duration:Number(button.dataset.duration),

                minimum:Number(button.dataset.min),

                maximum:Number(button.dataset.max)

            };

            selectedPlan.value = currentPlan.name;

            selectedROI.value = currentPlan.roi + "%";

            selectedDuration.value = currentPlan.duration + " Days";

            investmentAmount.value = "";

            expectedProfit.textContent = "$0.00";

            totalReturn.textContent = "$0.00";

            investmentCard.classList.remove("hidden");

            investmentCard.scrollIntoView({

                behavior:"smooth"

            });

        });

    });

}

/*==========================================================
LIVE CALCULATION
==========================================================*/

investmentAmount.addEventListener("input",()=>{

    if(!currentPlan){

        return;

    }

    const amount = Number(investmentAmount.value);

    if(!amount){

        expectedProfit.textContent="$0.00";

        totalReturn.textContent="$0.00";

        return;

    }

    const profit = amount * currentPlan.roi / 100;

    expectedProfit.textContent = "$" + profit.toFixed(2);

    totalReturn.textContent = "$" + (amount + profit).toFixed(2);

});

/*==========================================================
SUBMIT
==========================================================*/

investmentForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    if(!currentPlan){

        showToast("Please choose an investment plan.","error");

        return;

    }

    const amount = Number(investmentAmount.value);

    if(amount < currentPlan.minimum){

        showToast(

            `Minimum investment is $${currentPlan.minimum}`,

            "error"

        );

        return;

    }

    if(amount > currentPlan.maximum){

        showToast(

            `Maximum investment is $${currentPlan.maximum}`,

            "error"

        );

        return;

    }

    const submitBtn = document.querySelector(".invest-btn");

    submitBtn.disabled = true;

    submitBtn.innerHTML = `

        <i class="fa-solid fa-spinner fa-spin"></i>

        Processing...

    `;

    try{

        const response = await fetch(

            "/api/investments",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                credentials:"include",

                body:JSON.stringify({

                    planId:currentPlan.id,

                    amount

                })

            }

        );

        const result = await response.json();

        if(!response.ok){

            showToast(result.message,"error");

        }else{

            showToast(result.message,"success");

            investmentForm.reset();

            investmentCard.classList.add("hidden");

            loadInvestments();

        }

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to connect to server.",

            "error"

        );

    }

    submitBtn.disabled = false;

    submitBtn.innerHTML = `

        <i class="fa-solid fa-chart-line"></i>

        Start Investment

    `;

});

/*==========================================================
LOAD MY INVESTMENTS
==========================================================*/

async function loadInvestments(){

    try{

        const response = await fetch(

            "/api/investments",

            {

                credentials:"include"

            }

        );

        const result = await response.json();

        if(!response.ok){

            return;

        }

        const table = document.getElementById("investmentTable");

        table.innerHTML = "";

        result.investments.forEach(item=>{

            table.innerHTML += `

                <tr>

                    <td>${item.planName}</td>

                    <td>$${item.amount}</td>

                    <td>$${item.expectedProfit}</td>

                    <td>${item.status}</td>

                    <td>${new Date(item.endDate).toLocaleDateString()}</td>

                </tr>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}

/*==========================================================
INIT
==========================================================*/

loadPlans();

loadInvestments();