import { useState } from 'react';
import { AdminApi, storeCode } from './adminApi.js';

export default function AdminLogin({ onSuccess }) {
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!code.trim()) return;
    setChecking(true);
    setError('');
    const result = await AdminApi.verifyCode(code.trim());
    setChecking(false);
    if (result.ok) {
      storeCode(code.trim());
      onSuccess();
    } else {
      setError('That access code isn\'t right. Please check with your manager and try again.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-line bg-card p-8 text-center">
        <p className="font-display text-lg font-bold">The Grand Aranya</p>
        <p className="mt-1 text-sm text-espresso/60">Wedding Sales Dashboard</p>

        <label className="mt-6 block text-left">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gold">
            Access Code
          </span>
          <input
            type="password"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your team access code"
            className="w-full rounded-lg border border-line px-3.5 py-3 text-sm outline-none focus:border-gold"
          />
        </label>

        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={checking}
          className="mt-5 w-full rounded-full bg-gold py-3 text-sm font-bold text-espresso disabled:opacity-60"
        >
          {checking ? 'Checking…' : 'Sign In'}
        </button>

        <p className="mt-4 text-[11px] text-espresso/40">
          Don&rsquo;t have a code? Ask whoever set up the website.
        </p>
      </form>
    </div>
  );
}
