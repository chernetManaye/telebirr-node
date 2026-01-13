import crypto from "crypto";

/**
 * Flattens Telebirr request parameters according to spec
 * - removes sign / signType
 * - lifts biz_content fields to top-level
 */
function flattenParams(params: Record<string, any>): Record<string, string> {
  const flat: Record<string, string> = {};

  for (const key in params) {
    const value = params[key];

    if (
      value === undefined ||
      value === null ||
      value === "" ||
      key === "sign" ||
      key === "signType" ||
      key === "sign_type"
    ) {
      continue;
    }

    if (key === "biz_content" && typeof value === "object") {
      for (const bizKey in value) {
        const bizValue = value[bizKey];
        if (bizValue !== undefined && bizValue !== null && bizValue !== "") {
          flat[bizKey] = String(bizValue);
        }
      }
    } else {
      flat[key] = String(value);
    }
  }

  return flat;
}

/**
 * Builds canonical Telebirr sign string
 */
export function buildSignString(params: Record<string, any>): string {
  const flat = flattenParams(params);

  return Object.keys(flat)
    .sort() // A–Z
    .map((key) => `${key}=${flat[key]}`)
    .join("&");
}

/**
 * Signs a Telebirr request using SHA256withRSA
 *
 * @param data - full request object (including biz_content)
 * @param privateKey - RSA private key (PEM string)
 * @returns base64 signature
 */
export function signRequest(
  data: Record<string, any>,
  privateKey: string
): string {
  const signString = buildSignString(data);

  return crypto
    .createSign("RSA-SHA256")
    .update(signString, "utf8")
    .sign(privateKey, "base64");
}
