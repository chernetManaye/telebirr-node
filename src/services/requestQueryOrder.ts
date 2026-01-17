import http from "http";
import https from "https";
import {
  TelebirrQueryorderRequest,
  QueryOrderResponse,
} from "../types/queryOrder";
import { createNonceStr } from "../utils/nonce";
import { createTimestamp } from "../utils/timestamp";
import { signRequest } from "../utils/signature";
import { TelebirrMode } from "../types/telebirrConfig";
import { TELEBIRR_URLS } from "../constants/urls";

export function requestQueryOrder(
  fabricToken: string,
  merchOrderId: string,
  config: {
    appId: string;
    appSecret: string;
    merchantAppId: string;
    merchantCode: string;
    privateKey: string;
    notifyUrl: string;
    redirectUrl: string;
    mode: TelebirrMode;
    http: boolean;
  }
): Promise<{
  data: QueryOrderResponse;
  message: string;
}> {
  const reqBody: TelebirrQueryorderRequest = {
    timestamp: createTimestamp(),
    nonce_str: createNonceStr(),
    method: "payment.queryorder",
    version: "1.0",
    biz_content: {
      appid: config.merchantAppId,
      merch_code: config.merchantCode,
      merch_order_id: merchOrderId,
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
      `${baseUrl}/payment/v1/merchant/queryOrder`,
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
              message: "Telebirr queryOrder request failed",
              data: parsed,
            });
          }

          resolve({
            data: parsed,
            message: "Telebirr queryOrder request successful",
          });
        });
      }
    );

    req.on("error", (err) => {
      reject({
        message: "Telebirr queryOrder network error",
        data: err,
      });
    });

    req.write(payload);
    req.end();
  });
}
