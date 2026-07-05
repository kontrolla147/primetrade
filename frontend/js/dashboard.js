"use strict";

/*==========================================================
DASHBOARD
==========================================================*/

/*==========================================================
GREETING
==========================================================*/

function updateGreeting() {
  const greeting = document.getElementById("greeting");

  const welcomeText = document.getElementById("welcomeText");

  const hour = new Date().getHours();

  let icon = "";

  let message = "";

  if (hour >= 5 && hour < 12) {
    icon = "🌅";

    message = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    icon = "☀️";

    message = "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    icon = "🌇";

    message = "Good Evening";
  } else {
    icon = "🌙";

    message = "Good Night";
  }

  greeting.innerHTML = `${icon} ${message}, <span id="userName">Loading...</span>`;

  welcomeText.textContent = "Have a great investment day.";
}

/*==========================================================
DATE & TIME
==========================================================*/

function updateDateTime() {
  const dateElement = document.getElementById("currentDate");

  const timeElement = document.getElementById("currentTime");

  const now = new Date();

  const dateOptions = {
    weekday: "long",

    year: "numeric",

    month: "long",

    day: "numeric",
  };

  const timeOptions = {
    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",
  };

  dateElement.textContent = now.toLocaleDateString(
    "en-US",

    dateOptions,
  );

  timeElement.textContent = now.toLocaleTimeString(
    "en-US",

    timeOptions,
  );
}

/*==========================================================
RECENT TRANSACTIONS
==========================================================*/

async function loadRecentTransactions() {
  try {
    const response = await fetch(
      "/api/transactions?page=1&limit=3",

      {
        credentials: "include",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      showToast(result.message, "error");

      return;
    }

    const table = document.getElementById("recentTransactions");

    table.innerHTML = "";

    if (!result.transactions.length) {
      table.innerHTML = `

                <tr>

                    <td colspan="4">

                        No transactions found.

                    </td>

                </tr>

            `;

      return;
    }

    result.transactions.forEach((transaction) => {
      table.innerHTML += `

<tr>

    <td>

        ${transaction.type}

    </td>

    <td>

        $${Number(transaction.amount).toLocaleString()}

    </td>

    <td>

        ${new Date(transaction.createdAt).toLocaleDateString()}

    </td>

    <td>

        <span class="status ${transaction.status.toLowerCase()}">

            ${transaction.status}

        </span>

    </td>

</tr>

`;
    });
  } catch (error) {
    console.error(error);
  }
}

/*==========================================================
LOAD USER
==========================================================*/

async function loadCurrentUser() {
  try {
    const response = await fetch(
      "/api/auth/me",

      {
        credentials: "include",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      window.location.href = "/pages/login.html";

      return;
    }

    const user = data.user;

    document.getElementById("userName").textContent = user.username;

    document.getElementById("totalBalance").textContent =
      `$${Number(user.balance).toLocaleString()}`;

    document.getElementById("totalProfit").textContent =
      `$${Number(user.totalProfit || 0).toLocaleString()}`;

    document.getElementById("activeInvestment").textContent =
      `$${Number(user.activeInvestment || 0).toLocaleString()}`;

    
    document.getElementById("bonusBalance").textContent =
      `$${Number(user.bonus || 0).toLocaleString()}`;

    document.getElementById("accountStatus").textContent = user.accountStatus;

    document.getElementById("kycStatus").textContent = user.kycStatus;

    document.getElementById("memberSince").textContent = new Date(
      user.createdAt,
    ).toLocaleDateString();

    document.getElementById("accountType").textContent =
      user.accountType || "Standard Investor";
  } catch (error) {
    console.error(error);

    window.location.href = "/pages/login.html";
  }
}


/*==========================================================
LOAD NOTIFICATIONS
==========================================================*/

async function loadNotifications(){

    try{

        const response = await fetch(

            "/api/notifications",

            {

                credentials:"include"

            }

        );

        const result = await response.json();

        if(!response.ok){

            return;

        }

        const container = document.getElementById(

            "notificationList"

        );

        container.innerHTML = "";

        if(!result.notifications.length){

            container.innerHTML = `

                <div class="notification-empty">

                    <i class="fa-regular fa-bell-slash"></i>

                    <p>

                        No recent notifications.

                    </p>

                </div>

            `;

            return;

        }

        result.notifications.forEach(notification=>{

            container.innerHTML += `

                <div class="notification-item ${notification.type}">

                    <div class="notification-icon">

                        ${getNotificationIcon(notification.type)}

                    </div>

                    <div class="notification-content">

                        <h4>

                            ${notification.title}

                        </h4>

                        <p>

                            ${notification.message}

                        </p>

                        <small>

                            ${formatNotificationDate(notification.createdAt)}

                        </small>

                    </div>

                </div>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}

/*==========================================================
NOTIFICATION ICON
==========================================================*/

function getNotificationIcon(type){

    switch(type){

        case "success":

            return '<i class="fa-solid fa-circle-check"></i>';

        case "warning":

            return '<i class="fa-solid fa-triangle-exclamation"></i>';

        case "error":

            return '<i class="fa-solid fa-circle-xmark"></i>';

        default:

            return '<i class="fa-solid fa-bell"></i>';

    }

}

/*==========================================================
FORMAT DATE
==========================================================*/

function formatNotificationDate(date){

    return new Date(date).toLocaleString(

        "en-US",

        {

            dateStyle:"medium",

            timeStyle:"short"

        }

    );

}

/*==========================================================
INIT
==========================================================*/

document.addEventListener("DOMContentLoaded", async () => {
  updateGreeting();

  updateDateTime();

  setInterval(updateDateTime, 1000);

  await loadCurrentUser();

await loadRecentTransactions();
/*==========================================================
AUTO REFRESH NOTIFICATIONS
==========================================================*/

setInterval(async () => {

    await loadNotifications();

}, 1000);
});
