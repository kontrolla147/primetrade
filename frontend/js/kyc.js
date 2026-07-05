"use strict";

/*==========================================================
ELEMENTS
==========================================================*/
const statusTitle = document.getElementById("statusTitle");

const statusText = document.getElementById("statusText");

const submitButton = document.getElementById("submitKyc");

const kycForm = document.getElementById("kycForm");

const kycStatus = document.getElementById("kycStatus");

const kycStatusMessage = document.getElementById("kycStatusMessage");

const statusIcon = document.querySelector(".status-icon");

const documentImage = document.getElementById("documentImage");

const selfieImage = document.getElementById("selfieImage");

const documentFileName = document.getElementById("documentFileName");

const selfieFileName = document.getElementById("selfieFileName");

/*==========================================================
SHOW FILE NAME
==========================================================*/

documentImage.addEventListener("change", () => {
  if (documentImage.files.length) {
    documentFileName.textContent = documentImage.files[0].name;
  }
});

selfieImage.addEventListener("change", () => {
  if (selfieImage.files.length) {
    selfieFileName.textContent = selfieImage.files[0].name;
  }
});

/*==========================================================
LOAD KYC STATUS
==========================================================*/

async function loadKYCStatus() {
  try {
    const response = await fetch(
      "/api/kyc/status",

      {
        credentials: "include",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return;
    }

    updateStatus(result.status, result.reason);
  } catch (error) {
    console.error(error);
  }
}

/*==========================================================
UPDATE STATUS
==========================================================*/

function updateStatus(status, reason = "") {
  statusIcon.className = "status-icon";

  kycForm.querySelectorAll("input, select, button").forEach((el) => {
    el.disabled = false;
  });

  submitButton.style.display = "flex";

  switch (status) {
    case "Not Submitted":
      statusTitle.textContent = "Verify Your Identity";

      statusText.textContent =
        "Complete KYC verification to unlock deposits, withdrawals and investing.";

      statusIcon.innerHTML = '<i class="fa-solid fa-id-card"></i>';

      kycStatus.textContent = "Verification Required";

      kycStatusMessage.textContent = "You have not submitted your KYC yet.";

      break;

    case "Pending":
      statusTitle.textContent = "Verification Pending";

      statusText.textContent = "Your documents are currently under review.";

      statusIcon.classList.add("pending");

      statusIcon.innerHTML = '<i class="fa-solid fa-clock"></i>';

      kycStatus.textContent = "Pending Verification";

      kycStatusMessage.textContent = "Review usually takes 24-48 hours.";

      disableForm();

      submitButton.style.display = "none";

      break;

    case "Verified":
      statusTitle.textContent = "Verification Complete";

      statusText.textContent = "Your account has been successfully verified.";

      statusIcon.classList.add("verified");

      statusIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

      kycStatus.textContent = "Identity Verified";

      kycStatusMessage.textContent = "You now have full access to PrimeTrade.";

      disableForm();

      submitButton.style.display = "none";

      break;

    case "Rejected":
      statusTitle.textContent = "Verification Rejected";

      statusText.textContent =
        "Please correct the issue below and submit again.";

      statusIcon.classList.add("rejected");

      statusIcon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';

      kycStatus.textContent = "Verification Rejected";

      kycStatusMessage.textContent = reason || "Your documents were rejected.";

      submitButton.style.display = "flex";

      break;
  }
}
/*==========================================================
DISABLE FORM
==========================================================*/

function disableForm() {
  kycForm.querySelectorAll("input,select,button").forEach((element) => {
    element.disabled = true;
  });
}

/*==========================================================
SUBMIT FORM
==========================================================*/

kycForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append(
    "fullName",

    document.getElementById("fullName").value,
  );

  formData.append(
    "dateOfBirth",

    document.getElementById("dateOfBirth").value,
  );

  formData.append(
    "nationality",

    document.getElementById("nationality").value,
  );

  formData.append(
    "documentType",

    document.getElementById("documentType").value,
  );

  formData.append(
    "documentNumber",

    document.getElementById("documentNumber").value,
  );

  formData.append(
    "documentImage",

    documentImage.files[0],
  );

  formData.append(
    "selfieImage",

    selfieImage.files[0],
  );

  try {
    const response = await fetch(
      "/api/kyc",

      {
        method: "POST",

        body: formData,

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
      "KYC submitted successfully.",

      "success",
    );

    updateStatus("Pending");

    kycForm.reset();

    documentFileName.textContent = "No file selected";

    selfieFileName.textContent = "No file selected";
  } catch (error) {
    console.error(error);

    showToast(
      "Unable to submit KYC.",

      "error",
    );
  }
});

/*==========================================================
INIT
==========================================================*/

loadKYCStatus();
