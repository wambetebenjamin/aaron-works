import { NextResponse } from "next/server";
import { getFreelancer } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const freelancer = await getFreelancer(username);

  if (!freelancer) {
    return NextResponse.json(
      { error: "Freelancer not found", username },
      { status: 404 },
    );
  }

  return NextResponse.json({ freelancer });
}
