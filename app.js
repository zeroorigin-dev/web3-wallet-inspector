// Public, free RPC endpoints — no API key required.
// Swap these for your own provider (Alchemy/Infura free tier) if you hit rate limits.
const RPC_ENDPOINTS = {
  eth: "https://ethereum-rpc.publicnode.com",
  polygon: "https://polygon-bor-rpc.publicnode.com",
  base: "https://base-rpc.publicnode.com",
  arbitrum: "https://arbitrum-one-rpc.publicnode.com",
};

const NETWORK_NAMES = {
  eth: "Ethereum Mainnet",
  polygon: "Polygon",
  base: "Base",
  arbitrum: "Arbitrum One",
};

// RPC timeout and retry settings
const RPC_TIMEOUT_MS = 8000;
const RPC_MAX_RETRIES = 2;
const RPC_RETRY_DELAY_MS = 500;

const addressInput = document.getElementById("addressInput");
const networkSelect = document.getElementById("networkSelect");
const lookupBtn = document.getElementById("lookupBtn");
const statusDiv = document.getElementById("status");
const resultDiv = document.getElementById("result");

/**
 * Display status messages with type (error, loading, success)
 */
function setStatus(message, type) {
  if (!message) {
    statusDiv.innerHTML = "";
    return;
  }
  const classes = `status ${type}`;
  statusDiv.innerHTML = `<div class="${classes}">${escapeHtml(message)}</div>`;
}

/**
 * Escape HTML to prevent XSS when displaying user input
 */
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Shorten address for display
 */
function shorten(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

/**
 * Create a timeout promise
 */
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms)
    ),
  ]);
}

/**
 * Retry a failed RPC call with exponential backoff
 */
async function withRetry(fn, maxRetries = RPC_MAX_RETRIES) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        const delay = RPC_RETRY_DELAY_MS * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

/**
 * Format balance for display based on network
 */
function formatBalance(balanceEth, network) {
  const num = parseFloat(balanceEth);
  const ticker = network === "polygon" ? "MATIC" : "ETH";
  return `${num.toFixed(6)} ${ticker}`;
}

/**
 * Validate Ethereum address format
 */
function isValidAddress(addr) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

/**
 * Main lookup function with retry and timeout logic
 */
async function inspectAddress() {
  const address = addressInput.value.trim();
  const network = networkSelect.value;

  // Input validation
  if (!address) {
    setStatus("Enter a wallet address first.", "error");
    return;
  }

  if (!isValidAddress(address)) {
    setStatus(
      "Invalid Ethereum address. Must start with 0x and be 42 characters (0x + 40 hex chars).",
      "error"
    );
    return;
  }

  // UI feedback
  lookupBtn.disabled = true;
  resultDiv.innerHTML = "";
  setStatus(`Looking up ${shorten(address)} on ${NETWORK_NAMES[network]}...`, "loading");

  try {
    // Perform lookup with retry and timeout
    const result = await withRetry(async () => {
      const provider = new ethers.JsonRpcProvider(RPC_ENDPOINTS[network]);

      // Set timeout on individual calls
      const [balanceWei, txCount, blockNumber, code] = await Promise.all([
        withTimeout(provider.getBalance(address), RPC_TIMEOUT_MS),
        withTimeout(provider.getTransactionCount(address), RPC_TIMEOUT_MS),
        withTimeout(provider.getBlockNumber(), RPC_TIMEOUT_MS),
        withTimeout(provider.getCode(address), RPC_TIMEOUT_MS),
      ]);

      return { balanceWei, txCount, blockNumber, code };
    });

    const balanceEth = ethers.formatEther(result.balanceWei);
    const isContract = result.code !== "0x";

    // Display results
    setStatus("", "");
    resultDiv.innerHTML = `
      <div class="card">
        <div class="row">
          <span class="label">Address</span>
          <span class="value copy-address" title="Click to copy">${escapeHtml(address)}</span>
        </div>
        <div class="row">
          <span class="label">Network</span>
          <span class="value">${escapeHtml(NETWORK_NAMES[network])}</span>
        </div>
        <div class="row">
          <span class="label">Balance</span>
          <span class="value">${escapeHtml(formatBalance(balanceEth, network))}</span>
        </div>
        <div class="row">
          <span class="label">Transaction count (nonce)</span>
          <span class="value">${result.txCount}</span>
        </div>
        <div class="row">
          <span class="label">Account type</span>
          <span class="value">${isContract ? "🔒 Smart Contract" : "👤 Externally Owned Account (wallet)"}</span>
        </div>
        <div class="row">
          <span class="label">Current block</span>
          <span class="value">${result.blockNumber.toLocaleString()}</span>
        </div>
      </div>
    `;

    // Add copy-to-clipboard functionality
    document.querySelector(".copy-address").addEventListener("click", (e) => {
      navigator.clipboard.writeText(address);
      const el = e.target;
      const original = el.textContent;
      el.textContent = "✓ Copied!";
      setTimeout(() => {
        el.textContent = original;
      }, 2000);
    });
  } catch (err) {
    console.error("Lookup error:", err);
    let userMessage = "Lookup failed: ";
    if (err.message && err.message.includes("timeout")) {
      userMessage += "Request timed out. The RPC endpoint may be slow — try again in a moment.";
    } else if (err.message && err.message.includes("429")) {
      userMessage += "Rate limited by public RPC. Try again in 30 seconds or use a private RPC key.";
    } else if (err.code === "NETWORK_ERROR") {
      userMessage += "Network error. Check your internet connection.";
    } else {
      userMessage += err.message || "Unknown error";
    }
    setStatus(userMessage, "error");
  } finally {
    lookupBtn.disabled = false;
  }
}

// Event listeners
lookupBtn.addEventListener("click", inspectAddress);
addressInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") inspectAddress();
});

// Clear result when user starts typing a new address
addressInput.addEventListener("input", () => {
  if (resultDiv.innerHTML) {
    resultDiv.innerHTML = "";
    setStatus("", "");
  }
});
