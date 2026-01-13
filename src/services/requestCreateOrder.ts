import { AxiosInstance } from "axios";
import {
  GenerateCheckoutUrlInput,
  CreateOrderResponse,
  TelebirrPreorderRequest,
} from "../types/createOrder";
import { createNonceStr } from "../utils/nonce";
import { createTimestamp } from "../utils/timestamp";
import { signRequest } from "../utils/signature";
import { TELEBIRR_URLS } from "../constants/urls";
import { TelebirrMode, IntegrationOption } from "../config/telebirrConfig";

export async function requestCreateOrder(
  client: AxiosInstance,
  fabricToken: string,
  input: GenerateCheckoutUrlInput,
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
): Promise<CreateOrderResponse> {
  const req: TelebirrPreorderRequest = {
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

  req.sign = signRequest(req, config.privateKey);
  req.sign_type = "SHA256WithRSA";

  const response = await client.post<CreateOrderResponse>(
    `${TELEBIRR_URLS[config.mode].apiBase}/payment/v1/merchant/preOrder`,
    req,
    {
      headers: {
        Authorization: fabricToken,
      },
    }
  );

  return response.data;
}
