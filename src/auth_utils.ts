import * as jose from "jose";
import { host, privateJWK, publicJWK } from "./enviroments";

export async function authenticateBearer(
  token: string,
  email: string
): Promise<boolean> {
  try {
    const { payload, protectedHeader } = await jose.jwtVerify(
      token,
      await jose.importJWK(publicJWK as jose.JWK, "ES256"),
      {
        algorithms: ["ES256"],
        issuer: host,
        audience: email,
        subject: "Client Authorization",
        requiredClaims: ["isAdmin"],
      }
    );
    //console.log(payload);
    return true;
  } catch (error) {
    console.error("Error when verifying auth tokens. Error: ", error);
    return false;
  }
}

export async function generateAuthTokens(email: string, isAdmin: boolean) {
  try {
    const accessToken = await new jose.SignJWT({ isAdmin })
      .setIssuer(host)
      .setIssuedAt()
      .setExpirationTime("5m")
      .setSubject("Client Authorization")
      .setProtectedHeader({ typ: "JWT", alg: "ES256" })
      .setAudience(email)
      .sign(await jose.importJWK(privateJWK as jose.JWK, "ES256"));
    const refreshToken = await new jose.SignJWT({ isAdmin })
      .setIssuer(host)
      .setIssuedAt()
      .setExpirationTime("20m")
      .setSubject("Client refresh")
      .setProtectedHeader({ typ: "JWT", alg: "ES256" })
      .setAudience(email)
      .sign(await jose.importJWK(privateJWK as jose.JWK, "ES256"));
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error when generating auth tokens.");
    throw error;
  }
}

// email or iban
export async function checkOwnership(
  token: string,
  to_check: { email?: string; iban?: string }
): Promise<boolean> {
    //TODO switch email iban
    //TODO get ibans of email
  return false;
}


//TODO middleware for auth and ownership