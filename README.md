# EcommerceClient

React + Vite frontend for the `ECommerceAPI` backend.

## Configure

1) Copy env and set your API URL (the client will append `/api` if missing):

```bash
cp .env.example .env.local
```

Edit `.env.local` and set `VITE_API_URL` to your API base, e.g. `http://localhost:5252`.

## Install & Run

```bash
npm install
npm run dev
```

Navigate to the local dev URL shown in the terminal.

## Features

- Browse products and categories
- Product details and add-to-cart
- Cart with quantity updates and checkout
- Auth: register, login, logout (JWT stored locally)
- Orders: create and view your orders

## Notes

- Protected routes: `/checkout`, `/orders`, `/profile` require login.
- The client decodes JWT for basic profile display. No `/me` endpoint is used.
