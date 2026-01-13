import { TelebirrConfig } from "../config/telebirrConfig";
import { createTelebirrHttpClient } from "../http/telebirrHttpClient";
import { applyFabricToken } from "../services/applyFabricToken";
import { FabricTokenResponse } from "../types/fabricToken";
import { requestCreateOrder } from "../services/requestCreateOrder";
import {
  GenerateCheckoutUrlInput,
  CreateOrderResponse,
} from "../types/createOrder";
import { createCheckoutUrl } from "../services/createCheckoutUrl";
import { requestQueryOrder } from "../services/requestQueryOrder";
import { QueryOrderResponse } from "../types/queryOrder";
import { RefundInput, RefundResponse } from "../types/refund";
import { requestRefund } from "../services/requestRefund";

export class TelebirrClient {
  private httpClient;
  private token?: FabricTokenResponse;
  private config: TelebirrConfig;

  constructor(config: TelebirrConfig) {
    this.config = config;
    this.httpClient = createTelebirrHttpClient(config);
  }

  async getFabricToken(): Promise<FabricTokenResponse> {
    if (this.token && !this.isTokenExpired(this.token)) {
      return this.token;
    }

    const token = await applyFabricToken(this.httpClient, {
      appSecret: this.config.appSecret,
      mode: this.config.mode,
    });

    this.token = token;
    return token;
  }

  async GenerateCheckoutUrl(input: GenerateCheckoutUrlInput): Promise<string> {
    const token = await this.getFabricToken();

    const response: CreateOrderResponse = await requestCreateOrder(
      this.httpClient,
      token.token,
      input,
      this.config
    );

    const prepayId = response.biz_content.prepay_id;

    return createCheckoutUrl({
      mode: this.config.mode,
      prepayId,
      merchantAppId: this.config.merchantAppId,
      merchantCode: this.config.merchantCode,
      privateKey: this.config.privateKey,
    });
  }
  async queryOrder(input: string): Promise<QueryOrderResponse> {
    const token = await this.getFabricToken();

    const response: QueryOrderResponse = await requestQueryOrder(
      this.httpClient,
      token.token,
      input,
      this.config
    );

    return response;
  }
  async refund(input: RefundInput): Promise<RefundResponse> {
    const token = await this.getFabricToken();

    const response: RefundResponse = await requestRefund(
      this.httpClient,
      token.token,
      input,
      this.config
    );

    return response;
  }

  private isTokenExpired(token: FabricTokenResponse): boolean {
    const now = new Date();
    const expiry = this.parseTelebirrDate(token.expirationDate);
    return now >= expiry;
  }

  private parseTelebirrDate(value: string): Date {
    if (!/^\d{14}$/.test(value)) {
      throw new Error("Invalid Telebirr date format");
    }

    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6)) - 1;
    const day = Number(value.slice(6, 8));
    const hour = Number(value.slice(8, 10));
    const minute = Number(value.slice(10, 12));
    const second = Number(value.slice(12, 14));

    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }
}
