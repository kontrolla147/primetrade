"use strict";

/*==========================================================
ELEMENTS
==========================================================*/

const activityTable = document.getElementById("activityTable");

const searchInput = document.getElementById("searchActivity");

const totalActivities = document.getElementById("totalActivities");

const currentPageText = document.getElementById("currentPage");

const totalPagesText = document.getElementById("totalPages");

const previousBtn = document.getElementById("previousPage");

const nextBtn = document.getElementById("nextPage");

let currentPage = 1;

const limit = 10;

let totalPages = 1;

let search = "";



/*==========================================================
LOAD ACTIVITIES
==========================================================*/

async function loadActivities(){

    try{

        const response = await fetch(

            `/api/admin/activities?page=${currentPage}&limit=${limit}&search=${search}`,

            {

                credentials:"include"

            }

        );

        const result = await response.json();

        if(!response.ok){

            showToast(result.message,"error");

            return;

        }

        renderActivities(result.activities);

        totalActivities.textContent = result.totalActivities;

        currentPageText.textContent = result.currentPage;

        totalPagesText.textContent = result.totalPages || 1;

        previousBtn.disabled = currentPage === 1;

        nextBtn.disabled = currentPage === result.totalPages;

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to load activities.",

            "error"

        );

    }

}


/*==========================================================
RENDER
==========================================================*/

function renderActivities(activities){

    activityTable.innerHTML = "";

    if(!activities.length){

        activityTable.innerHTML = `

        <tr>

            <td colspan="5">

                No activity found.

            </td>

        </tr>

        `;

        return;

    }

    activities.forEach(activity=>{

        activityTable.innerHTML += `

        <tr>

            <td>

                ${activity.admin?.username || "-"}

            </td>

            <td>

                <span class="action-badge">

                    ${activity.action}

                </span>

            </td>

            <td>

                ${activity.target}

            </td>

            <td>

                ${activity.description}

            </td>

            <td>

                ${new Date(

                    activity.createdAt

                ).toLocaleString()}

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

    ()=>{

        search = searchInput.value.trim();

        currentPage = 1;

        loadActivities();

    }

);



/*==========================================================
PAGINATION
==========================================================*/

previousBtn.addEventListener(

    "click",

    ()=>{

        if(currentPage > 1){

            currentPage--;

            loadActivities();

        }

    }

);

nextBtn.addEventListener(

    "click",

    ()=>{

        if(currentPage < totalPages){

            currentPage++;

            loadActivities();

        }

    }

);

/*==========================================================
INIT
==========================================================*/

loadActivities();
