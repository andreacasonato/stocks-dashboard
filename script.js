// ----- CONFIGURATION VARIABLES -----

const API_KEY = "B296NQOAOTD70U3Y";
let myChart = null;

// ----- DOM ELEMENTS -----

const stockInput = document.getElementById("stockInput");
const searchBtn = document.getElementById("searchBtn");

// ----- EVENT LISTENERS -----

searchBtn.addEventListener("click", searchStock);

stockInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchStock();
  }
});

// ----- MAIN FUNCTION -----

async function searchStock() {
  const symbol = stockInput.value.trim().toUpperCase();

  if (!symbol) {
    showError("Please enter a stock symbol");
    return;
  }

  hideError();
  showLoading(true);
  hideStockInfo();
}
