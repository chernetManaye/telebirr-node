import { generateKeyPairSync } from "crypto";
import fs from "fs";
import path from "path";

export function generatePrivateKey(): string {
  const { privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  return privateKey;
}

export interface KeyPairOptions {
  dir?: string; // default: process.cwd()
  privateKeyName?: string;
  publicKeyName?: string;
  overwrite?: boolean; // default: false
}

export function generateKeys(options: KeyPairOptions = {}): {
  privateKeyPath: string;
  publicKeyPath: string;
} {
  const {
    dir = process.cwd(),
    privateKeyName = "telebirr_private.pem",
    publicKeyName = "telebirr_public.pem",
    overwrite = false,
  } = options;

  const privateKeyPath = path.join(dir, privateKeyName);
  const publicKeyPath = path.join(dir, publicKeyName);

  const exists = fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath);

  if (exists && !overwrite) {
    return { privateKeyPath, publicKeyPath };
  }

  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  fs.writeFileSync(privateKeyPath, privateKey, { mode: 0o600 });
  fs.writeFileSync(publicKeyPath, publicKey);

  return { privateKeyPath, publicKeyPath };
}
