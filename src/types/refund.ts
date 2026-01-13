import { SignType, ApiVersion, PaymentMethod } from "./createOrder";

export interface RefundInput {
  merchOrderId: string;
  refundRequestNo: string;
  amount: string;
  refundReason?: string;
}

export interface TelebirrRefundBizContent {
  appid: string;
  merch_code: string;
  merch_order_id: string;
  trans_currency: "ETB";
  actual_amount: string;
  refund_request_no: string;
  refund_reason?: string;
}

export interface TelebirrRefundRequest {
  method: PaymentMethod;
  timestamp: string;
  nonce_str: string;
  version: ApiVersion;
  sign?: string;
  sign_type?: SignType;
  biz_content: TelebirrRefundBizContent;
}

export type TelebirrRefundStatus =
  | "REFUND_SUCCESS"
  | "REFUNDING"
  | "REFUND_FAILED"
  | "REFUND_DUPLICATED";

export interface RefundResponse {
  result: "SUCCESS" | "FAIL";
  code: string;
  msg: string;
  sign: string;
  sign_type: "SHA256WithRSA";
  nonce_str: string;
  biz_content: {
    /** Short code registered by a merchant with Mobile Money */
    merch_code: string;

    /** Order ID on the merchant side */
    merch_order_id: string;

    /** Original transaction order ID on the payment side */
    trans_order_id: string;

    /** Refund transaction order ID on the payment side */
    refund_order_id: string;

    /** Refund amount */
    refund_amount: string;

    /** Refund currency (e.g. ETB) */
    refund_currency: string;

    /** Refund status */
    refund_status: TelebirrRefundStatus;

    /**
     * Refund success timestamp.
     * Only present when refund_status === "REFUND_SUCCESS"
     */
    refund_time?: string;
  };
}
