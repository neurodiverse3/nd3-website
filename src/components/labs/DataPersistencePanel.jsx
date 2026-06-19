"use client";
import React, { useState, useRef } from 'react';
import { Download, Upload, Lock, Unlock, Trash2, Shield, Check, AlertTriangle, X } from 'lucide-react';
import { exportAllLabData, importAllLabData, clearAllLabData } from '../../lib/useLabStorage';

export default function DataPersistencePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState('');
  const [useEncryption, setUseEncryption] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await exportAllLabData();
      let exportData = data;
      let filename = `nd3-lab-data-${new Date().toISOString().slice(0, 10)}.json`;

      if (useEncryption && passphrase) {
        const encrypted = await encryptData(data, passphrase);
        exportData = encrypted;
        filename = `nd3-lab-data-${new Date().toISOString().slice(0, 10)}.encrypted.json`;
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError('');
    setImportSuccess(false);

    try {
      const text = await file.text();
      let data = JSON.parse(text);

      if (data.encrypted && passphrase) {
        data = await decryptData(data, passphrase);
      }

      await importAllLabData(data);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (err) {
      setImportError(err.message || 'Failed to import data. Check file format.');
      console.error('Import failed:', err);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    try {
      await clearAllLabData();
      setShowConfirmClear(false);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (err) {
      console.error('Clear failed:', err);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="border border-[var(--rule)] bg-black/40">
      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-black/20 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-[var(--accent)]" />
          <span className="text-xs md:text-sm font-mono font-bold text-[var(--fg)] uppercase tracking-widest">
            YOUR DATA & PERSISTENCE
          </span>
        </div>
        <span className="text-xs md:text-sm font-mono text-[var(--muted)] uppercase tracking-wider">
          {isOpen ? '▼' : '▶'}
        </span>
      </button>

      {/* Expanded Panel */}
      {isOpen && (
        <div className="border-t border-[var(--rule)] p-4 space-y-4 animate-in fade-in duration-200">
          {/* Info Banner */}
          <div className="border border-blue-500/20 bg-blue-500/5 p-3 space-y-1">
            <p className="text-xs md:text-sm font-mono text-[var(--muted)] leading-relaxed">
              Your lab data is stored locally on this device. No account required. No tracking. No server.
              Export your data to transfer between devices or back it up.
            </p>
          </div>

          {/* Encryption Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-mono text-[var(--muted)] uppercase tracking-wider">
              ENCRYPT EXPORT:
            </span>
            <button
              onClick={() => setUseEncryption(!useEncryption)}
              className={`px-2 py-1 text-xs md:text-sm font-mono font-bold border cursor-pointer transition-all uppercase ${
                useEncryption
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-accent-pink-soft/10'
                  : 'border-[var(--rule)] text-[var(--muted)] hover:border-[var(--muted)]'
              }`}
            >
              {useEncryption ? <Lock size={10} className="inline mr-1" /> : <Unlock size={10} className="inline mr-1" />}
              {useEncryption ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Passphrase Input */}
          {useEncryption && (
            <div className="space-y-1">
              <label className="text-xs md:text-sm font-mono text-[var(--muted)] uppercase tracking-wider block">
                PASSPHRASE (REQUIRED FOR ENCRYPTED FILES):
              </label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter a passphrase..."
                className="w-full bg-black border border-[var(--rule)] px-3 py-1.5 text-xs text-[var(--fg)] outline-none focus:border-[var(--accent)] font-mono rounded-none"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Export */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 py-2.5 border border-[var(--rule)] hover:border-[var(--accent)] text-[var(--muted)] hover:text-[var(--fg)] text-xs md:text-sm font-mono font-bold uppercase tracking-wider cursor-pointer transition-all disabled:opacity-50 rounded-none"
            >
              {exportSuccess ? (
                <><Check size={12} className="text-green-500" /> EXPORTED</>
              ) : (
                <><Download size={12} /> {isExporting ? 'EXPORTING...' : 'EXPORT DATA'}</>
              )}
            </button>

            {/* Import */}
            <label className="flex items-center justify-center gap-2 py-2.5 border border-[var(--rule)] hover:border-[var(--accent)] text-[var(--muted)] hover:text-[var(--fg)] text-xs md:text-sm font-mono font-bold uppercase tracking-wider cursor-pointer transition-all rounded-none">
              {importSuccess ? (
                <><Check size={12} className="text-green-500" /> IMPORTED</>
              ) : (
                <><Upload size={12} /> {isImporting ? 'IMPORTING...' : 'IMPORT DATA'}</>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            {/* Clear */}
            <button
              onClick={() => setShowConfirmClear(true)}
              disabled={isClearing}
              className="flex items-center justify-center gap-2 py-2.5 border border-red-500/30 hover:border-red-500 text-red-500/70 hover:text-red-500 text-xs md:text-sm font-mono font-bold uppercase tracking-wider cursor-pointer transition-all disabled:opacity-50 rounded-none"
            >
              <Trash2 size={12} /> {isClearing ? 'CLEARING...' : 'CLEAR ALL DATA'}
            </button>
          </div>

          {/* Import Error */}
          {importError && (
            <div className="border border-red-500/20 bg-red-500/5 p-2 flex items-center gap-2">
              <AlertTriangle size={12} className="text-red-500 shrink-0" />
              <span className="text-xs md:text-sm font-mono text-red-500 uppercase tracking-wider">{importError}</span>
              <button onClick={() => setImportError('')} className="ml-auto text-red-500 cursor-pointer">
                <X size={10} />
              </button>
            </div>
          )}

          {/* Clear Confirmation */}
          {showConfirmClear && (
            <div className="border border-red-500/30 bg-red-500/5 p-3 space-y-3">
              <p className="text-xs md:text-sm font-mono text-red-500 uppercase tracking-wider">
                WARNING: This will permanently delete ALL saved lab data on this device. This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  className="px-4 py-1.5 bg-red-500 text-white text-xs md:text-sm font-mono font-bold uppercase tracking-wider cursor-pointer hover:bg-red-600 transition-colors rounded-none"
                >
                  CONFIRM DELETE
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-4 py-1.5 border border-[var(--rule)] text-[var(--muted)] text-xs md:text-sm font-mono font-bold uppercase tracking-wider cursor-pointer hover:border-[var(--muted)] transition-colors rounded-none"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

async function deriveKey(passphrase, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptData(data, passphrase) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const plaintext = encoder.encode(JSON.stringify(data));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);

  return {
    encrypted: true,
    version: 1,
    salt: Array.from(salt),
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(ciphertext)),
  };
}

async function decryptData(encrypted, passphrase) {
  const salt = new Uint8Array(encrypted.salt);
  const iv = new Uint8Array(encrypted.iv);
  const ciphertext = new Uint8Array(encrypted.data);
  const key = await deriveKey(passphrase, salt);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(plaintext));
}
