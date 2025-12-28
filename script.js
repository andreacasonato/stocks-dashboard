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

  try {
    const timeSeries = await fetchStockData(symbol);

    displayStockInfo(symbol, timeSeries);
    displayChart(timeSeries);
  } catch (error) {
    showError(error.message);
  } finally {
    showLoading(false);
  }
}

// API Fetch Function
async function fetchStockData(symbol) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.Note) {
    throw new Error("API limit reached. Please wait 1 minute and try again.");
  }

  if (!data["Time Series (Daily)"]) {
    throw new Error("Invalid stock symbol.");
  }

  return data["Time Series (Daily)"];
}
