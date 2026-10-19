"use client";

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="aw-cookielink"
      onClick={() => {
        window.dispatchEvent(new Event("aaronworks:open-cookie-settings"));
      }}
    >
      Cookie settings
    </button>
  );
}
