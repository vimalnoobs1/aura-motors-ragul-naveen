import React, { useState } from 'react';
import { AuraUser } from '../types';
import { Lock, X, LogOut, CheckCircle2, User } from 'lucide-react';
import { engineSound } from '../audio/engineSound';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuraUser | null;
  onLogin: (user: AuraUser) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('1234');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUsername = username.trim() || 'demo';
    const cleanPassword = password.trim() || '1234';

    const displayName = cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1);

    engineSound.playConfirmationBeep();
    setSuccessMsg(`Welcome, ${displayName}. Redirecting to showroom...`);

    const authenticatedUser: AuraUser = {
      id: `USR-${cleanUsername.toUpperCase()}`,
      username: cleanUsername,
      name: displayName,
      role: 'VIP Client',
      clearance: 'Atelier Client Access',
      clearanceLevel: 5,
      status: 'AUTHENTICATED',
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      localStorage.setItem('aura_auth_user', JSON.stringify(authenticatedUser));
    } catch {}

    setTimeout(() => {
      onLogin(authenticatedUser);
      onClose();
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-[#10131c] border border-neutral-750/90 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(212,175,55,0.12)] flex flex-col overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800/80 bg-gradient-to-r from-[#151926] to-[#10131c]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-lg font-rajdhani font-bold tracking-wider text-white uppercase">
                AURA CLIENT LOGIN
              </h2>
              <span className="text-xs text-neutral-400">
                VIP Showroom & Order Access
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              engineSound.playClickBeep();
              onClose();
            }}
            className="p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-neutral-800"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {currentUser ? (
            /* Logged In State */
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#141724] border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> LOGGED IN
                  </span>
                  <span className="text-[11px] font-mono-tech text-neutral-400">
                    Session Active
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-rajdhani font-bold text-white tracking-wide">
                    Welcome, {currentUser.name}
                  </h3>
                  <p className="text-xs text-[#d4af37] font-medium mt-0.5">
                    {currentUser.role} • Verified Member
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    engineSound.playClickBeep();
                    onClose();
                  }}
                  className="flex-1 min-h-[44px] py-3 bg-gradient-to-r from-[#e6ca9c] to-[#d4af37] text-neutral-950 font-rajdhani font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:brightness-105 cursor-pointer text-center"
                >
                  Return to Showroom
                </button>

                <button
                  onClick={() => {
                    engineSound.playClickBeep();
                    onLogout();
                  }}
                  className="px-5 min-h-[44px] flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-red-400 border border-red-500/30 rounded-xl font-rajdhani font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#151926]/70 border border-neutral-750 text-xs text-neutral-300">
                <span className="text-[#d4af37] font-semibold block mb-0.5">DEMO LOGIN:</span>
                You can enter username <strong className="text-white">demo</strong> and password <strong className="text-white">1234</strong>, or enter any username and password of your choice.
              </div>

              <div>
                <label className="block text-xs uppercase text-neutral-400 font-medium mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter any username"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#141724] border border-neutral-750 rounded-xl text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-neutral-400 font-medium mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter any password"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#141724] border border-neutral-750 rounded-xl text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    required
                  />
                </div>
              </div>

              {successMsg && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#e6ca9c] via-[#f7ebd7] to-[#d4af37] hover:brightness-110 text-neutral-950 font-rajdhani font-bold text-sm tracking-wider uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer active:scale-98"
              >
                <span>LOGIN</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
