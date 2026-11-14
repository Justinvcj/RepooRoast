import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, KeyRound, ShieldCheck, ExternalLink } from 'lucide-react';

interface CustomModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  enabled: boolean;
  apiKey: string;
  rememberKey: boolean;
  onSave: (enabled: boolean, apiKey: string, rememberKey: boolean) => void;
}

export const CustomModeModal: React.FC<CustomModeModalProps> = ({ isOpen, onClose, enabled, apiKey, rememberKey, onSave }) => {
  const [localEnabled, setLocalEnabled] = useState(enabled);
  const [localKey, setLocalKey] = useState(apiKey);
  const [localRemember, setLocalRemember] = useState(rememberKey);

  // Re-sync local draft state whenever the modal is (re)opened.
  useEffect(() => {
    if (isOpen) {
      setLocalEnabled(enabled);
      setLocalKey(apiKey);
      setLocalRemember(rememberKey);
    }
  }, [isOpen, enabled, apiKey, rememberKey]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSave = () => {
    onSave(localEnabled, localKey.trim(), localRemember);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="custom-mode-title"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel bg-surface/95 rounded-3xl p-6 md:p-8 w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-textSecondary hover:text-textPrimary transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <KeyRound className="w-6 h-6 text-primary" />
              <h2 id="custom-mode-title" className="text-xl font-serif font-bold text-textPrimary">Custom Mode</h2>
            </div>
            <p className="text-sm text-textSecondary mb-6">
              Bring your own Google Gemini API key for the review. Your key never touches RepoRoast's servers.
            </p>

            <div className="flex items-center justify-between mb-5 p-4 bg-background rounded-xl border border-border/50">
              <span className="text-sm font-semibold text-textPrimary">Enable Custom Mode</span>
              <button
                role="switch"
                aria-checked={localEnabled}
                onClick={() => setLocalEnabled(!localEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${localEnabled ? 'bg-primary' : 'bg-[#30363d]'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${localEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className={localEnabled ? '' : 'opacity-40 pointer-events-none'}>
              <label htmlFor="custom-api-key" className="block text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">
                Gemini API Key
              </label>
              <input
                id="custom-api-key"
                type="password"
                autoComplete="off"
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                placeholder="AIza..."
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-textPrimary placeholder-textSecondary/50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
              >
                Get a free Gemini API key <ExternalLink className="w-3 h-3" />
              </a>

              <label className="flex items-start gap-2 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localRemember}
                  onChange={(e) => setLocalRemember(e.target.checked)}
                  className="mt-0.5"
                />
                <span className="text-xs text-textSecondary">
                  Remember this key for the rest of this browser tab session (cleared when you close the tab). Stored unencrypted in this browser only.
                </span>
              </label>
            </div>

            <div className="mt-6 flex items-start gap-2 p-4 bg-[#3fb950]/5 border border-[#3fb950]/20 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-[#3fb950] shrink-0 mt-0.5" />
              <p className="text-xs text-textSecondary leading-relaxed">
                In Custom Mode, your key is used only in <strong className="text-textPrimary">this browser</strong> to call Google's Gemini API directly.
                RepoRoast's server builds the review prompts but never receives your key or sees the AI's response.
              </p>
            </div>

            <button
              onClick={handleSave}
              className="w-full mt-6 py-3 rounded-full bg-primary hover:bg-orange-600 text-white font-semibold transition-colors"
            >
              Save
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
