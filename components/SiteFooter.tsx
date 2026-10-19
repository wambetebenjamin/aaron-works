import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { BRAND, CATEGORIES } from "@/lib/seed";
import CookieSettingsButton from "./CookieSettingsButton";
import { whatsappLink } from "@/lib/utils";

export default function SiteFooter() {
  return (
    <footer className="aw-footer">
      <div className="aw-wrap">
        <div className="aw-footer__grid">
          <div className="aw-footer__brand">
            <span className="aw-logo">
              <span className="aw-logo__mark" aria-hidden="true">
                A
              </span>
              <span className="aw-logo__word">
                <b>Aaron Works</b>
                <span>Find talent. Get work done.</span>
              </span>
            </span>
            <p className="aw-mt-2">
              A Kenyan freelancer marketplace connecting East African businesses
              with vetted designers, developers, writers and specialists across
              the region.
            </p>
            <a
              href={whatsappLink(BRAND.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="aw-footer__wa"
            >
              <MessageCircle size={15} aria-hidden="true" />
              {BRAND.whatsappDisplay}
            </a>
            <div className="aw-socials">
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aaron Works on LinkedIn"
              >
                <Linkedin size={15} aria-hidden="true" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aaron Works on Instagram"
              >
                <Instagram size={15} aria-hidden="true" />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aaron Works on Facebook"
              >
                <Facebook size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h4>Categories</h4>
            <ul>
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/freelancers?category=${encodeURIComponent(cat.name)}`}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>For clients & talent</h4>
            <ul>
              <li>
                <Link href="/post-job">Post a job</Link>
              </li>
              <li>
                <Link href="/freelancers">Find a freelancer</Link>
              </li>
              <li>
                <Link href="/jobs">Browse jobs</Link>
              </li>
              <li>
                <Link href="/auth/signup">Create an account</Link>
              </li>
              <li>
                <Link href="/dashboard/client">Client dashboard</Link>
              </li>
              <li>
                <Link href="/dashboard/freelancer">Freelancer dashboard</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Contact & legal</h4>
            <ul>
              <li>
                <a href={`mailto:${BRAND.email}`}>
                  <Mail size={13} aria-hidden="true" /> {BRAND.email}
                </a>
              </li>
              <li>
                <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                  <MapPin size={13} aria-hidden="true" /> {BRAND.location}
                </span>
              </li>
              <li>
                <a
                  href={whatsappLink(BRAND.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp support
                </a>
              </li>
              <li>
                <Link href="/legal/privacy-policy">Privacy policy</Link>
              </li>
              <li>
                <Link href="/legal/terms">Terms of service</Link>
              </li>
              <li>
                <Link href="/legal/cookie-policy">Cookie policy</Link>
              </li>
              <li>
                <CookieSettingsButton />
              </li>
            </ul>
          </div>
        </div>

        <div className="aw-footer__bottom">
          <span>
            © {new Date().getFullYear()} {BRAND.name}. Nairobi, Kenya. All
            rights reserved.
          </span>
          <nav aria-label="Legal">
            <Link href="/legal/privacy-policy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/cookie-policy">Cookies</Link>
            <a
              href={whatsappLink(BRAND.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
