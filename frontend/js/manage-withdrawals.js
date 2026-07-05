"use strict";

/*==========================================================
VERIFY ADMIN
==========================================================*/

async function verifyAdmin() {
  try {
    const response = await fetch(
      "/api/admin/verify",

      {
        credentials: "include",
      },
    );

    if (!response.ok) {
      window.location.href = "/admin/admin-control.html";

      return false;
    }

    return true;
  } catch (error) {
    window.location.href = "/admin/admin-control.html";

    return false;
  }
}

/*==========================================================
ELEMENTS
==========================================================*/
const rejectReasonBox = document.getElementById("rejectReasonBox");

const rejectReason = document.getElementById("rejectReason");

const withdrawalGrid = document.getElementById("withdrawalGrid");

const searchInput = document.getElementById("searchWithdrawal");

const pendingCount = document.getElementById("pendingCount");

const approvedCount = document.getElementById("approvedCount");

const rejectedCount = document.getElementById("rejectedCount");

const totalAmount = document.getElementById("totalAmount");

/*==========================================================
DATA
==========================================================*/

let withdrawals = [];

let selectedWithdrawal = null;

/*==========================================================
INITIALIZE
==========================================================*/

document.addEventListener(
  "DOMContentLoaded",

  async () => {
    const authenticated = await verifyAdmin();

    if (!authenticated) return;

    refreshWithdrawals();
  },
);

/*==========================================================
LOAD WITHDRAWALS
==========================================================*/

async function loadWithdrawals() {
  try {
    const response = await fetch(
      "/api/admin/withdrawals",

      {
        credentials: "include",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      showToast(
        result.message,

        "error",
      );

      return;
    }

    withdrawals = result.withdrawals;

    updateStats();

    renderWithdrawals(withdrawals);
  } catch (error) {
    console.error(error);

    showToast(
      "Unable to load withdrawals.",

      "error",
    );
  }
}

/*==========================================================
UPDATE STATS
==========================================================*/

function updateStats() {
  const pending = withdrawals.filter(
    (item) => item.status === "Pending",
  ).length;

  const approved = withdrawals.filter(
    (item) => item.status === "Approved",
  ).length;

  const rejected = withdrawals.filter(
    (item) => item.status === "Rejected",
  ).length;

  const total = withdrawals.reduce(
    (sum, item) => sum + item.amount,

    0,
  );

  pendingCount.textContent = pending;

  approvedCount.textContent = approved;

  rejectedCount.textContent = rejected;

  totalAmount.textContent = "$" + total.toLocaleString();
}

/*==========================================================
RENDER WITHDRAWALS
==========================================================*/

function renderWithdrawals(data) {
  withdrawalGrid.innerHTML = "";

  if (!data.length) {
    withdrawalGrid.innerHTML = `

        <div class="no-data">

            <i class="fa-solid fa-wallet"></i>

            <h3>No Withdrawal Requests</h3>

            <p>

                There are currently no withdrawal requests.

            </p>

        </div>

        `;

    return;
  }

  data.forEach((withdrawal) => {
    withdrawalGrid.innerHTML += `

        <div class="withdraw-card">

            <div class="withdraw-header">

                <div class="withdraw-user">

                    <div class="withdraw-avatar">

                        <i class="fa-solid fa-user"></i>

                    </div>

                    <div>

                        <h3>

                            ${withdrawal.user.username}

                        </h3>

                        <span>

                            ${withdrawal.user.email}

                        </span>

                    </div>

                </div>

                <span class="status ${withdrawal.status.toLowerCase()}">

                    ${withdrawal.status}

                </span>

            </div>

            <div class="withdraw-details">

                <div class="withdraw-item">

                    <small>Amount</small>

                    <strong>

                        $${withdrawal.amount.toLocaleString()}

                    </strong>

                </div>

                <div class="withdraw-item">

                    <small>Coin</small>

                    <strong>

                        ${withdrawal.coin}

                    </strong>

                </div>

                <div class="withdraw-item">

                    <small>Wallet</small>

                    <strong>

                        ${withdrawal.walletAddress.slice(0, 18)}...

                    </strong>

                </div>

                <div class="withdraw-item">

                    <small>Date</small>

                    <strong>

                        ${new Date(withdrawal.createdAt).toLocaleDateString()}

                    </strong>

                </div>

            </div>

            <button

                class="view-btn"

                data-id="${withdrawal._id}">

                <i class="fa-solid fa-eye"></i>

                View Details

            </button>

        </div>

        `;
  });
}

/*==========================================================
MODAL ELEMENTS
==========================================================*/

const modal = document.getElementById("withdrawModal");

const closeModalBtn = document.getElementById("closeModal");

const modalUser = document.getElementById("modalUser");

const modalEmail = document.getElementById("modalEmail");

const modalAmount = document.getElementById("modalAmount");

const modalCoin = document.getElementById("modalCoin");

const modalWallet = document.getElementById("modalWallet");

const modalStatus = document.getElementById("modalStatus");

const modalDate = document.getElementById("modalDate");

const approveBtn = document.getElementById("approveWithdrawal");

const rejectBtn = document.getElementById("rejectWithdrawal");

/*==========================================================
SEARCH
==========================================================*/

searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim().toLowerCase();

  if (!value) {
    renderWithdrawals(withdrawals);

    return;
  }

  const filtered = withdrawals.filter((item) => {
    return (
      item.user.username.toLowerCase().includes(value) ||
      item.user.email.toLowerCase().includes(value) ||
      item.coin.toLowerCase().includes(value)
    );
  });

  renderWithdrawals(filtered);
});

/*==========================================================
OPEN MODAL
==========================================================*/

withdrawalGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".view-btn");

  if (!button) return;

  selectedWithdrawal = withdrawals.find(
    (item) => item._id === button.dataset.id,
  );

  if (!selectedWithdrawal) return;

  modalUser.textContent = selectedWithdrawal.user.username;

  modalEmail.textContent = selectedWithdrawal.user.email;

  modalAmount.textContent = "$" + selectedWithdrawal.amount.toLocaleString();

  modalCoin.textContent = selectedWithdrawal.coin;

  modalWallet.textContent = selectedWithdrawal.walletAddress;

  modalStatus.textContent = selectedWithdrawal.status;

  modalDate.textContent = new Date(
    selectedWithdrawal.createdAt,
  ).toLocaleString();

  modal.classList.add("show");
});

/*==========================================================
CLOSE MODAL
==========================================================*/

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("show");
  }
});

/*==========================================================
APPROVE
==========================================================*/

approveBtn.addEventListener("click", async () => {
  if (!selectedWithdrawal) return;

  const confirmed = await showConfirm(
    "Approve Withdrawal",

    `Approve withdrawal for ${selectedWithdrawal.user.username}?`,
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `/api/admin/withdrawals/approve/${selectedWithdrawal._id}`,

      {
        method: "PUT",

        credentials: "include",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      showToast(
        result.message,

        "error",
      );

      return;
    }

    showToast(
      "Withdrawal approved successfully.",

      "success",
    );

    modal.classList.remove("show");

    refreshWithdrawals();
  } catch (error) {
    console.error(error);

    showToast(
      "Unable to approve withdrawal.",

      "error",
    );
  }
});

/*==========================================================
REJECT
==========================================================*/
/*==========================================================
REJECT
==========================================================*/

rejectBtn.addEventListener("click", async () => {
  if (!selectedWithdrawal) return;

  /*----------------------------------
    First Click
    ----------------------------------*/

  if (!rejectReasonBox.classList.contains("show")) {
    rejectReasonBox.classList.add("show");

    rejectReason.focus();

    rejectBtn.innerHTML = `

            <i class="fa-solid fa-paper-plane"></i>

            Submit Rejection

        `;

    return;
  }

  /*----------------------------------
    Validate
    ----------------------------------*/

  const reason = rejectReason.value.trim();

  if (!reason) {
    showToast(
      "Please enter a rejection reason.",

      "warning",
    );

    rejectReason.focus();

    return;
  }

  /*----------------------------------
    Confirm
    ----------------------------------*/

  const confirmed = await showConfirm(
    "Reject Withdrawal",

    `Reject withdrawal for ${selectedWithdrawal.user.username}?`,
  );

  if (!confirmed) return;

  /*----------------------------------
    Send
    ----------------------------------*/

  try {
    const response = await fetch(
      `/api/admin/withdrawals/reject/${selectedWithdrawal._id}`,

      {
        method: "PUT",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          reason,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      showToast(
        result.message,

        "error",
      );

      return;
    }

    showToast(
      "Withdrawal rejected successfully.",

      "success",
    );

    rejectReason.value = "";

    rejectReasonBox.classList.remove("show");

    rejectBtn.innerHTML = `

            <i class="fa-solid fa-xmark"></i>

            Reject

        `;

    modal.classList.remove("show");

    refreshWithdrawals();
  } catch (error) {
    console.error(error);

    showToast(
      "Unable to reject withdrawal.",

      "error",
    );
  }
});

/*==========================================================
FORMAT DATE
==========================================================*/

function formatDate(date) {
  return new Date(date).toLocaleString(
    "en-US",

    {
      year: "numeric",

      month: "short",

      day: "numeric",

      hour: "2-digit",

      minute: "2-digit",
    },
  );
}

/*==========================================================
FORMAT CURRENCY
==========================================================*/

function formatCurrency(amount) {
  return (
    "$" +
    Number(amount).toLocaleString(
      "en-US",

      {
        minimumFractionDigits: 2,

        maximumFractionDigits: 2,
      },
    )
  );
}

/*==========================================================
REFRESH
==========================================================*/

async function refreshWithdrawals() {
  await loadWithdrawals();

  if (searchInput.value.trim()) {
    searchInput.dispatchEvent(new Event("input"));
  }
}

/*==========================================================
ESC KEY CLOSE
==========================================================*/

document.addEventListener(
  "keydown",

  (event) => {
    if (event.key === "Escape" && modal.classList.contains("show")) {
      modal.classList.remove("show");
    }
  },
);

/*==========================================================
PREVENT DOUBLE CLICK
==========================================================*/

function setLoading(button, loading) {
  if (!button) return;

  if (loading) {
    button.disabled = true;

    button.classList.add("loading");
  } else {
    button.disabled = false;

    button.classList.remove("loading");
  }
}

/*==========================================================
RELOAD AFTER APPROVE/REJECT
==========================================================*/

approveBtn.addEventListener(
  "click",

  () => {
    setLoading(
      approveBtn,

      true,
    );

    setTimeout(() => {
      setLoading(
        approveBtn,

        false,
      );
    }, 1000);
  },
);

rejectBtn.addEventListener(
  "click",

  () => {
    setLoading(
      rejectBtn,

      true,
    );

    setTimeout(() => {
      setLoading(
        rejectBtn,

        false,
      );
    }, 1000);
  },
);

/*==========================================================
AUTO REFRESH EVERY 30 SECONDS
==========================================================*/

setInterval(
  () => {
    loadWithdrawals();
  },

  30000,
);

/*==========================================================
ANIMATE STATS
==========================================================*/

function animateCards() {
  document.querySelectorAll(".stat-card").forEach(
    (
      card,

      index,
    ) => {
      card.style.opacity = "0";

      card.style.transform = "translateY(20px)";

      setTimeout(() => {
        card.style.transition = ".35s";

        card.style.opacity = "1";

        card.style.transform = "translateY(0)";
      }, index * 120);
    },
  );
}

document.addEventListener(
  "DOMContentLoaded",

  animateCards,
);
