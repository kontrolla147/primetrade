"use strict";

/*==========================================================
ELEMENTS
==========================================================*/

const btcWallet = document.getElementById("btcWallet");

const ethWallet = document.getElementById("ethWallet");

const trcWallet = document.getElementById("trcWallet");

const ercWallet = document.getElementById("ercWallet");

/*==========================================================
STORE FULL ADDRESSES
==========================================================*/

const walletAddresses = {};

/*==========================================================
SHORTEN ADDRESS
==========================================================*/

function shortenAddress(address) {
  if (!address) return "Not Available";

  if (address.length <= 20) {
    return address;
  }

  return `${address.slice(0, 8)}...${address.slice(-8)}`;
}

/*==========================================================
LOAD WALLETS
==========================================================*/

async function loadWallets() {
  try {
    const response = await fetch(
      "/api/wallets",

      {
        credentials: "include",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      showToast(result.message, "error");

      return;
    }

    walletAddresses.btcWallet = result.BTC;

    walletAddresses.ethWallet = result.ETH;

    walletAddresses.trcWallet = result.USDT_TRC20;

    walletAddresses.ercWallet = result.USDT_ERC20;

    btcWallet.textContent = shortenAddress(result.BTC);

    ethWallet.textContent = shortenAddress(result.ETH);

    trcWallet.textContent = shortenAddress(result.USDT_TRC20);

    ercWallet.textContent = shortenAddress(result.USDT_ERC20);
  } catch (error) {
    console.error(error);

    showToast(
      "Unable to load wallet addresses.",

      "error",
    );
  }
}

/*==========================================================
SHOW / HIDE ADDRESS
==========================================================*/

document.querySelectorAll(".toggle-address").forEach((button) => {
  button.addEventListener("click", () => {
    const walletId = button.dataset.wallet;

    const span = document.getElementById(walletId);

    const fullAddress = walletAddresses[walletId];

    if (button.dataset.open === "true") {
      span.textContent = shortenAddress(fullAddress);

      button.dataset.open = "false";

      button.innerHTML = `

                <i class="fa-regular fa-eye"></i>

                Show Full

            `;
    } else {
      span.textContent = fullAddress;

      button.dataset.open = "true";

      button.innerHTML = `

                <i class="fa-regular fa-eye-slash"></i>

                Hide Address

            `;
    }
  });
});

/*==========================================================
COPY ADDRESS
==========================================================*/

document.querySelectorAll(".copy-wallet").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      const walletId = button.dataset.wallet;

      await navigator.clipboard.writeText(walletAddresses[walletId]);

      showToast(
        "Wallet address copied successfully.",

        "success",
      );
    } catch (error) {
      console.error(error);
    }
  });
});

/*==========================================================
INIT
==========================================================*/

loadWallets();
