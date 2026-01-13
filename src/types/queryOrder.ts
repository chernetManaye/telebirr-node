import { SignType, ApiVersion, PaymentMethod } from "./createOrder";

export type TelebirrTradeStatus =
  | "PAY_SUCCESS"
  | "PAY_FAILED"
  | "WAIT_PAY"
  | "ORDER_CLOSED"
  | "PAYING"
  | "ACCEPTED"
  | "REFUNDING"
  | "REFUND_SUCCESS"
  | "REFUND_FAILED";

export interface TelebirrQueryOrderBizContent {
  appid: string;
  merch_code: string;
  merch_order_id: string;
}

export interface TelebirrQueryorderRequest {
  method: PaymentMethod;
  timestamp: string;
  nonce_str: string;
  version: ApiVersion;
  sign?: string;
  sign_type?: SignType;
  biz_content: TelebirrQueryOrderBizContent;
}

export interface QueryOrderResponse {
  result: "SUCCESS" | "FAIL";
  code: string;
  msg: string;
  sign: string;
  sign_type: "SHA256WithRSA";
  nonce_str: string;
  biz_content: {
    merch_order_id: string;
    order_status: string;
    trade_status: TelebirrTradeStatus;
    payment_order_id: string;
    trans_time: string;
    trans_currency: "ETB";
    total_amount: string;
    trans_id: string;
  };
}
