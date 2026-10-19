import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessagesSquare } from "lucide-react";
import MessagesClient from "@/components/MessagesClient";
import { auth } from "@/lib/auth";
import { getStore } from "@/lib/db";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
  description: "Your Aaron Works inbox for client and freelancer conversations.",
};

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=%2Fmessages");
  }

  const store = await getStore();
  const name = session.user.name ?? "";
  const threads = store.threads.filter(
    (thread) =>
      thread.participants.clientName === name ||
      thread.participants.freelancerName === name,
  );

  return (
    <>
      <section className="aw-pagehead">
        <div className="aw-wrap">
          <nav className="aw-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Messages</span>
          </nav>
          <h1>Messages</h1>
          <p>
            Text-only conversations between clients and freelancers. Keep
            agreements, scope changes and approvals in the thread — the Aaron Works
            team can review it if a dispute is raised.
          </p>
        </div>
      </section>

      <section className="aw-section aw-section--tight">
        <div className="aw-wrap">
          {threads.length ? (
            <MessagesClient
              threads={threads}
              currentUserId={session.user.id}
              currentName={name}
            />
          ) : (
            <div className="aw-empty">
              <MessagesSquare size={30} aria-hidden="true" />
              <h3>No messages yet</h3>
              <p>
                Start by messaging a freelancer from their profile, or reply to a
                proposal in your dashboard.
              </p>
              <Link href="/freelancers" className="aw-btn aw-btn--green aw-btn--sm">
                Find a freelancer
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
