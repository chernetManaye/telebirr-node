import { AxiosInstance } from "axios";
import {
  TelebirrQueryorderRequest,
  QueryOrderResponse,
} from "../types/queryOrder";
import { createNonceStr } from "../utils/nonce";
import { createTimestamp } from "../utils/timestamp";
import { signRequest } from "../utils/signature";
import { TELEBIRR_URLS } from "../constants/urls";
import { TelebirrMode, IntegrationOption } from "../config/telebirrConfig";

export async function requestQueryOrder(
  client: AxiosInstance,
  fabricToken: string,
  input: string,
  config: {
    mode: TelebirrMode;
    merchantAppId: string;
    merchantCode: string;
    notifyUrl: string;
    redirectUrl: string;
    privateKey: string;
    http: boolean;
    integrationOption: IntegrationOption;
  }
): Promise<QueryOrderResponse> {
  const req: TelebirrQueryorderRequest = {
    timestamp: createTimestamp(),
    nonce_str: createNonceStr(),
    method: "payment.refund",
    version: "1.0",
    biz_content: {
      appid: config.merchantAppId,
      merch_code: config.merchantCode,
      merch_order_id: input,
    },
  };

  req.sign = signRequest(req, config.privateKey);
  req.sign_type = "SHA256WithRSA";

  const response = await client.post<QueryOrderResponse>(
    `${TELEBIRR_URLS[config.mode].apiBase}/payment/v1/merchant/queryOrder`,
    req,
    {
      headers: {
        Authorization: fabricToken,
      },
    }
  );

  return response.data;
}
