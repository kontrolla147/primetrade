"use strict";

(() => {

/*==========================================================
ELEMENTS
==========================================================*/

const transactionTable = document.getElementById("transactionTable");

const filter = document.getElementById("transactionFilter");

const search = document.getElementById("searchTransaction");

const previousBtn = document.getElementById("previousPage");

const nextBtn = document.getElementById("nextPage");

const currentPageText = document.getElementById("currentPage");

const totalPagesText = document.getElementById("totalPages");

const transactionModal = document.getElementById("transactionModal");

const closeTransactionButton = document.getElementById("closeTransactionModal");

let currentPage = 1;


const limit = 10;

let totalPages = 1;

let searchText = "";

let filterType = "all";

/*==========================================================
LOAD TRANSACTIONS
==========================================================*/

async function loadTransactions() {
  try {
    const response = await fetch(
      `/api/transactions?page=${currentPage}&limit=${limit}&type=${filterType}&search=${searchText}`,

      {
        credentials: "include",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      showToast(result.message, "error");

      return;
    }

    renderTransactions(result.transactions);

    totalPages = result.totalPages || 1;

    currentPageText.textContent = currentPage;

    totalPagesText.textContent = totalPages;

    previousBtn.disabled = currentPage === 1;

    nextBtn.disabled = currentPage === totalPages;
  } catch (error) {
    console.error(error);

    showToast(
      "Unable to load transactions.",

      "error",
    );
  }
}

/*==========================================================
RENDER TRANSACTIONS
==========================================================*/

function renderTransactions(transactions) {
  transactionTable.innerHTML = "";

  if (transactions.length === 0) {
    transactionTable.innerHTML = `

            <tr>

                <td colspan="6">

                    <div class="empty-state">

                        <i class="fa-regular fa-folder-open"></i>

                        <h3>No Transactions Found</h3>

                        <p>

                            Your transaction history will appear here.

                        </p>

                    </div>

                </td>

            </tr>

        `;

    return;
  }

  transactions.forEach((transaction) => {
    transactionTable.innerHTML += `

            <tr>

                <td>

                    <span class="type ${transaction.type.toLowerCase()}">

                        ${getTypeIcon(transaction.type)}

                        ${transaction.type}

                    </span>

                </td>

                <td>

                    $${Number(transaction.amount).toFixed(2)}

                </td>

                <td>

                    <span class="status ${transaction.status.toLowerCase()}">

                        ${transaction.status}

                    </span>

                </td>

                <td>

                    ${new Date(transaction.createdAt).toLocaleDateString()}

                </td>

                <td>

                    <button

                        class="copy-reference"

                        data-reference="${transaction.reference}">

                        ${transaction.reference}

                        <i class="fa-regular fa-copy"></i>

                    </button>

                </td>

                <td>

                    <button

                        class="view-btn"

                        data-id="${transaction._id}">

                        View

                    </button>

                </td>

            </tr>

        `;
  });

  initializeCopyButtons();

  initializeViewButtons();
}

/*==========================================================
TYPE ICON
==========================================================*/

function getTypeIcon(type) {
  switch (type) {
    case "Deposit":
      return '<i class="fa-solid fa-arrow-down"></i>';

    case "Withdrawal":
      return '<i class="fa-solid fa-arrow-up"></i>';

    case "Investment Profit":
      return '<i class="fa-solid fa-coins"></i>';

    case "Investment":
      return '<i class="fa-solid fa-chart-line"></i>';

    case "Bonus":
      return '<i class="fa-solid fa-gift"></i>';

    default:
      return '<i class="fa-solid fa-money-bill"></i>';
  }
}

/*==========================================================
COPY REFERENCE
==========================================================*/

function initializeCopyButtons() {
  document.querySelectorAll(".copy-reference").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.reference);

        showToast(
          "Reference copied successfully.",

          "success",
        );
      } catch (error) {
        console.error(error);
      }
    });
  });
}

/*==========================================================
VIEW TRANSACTION
==========================================================*/

function initializeViewButtons() {
  document.querySelectorAll(".view-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const response = await fetch(
          `/api/transactions/${button.dataset.id}`,

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

        openTransactionModal(result.transaction);
      } catch (error) {
        console.error(error);
      }
    });
  });
}

/*==========================================================
OPEN MODAL
==========================================================*/

function openTransactionModal(transaction) {
  document.getElementById("detailType").textContent = transaction.type;

  document.getElementById("detailAmount").textContent =
    "$" + transaction.amount;

  document.getElementById("detailStatus").textContent = transaction.status;

  document.getElementById("detailDate").textContent = new Date(
    transaction.createdAt,
  ).toLocaleString();

  document.getElementById("detailReference").textContent =
    transaction.reference;

  document.getElementById("detailDescription").textContent =
    transaction.description || "-";

 transactionModal.classList.remove("hidden");

transactionModal.classList.add("show");
}

/*==========================================================
CLOSE MODAL
==========================================================*/

closeTransactionButton.addEventListener("click", () => {

    transactionModal.classList.remove("show");

    transactionModal.classList.add("hidden");

});

transactionModal.addEventListener("click", (e) => {

    if (e.target === transactionModal) {

        transactionModal.classList.remove("show");

        transactionModal.classList.add("hidden");

    }

});

/*==========================================================
SEARCH
==========================================================*/

search.addEventListener("input", () => {
  searchText = search.value.trim();

  currentPage = 1;

  loadTransactions();
});

/*==========================================================
FILTER
==========================================================*/

filter.addEventListener("change", () => {
  filterType = filter.value;

  currentPage = 1;

  loadTransactions();
});

/*==========================================================
PAGINATION
==========================================================*/

previousBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;

    loadTransactions();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;

    loadTransactions();
  }
});

/*==========================================================
INIT
==========================================================*/

loadTransactions();
})();