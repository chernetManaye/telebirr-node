// import { generateSimulatorCredentials } from "./utils/credentials.js";
// import { TelebirrClient } from "./client/telebirrClient.js";

// const creds = generateSimulatorCredentials();

// console.log(creds);

// const client = new TelebirrClient({
//   mode: "simulate", // "sandbox" | "production" | "sandbox"
//   appId: creds.fabricAppId,
//   appSecret: creds.fabricAppSecret,
//   merchantAppId: creds.merchantAppId,
//   merchantCode: creds.merchantCode,
//   privateKey: creds.merchantPrivateKey,
//   notifyUrl: "https://example.com/notify",
//   redirectUrl: "https://example.com/redirect",
// });

// console.log(client);

// const checkoutUrl = await client.createOrder({
//   merchOrderId: "order123",
//   title: "Phone",
//   amount: "12",
//   callbackInfo: "some custom text",
// });

// console.log(checkoutUrl);
