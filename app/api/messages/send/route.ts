import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createThreadMessage, getFreelancer, getStore } from "@/lib/db";
import { messageSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Sign in to send messages.", signInRequired: true },
      { status: 401 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = messageSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check your message.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const store = await getStore();
  const existingThread = parsed.data.threadId
    ? store.threads.find((t) => t.id === parsed.data.threadId)
    : null;
  const recipientUser = store.users.find((u) => u.id === parsed.data.recipientId);
  const recipientFreelancer = await getFreelancer(parsed.data.recipientId);

  if (!existingThread && !recipientUser && !recipientFreelancer) {
    return NextResponse.json({ error: "Recipient not found." }, { status: 404 });
  }

  const senderName = session.user.name ?? "Aaron Works member";
  const recipientName =
    recipientUser?.name ?? recipientFreelancer?.name ?? "Aaron Works member";

  const thread = await createThreadMessage({
    threadId: parsed.data.threadId,
    senderId: session.user.id,
    senderName,
    recipientId: parsed.data.recipientId,
    body: parsed.data.message,
    jobTitle: parsed.data.jobTitle,
    participants: {
      clientId: session.user.role === "client" ? session.user.id : parsed.data.recipientId,
      clientName: session.user.role === "client" ? senderName : recipientName,
      clientAvatar: "/images/freelancers/grace-wanjiru.jpg",
      freelancerId:
        session.user.role === "freelancer" ? session.user.id : parsed.data.recipientId,
      freelancerName:
        session.user.role === "freelancer" ? senderName : recipientName,
      freelancerAvatar:
        session.user.role === "freelancer"
          ? session.user.image ?? "/images/freelancers/amina-hassan.jpg"
          : recipientFreelancer?.avatar ?? "/images/freelancers/amina-hassan.jpg",
    },
  });

  if (!thread) {
    return NextResponse.json({ error: "Could not create the conversation." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, thread }, { status: 201 });
}
