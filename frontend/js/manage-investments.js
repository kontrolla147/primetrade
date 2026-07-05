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

const plansGrid = document.getElementById("plansGrid");

const searchInput = document.getElementById("searchPlan");

const newPlanBtn = document.getElementById("newPlanBtn");

const planModal = document.getElementById("planModal");

const planCloseBtn = document.getElementById("closeModal");

const planForm = document.getElementById("planForm");

const modalTitle = document.getElementById("modalTitle");

/*==========================================================
FORM ELEMENTS
==========================================================*/

const planName = document.getElementById("planName");

const planROI = document.getElementById("planROI");

const planDuration = document.getElementById("planDuration");

const planMinimum = document.getElementById("planMinimum");

const planMaximum = document.getElementById("planMaximum");

const planBadge = document.getElementById("planBadge");

const planDescription = document.getElementById("planDescription");

const planStatus = document.getElementById("planStatus");

/*==========================================================
STATS
==========================================================*/

const totalPlans = document.getElementById("totalPlans");

const activePlans = document.getElementById("activePlans");

const hiddenPlans = document.getElementById("hiddenPlans");

const highestROI = document.getElementById("highestROI");

/*==========================================================
DATA
==========================================================*/

let plans = [];

let editingPlan = null;

/*==========================================================
INIT
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        const authenticated = await verifyAdmin();

        if (!authenticated) return;

        loadPlans();

    }

);


/*==========================================================
LOAD PLANS
==========================================================*/

async function loadPlans(){

    try{

        const response = await fetch(

            "/api/admin/investment-plans",

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

        plans = result.plans || [];

        renderPlans(plans);

        updateStats();

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to load investment plans.",

            "error"

        );

    }

}

/*==========================================================
RENDER PLANS
==========================================================*/

function renderPlans(data){

    plansGrid.innerHTML = "";

    if(!data.length){

        plansGrid.innerHTML = `

        <div class="no-data">

            <i class="fa-solid fa-layer-group"></i>

            <h3>No Investment Plans Found</h3>

        </div>

        `;

        return;

    }

    data.forEach(plan=>{

        plansGrid.innerHTML += `

        <div class="plan-card">

            <div class="plan-header">

                <div>

                    <h3>

                        ${plan.name}

                    </h3>

                    <span class="plan-badge">

                        ${plan.badge || "Standard"}

                    </span>

                </div>

                <span class="plan-status ${plan.status.toLowerCase()}">

                    ${plan.status}

                </span>

            </div>

            <div class="plan-roi">

                <h2>

                    ${plan.roi}%

                </h2>

                <span>

                    Return On Investment

                </span>

            </div>

            <div class="plan-details">

                <div class="plan-item">

                    <small>Duration</small>

                    <strong>

                        ${plan.duration} Days

                    </strong>

                </div>

                <div class="plan-item">

                    <small>Minimum</small>

                    <strong>

                        $${Number(plan.minimum).toLocaleString()}

                    </strong>

                </div>

                <div class="plan-item">

                    <small>Maximum</small>

                    <strong>

                        $${Number(plan.maximum).toLocaleString()}

                    </strong>

                </div>

                <div class="plan-item">

                    <small>Status</small>

                    <strong>

                        ${plan.status}

                    </strong>

                </div>

            </div>

            <div class="plan-description">

                ${plan.description || "No description provided."}

            </div>

            <div class="plan-actions">

                <button

                    class="edit-btn"

                    data-id="${plan._id}">

                    <i class="fa-solid fa-pen"></i>

                    Edit

                </button>

                <button

                    class="hide-btn"

                    data-id="${plan._id}">

                    <i class="fa-solid fa-eye-slash"></i>

                    ${plan.status==="Active" ? "Hide" : "Activate"}

                </button>

                <button

                    class="delete-btn"

                    data-id="${plan._id}">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}

/*==========================================================
UPDATE STATS
==========================================================*/

function updateStats(){

    totalPlans.textContent = plans.length;

    activePlans.textContent = plans.filter(

        plan=>plan.status==="Active"

    ).length;

    hiddenPlans.textContent = plans.filter(

        plan=>plan.status==="Hidden"

    ).length;

    if(plans.length){

        highestROI.textContent =

        Math.max(

            ...plans.map(

                plan=>Number(plan.roi)

            )

        ) + "%";

    }

    else{

        highestROI.textContent = "0%";

    }

}

/*==========================================================
SEARCH
==========================================================*/

searchInput.addEventListener(

    "input",

    ()=>{

        const value = searchInput.value

            .trim()

            .toLowerCase();

        if(!value){

            renderPlans(plans);

            return;

        }

        const filtered = plans.filter(plan=>

            plan.name.toLowerCase().includes(value) ||

            (plan.badge||"")

            .toLowerCase()

            .includes(value)

        );

        renderPlans(filtered);

    }

);


/*==========================================================
NEW PLAN
==========================================================*/

newPlanBtn.addEventListener("click", () => {

    editingPlan = null;

    modalTitle.textContent = "Create Investment Plan";

    planForm.reset();

    planStatus.value = "Active";

    planModal.classList.add("show");

});

/*==========================================================
CLOSE MODAL
==========================================================*/

planCloseBtn.addEventListener("click", () => {

    planModal.classList.remove("show");

    planForm.reset();

    editingPlan = null;

});

planModal.addEventListener("click", (event) => {

    if(event.target === planModal){

        planModal.classList.remove("show");

        planForm.reset();

        editingPlan = null;

    }

});

/*==========================================================
EDIT / HIDE / DELETE CLICK EVENTS
==========================================================*/

plansGrid.addEventListener("click", async (event) => {

    const editBtn = event.target.closest(".edit-btn");

    const hideBtn = event.target.closest(".hide-btn");

    const deleteBtn = event.target.closest(".delete-btn");

    /*======================================================
    EDIT
    ======================================================*/

    if(editBtn){

        const id = editBtn.dataset.id;

        editingPlan = plans.find(

            plan => plan._id === id

        );

        if(!editingPlan) return;

        modalTitle.textContent =

            "Edit Investment Plan";

        planName.value = editingPlan.name;

        planROI.value = editingPlan.roi;

        planDuration.value = editingPlan.duration;

        planMinimum.value = editingPlan.minimum;

        planMaximum.value = editingPlan.maximum;

        planBadge.value = editingPlan.badge || "";

        planDescription.value =

            editingPlan.description || "";

        planStatus.value = editingPlan.status;

        planModal.classList.add("show");

        return;

    }

    /*======================================================
    HIDE / ACTIVATE
    ======================================================*/

    if(hideBtn){

        editingPlan = plans.find(

            plan => plan._id === hideBtn.dataset.id

        );

        if(!editingPlan) return;

        // Part 4 will handle the API request

        return;

    }

    /*======================================================
    DELETE
    ======================================================*/

    if(deleteBtn){

        editingPlan = plans.find(

            plan => plan._id === deleteBtn.dataset.id

        );

        if(!editingPlan) return;

        // Part 5 will handle deleting

        return;

    }

});


/*==========================================================
SAVE PLAN
==========================================================*/

planForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const saveBtn = planForm.querySelector(".save-btn");

    const data = {

        name: planName.value.trim(),

        roi: Number(planROI.value),

        duration: Number(planDuration.value),

        minimum: Number(planMinimum.value),

        maximum: Number(planMaximum.value),

        badge: planBadge.value.trim(),

        description: planDescription.value.trim(),

        status: planStatus.value

    };

    /*==========================================================
    VALIDATION
    ==========================================================*/

    if(

        !data.name ||

        data.roi <= 0 ||

        data.duration <= 0 ||

        data.minimum <= 0 ||

        data.maximum <= 0

    ){

        showToast(

            "Please complete all required fields.",

            "warning"

        );

        return;

    }

    if(data.minimum > data.maximum){

        showToast(

            "Minimum amount cannot be greater than maximum.",

            "warning"

        );

        return;

    }

    saveBtn.disabled = true;

    saveBtn.innerHTML = `

        <i class="fa-solid fa-spinner fa-spin"></i>

        Saving...

    `;

    try{

        const response = await fetch(

            editingPlan

            ?

            `/api/admin/investment-plans/${editingPlan._id}`

            :

            "/api/admin/investment-plans",

            {

                method: editingPlan ? "PUT" : "POST",

                credentials: "include",

                headers:{

                    "Content-Type":"application/json"

                },

                body: JSON.stringify(data)

            }

        );

        const result = await response.json();

        if(!response.ok){

            showToast(

                result.message,

                "error"

            );

            saveBtn.disabled = false;

            saveBtn.innerHTML = `

                <i class="fa-solid fa-floppy-disk"></i>

                Save Plan

            `;

            return;

        }

        showToast(

            editingPlan

            ?

            "Investment plan updated successfully."

            :

            "Investment plan created successfully.",

            "success"

        );

        planModal.classList.remove("show");

        editingPlan = null;

        planForm.reset();

        loadPlans();

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to save investment plan.",

            "error"

        );

    }

    saveBtn.disabled = false;

    saveBtn.innerHTML = `

        <i class="fa-solid fa-floppy-disk"></i>

        Save Plan

    `;

});


/*==========================================================
HIDE / ACTIVATE PLAN
==========================================================*/

async function togglePlan(plan){

    const action =

        plan.status === "Active"

        ? "Hide"

        : "Activate";

    const confirmed = await showConfirm(

        `${action} Investment Plan`,

        `${action} "${plan.name}"?`

    );

    if(!confirmed) return;

    try{

        const response = await fetch(

            `/api/admin/investment-plans/${plan._id}/toggle`,

            {

                method:"PATCH",

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

        showToast(

            result.message,

            "success"

        );

        loadPlans();

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to update investment plan.",

            "error"

        );

    }

}

/*==========================================================
DELETE PLAN
==========================================================*/

async function deletePlan(plan){

    const confirmed = await showConfirm(

        "Delete Investment Plan",

        `Delete "${plan.name}" permanently?`

    );

    if(!confirmed) return;

    try{

        const response = await fetch(

            `/api/admin/investment-plans/${plan._id}`,

            {

                method:"DELETE",

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

        showToast(

            "Investment plan deleted successfully.",

            "success"

        );

        loadPlans();

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to delete investment plan.",

            "error"

        );

    }

}

/*==========================================================
BUTTON ACTIONS
==========================================================*/

plansGrid.addEventListener(

    "click",

    async(event)=>{

        const hideBtn = event.target.closest(".hide-btn");

        const deleteBtn = event.target.closest(".delete-btn");

        if(hideBtn){

            const plan = plans.find(

                p=>p._id===hideBtn.dataset.id

            );

            if(plan){

                await togglePlan(plan);

            }

        }

        if(deleteBtn){

            const plan = plans.find(

                p=>p._id===deleteBtn.dataset.id

            );

            if(plan){

                await deletePlan(plan);

            }

        }

    }

);