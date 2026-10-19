import Link from "next/link";
import { BriefcaseBusiness, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="aw-state">
      <div className="aw-state__inner">
        <div className="aw-state__icon" aria-hidden="true">
          <BriefcaseBusiness size={34} />
        </div>
        <p className="aw-eyebrow" style={{ justifyContent: "center" }}>
          404 · Page not found
        </p>
        <h1>This job no longer exists.</h1>
        <p>
          The page you were looking for may have been filled, closed or moved. The
          jobs board is a good place to pick up the trail.
        </p>
        <div className="aw-state__actions">
          <Link href="/jobs" className="aw-btn aw-btn--green">
            <ArrowLeft size={15} aria-hidden="true" />
            Back to Jobs
          </Link>
          <Link href="/freelancers" className="aw-btn aw-btn--outline">
            <Search size={15} aria-hidden="true" />
            Find a freelancer
          </Link>
        </div>
      </div>
    </section>
  );
}
