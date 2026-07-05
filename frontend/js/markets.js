"use strict";

/*==========================================================
PRIMETRADE MARKETS
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {
  loadHeroPrices();

  loadMarkets();

  initSearch();

  initRefresh();

  setInterval(loadHeroPrices, 30000);

  setInterval(loadMarkets, 30000);
});
/*==========================================================
LOAD LIVE MARKET
==========================================================*/

async function loadMarkets() {
  const table = document.getElementById("marketTable");

  if (!table) return;

  table.innerHTML = `
        <tr>
            <td colspan="7">
                <div class="market-loading">

                    <i class="fa-solid fa-spinner fa-spin"></i>

                    <p>Loading live market...</p>

                </div>
            </td>
        </tr>
    `;

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false",
    );

    if (!response.ok) {
      throw new Error("Failed to fetch market data.");
    }

    const coins = await response.json();

    let html = "";

   coins.forEach((coin, index) => {

    const price = coin.current_price ?? 0;

    const change = coin.price_change_percentage_24h ?? 0;

    const marketCap = coin.market_cap ?? 0;

    const volume = coin.total_volume ?? 0;

    html += `
        <tr>

            <td>${index + 1}</td>

            <td>
                <div class="coin-info">

                    <img src="${coin.image}" alt="${coin.name}">

                    <div>
                        <strong>${coin.name}</strong>
                        <small>${coin.symbol.toUpperCase()}</small>
                    </div>

                </div>
            </td>

            <td>$${price.toLocaleString()}</td>

            <td class="${change >= 0 ? "positive" : "negative"}">
                ${change.toFixed(2)}%
            </td>

            <td>$${marketCap.toLocaleString()}</td>

            <td>$${volume.toLocaleString()}</td>

            <td>
                <a href="/pages/register.html" class="trade-btn">
                    Invest
                </a>
            </td>

        </tr>
    `;

});

    table.innerHTML = html;
  } catch (error) {
    console.error(error);

    table.innerHTML = `
            <tr>

                <td colspan="7">

                    <div class="market-error">

                        <i class="fa-solid fa-circle-exclamation"></i>

                        <p>

                            Unable to load market data.

                        </p>

                    </div>

                </td>

            </tr>
        `;
  }
}

/*==========================================================
SEARCH
==========================================================*/

function initSearch() {
  const input = document.getElementById("marketSearch");

  if (!input) return;

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();

    const rows = document.querySelectorAll("#marketTable tr");

    rows.forEach((row) => {
      const coin = row.querySelector("strong");

      const symbol = row.querySelector("small");

      if (!coin || !symbol) return;

      const coinName = coin.textContent.toLowerCase();

      const coinSymbol = symbol.textContent.toLowerCase();

      row.style.display =
        coinName.includes(value) || coinSymbol.includes(value) ? "" : "none";
    });
  });
}

/*==========================================================
REFRESH BUTTON
==========================================================*/

function initRefresh() {
  const refreshBtn = document.getElementById("refreshMarkets");

  if (!refreshBtn) return;

  refreshBtn.addEventListener("click", async () => {
    refreshBtn.disabled = true;

    refreshBtn.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            Refreshing...

        `;

    await loadMarkets();

    refreshBtn.disabled = false;

    refreshBtn.innerHTML = `

            <i class="fa-solid fa-rotate-right"></i>

            Refresh

        `;
  });
}

/*==========================================================
LIVE HERO MARKET
==========================================================*/

async function loadHeroPrices() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana",
    );

    const data = await response.json();

    updateHeroCoin(
      "btc",
      data.find((c) => c.id === "bitcoin"),
    );

    updateHeroCoin(
      "eth",
      data.find((c) => c.id === "ethereum"),
    );

    updateHeroCoin(
      "bnb",
      data.find((c) => c.id === "binancecoin"),
    );

    updateHeroCoin(
      "sol",
      data.find((c) => c.id === "solana"),
    );
  } catch (err) {
    console.error(err);
  }
}

function updateHeroCoin(prefix, coin) {
  if (!coin) return;

  document.getElementById(`${prefix}-price`).textContent =
    "$" + coin.current_price.toLocaleString();

  const change = document.getElementById(`${prefix}-change`);

  change.textContent = `${coin.price_change_percentage_24h.toFixed(2)}%`;

  change.className = coin.price_change_percentage_24h >= 0 ? "green" : "red";
}


/*==========================================================
FAQ
==========================================================*/

document.querySelectorAll(".faq-question").forEach(question => {

    question.addEventListener("click", () => {

        const item = question.parentElement;

        document.querySelectorAll(".faq-item").forEach(faq => {

            if(faq !== item){

                faq.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});