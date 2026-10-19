"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/utils";
import { BRAND } from "@/lib/seed";

const NAV = [
  { href: "/freelancers", label: "Find freelancers" },
  { href: "/jobs", label: "Browse jobs" },
  { href: "/post-job", label: "Post a job" },
  { href: "/#how-it-works", label: "How it works" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const dashboardHref =
    session?.user?.role === "freelancer"
      ? "/dashboard/freelancer"
      : "/dashboard/client";

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="aw-header">
      <div className="aw-wrap">
        <div className="aw-header__inner">
          <Link href="/" className="aw-logo" aria-label={`${BRAND.name} home`}>
            <span className="aw-logo__mark" aria-hidden="true">
              A
            </span>
            <span className="aw-logo__word">
              <b>Aaron Works</b>
              <span>Find talent. Get work done.</span>
            </span>
          </Link>

          <nav className="aw-nav" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-active={isActive(item.href)}
              >
                {item.label}
              </Link>
            ))}
            {session?.user ? (
              <Link href={dashboardHref} data-active={isActive("/dashboard")}>
                Dashboard
              </Link>
            ) : null}
          </nav>

          <div className="aw-header__actions">
            <a
              href={whatsappLink(BRAND.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="aw-btn aw-btn--ghost aw-btn--sm"
            >
              WhatsApp us
            </a>
            {status === "loading" ? (
              <span className="aw-btn aw-btn--green aw-btn--sm" aria-hidden="true">
                Join free
              </span>
            ) : session?.user ? (
              <>
                <Link
                  href="/messages"
                  className="aw-btn aw-btn--ghost aw-btn--sm"
                  aria-label="Messages"
                >
                  <MessageSquare size={15} aria-hidden="true" />
                  <span>Inbox</span>
                </Link>
                <button
                  type="button"
                  className="aw-btn aw-btn--outline aw-btn--sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut size={14} aria-hidden="true" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="aw-btn aw-btn--outline aw-btn--sm"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="aw-btn aw-btn--green aw-btn--sm"
                >
                  <UserRound size={15} aria-hidden="true" />
                  Join free
                </Link>
              </>
            )}
            <button
              type="button"
              className="aw-navtoggle"
              aria-expanded={open}
              aria-controls="aw-mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div
        id="aw-mobile-menu"
        className="aw-mobilemenu"
        data-open={open ? "true" : "false"}
      >
        <div className="aw-wrap">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          {session?.user ? (
            <>
              <Link href={dashboardHref}>
                <LayoutDashboard size={15} aria-hidden="true" /> Dashboard
              </Link>
              <Link href="/messages">Messages</Link>
            </>
          ) : (
            <>
              <Link href="/auth/signin">Sign in</Link>
              <Link href="/auth/signup">Create a free account</Link>
            </>
          )}
          <a
            href={whatsappLink(BRAND.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="aw-btn aw-btn--green"
          >
            WhatsApp {BRAND.whatsappDisplay}
          </a>
        </div>
      </div>
    </header>
  );
}
