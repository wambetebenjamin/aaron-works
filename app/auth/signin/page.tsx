import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "@/components/AuthForms";
import { googleEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Aaron Works client or freelancer account.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <div className="aw-auth">
      <Suspense
        fallback={
          <div className="aw-auth__card">
            <p className="aw-small">Loading sign-in…</p>
          </div>
        }
      >
        <SignInForm googleEnabled={googleEnabled} />
      </Suspense>
    </div>
  );
}
