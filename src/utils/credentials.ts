import fs from "fs";
import path from "path";
import { randomUUID, randomBytes } from "crypto";
import { customAlphabet } from "nanoid";
import { generatePrivateKey } from "./keys";
import { GeneratedCredentials } from "../types/credentials";

const numeric16 = customAlphabet("0123456789", 16);
const numeric6 = customAlphabet("0123456789", 6);

const ENV_FILE_NAME = ".env";

export function generateCredentials(): GeneratedCredentials {
  const envPath = path.join(process.cwd(), ENV_FILE_NAME);

  const existingEnv = fs.existsSync(envPath)
    ? fs.readFileSync(envPath, "utf8")
    : "";

  const existingMap = new Map<string, string>();

  existingEnv.split("\n").forEach((line) => {
    const [key, ...rest] = line.split("=");
    if (!key || rest.length === 0) return;
    existingMap.set(key.trim(), rest.join("=").trim());
  });

  const getOrGenerate = (key: string, generator: () => string): string => {
    if (process.env[key]) return process.env[key]!;
    if (existingMap.has(key)) return existingMap.get(key)!;
    return generator();
  };

  const generated: GeneratedCredentials = {
    FABRIC_APP_ID: getOrGenerate("FABRIC_APP_ID", () => randomUUID()),
    FABRIC_APP_SECRET: getOrGenerate("FABRIC_APP_SECRET", () =>
      randomBytes(16).toString("hex")
    ),
    MERCHANT_APP_ID: getOrGenerate("MERCHANT_APP_ID", () => numeric16()),
    MERCHANT_CODE: getOrGenerate("MERCHANT_CODE", () => numeric6()),
    PRIVATE_KEY: "",
  };

  // Handle private key
  if (process.env.PRIVATE_KEY || existingMap.has("PRIVATE_KEY")) {
    const stored = process.env.PRIVATE_KEY ?? existingMap.get("PRIVATE_KEY")!;

    generated.PRIVATE_KEY = stored
      .replace(/\\n/g, "\n")
      .replace(/^"(.*)"$/, "$1");
  } else {
    const rawPrivateKey = generatePrivateKey();
    generated.PRIVATE_KEY = rawPrivateKey;
  }

  // Write missing entries only
  const entries: string[] = [];
  Object.entries(generated).forEach(([key, value]) => {
    if (key === "PRIVATE_KEY") return;
    if (!existingMap.has(key)) {
      entries.push(`${key}="${value}"`);
    }
  });

  if (!existingMap.has("PRIVATE_KEY")) {
    const escaped = generated.PRIVATE_KEY.replace(/\n/g, "\\n");
    entries.push(`PRIVATE_KEY="${escaped}"`);
  }

  if (entries.length > 0) {
    const header =
      existingEnv.trim().length === 0
        ? "# Telebirr Simulator Credentials\n"
        : "\n\n# Telebirr Simulator Credentials\n";

    fs.writeFileSync(
      envPath,
      existingEnv + header + entries.join("\n") + "\n",
      "utf8"
    );
  }

  return generated;
}
