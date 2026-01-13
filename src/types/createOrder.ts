export interface GenerateCheckoutUrlInput {
  title: string;
  amount: string;
  merchOrderId?: string;
  callbackInfo?: string;
}

export type SignType = "SHA256WithRSA";

export type ApiVersion = "1.0";

export type PaymentMethod = "payment.preorder" | "payment.refund";

export type TradeType =
  | "InApp"
  | "Cross-App"
  | "Checkout"
  | "PWA"
  | "QrCode"
  | "QuickPay"
  | "BankTrade";

export type BusinessType = "BuyGoods";

export type PayeeType = "3000" | "5000";

export type PayeeIdentifierType = "04";

export interface TelebirrBizContent {
  appid: string;
  merch_code: string;
  merch_order_id?: string;
  notify_url: string;
  redirect_url?: string;
  trade_type: TradeType;
  title: string;
  total_amount: string;
  trans_currency: string;
  timeout_express?: string;
  business_type?: BusinessType;
  payee_type?: PayeeType;
  payee_identifier?: string;
  payee_identifier_type?: PayeeIdentifierType;
  callback_info?: string;
}

export interface TelebirrPreorderRequest {
  method: PaymentMethod;
  timestamp: string;
  nonce_str: string;
  version: ApiVersion;
  sign?: string;
  sign_type?: SignType;
  biz_content: TelebirrBizContent;
}

export interface CreateOrderResponse {
  result: "SUCCESS" | "FAIL";
  code: string;
  msg: string;
  sign: string;
  sign_type: "SHA256WithRSA";
  nonce_str: string;
  biz_content: {
    merch_order_id: string;
    prepay_id: string;
  };
}
