"use server";

import { redirect } from "next/navigation";

import {
  createSession,
  deleteSession,
  type LoginFormState,
  type UserRole,
} from "@/lib/auth/session";

const DEMO_PASSWORD = "Laila2026!";

const demoUsers: Record<
  string,
  { id: string; fullName: string; firmName: string; role: UserRole }
> = {
  "owner@laila.local": {
    id: "user-owner",
    fullName: "Sara El Idrissi",
    firmName: "Cabinet Atlas Fiduciaire",
    role: "OWNER",
  },
  "reviewer@laila.local": {
    id: "user-reviewer",
    fullName: "Youssef Bennani",
    firmName: "Cabinet Atlas Fiduciaire",
    role: "REVIEWER",
  },
};

export async function login(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { message: "Saisissez votre email et votre mot de passe." };
  }

  const matchedUser = demoUsers[email];

  if (!matchedUser || password !== DEMO_PASSWORD) {
    return {
      message:
        "Identifiants invalides. Utilisez un des comptes de demonstration affiches.",
    };
  }

  await createSession({
    userId: matchedUser.id,
    fullName: matchedUser.fullName,
    firmName: matchedUser.firmName,
    role: matchedUser.role,
  });

  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}

