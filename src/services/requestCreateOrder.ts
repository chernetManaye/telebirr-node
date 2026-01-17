import http from "http";
import https from "https";
import {
  GenerateCheckoutUrlInput,
  CreateOrderResponse,
  TelebirrPreorderRequest,
} from "../types/createOrder";
import { createNonceStr } from "../utils/nonce";
import { createTimestamp } from "../utils/timestamp";
import { signRequest } from "../utils/signature";
import { TelebirrMode } from "../types/telebirrConfig";
import { TELEBIRR_URLS } from "../constants/urls";

export function requestCreateOrder(
  fabricToken: string,
  input: GenerateCheckoutUrlInput,
  config: {
    mode: TelebirrMode;
    appId: string;
    appSecret: string;
    merchantAppId: string;
    merchantCode: string;
    notifyUrl: string;
    redirectUrl: string;
    privateKey: string;
    http: boolean;
  }
): Promise<{
  message: string;
  data: CreateOrderResponse;
}> {
  const reqBody: TelebirrPreorderRequest = {
    timestamp: createTimestamp(),
    nonce_str: createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
    biz_content: {
      appid: config.merchantAppId,
      merch_code: config.merchantCode,
      merch_order_id: input.merchOrderId,
      notify_url: config.notifyUrl,
      redirect_url: config.redirectUrl,
      trade_type: "Checkout",
      title: input.title,
      total_amount: input.amount,
      trans_currency: "ETB",
      timeout_express: "120m",
      business_type: "BuyGoods",
      payee_type: "3000",
      payee_identifier: config.merchantCode,
      payee_identifier_type: "04",
      callback_info: "From web",
    },
  };

  reqBody.sign = signRequest(reqBody, config.privateKey);
  reqBody.sign_type = "SHA256WithRSA";

  const payload = JSON.stringify(reqBody);

  const baseUrl = TELEBIRR_URLS[config.mode].apiBase;
  const isHttps = baseUrl.startsWith("https://");
  const client = isHttps ? https : http;

  return new Promise((resolve, reject) => {
    const req = client.request(
      `${baseUrl}/payment/v1/merchant/preOrder`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
          "X-APP-Key": config.appId,
          Authorization: fabricToken,
        },
        ...(isHttps && { rejectUnauthorized: false }),
      },
      (res) => {
        let raw = "";

        res.on("data", (chunk) => {
          raw += chunk;
        });

        res.on("end", () => {
          const status = res.statusCode || 0;
          let parsed: any = raw;

          parsed = JSON.parse(raw);

          if (status < 200 || status >= 300) {
            return reject({
              message: "Telebirr preorder request failed",
              data: parsed,
            });
          }

          resolve({
            message: "Telebirr preorder request successful",
            data: parsed,
          });
        });
      }
    );

    req.on("error", (err) => {
      reject({
        message: "Telebirr preorder network error",
        data: err,
      });
    });

    req.write(payload);
    req.end();
  });
}
