"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Send, ShieldCheck } from "lucide-react";
import type { Thread } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export default function MessagesClient({
  threads,
  currentUserId,
  currentName,
}: {
  threads: Thread[];
  currentUserId: string;
  currentName: string;
}) {
  const [activeId, setActiveId] = useState(threads[0]?.id ?? "");
  const [localThreads, setLocalThreads] = useState<Thread[]>(threads);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const active = useMemo(
    () => localThreads.find((t) => t.id === activeId) ?? localThreads[0],
    [activeId, localThreads],
  );

  const isOwn = (thread: Thread, senderId: string, senderName: string) =>
    senderId === currentUserId ||
    senderName === currentName ||
    (thread.participants.freelancerName === senderName && senderName === currentName);

  const send = async () => {
    if (!active || !draft.trim()) return;
    setSending(true);
    setError(null);
    const recipientId =
      active.participants.clientName === currentName
        ? active.participants.freelancerId
        : active.participants.clientId;

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: active.id,
          recipientId,
          message: draft.trim(),
          jobTitle: active.jobTitle,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Message could not be sent.");
        return;
      }
      setLocalThreads((current) =>
        current.map((thread) =>
          thread.id === active.id
            ? { ...thread, messages: [...thread.messages, data.thread.messages[data.thread.messages.length - 1]] }
            : thread,
        ),
      );
      setDraft("");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSending(false);
    }
  };

  if (!localThreads.length) {
    return (
      <div className="aw-empty">
        <h3>No conversations yet</h3>
        <p>When you message a client or freelancer, the thread will appear here.</p>
      </div>
    );
  }

  return (
    <div className="aw-chat">
      <div className="aw-chat__list" role="tablist" aria-label="Conversations">
        <div className="aw-chat__listhead">Inbox · {localThreads.length}</div>
        {localThreads.map((thread) => {
          const other =
            thread.participants.clientName === currentName
              ? thread.participants.freelancerName
              : thread.participants.clientName;
          const last = thread.messages[thread.messages.length - 1];
          return (
            <button
              key={thread.id}
              type="button"
              role="tab"
              aria-selected={thread.id === active?.id}
              data-active={thread.id === active?.id}
              className="aw-threaditem"
              onClick={() => setActiveId(thread.id)}
            >
              <span className="aw-inline" style={{ gap: 10, flex: 1 }}>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#eef5da",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#4c6316",
                    flex: "none",
                  }}
                  aria-hidden="true"
                >
                  {other
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span style={{ minWidth: 0 }}>
                  <strong>{other}</strong>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                    {last?.body ?? "No messages yet"}
                  </span>
                </span>
              </span>
              {thread.unread ? <span className="aw-unread" aria-label="Unread" /> : null}
            </button>
          );
        })}
      </div>

      {active ? (
        <div className="aw-chat__main">
          <div className="aw-chat__head">
            <div className="aw-inline" style={{ gap: 10 }}>
              <Image
                src={active.participants.freelancerAvatar}
                alt=""
                width={40}
                height={40}
                className="aw-avatar"
                style={{ width: 40, height: 40 }}
              />
              <div>
                <strong>
                  {active.participants.clientName === currentName
                    ? active.participants.freelancerName
                    : active.participants.clientName}
                </strong>
                <span>{active.jobTitle}</span>
              </div>
            </div>
            <span className="aw-pill aw-pill--green">Escrow protected</span>
          </div>

          <div className="aw-chat__messages" aria-live="polite">
            {active.messages.map((message) => {
              const own = isOwn(active, message.senderId, message.senderName);
              return (
                <div
                  key={message.id}
                  className={`aw-bubble${own ? " aw-bubble--own" : ""}`}
                >
                  {message.body}
                  <small>
                    {message.senderName} · {timeAgo(message.sentAt)}
                  </small>
                </div>
              );
            })}
          </div>

          <div className="aw-chat__composer">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a message… (text only)"
              aria-label="Message"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send();
                }
              }}
            />
            <button
              type="button"
              className="aw-btn aw-btn--blue"
              onClick={send}
              disabled={sending || !draft.trim()}
            >
              <Send size={15} aria-hidden="true" />
              {sending ? "Sending" : "Send"}
            </button>
          </div>
          {error ? (
            <p className="aw-error" style={{ padding: "0 18px 12px" }}>
              {error}
            </p>
          ) : (
            <p className="aw-hint" style={{ padding: "10px 18px", borderTop: "1px solid #f0f2ec", margin: 0 }}>
              <ShieldCheck size={12} aria-hidden="true" style={{ verticalAlign: "-2px" }} />{" "}
              Keep payments in escrow. Never share M-Pesa PINs or passwords.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
