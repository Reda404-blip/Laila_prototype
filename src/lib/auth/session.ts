import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

export type UserRole = "OWNER" | "REVIEWER";

type SessionPayload = {
  userId: string;
  fullName: string;
  firmName: string;
  role: UserRole;
  expiresAt: string;
};

export type LoginFormState =
  | {
      message?: string;
    }
  | undefined;

const SESSION_COOKIE_NAME = "laila_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;

function getSessionSecret(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ??
    (process.env.NODE_ENV === "production"
      ? undefined
      : "laila-prototype-development-secret");

  if (!secret) {
    throw new Error("SESSION_SECRET is required in production.");
  }

  return new TextEncoder().encode(secret);
}

export async function createSession(input: Omit<SessionPayload, "expiresAt">) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const token = await new SignJWT({
    ...input,
    expiresAt: expiresAt.toISOString(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getSessionSecret());

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSessionSecret());

    return {
      userId: String(payload.userId),
      fullName: String(payload.fullName),
      firmName: String(payload.firmName),
      role: payload.role === "REVIEWER" ? "REVIEWER" : "OWNER",
      expiresAt: String(payload.expiresAt),
    };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
