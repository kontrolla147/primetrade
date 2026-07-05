"use strict";

/*==========================================================
ELEMENTS
==========================================================*/
const walletBox = document.getElementById("walletBox");
const depositForm = document.getElementById("depositForm");

const coinSelect = document.getElementById("coin");

const walletAddress = document.getElementById("walletAddress");

const copyWalletBtn = document.getElementById("copyWallet");

/*==========================================================
LOAD WALLET
==========================================================*/

coinSelect.addEventListener("change", async () => {

    const coin = coinSelect.value;

    if(!coin){

        walletBox.classList.add("hidden");

        walletAddress.textContent =
        "Select a cryptocurrency to view wallet address.";

        return;

    }

    walletBox.classList.remove("hidden");

    try{

        const response = await fetch(`/api/deposits/wallet/${coin}`);

        const data = await response.json();

        if(!response.ok){

            showToast(data.message,"error");

            return;

        }

        walletAddress.textContent = data.wallet;

    }

    catch(error){

        console.error(error);

        showToast("Unable to load wallet.","error");

    }

});
/*==========================================================
COPY WALLET
==========================================================*/

copyWalletBtn.addEventListener("click", async () => {
  const wallet = walletAddress.textContent.trim();

  if (
    wallet === "" ||
    wallet === "Select a cryptocurrency to view wallet address."
  ) {
    showToast("Select a cryptocurrency first.", "error");

    return;
  }

  try {
    await navigator.clipboard.writeText(wallet);

    showToast("Wallet copied successfully.", "success");
  } catch (error) {
    console.error(error);

    showToast("Unable to copy wallet.", "error");
  }
});

/*==========================================================
SUBMIT
==========================================================*/

depositForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = depositForm.querySelector(".deposit-btn");

  const data = {
    amount: Number(document.getElementById("amount").value),

    coin: coinSelect.value,
  };

  if (data.amount <= 0) {
    showToast("Enter a valid amount.", "error");

    return;
  }

  if (!data.coin) {
    showToast("Select a cryptocurrency.", "error");

    return;
  }

  submitBtn.disabled = true;

  submitBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Processing...
    `;

  try {
    const response = await fetch(
      "/api/deposits",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(data),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      showToast(result.message, "error");

      submitBtn.disabled = false;

      submitBtn.innerHTML = `
                <i class="fa-solid fa-paper-plane"></i>
                Submit Deposit
            `;

      return;
    }

    showToast(
      "Deposit request submitted successfully.",

      "success",
    );

    depositForm.reset();

    walletAddress.textContent =
      "Select a cryptocurrency to view wallet address.";

    submitBtn.disabled = false;

    submitBtn.innerHTML = `
            <i class="fa-solid fa-paper-plane"></i>
            Submit Deposit
        `;

    loadDepositHistory();
  } catch (error) {
    console.error(error);

    showToast("Server Error.", "error");

    submitBtn.disabled = false;

    submitBtn.innerHTML = `
            <i class="fa-solid fa-paper-plane"></i>
            Submit Deposit
        `;
  }
});

/*==========================================================
LOAD HISTORY
==========================================================*/

async function loadDepositHistory() {
  try {
    const response = await fetch(
      "/api/deposits",

      {
        credentials: "include",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return;
    }

    const tbody = document.getElementById("depositHistory");

    tbody.innerHTML = "";

    result.deposits.forEach((deposit) => {
      tbody.innerHTML += `

                <tr>

                    <td>$${deposit.amount}</td>

                    <td>${deposit.coin}</td>

                    <td>${deposit.status}</td>

                    <td>

                        ${new Date(deposit.createdAt).toLocaleDateString()}

                    </td>

                </tr>

            `;
    });
  } catch (error) {
    console.error(error);
  }
}

loadDepositHistory();
