"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reproduces the template's original loading screen exactly:
 *   <div id="preloader"><span class="loader"><span class="loader-inner"></span></span></div>
 * Styles and keyframes live in the untouched template stylesheet
 * (/template/style.css, #preloader at line 2421). The original site faded the
 * loader out on window load (js/custom.js:50); this component mirrors that
 * behaviour, then unmounts it.
 *
 * A 3-second failsafe guarantees the overlay can never trap the page if the
 * load event is delayed by a slow third-party asset.
 */
export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    let hideTimer: number | undefined;
    let removeTimer: number | undefined;

    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      hideTimer = window.setTimeout(() => {
        setHidden(true);
        removeTimer = window.setTimeout(() => setRemoved(true), 600);
      }, 450);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }
    const failsafe = window.setTimeout(finish, 3000);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(failsafe);
      if (hideTimer) window.clearTimeout(hideTimer);
      if (removeTimer) window.clearTimeout(removeTimer);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      id="preloader"
      className={`aw-preloader${hidden ? " is-done" : ""}`}
      aria-hidden="true"
    >
      <span className="loader">
        <span className="loader-inner" />
      </span>
    </div>
  );
}
