# PharmaSupply Blockchain - Developer Log (Context Handover)

## Active Session — 2026-06-28 UI/UX Overhaul

### Approved Palette
| Token | Hex | Use |
|---|---|---|
| `--off-white` | `#F1F6F4` | Light surface / text on dark |
| `--accent-orange` | `#FF8801` | Primary CTA, highlights |
| `--teal-deep` | `#114C5A` | Brand primary, sidebar, headers |
| `--teal-light` | `#D9E8E2` | Soft surface, muted backgrounds |
| `--amber` | `#FF9932` | Secondary accent, warnings |
| `--navy` | `#172B36` | Darkest background layer |

### Session TODO
- [x] Update `global.css` — replaced full palette, added Space Grotesk display font, glassmorphism variables, warm glow tokens
- [x] Update `Sidebar.css` — teal/navy frosted glass shell, glowing orange active nav indicator, improved group labels
- [x] Update `Header.css` — frosted glass header, gradient orange logo, orange login pill CTA, shimmer accent underline
- [x] Update `ProductCard.css` — warm orange glow on hover, teal category chip, shimmer image overlay, glassmorphic surface
- [x] Update `App.css` — increased content padding, teal-tinted mobile overlay
- [x] Update `DEVLOG.md` tasks on completion

**Session complete.** Next: run `npm run dev` to visually verify all palette and micro-interaction changes.

---

## Session — 2026-06-28 API 404 Bug Fixes

**Root Cause:** All `/api/*` calls returned 404 from Vite (`:5173`) not the backend (`:3000`). The proxy was correctly configured but the backend was not running. Secondary issues amplified the symptom.

### Fixes Applied
- [x] `productService.js` — `retry` helper now skips retries on any 4xx response (was silently looping 3+ times on every 404, causing the cascade of errors in the log)
- [x] `blockchainService.js` — Added missing `getTransactions(token)` method (was only called via raw inline `axios.get` in TransactionHistory)
- [x] `TransactionHistory.jsx` — Removed raw `axios` import; now uses `blockchainService.getTransactions()` for consistency with the rest of the service layer
- [x] `vite.config.js` — Added `ws: true` and a proxy `error` handler that logs a clear message when backend is unreachable

### To Verify
Run both servers concurrently:
\`\`\`bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev
\`\`\`
Then navigate to `/products`, `/admin` (UserManagement), and `/blockchain-transaction` — all three 404 error families should be resolved.




## Current Status (as of 2024-06-27 Remediation)

The project recently went through a major remediation phase focusing on security, smart contract access control, deployment configuration, and UI/UX polish. 

### Completed Phases
- **Phase 1 (Security & Correctness):** Fixed critical auth vulnerabilities (open password reset, JWT in localStorage, role self-elevation) and improved wallet key management by moving generation to the client.
- **Phase 2 (Smart Contract):** Integrated OpenZeppelin `AccessControl` for supplier/courier roles. Parameterized blockchain configuration in the backend.
- **Phase 3 (Deployment):** Dockerized the application with a MongoDB service, healthchecks, and non-root users. Set up a GitHub Actions CI workflow.
- **Phase 4 (UI/UX Polish):** Added explicit transitions, custom easing, active states, and reduced-motion support. Integrated auth loading states.
- **Phase 5 (Verification):** Backend (22 tests) and Contract (12 tests) are passing.

### Where We Left Off
- **Frontend Build:** The production frontend build step was pending user approval and needs to be verified.
- **Docker Compose:** The full Docker Compose stack smoke test was not run locally (only syntax validated).

## Next Steps / Backlog

When picking up development, the following items from the "Remaining Items / Out of Scope" list should be prioritized based on product needs:

1. **Email Integration:** Implement a real email provider for the password-reset flow (tokens are currently just logged).
2. **Production Key Management:** Evaluate and integrate a KMS/HSM signer for production blockchain key management instead of local private keys.
3. **Feature Development:** Build the prescription verification workflow and explore IoT/cold-chain integration.
4. **Testing:** Expand comprehensive frontend unit and E2E test coverage.
5. **Infrastructure:** Prepare cloud-specific deployment manifests (AWS/GCP/Azure) beyond the local Docker Compose setup.

## References
For detailed changes made during the recent audit, refer to `docs/REMEDIATION_LOG.md`.
