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

const addressInput = document.getElementById("addressInput");
const networkSelect = document.getElementById("networkSelect");
const lookupBtn = document.getElementById("lookupBtn");
const statusDiv = document.getElementById("status");
const resultDiv = document.getElementById("result");

function setStatus(message, type) {
  if (!message) {
    statusDiv.innerHTML = "";
    return;
  }
  statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
}

function shorten(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

async function inspectAddress() {
  const address = addressInput.value.trim();
  const network = networkSelect.value;

  if (!address) {
    setStatus("Enter a wallet address first.", "error");
    return;
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    setStatus("That doesn't look like a valid Ethereum-style address (should start with 0x and be 42 characters).", "error");
    return;
  }

  lookupBtn.disabled = true;
  resultDiv.innerHTML = "";
  setStatus("Looking up address on " + NETWORK_NAMES[network] + "...", "loading");

  try {
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINTS[network]);

    const [balanceWei, txCount, blockNumber, code] = await Promise.all([
      provider.getBalance(address),
      provider.getTransactionCount(address),
      provider.getBlockNumber(),
      provider.getCode(address),
    ]);

    const balanceEth = ethers.formatEther(balanceWei);
    const isContract = code !== "0x";

    setStatus("", "");
    resultDiv.innerHTML = `
      <div class="card">
        <div class="row"><span class="label">Address</span><span class="value">${address}</span></div>
        <div class="row"><span class="label">Network</span><span class="value">${NETWORK_NAMES[network]}</span></div>
        <div class="row"><span class="label">Balance</span><span class="value">${parseFloat(balanceEth).toFixed(6)} ${network === "polygon" ? "MATIC" : "ETH"}</span></div>
        <div class="row"><span class="label">Transaction count (nonce)</span><span class="value">${txCount}</span></div>
        <div class="row"><span class="label">Account type</span><span class="value">${isContract ? "Smart Contract" : "Externally Owned Account (wallet)"}</span></div>
        <div class="row"><span class="label">Current block</span><span class="value">${blockNumber.toLocaleString()}</span></div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    setStatus("Lookup failed: " + (err.message || "unknown error") + ". The public RPC may be rate-limited — try again in a moment.", "error");
  } finally {
    lookupBtn.disabled = false;
  }
}

lookupBtn.addEventListener("click", inspectAddress);
addressInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") inspectAddress();
});
