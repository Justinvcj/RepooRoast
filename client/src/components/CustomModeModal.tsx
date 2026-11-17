import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, KeyRound, ShieldCheck, ExternalLink } from 'lucide-react';
import { Button } from './ui';

interface CustomModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  enabled: boolean;
  apiKey: string;
  rememberKey: boolean;
  onSave: (enabled: boolean, apiKey: string, rememberKey: boolean) => void;
}

export const CustomModeModal: React.FC<CustomModeModalProps> = ({
  isOpen,
  onClose,
  enabled,
  apiKey,
  rememberKey,
  onSave,
}) => {
  const [localEnabled, setLocalEnabled] = useState(enabled);
  const [localKey, setLocalKey] = useState(apiKey);
  const [localRemember, setLocalRemember] = useState(rememberKey);

  // Sync draft state with props only when opened, avoiding setState in effect loops
  const [lastIsOpen, setLastIsOpen] = useState(isOpen);
  if (isOpen !== lastIsOpen) {
    setLastIsOpen(isOpen);
    if (isOpen) {
      setLocalEnabled(enabled);
      setLocalKey(apiKey);
      setLocalRemember(rememberKey);
    }
  }

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
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="custom-mode-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-surface-secondary border border-border-focused shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-lg relative select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-1 rounded-lg text-textMuted hover:text-textPrimary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-surface-elevated border border-border-hairline text-primary">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 id="custom-mode-title" className="text-xl font-bold tracking-tight text-textPrimary font-sans">
                Custom Mode
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-textSecondary mb-6 font-normal">
              Bring your own Google Gemini API key for the review. Your key never touches RepoRoast's servers.
            </p>

            <div className="flex items-center justify-between mb-5 p-4 bg-background rounded-xl border border-border-hairline">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-textPrimary font-sans">Enable Custom Mode</span>
                <span className="text-xs text-textMuted font-mono">Bypasses default API endpoint</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={localEnabled}
                onClick={() => setLocalEnabled(!localEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  localEnabled ? 'bg-primary' : 'bg-surface-elevated border border-border-hairline'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    localEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className={`space-y-3 transition-opacity ${localEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <label
                htmlFor="custom-api-key"
                className="block text-xs font-mono font-medium text-textSecondary uppercase tracking-wider"
              >
                Gemini API Key
              </label>
              <input
                id="custom-api-key"
                type="password"
                autoComplete="off"
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                placeholder="AIza..."
                className="w-full bg-background border border-border-hairline rounded-xl px-4 py-2.5 text-textPrimary placeholder-textMuted font-mono text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all selection:bg-primary/30"
              />
              <div className="flex justify-between items-center pt-1">
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono"
                >
                  Get a free Gemini API key <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={localRemember}
                  onChange={(e) => setLocalRemember(e.target.checked)}
                  className="mt-0.5 rounded border-border-hairline bg-background text-primary focus:ring-primary"
                />
                <span className="text-xs text-textSecondary leading-relaxed">
                  Remember this key for the rest of this browser tab session (cleared when you close the tab). Stored unencrypted in this browser only.
                </span>
              </label>
            </div>

            <div className="mt-6 flex items-start gap-3 p-3.5 bg-surface-elevated/70 border border-border-hairline rounded-xl">
              <ShieldCheck className="w-4 h-4 text-data-success shrink-0 mt-0.5" />
              <p className="text-xs text-textSecondary leading-relaxed">
                In Custom Mode, your key is used only in <strong className="text-textPrimary">this browser</strong> to call Google's Gemini API directly. RepoRoast's server builds the review prompts but never receives your key.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleSave}
              className="mt-6"
            >
              Save
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
