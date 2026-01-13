telebirr-node

A simple, opinionated Node.js SDK for integrating Telebirr payments (C2B) with automatic signing, token handling, and checkout URL generation.

Designed to be:

Simple to use
Spec-aligned with Telebirr
Production-ready
Framework-agnostic (Express, Fastify, etc.)

Installation

npm install telebirr-node

Required Configuration

Telebirr requires five credentials, plus callback URLs.
You should never hard-code secrets.
Always load them from process.env.

Required credentials
Name Description
FABRIC_APP_ID Fabric application ID
FABRIC_APP_SECRET Fabric application secret
MERCHANT_APP_ID Merchant app ID
MERCHANT_CODE Merchant code
MERCHANT_PRIVATE_KEY RSA private key (PEM string)
Required URLs
Name Description
TELEBIRR_NOTIFY_URL Server-to-server callback
TELEBIRR_REDIRECT_URL User redirect after payment

Basic Setup
import { TelebirrClient } from "telebirr-node";

const client = new TelebirrClient({
mode: "sandbox", // "simulate" | "sandbox" | "production"

fabricAppId: process.env.FABRIC_APP_ID!,
appSecret: process.env.FABRIC_APP_SECRET!,

merchantAppId: process.env.MERCHANT_APP_ID!,
merchantCode: process.env.MERCHANT_CODE!,
privateKey: process.env.MERCHANT_PRIVATE_KEY!,

notifyUrl: process.env.TELEBIRR_NOTIFY_URL!,
redirectUrl: process.env.TELEBIRR_REDIRECT_URL!,

http: true, // allow http in simulator
IntegrationOption: "C2B",
});

MERCHANT_PRIVATE_KEY must be the full PEM string, including
-----BEGIN RSA PRIVATE KEY-----

Express Demo (Simulator)

Below is a complete demo using three routes:

POST /payment/initiate
POST /payment/refund
GET /payment/status/:merchOrderId

Initiate Payment

Creates an order and redirects the user to Telebirr checkout.

app.post("/payment/initiate", async (req, res) => {
const checkoutUrl = await client.generateCheckoutUrl({
merchOrderId: "order123",
title: "Phone",
amount: "12",
callbackInfo: "from web checkout",
});

res.redirect(checkoutUrl);
});

What happens internally:

Fabric token is fetched (and cached)

Order is signed and created

Checkout URL is generated

User is redirected
if you are using frontend frame work like react and do not want to lose state only send the checkout url as a json reponse and let the frame work handle the redirection

Query Payment Status

Used to check payment result by merchant order ID.

app.get("/payment/status/:merchOrderId", async (req, res) => {
const { merchOrderId } = req.params;

const info = await client.queryOrder(merchOrderId);

res.json(info);
});

Typical use cases:

Payment confirmation page

Background reconciliation

Admin dashboard

Refund Payment

Refunds a completed transaction.

app.post("/payment/refund", async (req, res) => {
const refundData = await client.refund({
merchOrderId: "order123",
refundRequestNo: "original-transaction-id",
refundReason: "customer request",
amount: "12",
});

res.json(refundData);
});

Notes:

refundRequestNo must be unique

Refund amount ≤ original payment amount

🧪 Simulator Mode

To use the Simulator provided by the package:

import { generateCredentials } from "./src/utils/credentials";
import { TelebirrClient } from "./src/client/telebirrClient";

const creds = generateCredentials();

const client = new TelebirrClient({
mode: "simulate",
fabricAppId: creds.fabricAppId,
appSecret: creds.fabricAppSecret,
merchantAppId: creds.merchantAppId,
merchantCode: creds.merchantCode,
privateKey: creds.merchantPrivateKey,
notifyUrl: "https://example.com/notify",
redirectUrl: "https://example.com/redirect",
http: true,
IntegrationOption: "C2B",
});

this is for only learning purpose the server is provided by the package provider not telebirr if you want real simulation use telebirrs sandbox in the mode property and white list your public IP address in telebirr

Simulator characteristics:

No real money
HTTP allowed
Faster testing cycle
Same signing rules as production
Supported Features

✔ Fabric token handling

✔ RSA-SHA256 signing

✔ C2B checkout

✔ Order query

✔ Refund

✔ Simulator support

check about about notify url in telebirr official documentation to handle the response properly
https://developer.ethiotelecom.et/docs/H5%20C2B%20Web%20Payment%20Integration%20Quick%20Guide/Notify_Callback
