# Ledger — Frontend

A React + Vite frontend for the backend ledger service. It provides authentication,
account management, balance tracking, and fund transfers, integrating with the
existing Express/MongoDB backend through its real APIs.

> The backend in this repository is treated as **read-only**. This client talks to
> it exactly as it is and does not modify any backend file, route, or contract.

## Tech stack

- **React 18** + **Vite** (JavaScript, ES modules)
- **React Router** for routing
- **axios** for the API layer
- **lucide-react** for icons
- Hand-authored CSS with design tokens (no UI framework)

Auth is handled via React Context; server state via small hooks — no Redux/React Query
(the app doesn't need them).

## Getting started

```bash
cd client
npm install
npm run dev
```

The app runs at **http://localhost:5173** and expects the backend on **http://localhost:3000**.

### Why a dev proxy?

The backend does not send CORS headers, so a browser app on another origin can't call
it directly. In development, Vite proxies `/api` → `http://localhost:3000`
(see `vite.config.js`), making requests same-origin so the auth cookie works — **without
changing the backend**. For production you'd serve the client from the same origin as the
API, or add CORS to the backend.

## Environment

Copy `.env.example` to `.env` if you need to override the API base URL:

```
VITE_API_BASE_URL=/api
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (with API proxy) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── api/          # one function per backend endpoint (axios)
├── components/
│   ├── ui/       # reusable primitives (Button, Field, Modal, Toast…)
│   └── layout/   # Navbar, AppLayout, ProtectedRoute
├── context/      # AuthContext (session state)
├── hooks/        # useFetch (loading/error/reload)
├── pages/        # Login, Register, Dashboard, AccountDetail, Transfer, NotFound
└── utils/        # formatting helpers
```

## Auth

- On login/register the backend returns a user and a JWT, and sets an auth cookie.
- The cookie (sent via the proxy) is the primary auth mechanism; the token is also kept
  **in memory** as an `Authorization` header. The JWT is **never stored in localStorage** —
  only the non-sensitive user object is persisted, for UI state.
- A global 401 interceptor logs the user out when a token expires or is blacklisted.

## Known backend limitations (handled, not worked around in the backend)

- **No "list transactions" endpoint** → there is no transaction-history page. The app shows
  accounts, balances, and lets you make transfers.
- **Transfers take ~15s** due to a delay in the backend's transaction code → the UI shows a
  clear loading state while the request is in flight.
- **No user directory** → the transfer form takes the recipient's **account ID** directly.
- **System funding** (`/transactions/system/initial-funds`) requires a privileged `systemUser`
  and is not exposed in the normal UI.
