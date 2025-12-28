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

// ----- API Fetch Function -----

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

// ----- Display Stock Info -----
function displayStockInfo(symbol, series) {
  const dates = Object.keys(series);
  const latestDate = dates[0];
  const latest = series[latestDate];
  const previous = series[dates[1]];

  document.getElementById("symbol").textContent = symbol;
  document.getElementById("price").textContent =
    "$" + parseFloat(latest["4. close"]).toFixed(2);

  document.getElementById("prevClose").textContent =
    "$" + parseFloat(previous["4. close"]).toFixed(2);

  document.getElementById("open").textContent =
    "$" + parseFloat(latest["1. open"]).toFixed(2);

  document.getElementById("high").textContent =
    "$" + parseFloat(latest["2. high"]).toFixed(2);

  document.getElementById("low").textContent =
    "$" + parseFloat(latest["3. low"]).toFixed(2);

  const volume = parseInt(latest["5. volume"]);
  document.getElementById("volume").textContent = volume.toLocaleString();

  const change =
    parseFloat(latest["4. close"]) - parseFloat(previous["4. close"]);

  const changePercent = ((change / previous["4. close"]) * 100).toFixed(2);

  const changeEl = document.getElementById("change");
  changeEl.textContent = `${change >= 0 ? "+" : ""}${change.toFixed(
    2
  )} (${changePercent}%)`;
  changeEl.style.color = change >= 0 ? "#10b981" : "#ef4444";

  document.getElementById("stockInfo").classList.add("show");
}
