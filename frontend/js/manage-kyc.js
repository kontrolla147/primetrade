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

const kycGrid = document.getElementById("kycGrid");

const searchInput = document.getElementById("searchUser");

const modal = document.getElementById("kycModal");

const modalName = document.getElementById("modalName");

const modalType = document.getElementById("modalType");

const modalImage = document.getElementById("modalImage");

const approveBtn = document.getElementById("approveKyc");

const rejectBtn = document.getElementById("rejectKyc");

const closeModalBtn = document.getElementById("closeModal");

/*==========================================================
DATA
==========================================================*/

let kycRequests = [];

let selectedKyc = null;

/*==========================================================
INITIALIZE
==========================================================*/

document.addEventListener(
  "DOMContentLoaded",

  async () => {
    const authenticated = await verifyAdmin();

    if (!authenticated) return;

    loadKyc();
  },
);

/*==========================================================
LOAD KYC
==========================================================*/

async function loadKyc() {
  try {
    const response = await fetch(
      "/api/admin/kyc",

      {
        credentials: "include",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      showToast(result.message, "error");

      return;
    }

    kycRequests = result.kyc;

    renderKyc(kycRequests);
  } catch (error) {
    console.error(error);

    showToast("Unable to load KYC requests.", "error");
  }
}

/*==========================================================
RENDER
==========================================================*/

function renderKyc(data) {
  kycGrid.innerHTML = "";

  if (!data.length) {
    kycGrid.innerHTML = `

        <div class="no-data">

            <i class="fa-solid fa-id-card"></i>

            <h3>No KYC Requests</h3>

        </div>

        `;

    return;
  }

  data.forEach((request) => {
    kycGrid.innerHTML += `

        <div class="kyc-card">

            <div class="kyc-header">

                <div class="kyc-user">

                    <div class="kyc-avatar">

                        <i class="fa-solid fa-user"></i>

                    </div>

                    <div>

                        <h3>${request.fullName}</h3>

                        <span>${request.user.username}</span>

                    </div>

                </div>

                <span class="status ${request.status.toLowerCase()}">

                    ${request.status}

                </span>

            </div>

            <div class="kyc-details">

                <div class="kyc-item">

                    <small>Document</small>

                    <strong>${request.documentType}</strong>

                </div>

                <div class="kyc-item">

                    <small>Nationality</small>

                    <strong>${request.nationality}</strong>

                </div>

            </div>

            <button

                class="view-btn"

                data-id="${request._id}">

                <i class="fa-solid fa-eye"></i>

                View Document

            </button>

        </div>

        `;
  });
}

/*==========================================================
SEARCH
==========================================================*/

searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim().toLowerCase();

  if (!value) {
    renderKyc(kycRequests);

    return;
  }

  const filtered = kycRequests.filter((request) => {
    return (
      request.fullName.toLowerCase().includes(value) ||
      request.user.username.toLowerCase().includes(value) ||
      request.user.email.toLowerCase().includes(value)
    );
  });

  renderKyc(filtered);
});

/*==========================================================
OPEN MODAL
==========================================================*/

kycGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".view-btn");

  if (!button) return;

  selectedKyc = kycRequests.find(
    (request) => request._id === button.dataset.id,
  );

  if (!selectedKyc) return;

  modalName.textContent = selectedKyc.fullName;

  modalType.textContent = selectedKyc.documentType;

  modalImage.src = selectedKyc.documentImage;

  modalImage.classList.remove("zoomed");

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
IMAGE ZOOM
==========================================================*/

let zoomLevel = 1;

modalImage.addEventListener("click", () => {
  if (zoomLevel === 1) {
    zoomLevel = 2.5;
  } else {
    zoomLevel = 1;
  }

  modalImage.style.transform = `scale(${zoomLevel})`;
});

/*==========================================================
MOUSE WHEEL ZOOM
==========================================================*/

modalImage.addEventListener("wheel", (event) => {
  event.preventDefault();

  if (event.deltaY < 0) {
    zoomLevel += 0.2;
  } else {
    zoomLevel -= 0.2;
  }

  if (zoomLevel < 1) {
    zoomLevel = 1;
  }

  if (zoomLevel > 5) {
    zoomLevel = 5;
  }

  modalImage.style.transform = `scale(${zoomLevel})`;
});

/*==========================================================
RESET ZOOM
==========================================================*/

function resetZoom() {
  zoomLevel = 1;

  modalImage.style.transform = "scale(1)";
}

closeModalBtn.addEventListener(
  "click",

  resetZoom,
);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    resetZoom();
  }
});

/*==========================================================
APPROVE KYC
==========================================================*/

approveBtn.addEventListener("click", async () => {
  if (!selectedKyc) return;

  const confirmed = await showConfirm(
    "Approve KYC",

    `Approve KYC for ${selectedKyc.fullName}?`,
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `/api/admin/kyc/approve/${selectedKyc._id}`,

      {
        method: "PUT",

        credentials: "include",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      showToast(result.message, "error");

      return;
    }

    showToast(
      "KYC approved successfully.",

      "success",
    );

    modal.classList.remove("show");

    resetZoom();

    loadKyc();
  } catch (error) {
    console.error(error);

    showToast(
      "Unable to approve KYC.",

      "error",
    );
  }
});

/*==========================================================
REJECT KYC
==========================================================*/

rejectBtn.addEventListener("click", async () => {
  if (!selectedKyc) return;

  const confirmed = await showConfirm(
    "Reject KYC",

    `Reject KYC for ${selectedKyc.fullName}?`,
  );

  if (!confirmed) return;

  const reason = prompt(
    "Reason for rejection:",

    "Verification failed.",
  );

  if (reason === null) return;

  try {
    const response = await fetch(
      `/api/admin/kyc/reject/${selectedKyc._id}`,

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
      showToast(result.message, "error");

      return;
    }

    showToast(
      "KYC rejected successfully.",

      "success",
    );

    modal.classList.remove("show");

    resetZoom();

    loadKyc();
  } catch (error) {
    console.error(error);

    showToast(
      "Unable to reject KYC.",

      "error",
    );
  }
});
