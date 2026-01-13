import { generateCredentials } from "./src/utils/credentials";
import { TelebirrClient } from "./src/client/telebirrClient";

const creds = generateCredentials();

const client = new TelebirrClient({
  mode: "simulate", // "sandbox" | "production"
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

const checkoutUrl = await client.GenerateCheckoutUrl({
  merchOrderId: "order123",
  title: "Phone",
  amount: "12",
  callbackInfo: "some custom text",
});

res.redirect(checkoutUrl);

const merchOrderId = "order123";

const info = await client.queryOrder(merchOrderId);

console.log(info);

const refundData = await client.refund({
  merchOrderId: "order123",
  refundRequestNo: "transaction number of the original payment",
  refundReason: "normal message",
  amount: "120",
});

console.log(refundData);
