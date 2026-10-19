"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Cookie, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { BRAND } from "@/lib/seed";

type Preferences = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: 1;
};

const DEFAULT_PREFS: Preferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  updatedAt: "",
  version: 1,
};

const STORAGE_KEY = BRAND.consentKey;

function readConsent(): Preferences | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    if (typeof parsed !== "object" || parsed === null) return null;
    if (!("functional" in parsed) && !("analytics" in parsed)) return null;
    return {
      necessary: true,
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      updatedAt: parsed.updatedAt || "",
      version: 1,
    };
  } catch {
    return null;
  }
}

function writeConsent(prefs: Preferences) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent("aaronworks:consent-updated", { detail: prefs }));
  } catch {
    // Storage may be blocked; the banner simply shows again next visit.
  }
}

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [openPrefs, setOpenPrefs] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = readConsent();
    if (saved) {
      setPrefs(saved);
    } else {
      setVisible(true);
    }

    const openHandler = () => {
      const current = readConsent();
      if (current) setPrefs(current);
      setOpenPrefs(true);
    };
    window.addEventListener("aaronworks:open-cookie-settings", openHandler);
    return () => {
      window.removeEventListener("aaronworks:open-cookie-settings", openHandler);
    };
  }, []);

  useEffect(() => {
    if (!openPrefs) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPrefs(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openPrefs]);

  const save = useCallback((next: Omit<Preferences, "necessary" | "updatedAt" | "version">) => {
    const record: Preferences = {
      necessary: true,
      ...next,
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    writeConsent(record);
    setPrefs(record);
    setVisible(false);
    setOpenPrefs(false);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {visible && !openPrefs ? (
        <div className="aw-cookie" role="region" aria-label="Cookie consent">
          <div className="aw-wrap">
            <div className="aw-cookie__inner">
              <div className="aw-cookie__copy">
                <strong>
                  <Cookie size={16} aria-hidden="true" /> We use cookies
                </strong>
                <p>
                  Aaron Works uses cookies to keep the site secure, remember your
                  preferences and understand how the marketplace is used. Under
                  the Kenya Data Protection Act 2019 you can accept all cookies or
                  choose which categories to allow. Necessary cookies are always on.{" "}
                  <Link href="/legal/cookie-policy" className="aw-link">
                    Read our cookie policy
                  </Link>
                  .
                </p>
              </div>
              <div className="aw-cookie__actions">
                <button
                  type="button"
                  className="aw-btn aw-btn--outline aw-btn--sm"
                  onClick={() => setOpenPrefs(true)}
                >
                  Manage preferences
                </button>
                <button
                  type="button"
                  className="aw-btn aw-btn--green aw-btn--sm"
                  onClick={() =>
                    save({ functional: true, analytics: true, marketing: true })
                  }
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {openPrefs ? (
        <div
          className="aw-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpenPrefs(false);
          }}
        >
          <div
            className="aw-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="aw-cookie-title"
            ref={panelRef}
          >
            <div className="aw-flex aw-between aw-center aw-mb-2">
              <h2 id="aw-cookie-title" style={{ margin: 0 }}>
                Cookie preferences
              </h2>
              <button
                type="button"
                onClick={() => setOpenPrefs(false)}
                aria-label="Close cookie preferences"
                style={{
                  border: 0,
                  background: "#f3f5ee",
                  borderRadius: 3,
                  padding: 7,
                  cursor: "pointer",
                  color: "#4a554d",
                }}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <p>
              Choose which cookies Aaron Works may store on this device. You can
              change these settings at any time from the footer. We keep your
              choice in this browser under <code>{STORAGE_KEY}</code>.
            </p>

            <div className="aw-toggle">
              <div>
                <strong>Necessary</strong>
                <p>
                  Required for sign-in, security, escrow sessions and load
                  balancing. These cannot be switched off.
                </p>
              </div>
              <label className="aw-switch">
                <input type="checkbox" checked disabled aria-label="Necessary cookies (always on)" />
                <span aria-hidden="true" />
              </label>
            </div>

            <div className="aw-toggle">
              <div>
                <strong>Functional</strong>
                <p>
                  Remembers your language, saved freelancers, filters and dashboard
                  layout across visits.
                </p>
              </div>
              <label className="aw-switch">
                <input
                  type="checkbox"
                  checked={prefs.functional}
                  onChange={(event) =>
                    setPrefs((p) => ({ ...p, functional: event.target.checked }))
                  }
                  aria-label="Functional cookies"
                />
                <span aria-hidden="true" />
              </label>
            </div>

            <div className="aw-toggle">
              <div>
                <strong>Analytics</strong>
                <p>
                  Helps us understand which job categories and pages are useful,
                  using aggregated, non-identifying measurements.
                </p>
              </div>
              <label className="aw-switch">
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(event) =>
                    setPrefs((p) => ({ ...p, analytics: event.target.checked }))
                  }
                  aria-label="Analytics cookies"
                />
                <span aria-hidden="true" />
              </label>
            </div>

            <div className="aw-toggle">
              <div>
                <strong>Marketing</strong>
                <p>
                  Allows us to measure campaigns that bring new clients and
                  freelancers to Aaron Works. Off by default.
                </p>
              </div>
              <label className="aw-switch">
                <input
                  type="checkbox"
                  checked={prefs.marketing}
                  onChange={(event) =>
                    setPrefs((p) => ({ ...p, marketing: event.target.checked }))
                  }
                  aria-label="Marketing cookies"
                />
                <span aria-hidden="true" />
              </label>
            </div>

            <p className="aw-note" style={{ marginTop: 16 }}>
              <ShieldCheck size={15} aria-hidden="true" />
              <span>
                Aaron Works complies with the Kenya Data Protection Act 2019. We
                never sell personal data. Read the{" "}
                <Link href="/legal/privacy-policy" className="aw-link">
                  privacy policy
                </Link>{" "}
                for how to exercise your rights.
              </span>
            </p>

            <div className="aw-modal__actions">
              <button
                type="button"
                className="aw-btn aw-btn--outline"
                onClick={() => setOpenPrefs(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="aw-btn aw-btn--blue aw-grow"
                onClick={() =>
                  save({
                    functional: prefs.functional,
                    analytics: prefs.analytics,
                    marketing: prefs.marketing,
                  })
                }
              >
                Save my choices
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
