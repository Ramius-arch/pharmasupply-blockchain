# Remediation Log — PharmaSupply Blockchain

This file documents the investigation findings and remediation steps taken to move the project toward production readiness.

## 2024-06-27 — Initial Audit

### Findings
- Critical auth/authorization gaps: self-elevation to admin/supplier, password hash leaked in responses, open password reset, JWT in localStorage, admin UI routes public.
- Smart contract has no access control.
- Backend exposes generated wallet private keys via API.
- Deployment config has hardcoded secrets and no MongoDB service.
- `backend/package.json` start script references wrong filename casing (`server.js` vs `Server.js`).
- Blockchain write failures are swallowed, causing DB/chain inconsistency.
- Global `BigInt.prototype.toJSON` mutation.
- UI/UX uses generic `transition: all`, inconsistent animation easing, missing reduced-motion support, and lacks press/active feedback.

### Plan
Phased remediation: (1) Security & correctness, (2) Smart contract & blockchain, (3) Deployment & DevOps, (4) UI/UX polish, (5) Verification & docs.

---

## Phase 1 — Security & Correctness

### Authentication & authorization
- **File**: `backend/middleware/validation.middleware.js`
  - Removed `role` from `registerSchema`. All new registrations default to `user`.
  - Increased minimum password length from 6 to 8 characters.
  - Added `forgotPasswordSchema` and `resetPasswordSchema`.
- **File**: `backend/services/auth.service.js`
  - `registerUser` now ignores any `role` passed by the client and forces `role: 'user'`.
  - Added `createPasswordResetToken` and replaced open `resetPassword` with token-verified flow.
  - Login now uses centralized `JWT_SECRET` from `config/env.js`.
- **File**: `backend/models/user.model.js`
  - Added `passwordResetToken` and `passwordResetExpires` fields.
  - Added `toJSON`/`toObject` transforms that strip `password` from serialized output.
  - Increased `password` minlength from 6 to 8.
- **File**: `backend/controllers/auth.controller.js`
  - Removed `role` from registration handler.
  - Added `forgotPassword` and `resetPassword` controllers.
- **File**: `backend/routes/auth.routes.js`
  - Wired `/forgot-password` and `/reset-password` endpoints.
- **File**: `backend/services/user.service.js`, `backend/controllers/user.controller.js`, `backend/routes/user.routes.js`
  - Added admin-only `PATCH /api/users/:userId/role` for role promotion.
- **File**: `frontend/src/App.jsx`
  - Wrapped `/admin` and `/dashboard` in `<ProtectedRoute allowedRoles={['admin', 'supplier']}>`.
- **File**: `backend/Server.js`
  - Added stricter auth rate limiter (`/api/auth/*`): 10 requests per 15 min.
  - Made CORS origin configurable via `CORS_ORIGIN` env var.
  - Added graceful shutdown handlers for `SIGTERM`/`SIGINT`.

### Wallet / key management
- **File**: `backend/controllers/wallet.controller.js`
  - Disabled server-side private-key generation; endpoint now returns `410` with guidance.
- **File**: `frontend/src/components/GenerateWallet/GenerateWallet.jsx`
  - Wallet is now generated locally in the browser with `ethers.Wallet.createRandom()`.
- **File**: `frontend/package.json`
  - Added `ethers` as a frontend dependency.

### Blockchain reliability
- **File**: `backend/services/product.service.js`
  - Product creation now fails closed: if the on-chain item cannot be created, the product is not saved.
- **File**: `backend/Server.js`
  - Removed global `BigInt.prototype.toJSON` mutation.
- **File**: `backend/package.json`
  - Fixed casing: `node Server.js` (was `node server.js`).

## Phase 2 — Smart Contract & Blockchain

- **File**: `web3/contracts/SupplyChain.sol`
  - Replaced `UNLICENSED` with `MIT` SPDX identifier.
  - Integrated OpenZeppelin `AccessControl`.
  - Added `SUPPLIER_ROLE` and `COURIER_ROLE`.
  - Restricted `createItem` to `SUPPLIER_ROLE`.
  - Restricted `updateItemStatus` to `COURIER_ROLE`.
  - Added constructor that requires a non-zero admin address.
- **File**: `web3/scripts/deploy.js`
  - Updated deployment to pass admin address.
  - Auto-grants supplier/courier roles to Hardhat test accounts in local development.
- **File**: `web3/test/SupplyChain.test.js`
  - Rewrote tests to verify access-control revert cases and role-based permissions.
- **File**: `web3/package.json`
  - Added `@openzeppelin/contracts` dependency and a proper `test` script.
- **File**: `package.json` (root)
  - Added `web3` to workspaces.
- **Files**: `backend/config/env.js`, `backend/config/blockchain.js`, `backend/services/blockchain.service.js`
  - Parameterized RPC URL, private key, contract address, and ABI via environment variables.
  - Added graceful fallbacks and missing-configuration warnings.
- **File**: `backend/.env.example`
  - Replaced hardcoded secrets with placeholders and documented all new variables.

## Phase 3 — Deployment & DevOps

- **File**: `docker-compose.yml`
  - Added `mongodb` service with persistent volume and healthcheck.
  - Removed hardcoded secrets; services now load env from `./backend/.env`.
  - Added healthchecks for Hardhat and backend.
  - Frontend now exposes port `5173:80` for nginx production build.
- **File**: `backend/Dockerfile`
  - Added `curl` for healthchecks.
  - Added non-root `appuser`.
- **File**: `frontend/Dockerfile`
  - Switched to multi-stage build producing an nginx-served production build.
- **File**: `.github/workflows/ci.yml`
  - Added CI workflow for backend tests, Hardhat tests, and frontend build/lint.

## Phase 4 — UI/UX Polish

- **File**: `frontend/src/styles/global.css`
  - Replaced generic `transition: var(--transition)` with explicit property transitions.
  - Added custom easing variables (`--ease-out`, `--ease-in-out`).
  - Added `:active` press feedback on cards and buttons.
  - Added disabled states and `cursor: not-allowed`.
  - Added `@media (prefers-reduced-motion: reduce)` support.
- **File**: `frontend/src/components/Layout/Sidebar.css`
  - Explicit transitions on nav links; added `:active` scale feedback.
- **File**: `frontend/src/components/ProductCard/ProductCard.css`
  - Explicit transitions; added `:active` feedback.
- **File**: `frontend/src/App.css`
  - Updated sidebar/main transition to use custom easing.
- **File**: `frontend/src/context/AuthContext.jsx`
  - Added `authLoading` state for login/register actions.
- **File**: `frontend/src/components/Register/Register.jsx`
  - Uses shared `loading` state from context; updated password min length to 8.
- **File**: `frontend/src/components/ForgotPassword/ForgotPassword.jsx`
  - Integrated real `authService.forgotPassword` backend call.
- **File**: `frontend/src/api/authService.js`
  - Added `forgotPassword` and `resetPassword` methods.

## Phase 5 — Verification

- **Backend tests**: `cd backend && npm test` → 22 tests passing.
- **Contract tests**: `cd web3 && npx hardhat test` → 12 tests passing.
- **Frontend build**: Pending user approval (build command was rejected during session).
- **Docker Compose smoke test**: Not run locally; configuration validated for syntax.

## Remaining Items / Out of Scope

- Full email provider integration for password-reset emails (tokens are currently logged for testing).
- KMS/HSM signer for production blockchain key management.
- Prescription verification workflow and IoT/cold-chain integration.
- Comprehensive frontend unit/E2E test coverage beyond existing files.
- Cloud-specific deployment (AWS/GCP/Azure) beyond Docker Compose.

