"use client";

import { useActionState } from "react";

import { login } from "@/app/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-semibold tracking-[0.02em] text-foreground"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="owner@laila.local"
          className="app-input"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-semibold tracking-[0.02em] text-foreground"
        >
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Laila2026!"
          className="app-input"
        />
      </div>

      {state?.message ? (
        <div className="rounded-2xl border border-danger/15 bg-danger-soft px-4 py-3 text-sm text-danger">
          {state.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="primary-button h-12 w-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Connexion en cours..." : "Se connecter"}
      </button>
    </form>
  );
}

