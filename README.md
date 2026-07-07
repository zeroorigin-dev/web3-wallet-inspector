# Web3 Wallet Inspector

A single-page, no-backend tool for looking up any Ethereum-compatible wallet address: balance, transaction count, contract-vs-wallet detection, and current block number — across Ethereum, Polygon, Base, and Arbitrum.

No wallet connection required. No API key required. All lookups happen client-side directly against free public RPC endpoints, so nothing you search is sent to any third-party server.

## Why this exists

Handy as a quick reference tool during Web3 QA / dApp testing work — verify a testnet transaction landed, sanity-check a wallet balance, or confirm whether an address is a contract before interacting with it.

## Live demo

Deploy this as a static site via GitHub Pages (Settings → Pages → deploy from `main` branch) and it just works — no build step needed.

## Run locally

No install needed — it's plain HTML/JS. Just open `index.html` in a browser, or serve it locally:

```bash
python -m http.server 8000
# visit http://localhost:8000
```

## How it works

- Uses [ethers.js v6](https://docs.ethers.org/v6/) (loaded via CDN) to talk directly to public JSON-RPC endpoints ([publicnode.com](https://www.publicnode.com/), free, no signup).
- Validates the address format client-side before making any network call.
- Runs balance, tx count, block number, and contract-code checks in parallel for a fast result.

## Customizing

To use your own RPC provider (e.g. if you hit public rate limits), edit the `RPC_ENDPOINTS` object at the top of `app.js`:

```js
const RPC_ENDPOINTS = {
  eth: "https://your-alchemy-or-infura-url-here",
  ...
};
```

Get a free tier key from [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/) if needed — never commit real API keys to a public repo; use environment variables or a `config.local.js` (gitignored) instead.

## Roadmap / ideas for contributions

- [ ] ENS name resolution (show `.eth` name if available)
- [ ] Recent transaction list (via a block explorer API)
- [ ] Testnet support (Sepolia, Polygon Amoy)
- [ ] Dark mode

## License

MIT
