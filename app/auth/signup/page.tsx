import type { Metadata } from "next";
import { Suspense } from "react";
import { SignUpForm } from "@/components/AuthForms";
import { googleEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Join Aaron Works as a client or freelancer. Verified profiles, escrow payments and Kenya-based support.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const roleParam = Array.isArray(params.role) ? params.role[0] : params.role;
  const initialRole = roleParam === "client" ? "client" : "freelancer";

  return (
    <div className="aw-auth">
      <Suspense
        fallback={
          <div className="aw-auth__card">
            <p className="aw-small">Loading sign-up…</p>
          </div>
        }
      >
        <SignUpForm googleEnabled={googleEnabled} initialRole={initialRole} />
      </Suspense>
    </div>
  );
}
