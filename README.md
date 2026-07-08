# 🔍 Web3 Wallet Inspector

A **single-page, client-side tool** for instantly looking up any Ethereum-compatible wallet address: balance, transaction count, account type, and current block number — across Ethereum, Polygon, Base, and Arbitrum.

**No wallet connection required. No API key required.** All lookups happen client-side directly against free public RPC endpoints, so nothing you search is sent to any third-party server.

---

## ✨ Features

- 🔐 **Privacy-first** — Client-side only, no external logging
- ⚡ **Fast** — Parallel RPC calls with retry logic
- 🌐 **Multi-chain** — Ethereum, Polygon, Base, Arbitrum
- 🔄 **Resilient** — Automatic retry on timeout/rate-limit
- 🎨 **Responsive** — Works on mobile, tablet, desktop
- ♿ **Accessible** — Keyboard navigation, proper ARIA labels

---

## 🚀 Live Demo

**[Deploy to GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)** — It's a static site, no build step needed.

1. Go to your repo **Settings → Pages**
2. Select **Deploy from branch**
3. Choose `main` and `/root`
4. Visit `https://yourusername.github.io/web3-wallet-inspector`

---

## 📖 Usage

### Run Locally

No install needed — it's plain HTML/JS. Just open `index.html` in a browser, or serve locally:

```bash
# Python 3
python -m http.server 8000
# visit http://localhost:8000

# Or Node.js
npx http-server
```

### Look Up an Address

1. Paste an Ethereum-style address (starting with `0x`)
2. Pick a network (Ethereum, Polygon, Base, Arbitrum)
3. Click **Inspect** — results appear in ~1–2 seconds
4. See balance, transaction count, account type, current block number

---

## 🔧 How It Works

- Uses **[ethers.js v6](https://docs.ethers.org/v6/)** (loaded via CDN)
- Queries public JSON-RPC endpoints from **[PublicNode](https://www.publicnode.com/)** (free, no signup)
- Validates address format client-side before making any network call
- Runs balance, tx count, block number, and contract-code checks in parallel
- Includes **automatic retry** with exponential backoff on timeouts
- **Input sanitization** to prevent XSS
- **Timeout protection** (8 seconds per request)

---

## ⚙️ Customize RPC Providers

If you hit public rate limits, use your own RPC provider:

1. Get a free tier key from **[Alchemy](https://www.alchemy.com/)** or **[Infura](https://www.infura.io/)**
2. Edit the `RPC_ENDPOINTS` object at the top of `app.js`:

```javascript
const RPC_ENDPOINTS = {
  eth: "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
  polygon: "https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY",
  base: "https://base-mainnet.g.alchemy.com/v2/YOUR_KEY",
  arbitrum: "https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY",
};
```

**⚠️ Never commit real API keys.** Use environment variables or `.env` files locally.

---

## 🧪 Testing

Try these addresses:

| Address | Chain | Type |
|---------|-------|------|
| `0x742d35Cc6634C0532925a3b844Bc9e7595f42bE9` | Ethereum | Popular EOA |
| `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | Ethereum | USDC Contract |
| `0x1234567890123456789012345678901234567890` | Ethereum | Invalid |

---

## 🔒 Security & Privacy

- ✅ Client-side only — no backend, no logging, no tracking
- ✅ No private keys, seeds, or sensitive data ever handled
- ✅ Input sanitized against XSS
- ✅ HTTPS required in production (GitHub Pages auto-enables)
- ✅ No cookies or local storage
- ✅ Content Security Policy headers configured

---

## 🗺️ Roadmap

- [ ] ENS name resolution (show `.eth` names)
- [ ] Recent transaction list (via Etherscan API)
- [ ] Testnet support (Sepolia, Polygon Amoy)
- [ ] Dark mode toggle
- [ ] Batch address lookups
- [ ] Export to CSV

---

## 🤝 Contributing

Found a bug or have a feature idea? Open an **[Issue](https://github.com/zeroorigin-dev/web3-wallet-inspector/issues)** or submit a **[PR](https://github.com/zeroorigin-dev/web3-wallet-inspector/pulls)**.

### Development Tips

- Keep it simple — no build tools or dependencies
- Test across browsers and mobile
- Update README with new features
- Follow the existing code style

---

## 📄 License

MIT — See **[LICENSE](LICENSE)** for details.

---

**Questions?** Open an issue or check the [ethers.js docs](https://docs.ethers.org/v6/).
