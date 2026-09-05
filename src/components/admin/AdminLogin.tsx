'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Password gate for the Content Manager. One field, one button, honest
 * errors. On success the server sets the signed cookie and the dashboard
 * renders.
 */
export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/cms/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) {
        setError(body.error ?? 'That password is not right.');
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError('The request did not go through. Try again.');
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
      <p className="font-[family-name:var(--font-display)] text-2xl text-white">Content Manager</p>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        Sign in with the spa password to edit promotions, reviews, treatments and announcements.
        Changes go live within a few minutes of saving.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="cms-password" className="block text-xs font-medium uppercase tracking-wider text-white/50">
            Password
          </label>
          <input
            id="cms-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:border-emerald-400/60 focus:outline-none"
            placeholder="Your password"
          />
        </div>
        {error ? (
          <p role="alert" className="rounded-lg bg-rose-500/15 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Checking…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

/** Sign-out control on the dashboard. */
export function AdminSignOut() {
  const router = useRouter();
  async function signOut() {
    await fetch('/api/cms/session', { method: 'DELETE' });
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={signOut}
      className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/70 transition hover:border-white/40 hover:text-white"
    >
      Sign out
    </button>
  );
}
